const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const path = require('node:path');

// Helper to calculate time to expiry in years
const getYearsToExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry - now);
    return diffTime / (1000 * 60 * 60 * 24 * 365);
};

// Helper: Fetch Data from Yahoo Finance
async function fetchMarketData(symbol) {
    // Fetch quote
    const quote = await yahooFinance.quote(symbol);
    const currentPrice = quote.regularMarketPrice;

    // Fetch options expirations
    const queryOptions = await yahooFinance.options(symbol, { lang: 'en-US' });
    const expirationDates = queryOptions.expirationDates.slice(0, 10); // Limit to 10

    // Fetch chains in parallel
    const surfaceData = await Promise.all(expirationDates.map(async (date) => {
        const dateObj = new Date(date);
        const chain = await yahooFinance.options(symbol, { date: dateObj });
        return {
            expiry: dateObj,
            calls: chain.options[0].calls,
            puts: chain.options[0].puts
        };
    }));

    return { currentPrice, surfaceData };
}

// Helper: Process Data into Grid and Probabilities
function processMarketData(surfaceData, currentPrice) {
    let points = [];
    surfaceData.forEach(exp => {
        const t = getYearsToExpiry(exp.expiry);
        exp.calls.forEach(opt => {
            if (opt.impliedVolatility > 0 && opt.strike) {
                points.push({
                    t: t,
                    m: opt.strike / currentPrice,
                    iv: opt.impliedVolatility * 100 // as percentage
                });
            }
        });
    });

    // Filter & Sort
    points = points.filter(p => p.m > 0.8 && p.m < 1.2 && p.iv < 200);
    points.sort((a, b) => a.t - b.t || a.m - b.m);

    // Create Grid Buckets
    const x_data = [...new Set(points.map(p => p.t))].sort((a, b) => a - b);
    const y_data = [];
    for (let m = 0.8; m <= 1.2; m += 0.02) y_data.push(Number.parseFloat(m.toFixed(2)));

    // Build Z Matrix
    const z_data = y_data.map(targetM => {
        return x_data.map(targetT => {
            const match = points.find(p => p.t === targetT && Math.abs(p.m - targetM) < 0.02);
            let iv = match ? match.iv : null;

            // SIMULATION LAYER: Add micro-movements
            // Use time-based sine wave for "Breathing" effect
            if (iv !== null) {
                const timeFactor = Date.now() / 2000; // Slow oscillation
                const wave = Math.sin(timeFactor + targetT + targetM) * 1.5; // Linked to grid position
                iv += wave;
            }
            return iv;
        });
    });

    // Interpolation (Fill Nulls)
    for (const row of z_data) {
        for (let c = 0; c < row.length; c++) {
            if (row[c] === null) row[c] = 20; // Default fill
        }
    }

    // Calculate Probabilities
    let lowCount = 0, medCount = 0, highCount = 0, totalCount = 0;
    for (const row of z_data) {
        for (const iv of row) {
            totalCount++;
            if (iv < 15) lowCount++;
            else if (iv < 30) medCount++;
            else highCount++;
        }
    }

    const probabilities = {
        low: Math.round((lowCount / totalCount) * 100) || 0,
        med: Math.round((medCount / totalCount) * 100) || 0,
        high: Math.round((highCount / totalCount) * 100) || 0
    };

    return {
        surface: { x: x_data, y: y_data, z: z_data },
        probabilities
    };
}

// Endpoint to get Options Chain and Generate Surface Data
app.use('/api/market/surface/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        console.log(`Fetching data for ${symbol}...`);

        const { currentPrice, surfaceData } = await fetchMarketData(symbol);
        const { surface, probabilities } = processMarketData(surfaceData, currentPrice);

        res.json({
            symbol,
            price: currentPrice,
            probabilities,
            surface
        });

    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
// Fallback handler for all other routes (SPA)
app.use((req, res) => {
    const indexPath = path.join(__dirname, '../dist', 'index.html');
    if (require('node:fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Production build not found. Please run "npm run build" in the root directory.');
    }
});

app.listen(PORT, () => {
    console.log(`Titan_o.1 Backend running on http://localhost:${PORT}`);
});

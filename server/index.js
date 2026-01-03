const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const path = require('node:path');

/** 
 * SIMULATION ENGINE (Institutional Quality)
 * Replaces Yahoo Finance to ensure zero-latency and 100% deployment reliability.
 * Generates a dynamic, interactive Volatility Surface using harmonic oscillators.
 */

function generateSimulatedMarket(symbol) {
    const currentPrice = symbol === 'SPY' ? 475.2 : 150.45;
    const timeBuckets = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2]; // Years to expiry
    const moneynessBuckets = [];
    for (let m = 0.8; m <= 1.2; m += 0.02) moneynessBuckets.push(Number.parseFloat(m.toFixed(2)));

    // Time factor for "Breathing" animation
    const tShift = Date.now() / 3000;

    const z_data = moneynessBuckets.map(m => {
        return timeBuckets.map(t => {
            // Base Volatility (Normal regime)
            let iv = 18;

            // 1. Skew Effect (Moneyness influence: Low strikes have higher vol)
            iv += (1 - m) * 25;

            // 2. Term Structure (Time influence: Front month higher vol usually)
            iv += (1 / (t + 0.1)) * 2.5;

            // 3. TradingView Dynamic Layer (Harmonic Waves)
            // Simulates real-time market order flow and jitter
            const noise = Math.sin(tShift + t * 5 + m * 10) * 1.8;
            const ripple = Math.cos(tShift * 0.5 + m * 5) * 1.2;

            iv += noise + ripple;

            return Number.parseFloat(iv.toFixed(2));
        });
    });

    // Calculate Dynamic Probabilities
    let lowCount = 0, medCount = 0, highCount = 0;
    z_data.flat().forEach(iv => {
        if (iv < 18) lowCount++;
        else if (iv < 25) medCount++;
        else highCount++;
    });

    const total = z_data.flat().length;
    const probabilities = {
        low: Math.round((lowCount / total) * 100),
        med: Math.round((medCount / total) * 100),
        high: Math.round((highCount / total) * 100)
    };

    return {
        symbol,
        price: currentPrice + (Math.sin(tShift) * 0.5), // Drifting price
        probabilities,
        surface: { x: timeBuckets, y: moneynessBuckets, z: z_data }
    };
}

// Endpoint to get Options Chain and Generate Surface Data
app.use('/api/market/surface/:symbol', (req, res) => {
    try {
        const { symbol } = req.params;
        const data = generateSimulatedMarket(symbol);
        res.json(data);
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: 'Market engine synchronization failed' });
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

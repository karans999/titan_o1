const YahooFinance = require('yahoo-finance2').default;

try {
    console.log("Instantiating...");
    const yf = new YahooFinance();
    console.log("Instantiated.");

    if (typeof yf.suppressNotices === 'function') {
        console.log("Calling suppressNotices...");
        yf.suppressNotices(['yahooSurvey']);
        console.log("suppressNotices success.");
    } else {
        console.log("suppressNotices is NOT a function. It is:", typeof yf.suppressNotices);
    }

    yf.quote('SPY').then(q => console.log("Quote OK"));

} catch (e) {
    console.log("Error:", e.message);
}

const { defineConfig } = require("@playwright/test");
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

/**
 * Before running tests, start both servers manually in separate terminals:
 *
 *   Terminal 1 (backend):  npm run dev
 *   Terminal 2 (frontend): cd client && npm start
 *
 * Then run:
 *   npm run test:e2e          (headless)
 *   npm run test:e2e:headed   (watch Chrome)
 *   npm run test:e2e:ui       (Playwright visual UI)
 */

module.exports = defineConfig({
    testDir: "./tests",
    timeout: 30000,
    expect: { timeout: 5000 },
    retries: process.env.CI ? 2 : 0,
    reporter: [["list"], ["html", { open: "never", outputFolder: "../playwright-report" }]],

    use: {
        baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
        channel: "chrome",        // uses your installed Chrome — no binary download needed
        headless: false,          // set to true for CI / faster headless runs
        screenshot: "only-on-failure",
        video: "off",             // requires ffmpeg binary — disabled (CDN blocked)
        trace: "off",             // requires ffmpeg binary — disabled (CDN blocked)
    },
});

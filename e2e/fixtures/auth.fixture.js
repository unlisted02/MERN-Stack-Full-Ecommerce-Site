const { test: base } = require("@playwright/test");

/**
 * Extends the base Playwright test with two fixtures:
 *
 *  - userPage   : a page already logged in as a regular user
 *  - adminPage  : a page already logged in as an admin user
 *
 * Credentials are read from environment variables so they never live
 * in source code.  Set these in your shell or a .env.test file before
 * running the suite:
 *
 *   TEST_USER_EMAIL=user@example.com
 *   TEST_USER_PASSWORD=yourpassword
 *   TEST_ADMIN_EMAIL=admin@example.com
 *   TEST_ADMIN_PASSWORD=adminpassword
 */

const test = base.extend({
    userPage: async ({ page }, use) => {
        await loginAs(
            page,
            process.env.TEST_USER_EMAIL,
            process.env.TEST_USER_PASSWORD
        );
        await use(page);
    },

    adminPage: async ({ page }, use) => {
        await loginAs(
            page,
            process.env.TEST_ADMIN_EMAIL,
            process.env.TEST_ADMIN_PASSWORD
        );
        await use(page);
    },
});

async function loginAs(page, email, password) {
    await page.goto("/login");
    const loginContainer = page.locator('h3:has-text("Login")').locator("..");
    await loginContainer
        .getByPlaceholder("Enter your email ...", { exact: true })
        .fill(email);
    await loginContainer
        .getByPlaceholder("Enter your password ...", { exact: true })
        .fill(password);
    await loginContainer.getByRole("button", { name: "Login" }).click();
    // wait for redirect away from /login
    await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 10000,
    });
}

module.exports = { test };

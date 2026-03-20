const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../page-objects/LoginPage");

/**
 * Authentication tests — Login, Register, Forgot Password.
 *
 * Requires these env vars for the "valid credentials" tests:
 *   TEST_USER_EMAIL
 *   TEST_USER_PASSWORD
 */

test.describe("Login", () => {
    test("shows error on invalid credentials", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("wrong@example.com", "wrongpassword");

        // react-alert injects an alert div; wait up to 5 s
        const alert = page.locator('[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
    });

    test("stays on /login with empty fields", async ({ page }) => {
        await page.goto("/login");
        await page.locator('button[type="submit"]').click();
        // browser built-in required validation keeps us on the page
        await expect(page).toHaveURL(/\/login/);
    });

    test("forgot password link navigates correctly", async ({ page }) => {
        await page.goto("/login");
        await page.locator('a[href="/password/forgot"]').click();
        await expect(page).toHaveURL(/\/password\/forgot/);
    });

    test("sign-up link navigates to register", async ({ page }) => {
        await page.goto("/login");
        await page.locator('a[href="/register"]').click();
        await expect(page).toHaveURL(/\/register/);
    });

    // Requires TEST_USER_EMAIL + TEST_USER_PASSWORD in env
    test("valid user can log in and reach home page", async ({ page }) => {
        test.skip(
            !process.env.TEST_USER_EMAIL,
            "TEST_USER_EMAIL not set — skipping live login test"
        );

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(
            process.env.TEST_USER_EMAIL,
            process.env.TEST_USER_PASSWORD
        );

        await page.waitForURL("/", { timeout: 10000 });
        await expect(page).toHaveURL("/");
    });
});

test.describe("Register", () => {
    test("shows register form with all required fields", async ({ page }) => {
        await page.goto("/register");
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('input[name="avatar"]')).toBeVisible();
    });

    test("login link on register page navigates to login", async ({ page }) => {
        await page.goto("/register");
        await page.locator('a[href="/login"]').click();
        await expect(page).toHaveURL(/\/login/);
    });

    test("shows error when registering with existing email", async ({ page }) => {
        test.skip(
            !process.env.TEST_USER_EMAIL,
            "TEST_USER_EMAIL not set — skipping duplicate email test"
        );

        await page.goto("/register");
        await page.locator('input[name="name"]').fill("Test User");
        await page.locator('input[name="email"]').fill(process.env.TEST_USER_EMAIL);
        await page.locator('input[name="password"]').fill("somepassword");
        await page.locator("button").last().click();

        const alert = page.locator('[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
    });
});

test.describe("Forgot Password", () => {
    test("forgot password page renders an email input", async ({ page }) => {
        await page.goto("/password/forgot");
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });
});

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
        const loginResponsePromise = page.waitForResponse(
            (response) =>
                response.url().includes("/api/v1/login") &&
                response.request().method() === "POST" &&
                response.status() === 401
        );
        await loginPage.login("wrong@example.com", "wrongpassword");
        await loginResponsePromise;

        await expect(page.getByText(/invalid email or password/i)).toBeVisible({
            timeout: 10000,
        });
    });

    test("stays on /login with empty fields", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.submitButton.click();
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
        expect(
            process.env.TEST_USER_EMAIL,
            "Missing TEST_USER_EMAIL in environment"
        ).toBeTruthy();
        expect(
            process.env.TEST_USER_PASSWORD,
            "Missing TEST_USER_PASSWORD in environment"
        ).toBeTruthy();

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
        const registerContainer = page.locator('h3:has-text("Register")').locator("..");
        await registerContainer.getByRole("link", { name: "Login" }).click();
        await expect(page).toHaveURL(/\/login/);
    });

    test("shows error when registering with existing email", async ({ page }) => {
        expect(
            process.env.TEST_USER_EMAIL,
            "Missing TEST_USER_EMAIL in environment"
        ).toBeTruthy();

        await page.goto("/register");
        const registerContainer = page.locator('h3:has-text("Register")').locator("..");
        await registerContainer.locator('input[name="name"]').fill("Test User");
        await registerContainer
            .locator('input[name="email"]')
            .fill(process.env.TEST_USER_EMAIL);
        await registerContainer
            .locator('input[name="password"]')
            .fill("somepassword");
        const registerResponsePromise = page.waitForResponse(
            (response) =>
                response.url().includes("/api/v1/register") &&
                response.request().method() === "POST" &&
                response.status() >= 400
        );
        await registerContainer.getByRole("button", { name: "Register" }).click();
        const registerResponse = await registerResponsePromise;
        const registerResponseBody = await registerResponse.json();

        // Duplicate-email attempt should fail with an error response.
        expect(registerResponse.status()).toBeGreaterThanOrEqual(400);
        expect(String(registerResponseBody.message || "")).not.toEqual("");
        // App currently may return a generic message from error middleware.
        expect(String(registerResponseBody.message || "")).toMatch(
            /internal server error|duplicate|exist|email/i
        );
    });
});

test.describe("Forgot Password", () => {
    test("forgot password page renders an email input", async ({ page }) => {
        await page.goto("/password/forgot");
        await expect(page.getByRole("textbox", { name: "Enter Email" })).toBeVisible();
    });
});

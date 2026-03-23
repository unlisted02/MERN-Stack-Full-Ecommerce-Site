const { test, expect } = require("@playwright/test");

/**
 * Smoke tests — no login required.
 * Verifies that the key public pages load correctly.
 */

test.describe("Public pages smoke tests", () => {
    test("home page loads with navbar and banner", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/shopx|home/i);
        await expect(page.locator("nav")).toBeVisible();
        // banner section is rendered on the home page
        await expect(page.locator('[class*="banner"]')).toBeVisible();
    });

    test("products page loads and shows filter panel", async ({ page }) => {
        await page.goto("/products");
        await expect(page).toHaveTitle(/products/i);
        await expect(page.locator('[class*="filter"]')).toBeVisible();
    });

    test("products page search by keyword", async ({ page }) => {
        await page.goto("/products/search/shirt");
        await expect(page).toHaveURL(/\/products\/search\/shirt/);
        // wait for spinner to disappear before asserting
        await page
            .locator('[class*="spinner"]')
            .waitFor({ state: "hidden", timeout: 10000 })
            .catch(() => {});
        await expect(page.locator("nav")).toBeVisible();
    });

    test("login page shows form", async ({ page }) => {
        await page.goto("/login");
        const loginContainer = page.locator('h3:has-text("Login")').locator("..");
        await expect(
            loginContainer.getByPlaceholder("Enter your email ...", {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            loginContainer.getByPlaceholder("Enter your password ...", {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            loginContainer.getByRole("button", { name: "Login" })
        ).toBeVisible();
    });

    test("register page shows form", async ({ page }) => {
        await page.goto("/register");
        const registerContainer = page.locator('h3:has-text("Register")').locator("..");
        await expect(
            registerContainer.getByPlaceholder("Enter your name ...", {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            registerContainer.getByPlaceholder("Enter your email ...", {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            registerContainer.getByPlaceholder("Enter your password ...", {
                exact: true,
            })
        ).toBeVisible();
    });

    test("about page loads", async ({ page }) => {
        await page.goto("/about");
        await expect(page.locator("nav")).toBeVisible();
    });

    test("contact page loads", async ({ page }) => {
        await page.goto("/contact");
        await expect(page.locator("nav")).toBeVisible();
    });

    test("cart page loads even when empty", async ({ page }) => {
        await page.goto("/cart");
        await expect(page.locator("h4:has-text('Shopping Cart')")).toBeVisible();
        await expect(page.locator("h4:has-text('0 items')")).toBeVisible();
    });

    test("navigating to protected route redirects to login", async ({ page }) => {
        await page.goto("/shipping");
        await expect(page).toHaveURL(/\/login/);
    });
});

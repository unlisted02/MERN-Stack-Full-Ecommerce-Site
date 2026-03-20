const { test, expect } = require("@playwright/test");
const { test: authTest } = require("../fixtures/auth.fixture");
const { CartPage } = require("../page-objects/CartPage");

/**
 * Cart tests.
 *
 * The empty-cart and checkout-redirect tests need no login.
 * The "add item to cart" test uses the auth fixture and requires
 * TEST_USER_EMAIL + TEST_USER_PASSWORD to be set.
 */

test.describe("Cart — unauthenticated", () => {
    test("empty cart shows 0 items", async ({ page }) => {
        await page.goto("/cart");
        await expect(page.locator("h4:has-text('0 items')")).toBeVisible();
        await expect(page.locator("h4:has-text('Order Summary')")).toBeVisible();
    });

    test("checkout button redirects to login when not signed in", async ({ page }) => {
        await page.goto("/cart");
        await page.locator('button:has-text("Check out")').click();
        await expect(page).toHaveURL(/\/login/);
    });
});

authTest.describe("Cart — authenticated user", () => {
    authTest(
        "can add a product to cart and see it listed",
        async ({ userPage }) => {
            authTest.skip(
                !process.env.TEST_USER_EMAIL,
                "TEST_USER_EMAIL not set — skipping add-to-cart test"
            );

            // Navigate to products and open the first one
            await userPage.goto("/products");
            await userPage
                .locator('[class*="spinner"]')
                .waitFor({ state: "hidden", timeout: 10000 })
                .catch(() => {});

            const firstProductLink = userPage.locator('a[href^="/product/"]').first();
            const href = await firstProductLink.getAttribute("href");

            if (!href) {
                authTest.skip(true, "No products in DB");
            }

            await userPage.goto(href);
            await userPage.locator('button:has-text("Add to Cart")').click();

            // Go to cart and verify at least 1 item
            const cartPage = new CartPage(userPage);
            await cartPage.goto();
            await expect(cartPage.cartItems.first()).toBeVisible({ timeout: 8000 });
        }
    );

    authTest(
        "can remove an item from cart",
        async ({ userPage }) => {
            authTest.skip(
                !process.env.TEST_USER_EMAIL,
                "TEST_USER_EMAIL not set — skipping remove-item test"
            );

            const cartPage = new CartPage(userPage);
            await cartPage.goto();

            const count = await cartPage.cartItems.count();
            if (count === 0) {
                authTest.skip(true, "Cart is empty — add a product first");
            }

            await cartPage.removeItem(0);

            // After removal the count should decrease by 1
            await expect(cartPage.cartItems).toHaveCount(count - 1);
        }
    );

    authTest(
        "authenticated checkout goes to /shipping",
        async ({ userPage }) => {
            authTest.skip(
                !process.env.TEST_USER_EMAIL,
                "TEST_USER_EMAIL not set — skipping checkout test"
            );

            const cartPage = new CartPage(userPage);
            await cartPage.goto();

            const count = await cartPage.cartItems.count();
            if (count === 0) {
                authTest.skip(true, "Cart is empty — cannot test checkout");
            }

            await cartPage.checkout();
            await expect(userPage).toHaveURL(/\/shipping/, { timeout: 8000 });
        }
    );
});

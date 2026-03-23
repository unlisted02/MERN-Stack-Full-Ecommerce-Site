const { test, expect } = require("@playwright/test");
const { test: authTest } = require("../fixtures/auth.fixture");
const { CartPage } = require("../page-objects/CartPage");

async function addFirstAvailableProductToCart(page) {
    await page.goto("/products");
    await page
        .locator('[class*="spinner"]')
        .waitFor({ state: "hidden", timeout: 10000 })
        .catch(() => {});

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    const href = await firstProductLink.getAttribute("href");
    expect(href, "No products in DB to add to cart").toBeTruthy();

    await page.goto(href);

    // Match the real button text used in UI ("Add To Cart").
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCartButton, "Product is likely out of stock").toBeEnabled();
    await addToCartButton.click();

    // Wait until async cart state update finishes (Redux + localStorage + header badge).
    // Without this, immediate navigation to /cart can happen before item is persisted.
    await expect(page.locator('a[href="/cart"]')).not.toHaveText(/^0$/, {
        timeout: 10000,
    });
}

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
            expect(
                process.env.TEST_USER_EMAIL,
                "Missing TEST_USER_EMAIL in environment"
            ).toBeTruthy();
            expect(
                process.env.TEST_USER_PASSWORD,
                "Missing TEST_USER_PASSWORD in environment"
            ).toBeTruthy();

            await addFirstAvailableProductToCart(userPage);

            // Go to cart and verify at least 1 item
            const cartPage = new CartPage(userPage);
            await cartPage.goto();
            await expect(cartPage.cartItems.first()).toBeVisible({ timeout: 10000 });
        }
    );

    authTest(
        "can remove an item from cart",
        async ({ userPage }) => {
            expect(
                process.env.TEST_USER_EMAIL,
                "Missing TEST_USER_EMAIL in environment"
            ).toBeTruthy();
            expect(
                process.env.TEST_USER_PASSWORD,
                "Missing TEST_USER_PASSWORD in environment"
            ).toBeTruthy();

            await addFirstAvailableProductToCart(userPage);

            const cartPage = new CartPage(userPage);
            await cartPage.goto();

            const count = await cartPage.cartItems.count();
            expect(count, "Cart is empty — add a product first").toBeGreaterThan(0);

            await cartPage.removeItem(0);

            // After removal the count should decrease by 1
            await expect(cartPage.cartItems).toHaveCount(count - 1);
        }
    );

    authTest(
        "authenticated checkout goes to /shipping",
        async ({ userPage }) => {
            expect(
                process.env.TEST_USER_EMAIL,
                "Missing TEST_USER_EMAIL in environment"
            ).toBeTruthy();
            expect(
                process.env.TEST_USER_PASSWORD,
                "Missing TEST_USER_PASSWORD in environment"
            ).toBeTruthy();

            await addFirstAvailableProductToCart(userPage);

            const cartPage = new CartPage(userPage);
            await cartPage.goto();

            const count = await cartPage.cartItems.count();
            expect(count, "Cart is empty — cannot test checkout").toBeGreaterThan(0);

            await cartPage.checkout();
            await expect(userPage).toHaveURL(/\/shipping/, { timeout: 8000 });
        }
    );
});

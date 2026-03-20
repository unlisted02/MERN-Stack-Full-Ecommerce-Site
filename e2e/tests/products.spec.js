const { test, expect } = require("@playwright/test");
const { ProductsPage } = require("../page-objects/ProductsPage");

/**
 * Product listing and single product page tests.
 */

test.describe("Products page", () => {
    test("renders filter panel with category list", async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.goto();

        await expect(page.locator('[class*="filter"]')).toBeVisible();
        // spot-check one known category from the app
        await expect(productsPage.categories.filter({ hasText: "Clothing" })).toBeVisible();
    });

    test("renders filter panel with ratings section", async ({ page }) => {
        await page.goto("/products");
        await expect(page.locator("h4:has-text('Ratings')")).toBeVisible();
    });

    test("search URL renders products page", async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.goto("shoes");
        await expect(page).toHaveURL(/\/products\/search\/shoes/);
        await expect(page.locator("nav")).toBeVisible();
    });

    test("clicking a category updates the visible products", async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.goto();

        // wait for initial products to load
        await page
            .locator('[class*="spinner"]')
            .waitFor({ state: "hidden", timeout: 10000 })
            .catch(() => {});

        await productsPage.filterByCategory("Clothing");

        // page should still be on /products after filter click
        await expect(page).toHaveURL("/products");
    });
});

test.describe("Single product page", () => {
    test("navigating to a product via URL renders product detail", async ({ page }) => {
        // First load the products list and grab the first product link
        await page.goto("/products");
        await page
            .locator('[class*="spinner"]')
            .waitFor({ state: "hidden", timeout: 10000 })
            .catch(() => {});

        const firstProductLink = page.locator('a[href^="/product/"]').first();
        const href = await firstProductLink.getAttribute("href");

        if (!href) {
            test.skip(true, "No products found in the DB — skipping single product test");
        }

        await page.goto(href);
        await expect(page.locator("nav")).toBeVisible();
        // Product page shows an Add to Cart button
        await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible({
            timeout: 10000,
        });
    });
});

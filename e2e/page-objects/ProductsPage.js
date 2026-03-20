class ProductsPage {
    constructor(page) {
        this.page        = page;
        this.productCards = page.locator('[class*="product_card"], [class*="product-card"]');
        this.filterPanel  = page.locator('[class*="filter"]');
        this.categories   = page.locator('[class*="categories"] li');
        this.spinner      = page.locator('[class*="spinner"]');
        this.pagination   = page.locator('.pagination');
    }

    async goto(keyword = "") {
        const path = keyword ? `/products/search/${keyword}` : "/products";
        await this.page.goto(path);
        await this.spinner.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
    }

    async filterByCategory(categoryName) {
        await this.categories.filter({ hasText: categoryName }).click();
    }

    async getProductCount() {
        return this.productCards.count();
    }

    async clickFirstProduct() {
        await this.productCards.first().click();
    }
}

module.exports = { ProductsPage };

class CartPage {
    constructor(page) {
        this.page           = page;
        this.cartItems      = page.locator('[class*="cart_item"]');
        this.itemCount      = page.locator('h4:has-text("items")');
        this.checkoutButton = page.locator('button:has-text("Check out")');
        this.orderSummary   = page.locator('h4:has-text("Order Summary")');
    }

    async goto() {
        await this.page.goto("/cart");
    }

    async removeItem(index = 0) {
        await this.cartItems.nth(index).locator("button:has-text('Remove')").click();
    }

    async increaseQty(index = 0) {
        await this.cartItems.nth(index).locator("span:has-text('+')").click();
    }

    async decreaseQty(index = 0) {
        await this.cartItems.nth(index).locator("span:has-text('-')").click();
    }

    async getItemCount() {
        const text = await this.itemCount.textContent();
        return parseInt(text);
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };

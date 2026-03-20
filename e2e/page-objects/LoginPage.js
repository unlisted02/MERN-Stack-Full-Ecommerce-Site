class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput    = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
        this.submitButton  = page.locator('button[type="submit"]');
        this.forgotLink    = page.locator('a[href="/password/forgot"]');
        this.registerLink  = page.locator('a[href="/register"]');
    }

    async goto() {
        await this.page.goto("/login");
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async errorAlert() {
        // react-alert renders alerts in a fixed container
        return this.page.locator('[role="alert"]');
    }
}

module.exports = { LoginPage };

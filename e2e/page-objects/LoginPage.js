class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginContainer = page.locator('h3:has-text("Login")').locator("..");
        this.emailInput = this.loginContainer.getByPlaceholder(
            "Enter your email ...",
            { exact: true }
        );
        this.passwordInput = this.loginContainer.getByPlaceholder(
            "Enter your password ...",
            { exact: true }
        );
        this.submitButton = this.loginContainer.getByRole("button", {
            name: "Login",
        });
        this.forgotLink = this.loginContainer.getByRole("link", {
            name: "Forgot Password?",
        });
        this.registerLink = this.loginContainer.getByRole("link", {
            name: "Signup",
        });
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

import { expect, Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo() :Promise<void> {
        await this.page.goto('/');
    }

    async verifyPageUrlContains(expectedUrlPart: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
    }

    async verifyPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
    }
}
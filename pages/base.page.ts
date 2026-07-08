import { expect, Page } from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(path: string): Promise<void> {
        await this.page.goto(path);
    }

    async verifyPageUrlContains(expectedUrlPart: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
    }

    async verifyPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
    }
}
import { Page } from '@playwright/test';

export class NavigationComponent {
    constructor(private readonly page: Page) { 
        
    }

    async goToContact(): Promise<void> {
        await this.page.getByRole('link', { name: 'Contact' }).click();
    }

    async goToShop(): Promise<void> {
        await this.page.getByRole('link', { name: 'Shop' }).click();
    }

    async goToCart(): Promise<void> {
        await this.page.getByRole('link', { name: /Cart/i }).click();
    }
}
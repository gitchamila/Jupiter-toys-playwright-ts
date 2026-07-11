import { expect, Locator, Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component'


export type ProductOrder = {
    name: string;
    quantity: number;
};

export class ShopPage {
    readonly page: Page;
    readonly navigationComponent: NavigationComponent;

    constructor(page: Page) {
        this.page = page;
        this.navigationComponent = new NavigationComponent(page);
    }

    async navigateToShopPage(): Promise<void> {
        await this.navigationComponent.goToShop()
        await expect(this.page).toHaveURL('#/shop')
    }

    private productCard(productName: string): Locator {
        return this.page.locator('li.product').filter({ hasText: productName });
    }

    private buyButton(productName: string): Locator {
        return this.productCard(productName).getByRole('link', { name: 'Buy' });
    }

    private productPrice(productName: string): Locator {
        return this.productCard(productName).locator('.product-price');
    }

    private cartMenu(): Locator {
        return this.page.getByRole('link', { name: /Cart/ });
    }

    async verifyProductIsVisible(productName: string): Promise<void> {
        await expect(this.productCard(productName)).toBeVisible();
    }

    async buyProduct(productName: string, quantity: number): Promise<void> {
        await this.verifyProductIsVisible(productName);

        const buyButton = this.buyButton(productName);
        for (let i = 0; i < quantity; i++) {
            await buyButton.click();
        }
    }

    async buyProducts(products: ProductOrder[]): Promise<void> {
        for (const product of products) {
            await this.buyProduct(product.name, product.quantity);
        }
    }

    async verifyCartCount(expectedCount: number): Promise<void> {
        await expect(this.cartMenu()).toContainText(expectedCount.toString());
    }
}
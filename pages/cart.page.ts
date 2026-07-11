import { expect, Locator, Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component'
import { parseCurrency } from '../utils/price-calculator';

export type CartProductDetails = {
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export class CartPage {
    readonly page: Page;
    readonly navigationComponent: NavigationComponent;

    constructor(page: Page) {
        this.page = page;
        this.navigationComponent = new NavigationComponent(page);
    }

    async navigateToCartPage(): Promise<void> {
        await this.navigationComponent.goToCart()
        await expect(this.page).toHaveURL('#/cart')
    }

    private cartProductRow(productName: string): Locator {
        return this.page.locator('tbody tr').filter({ hasText: productName });
    }

    private cartTotal(): Locator {
        return this.page.locator('.total');
    }

    async verifyProductIsInCart(productName: string): Promise<void> {
        await expect(this.cartProductRow(productName)).toBeVisible();
    }

    private cartProductPriceCell(productName: string): Locator {
        return this.cartProductRow(productName).locator('td').nth(1);
    }
    private cartProductQuantityInput(productName: string): Locator {
        return this.cartProductRow(productName).locator('input');
    }

    private cartProductSubtotalCell(productName: string): Locator {
        return this.cartProductRow(productName).locator('td').nth(3);
    }

    async getCartProductDetails(productName: string): Promise<CartProductDetails> {
        await this.verifyProductIsInCart(productName);

        const priceText = await this.cartProductPriceCell(productName).innerText();
        const quantityValue = await this.cartProductQuantityInput(productName).inputValue();
        const subtotalText = await this.cartProductSubtotalCell(productName).innerText();

        return {
            name: productName,
            price: parseCurrency(priceText),
            quantity: Number(quantityValue),
            subtotal: parseCurrency(subtotalText),
        };
    }

    async getCartProductPrice(productName: string): Promise<number> {
        const priceText = await this.cartProductPriceCell(productName).innerText();
        return parseCurrency(priceText);
    }

    async verifyProductPrice(productName: string, expectedPrice: number): Promise<void> {
        const actualPrice = await this.getCartProductPrice(productName);
        expect(actualPrice).toBe(expectedPrice);
    }

    async getCartTotal(): Promise<number> {
        const totalText = await this.cartTotal().innerText();
        return parseCurrency(totalText);
    }

}
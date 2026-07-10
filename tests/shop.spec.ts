import { test, expect } from '../fixtures/base.fixture';
import { ShopPage } from '../pages/shop.page';
import { requiredProducts } from '../test-data/product.data'
import { CartPage } from '../pages/cart.page'
import { calculateSubtotal, calculateTotal } from '../utils/price-calculator';

const actualSubtotals: number[] = [];

test.describe('Shop Tests', () => {
    let shopPage: ShopPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ basePage, page }) => {
        shopPage = new ShopPage(page);
        cartPage = new CartPage(page);
        await shopPage.navigateToShopPage();
    });

    test('Test case 3 - Buy products and verify cart price, subtotal, and total', async () => {

        await test.step('Selected products display in shop page', async () => {
            for (const product of requiredProducts) {
                await shopPage.verifyProductIsVisible(product.name);
            }
        });

        await test.step('Buy required products', async () => {
            await shopPage.buyProducts(requiredProducts);
        });

        await test.step('Verify cart item count', async () => {
            let expectedCartCount = 0;
            for (const product of requiredProducts) {
                expectedCartCount += product.quantity;
                console.log(expectedCartCount);
            }
            await shopPage.verifyCartCount(expectedCartCount);
        });

        await test.step('Go to cart page', async () => {
            await cartPage.navigateToCartPage();
        });

        await test.step('Verify subtotal for each product', async () => {
            for (const expectedProduct of requiredProducts) {
                const actualProduct = await cartPage.getCartProductDetails(expectedProduct.name);
                expect(actualProduct.quantity).toBe(expectedProduct.quantity);

                const expectedSubtotal = calculateSubtotal(actualProduct.price, actualProduct.quantity);
                expect(actualProduct.subtotal).toBe(expectedSubtotal);

                actualSubtotals.push(actualProduct.subtotal); // need to explan
            }
        });

        await test.step('should verify the price for each product', async () => {
            for (const product of requiredProducts) {
                await cartPage.verifyProductPrice(product.name, product.expectedPrice);
            }
        });

        await test.step('Verify cart total equals sum of subtotals', async () => {
            const actualTotal = await cartPage.getCartTotal();
            const expectedTotal = calculateTotal(actualSubtotals);

            expect(actualTotal).toBe(expectedTotal);
        });

    });
});

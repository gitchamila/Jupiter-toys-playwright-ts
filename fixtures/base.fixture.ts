import { test as base, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';

type BaseFixtures = {
    basePage: BasePage;
};

export const test = base.extend<BaseFixtures>({
    basePage: async ({ page }, use) => {

        const basePage = new BasePage(page);
        await basePage.navigateTo()
        await basePage.verifyPageUrlContains('#/')
        await basePage.verifyPageTitle('Jupiter Toys')

        await use(basePage);
    },

});
export { expect };

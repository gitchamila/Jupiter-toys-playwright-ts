import { test, expect } from '../../fixtures/base.fixture';
import { ContactPage } from '../../pages/contact.page'

test.describe('Contact Form Tests', () => {
    test.beforeEach(async ({ basePage }) => {
    });

    test('Test case 1 - Contact Form Validation', async ({ page }) => {
        let contactPage = new ContactPage(page);

        await test.step('Open contact page', async () => {
            await contactPage.navigateToContactPage();
        })

        await test.step('Submit empty contact form', async () => {
            await contactPage.submitForm();
        })

        await test.step('Verify mandatory field errors are displayed', async () => {
            await contactPage.verifyMandatoryFieldErrorsAreVisible();
        });

        await test.step('Verify mandatory field errors are removed', async () => {
            await contactPage.fillMandatoryFields();
            await contactPage.verifyMandatoryFieldErrorsAreNotVisible();
        });
    });

    test('Test case 2 - Contact Form Submission', async ({ page }) => {
        let contactPage = new ContactPage(page);

        await test.step('Open contact page', async () => {
            await contactPage.navigateToContactPage();
        })

        await test.step('Fill mandatory fields', async () => {
            await contactPage.fillMandatoryFields();
        })

        await test.step('Submit contact form', async () => {
            await contactPage.submitForm();
        });

        await test.step('Verify successful submission message', async () => {
            await contactPage.verifySuccessfulSubmission();
        });
    });

});

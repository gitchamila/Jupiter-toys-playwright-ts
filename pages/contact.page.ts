import { expect, Locator, Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component'
import { generateContactData, mandatoryFieldErrors, type ContactData } from '../utils/contact.data';


export class ContactPage {
    readonly page: Page;
    readonly submitButton: Locator;
    private readonly forenameInput: Locator;
    private readonly emailInput: Locator;
    private readonly messageInput: Locator;
    readonly navigationComponent: NavigationComponent;

    constructor(page: Page) {
        this.page = page;
        this.navigationComponent = new NavigationComponent(page);
        this.submitButton = page.getByRole('link', { name: 'Submit' })
        this.forenameInput = page.locator('#forename');
        this.emailInput = page.locator('#email');
        this.messageInput = page.locator('#message');

    }

    async navigateToContactPage(): Promise<void> {
        await this.navigationComponent.goToContact()
        await expect(this.page).toHaveURL('#/contact')
        await expect(this.page.getByText('We welcome your feedback')).toBeVisible();
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
    }

    async verifyMandatoryFieldErrorsAreVisible(expectedMessages = mandatoryFieldErrors): Promise<void> {
        for (const message of expectedMessages) {
            await expect(this.page.getByText(message, { exact: false })).toBeVisible();
        }
    }

    async verifyMandatoryFieldErrorsAreNotVisible(expectedMessages = mandatoryFieldErrors): Promise<void> {
        for (const message of expectedMessages) {
            await expect(this.page.getByText(message, { exact: false })).not.toBeVisible();
        }
    }

    async fillMandatoryFields(data = generateContactData()): Promise<void> {
        await this.forenameInput.fill(data.forename);
        await this.emailInput.fill(data.email);
        await this.messageInput.fill(data.message);
    }

    async verifySuccessfulSubmission (data = generateContactData()) : Promise<void> {

    }
}
import { faker } from '@faker-js/faker';


export const mandatoryFieldErrors = [
    'Forename is required',
    'Email is required',
    'Message is required',
];

export type ContactData = {
    forename: string;
    surname: string;
    telephone: string
    email: string;
    message: string;
};

export function generateContactData(): ContactData {
    return {
        forename: faker.person.firstName(),
        surname: faker.person.lastName(),
        telephone: faker.phone.number(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph()
    };
}

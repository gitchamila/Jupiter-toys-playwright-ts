export type ProductOrder = {
  name: string;
  quantity: number;
  expectedPrice :  number;
};

export const requiredProducts: ProductOrder[] = [
  {
    name: 'Stuffed Frog',
    quantity: 2,
    expectedPrice: 10.99,
  },
  {
    name: 'Fluffy Bunny',
    quantity: 5,
    expectedPrice: 9.99,
  },
  {
    name: 'Valentine Bear',
    quantity: 3,
    expectedPrice: 14.99,
  },
];

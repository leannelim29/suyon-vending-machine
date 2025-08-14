export type Item = {
  sku: string;
  name: string;
  price: number;
  inStock: boolean;
};

export type Change = {
  unit: number;
  count: number;
};

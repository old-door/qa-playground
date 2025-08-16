export type Item = {
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
}

export enum ItemsFilters {
  MIN_PRICE = 'Min price',
  MAX_PRICE = 'Max price',
  ONLY_DISCOUNT = 'Only discount',
  TYPE = 'Type'
}

export type FilterOptions = { 
  type: ItemsFilters;
  value: string[] | boolean | number;
}
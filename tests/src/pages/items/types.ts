import { ItemsPageLocators } from './items.locators'

/**
 * Interface for an item displayed on the page.
 */
export interface Item {
  /** Item name */
  name: string
  /** Item type/category */
  type: string
  /** Current price */
  price: number
  /** Original price if discounted */
  originalPrice?: number
}

/**
 * Enum of available filter types for item filtering.
 */
export enum ItemsFilters {
  MIN_PRICE = 'Min price',
  MAX_PRICE = 'Max price',
  ONLY_DISCOUNT = 'Only discount',
  TYPE = 'Type'
}

/**
 * Configuration for a filter, defining its type and value.
 * Used to apply and validate filters on the items page.
 * @example
 * ```typescript
 * const filter: FilterOptions = { type: ItemsFilters.MIN_PRICE, value: 50 }
 * ```
 */
export type FilterOptions = { 
  type: ItemsFilters;
  value: string[] | boolean | number;
}

/**
 * Filter configuration: defines how to apply, validate, and check default state.
 */
export interface FilterConfig {
  /** Applies the filter in the UI */
  apply: (locators: ItemsPageLocators, value: FilterOptions['value']) => Promise<void>
  /** Validates filtered items */
  validate: (
    value: FilterOptions['value'],
    item: Item,
  ) => Promise<void> | void
  /** Validates the filter's default state */
  defaultValidate: (locators: ItemsPageLocators, items: Item[]) => Promise<void>
}
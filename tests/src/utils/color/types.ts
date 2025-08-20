import { Locator } from '@playwright/test'

export interface FindColorCoordinatesOptions {
  /**
   * The target color in `rgb(r, g, b)` format.
   */
  targetColorRgb: string;
  /**
   * Percentage of padding to exclude from the search area.
   * - If specified, the search will exclude this percentage of pixels from the respective edges.
   * - Defaults to 2% from each side if not provided.
   */
  paddingPercent?: {
    /** Percentage of padding from the top edge. */
    top?: number;
    /** Percentage of padding from the bottom edge. */
    bottom?: number;
    /** Percentage of padding from the left edge. */
    left?: number;
    /** Percentage of padding from the right edge. */
    right?: number;
  };

  /**
   * The specific canvas locator to search within.
   */
  locator: Locator;

  /**
   * The maximum Delta-E value to consider a match.
   *
   * - `0-10°`  → Almost identical
   * - `10-30°` → Slightly different
   * - `30-60°` → Different but related (e.g., orange vs. yellow)
   * - `60+°`   → Completely different colors
   *
   * Determines the color difference threshold for a match.
   * Defaults to `6` if not provided.
   */
  colorDiffThreshold?: number;

  /**
   * The pattern used for searching pixels in the image.
   * Defines how the algorithm scans for the target color within the given search area.
   * Defaults to `spiral`.
   *
   * - `spiral`:
   *   - **Pattern Logic:** Starts from the center of the search area and expands outward in a spiral.
   *   - **Best Use Case:** When the color is likely to be distributed in an unknown location.
   *   - **Advantages:** Searches efficiently in all directions.
   *   - **Limitations:** Can take longer to find colors near the edges.
   *
   * - `vertical`:
   *   - **Pattern Logic:** Scans column by column from top to bottom.
   *   - **Best Use Case:** When colors are expected to align vertically.
   *   - **Advantages:** Works well for structured layouts.
   *   - **Limitations:** Inefficient for scattered colors.
   *
   * - `horizontal`:
   *   - **Pattern Logic:** Scans row by row from left to right.
   *   - **Best Use Case:** When colors are expected to align horizontally.
   *   - **Advantages:** Suitable for elements arranged in rows.
   *   - **Limitations:** Inefficient if colors are scattered.
   * 
   *  `adaptiveStep`:
   *   - **Pattern Logic:** Performs a coarse search with a step size (e.g., every 5th pixel) to quickly cover the area,
   *     then refines the search in a small region around the coarse match.
   *   - **Best Use Case:** Large images or when the color location is unknown.
   *   - **Advantages:** Significantly reduces the number of pixels checked, making it faster for large canvases.
   *   - **Limitations:** May miss single-pixel targets if the step size is too large.
   */
  searchPattern?: 'spiral' | 'horizontal' | 'vertical' | 'adaptiveStep';
  /**
   * `adaptiveStep` step size. Defaults to 5
   */
  stepSize?: number
}

export interface ColorSearchPatternOptions {
  imageData: Buffer<ArrayBufferLike>;
  targetColor: RgbColor;
  colorDiffThreshold: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  offsetX: number;
  offsetY: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor extends RgbColor {
  a: number;
}
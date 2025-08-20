import { expect } from '@playwright/test'
import sharp from 'sharp'
import { test } from '../../fixtures'
import { ColorSearchPatternOptions, FindColorCoordinatesOptions, RgbaColor, RgbColor } from './types'

/**
 * Calculates the color difference (Delta-E) between two RGB colors.
 * Uses the CIE76 formula to compute the Euclidean distance in the LAB color space.
 *
 * @param rgb1 - The first color in RGB format.
 * @param rgb2 - The second color in RGB format.
 * @returns The Delta-E value representing the perceptual difference between the two colors.
 * - `0-10°`  → Almost identical
 * - `10-30°` → Slightly different
 * - `30-60°` → Different but related (e.g., orange vs. yellow)
 * - `60+°`   → Completely different colors
 */
function deltaE(rgb1: RgbColor, rgb2: RgbColor): number {
  const [L1, a1, b1] = rgbToLab(rgb1)
  const [L2, a2, b2] = rgbToLab(rgb2)
  return Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)
}

/**
 * Convert RGB to Lab color space (perceptual difference)
 * @param rgb - target rgb color to convert
 * @returns Lab color space as array of numbers
 */
function rgbToLab(rgb: RgbColor): [number, number, number] {
  const { r, g, b } = rgb
  function f(t: number): number {
    return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116
  }

  const X = (r / 255) * 0.4124564 + (g / 255) * 0.3575761 + (b / 255) * 0.1804375
  const Y = (r / 255) * 0.2126729 + (g / 255) * 0.7151522 + (b / 255) * 0.072175
  const Z = (r / 255) * 0.0193339 + (g / 255) * 0.119192 + (b / 255) * 0.9503041

  const L = 116 * f(Y) - 16
  const a = 500 * (f(X) - f(Y))
  const bLab = 200 * (f(Y) - f(Z))

  return [L, a, bLab]
}

/**
 * Convert RGB/RGBA string to Color object `{r: number, g: number, b: number, a: number}`
 * @param rgbString - string containing rgb color
 * @returns Color object
 */
export function stringToRgb(rgbString: string): RgbaColor {
  const rgbRgbaRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/
  const match = rgbString.match(rgbRgbaRegex)!
  expect(match, `${rgbString} to match RGB/RGBA format`).toBeTruthy()

  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1 // Default alpha = 1

  return { r, g, b, a }
}

/**
 * Finds the coordinates (x, y) of a target color within a given page or locator.
 * Supports searching within a specific element (locator) or the entire page.
 * @param options - Parameters for configuring the search and Playwright screenshot capture.
 * @see FindColorCoordinatesOptions
 * @returns A promise resolving to the coordinates `{ x, y }` if the color is found, or `null` if not found.
 */
export function findColorCoordinates(
  options: FindColorCoordinatesOptions,
): Promise<{ x: number; y: number } | null> {
  const {
    targetColorRgb,
    paddingPercent = {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
    },
    locator,
    colorDiffThreshold = 6,
    searchPattern = 'adaptiveStep',
    stepSize
  } = options ?? {}

  return test.step(`Find color: "${targetColorRgb}" coords`, async () => {
    const targetColor = stringToRgb(targetColorRgb)
    // Get bounding box of the element
    const boundingBox = (await locator.boundingBox())!
    expect(boundingBox, `Locator bounding box not to be null`).not.toBeNull()

    const dataURL = await locator.evaluate((element) => {
      const canvas = element as HTMLCanvasElement
      return canvas.toDataURL('image/png') // PNG as Data URL
    })

    // Data URL -> Buffer
    const buffer = Buffer.from(dataURL.split(',')[1], 'base64')

    const { data: imageData, info } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const width = info.width
    const height = info.height
    const paddingXLeft = Math.floor(width * ((paddingPercent.left ?? 0) / 100))
    const paddingXRight = Math.floor(width * ((paddingPercent.right ?? 0) / 100))
    const paddingYTop = Math.floor(height * ((paddingPercent.top ?? 0) / 100))
    const paddingYBottom = Math.floor(height * ((paddingPercent.bottom ?? 0) / 100))

    const searchPatternOptions: ColorSearchPatternOptions = {
      imageData,
      targetColor,
      width,
      height,
      colorDiffThreshold,
      startX: Math.max(paddingXLeft, 0),
      startY: Math.max(paddingYTop, 0),
      endX: width - paddingXRight,
      endY: height - paddingYBottom,
      offsetX: boundingBox.x,
      offsetY: boundingBox.y,
    }

    switch (searchPattern) {
      case 'spiral':
        return spiralSearchPattern(searchPatternOptions)
      case 'vertical':
        return verticalSearchPattern(searchPatternOptions)
      case 'horizontal':
        return horizontalSearchPattern(searchPatternOptions)
      case 'adaptiveStep':
        return adaptiveStepSearchPattern({...searchPatternOptions, stepSize})
      default:
        return null
    }
  })
}

/**
 * Spiral pattern color search:
 *   - **Pattern Logic:** Starts from the center of the search area and expands outward in a spiral.
 *   - **Best Use Case:** When the color is likely to be distributed in an unknown location.
 *   - **Advantages:** Searches efficiently in all directions.
 *   - **Limitations:** Can take longer to find colors near the edges.
 * @param options
 * @see ColorSearchPatternOptions
 * @returns A promise resolving to the coordinates `{ x, y }` if the color is found, or `null` if not found.
 */
function spiralSearchPattern(options: ColorSearchPatternOptions) {
  const {
    imageData, targetColor, width, height, startX, endX, startY, endY, offsetX, offsetY, colorDiffThreshold,
  } = options
  const directions = [
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 }, // Left
    { x: 0, y: -1 }, // Up
  ]
  // Calculate starting position (center of search area)
  const centerX = Math.floor((startX + endX) / 2)
  const centerY = Math.floor((startY + endY) / 2)

  let x = centerX
  let y = centerY
  let step = 1
  let directionIndex = 0
  let stepsInCurrentDirection = 0
  let turns = 0
  const maxSteps = (endX - startX) * (endY - startY)

  for (let checkedPixels = 0; checkedPixels < maxSteps; checkedPixels++) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const index = (y * width + x) * 4
      const color = {
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2],
        a: imageData[index + 3],
      }
      const diff = deltaE(color, targetColor)
      if (diff < colorDiffThreshold) {
        return { x: x + offsetX, y: y + offsetY }
      }
    }

    // Move in the current direction
    x += directions[directionIndex].x
    y += directions[directionIndex].y
    stepsInCurrentDirection++

    if (stepsInCurrentDirection === step) {
      stepsInCurrentDirection = 0
      directionIndex = (directionIndex + 1) % 4
      turns++
      if (turns % 2 === 0) {
        step++ // Increase step size every two turns
      }
    }
  }
  return null
}

/**
 * Horizontal pattern color search:
 *   - **Pattern Logic:** Scans row by row from left to right.
 *   - **Best Use Case:** When colors are expected to align horizontally.
 *   - **Advantages:** Suitable for elements arranged in rows.
 *   - **Limitations:** Inefficient if colors are scattered.
 * @param options
 * @see ColorSearchPatternOptions
 * @returns A promise resolving to the coordinates `{ x, y }` if the color is found, or `null` if not found.
 */
function horizontalSearchPattern(options: ColorSearchPatternOptions) {
  const { 
    imageData, targetColor, width, startX, endX, startY, endY, offsetX, offsetY, colorDiffThreshold 
  } = options
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = (y * width + x) * 4 // 4 bytes per pixel (RGBA)
      const color = {
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2],
        a: imageData[index + 3],
      }
      const diff = deltaE(color, targetColor)
      if (diff < colorDiffThreshold) {
        return { x: x + offsetX, y: y + offsetY }
      }
    }
  }
  return null
}

/**
 * Vertical pattern color search:
 *   - **Pattern Logic:** Scans column by column from top to bottom.
 *   - **Best Use Case:** When colors are expected to align vertically.
 *   - **Advantages:** Works well for structured layouts.
 *   - **Limitations:** Inefficient for scattered colors.
 * @param options
 * @see ColorSearchPatternOptions
 * @returns A promise resolving to the coordinates `{ x, y }` if the color is found, or `null` if not found.
 */
function verticalSearchPattern(options: ColorSearchPatternOptions) {
  const { 
    imageData, targetColor, width, startX, endX, startY, endY, offsetX, offsetY, colorDiffThreshold 
  } = options
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const index = (y * width + x) * 4 // 4 bytes per pixel (RGBA)
      const color = {
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2],
        a: imageData[index + 3],
      }
      const diff = deltaE(color, targetColor)
      if (diff < colorDiffThreshold) {
        return { x: x + offsetX, y: y + offsetY }
      }
    }
  }
  return null
}

/**
 * Adaptive Step pattern color search:
 *   - **Pattern Logic:** Performs a coarse search with a step size (e.g., every 5th pixel) to quickly cover the area,
 *     then refines the search in a small region around the coarse match.
 *   - **Best Use Case:** Large images or when the color location is unknown.
 *   - **Advantages:** Significantly reduces the number of pixels checked, making it faster for large canvases.
 *   - **Limitations:** May miss single-pixel targets if the step size is too large.
 * @param options
 * @see ColorSearchPatternOptions
 * @returns A promise resolving to the coordinates `{ x, y }` if the color is found, or `null` if not found.
 */
function adaptiveStepSearchPattern(options: ColorSearchPatternOptions & {stepSize?: number, }) {
  const {
    imageData, targetColor, width, startX, endX, startY, endY, offsetX, offsetY, colorDiffThreshold, 
    stepSize = 5
  } = options

  // Step size for coarse search (adjust based on image size)
  const step = Math.max(stepSize, Math.floor(Math.sqrt((endX - startX) * (endY - startY)) / 100))

  // Step 1: Coarse search with step size
  let coarseMatch: { x: number; y: number } | null = null
  for (let y = startY; y < endY; y += step) {
    for (let x = startX; x < endX; x += step) {
      const index = (y * width + x) * 4
      const color = {
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2],
        a: imageData[index + 3],
      }
      const diff = deltaE(color, targetColor)
      if (diff < colorDiffThreshold) {
        coarseMatch = { x, y }
        break
      }
    }
    if (coarseMatch) break
  }

  // Step 2: If coarse match found, refine search in a small region
  if (coarseMatch) {
    const refineRadius = step * 2 // Search within 2x step size around coarse match
    const refineStartX = Math.max(startX, coarseMatch.x - refineRadius)
    const refineEndX = Math.min(endX, coarseMatch.x + refineRadius)
    const refineStartY = Math.max(startY, coarseMatch.y - refineRadius)
    const refineEndY = Math.min(endY, coarseMatch.y + refineRadius)

    for (let y = refineStartY; y < refineEndY; y++) {
      for (let x = refineStartX; x < refineEndX; x++) {
        const index = (y * width + x) * 4
        const color = {
          r: imageData[index],
          g: imageData[index + 1],
          b: imageData[index + 2],
          a: imageData[index + 3],
        }
        const diff = deltaE(color, targetColor)
        if (diff < colorDiffThreshold) {
          return { x: x + offsetX, y: y + offsetY }
        }
      }
    }
  }

  return null
}
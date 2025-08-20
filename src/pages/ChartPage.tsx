import { useEffect, useRef, useState } from 'react'

export default function ChartPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number | null; item: string | null }>({ x: 0, y: 0, value: null, item: null })
  const [hoveredIndex, setHoveredIndex] = useState<{ index: number | null; item: string | null }>({ index: null, item: null })
  const [selectedItems, setSelectedItems] = useState<string[]>(['Item1'])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: string | null } | null>(null)

  const chartMockData = {
    Item1: {
      labels: [
        '1', '2', '3', '4', '5', '6', '6',
        '8', '9', '10', '11', '12', '13', '14',
        '15', '16', '17'
      ],
      values: [
        90.5, 92.3, 93.1, 92.7, 91.9, 91.2, 91.5,
        92.0, 92.4, 92.2, 91.8, 91.6, 91.0, 90.7,
        90.3, 90.5, 90.8
      ],
    },
    Item2: {
      labels: [
        '1', '2', '3', '4', '5', '6', '6',
        '8', '9', '10', '11', '12', '13', '14',
        '15', '16', '17'
      ],
      values: [
        120.2, 151.8, 152.5, 151.9, 151.0, 150.5, 150.8,
        151.2, 121.7, 131.4, 151.0, 150.7, 150.2, 149.8,
        80.5, 90.7, 100.0
      ],
    },
    Item3: {
      labels: [
        '1', '2', '3', '4', '5', '6', '6',
        '8', '9', '10', '11', '12', '13', '14',
        '15', '16', '17'
      ],
      values: [
        75.0, 80.5, 77.2, 81.8, 82.0, 75.5, 75.8,
        76.3, 76.9, 76.6, 76.2, 100.9, 100.4, 75.0,
        90.7, 80.9, 85.2
      ],
    }
  }

  // Colors for each item
  const chartColors = {
    Item1: '#1e5adeff',
    Item2: '#ff6384',
    Item3: '#45eb36ff'
  }

  const allValues = Object.values(chartMockData).flatMap(x => x.values)
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
  const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--axis-color').trim()

  // Function to calculate distance from point to line segment
  const getDistanceToSegment = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2 // Length squared of segment
    if (l2 === 0) return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) // If segment is a point
    let t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / l2
    t = Math.max(0, Math.min(1, t)) // Clamp to segment bounds
    const px = x1 + t * (x2 - x1)
    const py = y1 + t * (y2 - y1)
    return Math.sqrt((x - px) ** 2 + (y - py) ** 2)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const width = canvas.width
        const height = canvas.height
        ctx.clearRect(0, 0, width, height)

        // Check if no items are selected
        if (selectedItems.length === 0) {
          ctx.fillStyle = textColor
          ctx.font = '16px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('No items selected. Please select at least one item.', width / 2, height / 2)
          return
        }

        const padding = 40
        const startGap = 20
        const endGap = 20

        // Draw axes
        ctx.beginPath()
        ctx.strokeStyle = axisColor
        ctx.lineWidth = 1
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.stroke()

        // Draw Y-axis scale
        const range = maxValue - minValue
        const tickInterval = Math.ceil((maxValue - minValue) / 5)
        ctx.strokeStyle = axisColor
        ctx.lineWidth = 0.5
        ctx.font = '10px Arial'
        ctx.fillStyle = textColor
        ctx.textAlign = 'right'
        for (let value = minValue; value <= maxValue; value += tickInterval) {
          const y = height - padding - ((value - minValue) / range) * (height - 2 * padding)
          ctx.beginPath()
          ctx.moveTo(padding - 5, y)
          ctx.lineTo(padding, y)
          ctx.stroke()
          ctx.fillText(value.toFixed(1), padding - 8, y + 3)
        }

        // Draw lines and points for each selected item
        selectedItems.forEach((item) => {
          const data = chartMockData[item as keyof typeof chartMockData]
          const dataPoints = data.values.length
          const range = maxValue - minValue

          const chartWidth = width - 2 * padding - startGap - endGap
          const xStep = chartWidth / (dataPoints - 1)

          const points = data.values.map((value, index) => {
            const x = padding + startGap + index * xStep
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding)
            return { x, y }
          })

          // Draw connecting line
          ctx.beginPath()
          ctx.strokeStyle = chartColors[item as keyof typeof chartColors]
          ctx.lineWidth = 2
          if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y)
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y)
            }
            ctx.stroke()
          }

          // Draw data points with hover effect
          points.forEach((point, index) => {
            const isHovered = hoveredIndex.item === item && hoveredIndex.index === index
            const radius = isHovered ? 4 : 2
            ctx.fillStyle = chartColors[item as keyof typeof chartColors]
            ctx.beginPath()
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
            ctx.fill()
          })
        })

        // Add labels using xStep from the first item
        const firstItem = chartMockData[selectedItems[0] as keyof typeof chartMockData]
        const dataPoints = firstItem.values.length
        const chartWidth = width - 2 * padding - startGap - endGap
        const xStep = chartWidth / (dataPoints - 1)
        ctx.fillStyle = textColor
        ctx.font = '12px Arial'
        firstItem.labels.forEach((label, index) => {
          const x = padding + startGap + index * xStep
          ctx.fillText(label, x - 10, height - padding + 15)
        })
        ctx.save()
        ctx.rotate(-Math.PI / 2)
        ctx.restore()
        ctx.fillText('Labels', (width - padding) / 2, height - padding + 35)
      }
    }
  }, [hoveredIndex, selectedItems])

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (canvas && wrapper) {
      const canvasRect = canvas.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      const x = event.clientX - canvasRect.left
      const y = event.clientY - canvasRect.top

      const padding = 40
      const startGap = 20
      let closestDistance = Infinity
      let closestIndex: number | null = null
      let closestItem: string | null = null

      // Use the first selected item's data for xStep calculation
      const firstItem = chartMockData[selectedItems[0] as keyof typeof chartMockData]
      const dataPoints = firstItem.values.length
      const width = canvas.width
      const chartWidth = width - 2 * padding - startGap - 20
      const xStep = chartWidth / (dataPoints - 1)

      selectedItems.forEach((item) => {
        const data = chartMockData[item as keyof typeof chartMockData]
        const points = data.values.map((value, index) => {
          const x = padding + startGap + index * xStep
          const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * (canvas.height - 2 * padding)
          return { x, y }
        })

        // Check distance to points
        points.forEach((point, index) => {
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
            closestItem = item
          }
        })

        // Check distance to line segments
        for (let i = 0; i < points.length - 1; i++) {
          const distance = getDistanceToSegment(x, y, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = i // Use the start index of the segment
            closestItem = item
          }
        }
      })

      const isHovered = closestDistance < 10
      setHoveredIndex(isHovered ? { index: closestIndex, item: closestItem } : { index: null, item: null })

      if (isHovered && closestItem && closestIndex !== null) {
        const data = chartMockData[closestItem as keyof typeof chartMockData]
        const tooltipX = event.clientX - wrapperRect.left + 10
        const tooltipY = event.clientY - wrapperRect.top - 20
        const maxX = wrapperRect.width - 80
        const maxY = wrapperRect.height - 30

        setTooltip({
          x: Math.min(tooltipX, maxX),
          y: Math.min(tooltipY, maxY),
          value: data.values[closestIndex],
          item: closestItem,
        })
      } else {
        setTooltip({ x: 0, y: 0, value: null, item: null })
      }
    }
  }

  const handleCanvasMouseLeave = () => {
    setHoveredIndex({ index: null, item: null })
    setTooltip({ x: 0, y: 0, value: null, item: null })
  }

  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault() // Prevent default context menu
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (canvas && wrapper) {
      const canvasRect = canvas.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      const x = event.clientX - canvasRect.left
      const y = event.clientY - canvasRect.top

      const padding = 40
      const startGap = 20
      const firstItem = chartMockData[selectedItems[0] as keyof typeof chartMockData]
      const dataPoints = firstItem.values.length
      const width = canvas.width
      const chartWidth = width - 2 * padding - startGap - 20
      const xStep = chartWidth / (dataPoints - 1)

      let closestDistance = Infinity
      let closestItem: string | null = null

      selectedItems.forEach((item) => {
        const data = chartMockData[item as keyof typeof chartMockData]
        const points = data.values.map((value, index) => {
          const x = padding + startGap + index * xStep
          const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * (canvas.height - 2 * padding)
          return { x, y }
        })

        // Check distance to points
        points.forEach((point) => {
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
          if (distance < closestDistance) {
            closestDistance = distance
            closestItem = item
          }
        })

        // Check distance to line segments
        for (let i = 0; i < points.length - 1; i++) {
          const distance = getDistanceToSegment(x, y, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
          if (distance < closestDistance) {
            closestDistance = distance
            closestItem = item
          }
        }
      })

      if (closestDistance < 10 && closestItem) {
        setContextMenu({
          x: event.clientX - wrapperRect.left,
          y: event.clientY - wrapperRect.top,
          item: closestItem,
        })
      }
    }
  }

  const handleHideItem = () => {
    if (contextMenu?.item) {
      setSelectedItems((prev) => prev.filter((s) => s !== contextMenu.item))
      setContextMenu(null)
    }
  }

  const handleContextMenuClose = () => {
    setContextMenu(null)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 0) { // Left click
      setContextMenu(null) // Close context menu on left click
    }
  }

  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const item = event.target.value
    setSelectedItems((prev) =>
      event.target.checked
        ? [...prev, item]
        : prev.filter((s) => s !== item)
    )
  }

  return (
    <div style={{ height: '80vh', position: 'relative' }}>
      <h1>Chart</h1>
      <div style={{ marginBottom: '1rem' }}>
        {Object.keys(chartMockData).map((item) => (
          <label 
            data-testid='legend-item'
            key={item} 
            style={{ marginRight: '1rem', color: chartColors[item as keyof typeof chartColors] }}
          >
            <input
              type="checkbox"
              value={item}
              checked={selectedItems.includes(item)}
              onChange={handleItemChange}
            />
            {item}
          </label>
        ))}
      </div>
      <div ref={wrapperRef} style={{ marginTop: '1rem', position: 'relative', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <canvas
          className='canvas-container'
          ref={canvasRef}
          width={800}
          height={400}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          onContextMenu={handleCanvasContextMenu}
          onClick={handleCanvasClick}
        />
        {tooltip.value !== null && tooltip.item !== null && (
          <div
            className='tooltip'
            data-testid='tooltip'
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {tooltip.item}: {tooltip.value.toFixed(2)}
          </div>
        )}
        {contextMenu && (
          <div
            className='context-menu'
            data-testid='chart-item-context-menu'
            style={{
              position: 'absolute',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 20,
              cursor: 'pointer',
            }}
            onMouseLeave={handleContextMenuClose}
          >
            <div
              className='context-menu-option'
              data-testid='chart-item-context-menu-hide-item'
              onClick={handleHideItem}
            >
              Hide {contextMenu.item}
            </div>
            <div
              className='context-menu-option'
            >
              Some option 1
            </div>
            <div
              className='context-menu-option'
            >
              Some option 2
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
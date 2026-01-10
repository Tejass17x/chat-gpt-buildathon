import React, { useRef, useState, useEffect } from 'react'
import './Resizer.css'

const Resizer = ({ element, onResize, minWidth = 50, minHeight = 50 }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const elementRef = useRef(null)

  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      setStartSize({
        width: rect.width,
        height: rect.height
      })
    }
  }, [element])

  const getCurrentSize = () => {
    // Get size from the element's rendered dimensions
    if (elementRef.current) {
      const container = elementRef.current.closest('.canvas-element')
      if (container) {
        const rect = container.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          return {
            width: rect.width,
            height: rect.height
          }
        }
      }
      // Try parent element
      const parent = elementRef.current.parentElement
      if (parent) {
        const rect = parent.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          return {
            width: rect.width,
            height: rect.height
          }
        }
      }
    }
    // Fallback to element style if available
    const width = element.style?.width
    const height = element.style?.height
    const widthValue = width ? (typeof width === 'string' ? parseFloat(width) : width) : 200
    const heightValue = height ? (typeof height === 'string' ? parseFloat(height) : height) : 100
    return {
      width: Math.max(widthValue, 50),
      height: Math.max(heightValue, 20)
    }
  }

  const parseSize = (size) => {
    if (typeof size === 'string') {
      const match = size.match(/(\d+)(px|%)?/)
      return match ? { value: parseInt(match[1]), unit: match[2] || 'px' } : { value: 0, unit: 'px' }
    }
    return { value: size || 0, unit: 'px' }
  }

  const handleMouseDown = (e, handle) => {
    e.stopPropagation()
    e.preventDefault()
    
    const currentSize = getCurrentSize()
    const startX = e.clientX
    const startY = e.clientY
    const startW = currentSize.width
    const startH = currentSize.height
    
    setIsResizing(true)
    setResizeHandle(handle)
    setStartPos({ x: startX, y: startY })
    setStartSize({ width: startW, height: startH })

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newWidth = startW
      let newHeight = startH

      // Calculate new dimensions based on handle
      switch (handle) {
        case 'nw': // Top-left
          newWidth = Math.max(minWidth, startW - deltaX)
          newHeight = Math.max(minHeight, startH - deltaY)
          break
        case 'ne': // Top-right
          newWidth = Math.max(minWidth, startW + deltaX)
          newHeight = Math.max(minHeight, startH - deltaY)
          break
        case 'sw': // Bottom-left
          newWidth = Math.max(minWidth, startW - deltaX)
          newHeight = Math.max(minHeight, startH + deltaY)
          break
        case 'se': // Bottom-right
          newWidth = Math.max(minWidth, startW + deltaX)
          newHeight = Math.max(minHeight, startH + deltaY)
          break
        case 'n': // Top
          newHeight = Math.max(minHeight, startH - deltaY)
          break
        case 's': // Bottom
          newHeight = Math.max(minHeight, startH + deltaY)
          break
        case 'w': // Left
          newWidth = Math.max(minWidth, startW - deltaX)
          break
        case 'e': // Right
          newWidth = Math.max(minWidth, startW + deltaX)
          break
      }

      // Update element style
      const newStyle = {
        ...element.style,
        width: `${newWidth}px`,
        height: `${newHeight}px`
      }

      onResize(newStyle)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handles = [
    { position: 'nw', cursor: 'nw-resize' }, // Top-left
    { position: 'n', cursor: 'n-resize' },   // Top
    { position: 'ne', cursor: 'ne-resize' }, // Top-right
    { position: 'e', cursor: 'e-resize' },   // Right
    { position: 'se', cursor: 'se-resize' }, // Bottom-right
    { position: 's', cursor: 's-resize' },  // Bottom
    { position: 'sw', cursor: 'sw-resize' }, // Bottom-left
    { position: 'w', cursor: 'w-resize' }    // Left
  ]

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle.position}
          className={`resize-handle resize-handle-${handle.position} ${resizeHandle === handle.position ? 'active' : ''}`}
          style={{ cursor: handle.cursor }}
          onMouseDown={(e) => handleMouseDown(e, handle.position)}
        />
      ))}
      <div 
        ref={elementRef}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          visibility: 'hidden'
        }}
      />
    </>
  )
}

export default Resizer


import React, { useRef, useState, useEffect, useCallback } from 'react'
import './Resizer.css'

const Resizer = ({ element, onResize, minWidth = 50, minHeight = 50, disabled = false }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const elementRef = useRef(null)
  const animationFrameRef = useRef(null)
  const resizeDataRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, startPosX: 0, startPosY: 0 })
  
  // Check if element is locked or disabled
  const isDisabled = disabled || element.locked || false

  const getCurrentSize = useCallback(() => {
    // Get size from element style if available, otherwise use defaults
    const width = element.style?.width
    const height = element.style?.height
    
    let widthValue = 200
    let heightValue = 100
    
    if (width) {
      if (typeof width === 'string') {
        widthValue = parseFloat(width) || 200
      } else {
        widthValue = width
      }
    }
    
    if (height) {
      if (typeof height === 'string') {
        heightValue = parseFloat(height) || 100
      } else {
        heightValue = height
      }
    }
    
    return {
      width: Math.max(widthValue, minWidth),
      height: Math.max(heightValue, minHeight)
    }
  }, [element.style, minWidth, minHeight])

  const handleMouseDown = (e, handle) => {
    e.stopPropagation()
    e.preventDefault()
    
    // Prevent resizing if disabled or locked
    if (isDisabled) return
    
    const currentSize = getCurrentSize()
    const startX = e.clientX
    const startY = e.clientY
    const startW = currentSize.width
    const startH = currentSize.height
    const startPosX = element.position?.x || 0
    const startPosY = element.position?.y || 0
    
    setIsResizing(true)
    setResizeHandle(handle)
    
    // Store initial values in ref for use in animation frame
    resizeDataRef.current = {
      startX,
      startY,
      startW,
      startH,
      startPosX,
      startPosY,
      handle
    }

    const handleMouseMove = (moveEvent) => {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const { startX, startY, startW, startH, startPosX, startPosY, handle } = resizeDataRef.current
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY

        let newWidth = startW
        let newHeight = startH
        let newPosX = startPosX
        let newPosY = startPosY

        // Calculate new dimensions and position based on handle
        switch (handle) {
          case 'nw': // Top-left - adjust both size and position
            newWidth = Math.max(minWidth, startW - deltaX)
            newHeight = Math.max(minHeight, startH - deltaY)
            newPosX = startPosX + (startW - newWidth)
            newPosY = startPosY + (startH - newHeight)
            break
          case 'ne': // Top-right - adjust size and Y position
            newWidth = Math.max(minWidth, startW + deltaX)
            newHeight = Math.max(minHeight, startH - deltaY)
            newPosY = startPosY + (startH - newHeight)
            break
          case 'sw': // Bottom-left - adjust size and X position
            newWidth = Math.max(minWidth, startW - deltaX)
            newHeight = Math.max(minHeight, startH + deltaY)
            newPosX = startPosX + (startW - newWidth)
            break
          case 'se': // Bottom-right - only adjust size
            newWidth = Math.max(minWidth, startW + deltaX)
            newHeight = Math.max(minHeight, startH + deltaY)
            break
          case 'n': // Top - adjust height and Y position
            newHeight = Math.max(minHeight, startH - deltaY)
            newPosY = startPosY + (startH - newHeight)
            break
          case 's': // Bottom - only adjust height
            newHeight = Math.max(minHeight, startH + deltaY)
            break
          case 'w': // Left - adjust width and X position
            newWidth = Math.max(minWidth, startW - deltaX)
            newPosX = startPosX + (startW - newWidth)
            break
          case 'e': // Right - only adjust width
            newWidth = Math.max(minWidth, startW + deltaX)
            break
        }

        // Update element style and position in real-time
        const newStyle = {
          ...element.style,
          width: `${newWidth}px`,
          height: `${newHeight}px`
        }

        // Only include position if it changed (for top/left handles)
        const updates = { style: newStyle }
        if (newPosX !== startPosX || newPosY !== startPosY) {
          updates.position = { x: newPosX, y: newPosY }
        }

        // Call onResize with updates for live updates
        onResize(updates)
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: false })
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
          className={`resize-handle resize-handle-${handle.position} ${resizeHandle === handle.position ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
          style={{ 
            cursor: isDisabled ? 'not-allowed' : handle.cursor,
            opacity: isDisabled ? 0.3 : 1,
            pointerEvents: isDisabled ? 'none' : 'all'
          }}
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


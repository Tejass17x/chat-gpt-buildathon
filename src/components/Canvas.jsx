import React, { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import CanvasElement from './CanvasElement'
import './Canvas.css'

const Canvas = ({ elements, onDrop, onSelectElement, selectedElement, onDeleteElement, onUpdateElement, onToggleLock }) => {
  const canvasRef = useRef(null)
  const [dropPosition, setDropPosition] = useState(null)
  const [showGrid, setShowGrid] = useState(true)

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['element', 'canvas-element'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !canvasRef.current) return
      
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop
      
      // Calculate position accounting for scroll and padding
      const GRID_SIZE = 10
      const x = Math.round((offset.x - canvasRect.left + scrollLeft - 32) / GRID_SIZE) * GRID_SIZE
      const y = Math.round((offset.y - canvasRect.top + scrollTop - 32) / GRID_SIZE) * GRID_SIZE
      
      const position = {
        x: Math.max(0, x),
        y: Math.max(0, y)
      }
      
      setDropPosition(null)
      
      // If moving existing element
      if (item.type === 'move' && item.id) {
        // Don't allow moving locked elements
        const elementToMove = elements.find(el => el.id === item.id)
        if (elementToMove && elementToMove.locked) {
          return // Prevent moving locked element
        }
        
        // Check if moving onto locked elements
        const overlappingLockedElements = elements.filter(el => {
          if (!el.locked || el.id === item.id) return false
          // Check if position overlaps with locked element (threshold for overlap detection)
          const threshold = 100 // pixels
          const distanceX = Math.abs(el.position.x - position.x)
          const distanceY = Math.abs(el.position.y - position.y)
          return distanceX < threshold && distanceY < threshold
        })
        
        // If moving onto locked elements, adjust z-index
        if (overlappingLockedElements.length > 0) {
          // Put locked elements to back
          overlappingLockedElements.forEach(lockedEl => {
            onUpdateElement(lockedEl.id, { zIndex: 1 })
          })
          // Move current element to front
          const maxZIndex = Math.max(...elements.map(el => el.zIndex || 1))
          onUpdateElement(item.id, { position, zIndex: maxZIndex + 1 })
        } else {
          // Normal move - just update position
          onUpdateElement(item.id, { position })
        }
        
        // Update selected element if it's the one being moved
        if (selectedElement?.id === item.id) {
          const updatedElement = { ...selectedElement, position }
          if (overlappingLockedElements.length > 0) {
            const maxZIndex = Math.max(...elements.map(el => el.zIndex || 1))
            updatedElement.zIndex = maxZIndex + 1
          }
          onSelectElement(updatedElement)
        }
      } else {
        // New element from sidebar
        onDrop(item, position)
      }
    },
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !canvasRef.current) return
      
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop
      
      const GRID_SIZE = 10
      const x = Math.round((offset.x - canvasRect.left + scrollLeft - 32) / GRID_SIZE) * GRID_SIZE
      const y = Math.round((offset.y - canvasRect.top + scrollTop - 32) / GRID_SIZE) * GRID_SIZE
      
      setDropPosition({
        x: Math.max(0, x),
        y: Math.max(0, y)
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  drop(canvasRef)

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h3>Canvas</h3>
        <div className="header-controls">
          <label className="grid-toggle">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span>Show Grid</span>
          </label>
          <span className="element-count">{elements.length} elements</span>
        </div>
      </div>
      <div
        ref={canvasRef}
        className={`canvas ${isOver && canDrop ? 'drag-over' : ''} ${showGrid ? 'show-grid' : ''}`}
      >
        {dropPosition && isOver && (
          <div
            className="drop-indicator"
            style={{
              left: `${dropPosition.x}px`,
              top: `${dropPosition.y}px`
            }}
          />
        )}
        {elements.length === 0 && !isOver && (
          <div className="canvas-empty">
            <div className="empty-icon">🎨</div>
            <h3>Drop elements here</h3>
            <p>Drag elements from the sidebar to start building</p>
          </div>
        )}
        {elements
          .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={() => onSelectElement(element)}
              onDelete={() => onDeleteElement(element.id)}
              onToggleLock={() => onToggleLock(element.id)}
              onUpdate={(updates) => {
                // Update the element in the elements array
                onUpdateElement(element.id, updates)
                // Also update the selected element state
                const updated = { ...element, ...updates }
                onSelectElement(updated)
              }}
            />
          ))}
      </div>
    </div>
  )
}

export default Canvas




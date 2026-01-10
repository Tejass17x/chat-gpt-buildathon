import React, { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import CanvasElement from './CanvasElement'
import './Canvas.css'

const Canvas = ({ elements, onDrop, onSelectElement, selectedElement, onDeleteElement, onUpdateElement }) => {
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
        onUpdateElement(item.id, { position })
        // Update selected element if it's the one being moved
        if (selectedElement?.id === item.id) {
          onSelectElement({ ...selectedElement, position })
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
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => onSelectElement(element)}
            onDelete={() => onDeleteElement(element.id)}
            onUpdate={(updates) => {
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




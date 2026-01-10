import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import Resizer from './Resizer'
import './CanvasElement.css'

const CanvasElement = ({ element, isSelected, onSelect, onDelete, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-element',
    item: { 
      id: element.id,
      type: 'move',
      currentPosition: element.position
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const renderElement = () => {
    // Ensure element has width and height for resizing
    const elementStyle = { ...element.style }
    
    // Set default dimensions if not specified
    if (!elementStyle.width) {
      if (element.type === 'divider') {
        elementStyle.width = '200px'
      } else if (element.type === 'image') {
        elementStyle.width = elementStyle.width || '400px'
      } else {
        elementStyle.width = 'auto'
      }
    }
    
    if (!elementStyle.height) {
      if (element.type === 'divider') {
        elementStyle.height = '1px'
      } else if (element.type === 'image') {
        elementStyle.height = elementStyle.height || 'auto'
      } else {
        elementStyle.height = 'auto'
      }
    }

    const baseStyle = {
      ...elementStyle,
      position: 'relative',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      pointerEvents: 'auto',
      display: 'block'
    }

    switch (element.type) {
      case 'navbar':
        return (
          <nav style={baseStyle} onClick={onSelect}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '2rem', margin: 0, padding: 0 }}>
              {element.props.text?.split(' ').map((item, i) => (
                <li key={i} style={{ cursor: 'pointer' }}>{item}</li>
              ))}
            </ul>
          </nav>
        )
      case 'button':
        return (
          <button
            style={baseStyle}
            onClick={onSelect}
            className={`btn-${element.props.variant || 'primary'}`}
          >
            {element.props.text}
          </button>
        )
      case 'heading':
        const HeadingTag = `h${element.props.level || 1}`
        return (
          <HeadingTag style={baseStyle} onClick={onSelect}>
            {element.props.text}
          </HeadingTag>
        )
      case 'paragraph':
        return (
          <p style={baseStyle} onClick={onSelect}>
            {element.props.text}
          </p>
        )
      case 'image':
        const imageStyle = {
          ...baseStyle,
          display: 'block',
          objectFit: 'contain',
          maxWidth: element.style?.maxWidth || '400px',
          width: element.style?.width || 'auto',
          height: element.style?.height || 'auto',
          minWidth: '100px',
          minHeight: '50px'
        }
        return (
          <img
            src={element.props.src || 'https://via.placeholder.com/400x300'}
            alt={element.props.alt || 'Image'}
            style={imageStyle}
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
              e.target.alt = 'Image Not Found'
            }}
            onLoad={(e) => {
              // Ensure image displays properly
              e.target.style.display = 'block'
            }}
            draggable={false}
          />
        )
      case 'input':
        return (
          <input
            type={element.props.type || 'text'}
            placeholder={element.props.placeholder}
            style={baseStyle}
            onClick={onSelect}
            readOnly
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={element.props.placeholder}
            rows={element.props.rows || 4}
            style={baseStyle}
            onClick={onSelect}
            readOnly
          />
        )
      case 'card':
        return (
          <div style={baseStyle} onClick={onSelect}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              {element.props.title}
            </h3>
            <p style={{ margin: 0, color: '#666' }}>{element.props.content}</p>
          </div>
        )
      case 'divider':
        return (
          <hr 
            style={{
              ...baseStyle,
              width: element.style?.width || '200px',
              height: element.style?.height || '1px',
              border: 'none',
              borderTop: '1px solid #ddd'
            }} 
            onClick={onSelect} 
          />
        )
      case 'container':
        return (
          <div style={baseStyle} onClick={onSelect}>
            {element.props.children || 'Container'}
          </div>
        )
      default:
        return <div style={baseStyle} onClick={onSelect}>Unknown Element</div>
    }
  }

  return (
    <div
      ref={drag}
      className={`canvas-element ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        zIndex: isSelected ? 1000 : isDragging ? 1001 : 1
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          display: 'inline-block'
        }}
      >
        <div ref={(el) => {
          if (el && isSelected) {
            // Store reference for resizer
            el.setAttribute('data-element-id', element.id)
          }
        }}>
          {renderElement()}
        </div>
        {isSelected && (
          <>
            <Resizer
              element={element}
              onResize={(newStyle) => {
                onUpdate({ style: newStyle })
              }}
              minWidth={element.type === 'image' ? 50 : element.type === 'divider' ? 50 : 30}
              minHeight={element.type === 'image' ? 50 : element.type === 'divider' ? 1 : 20}
            />
            <div className="element-controls">
              <button
                className="control-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>
      {isHovered && !isSelected && (
        <div className="element-overlay">
          <span className="element-type">{element.type}</span>
        </div>
      )}
    </div>
  )
}

export default CanvasElement




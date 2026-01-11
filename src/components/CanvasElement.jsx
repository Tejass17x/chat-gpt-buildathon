import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import Resizer from './Resizer'
import './CanvasElement.css'

const CanvasElement = ({ element, isSelected, onSelect, onDelete, onToggleLock, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false)
  const isLocked = element.locked || false

  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-element',
    item: { 
      id: element.id,
      type: 'move',
      currentPosition: element.position
    },
    canDrag: () => !isLocked, // Disable dragging for locked elements
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
      cursor: isLocked ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
      userSelect: 'none',
      pointerEvents: 'auto',
      display: 'block',
      opacity: isLocked ? 0.85 : 1
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
      case 'link':
        return (
          <a
            href={element.props.href || '#'}
            target={element.props.target || '_self'}
            style={baseStyle}
            onClick={onSelect}
          >
            {element.props.text || 'Link'}
          </a>
        )
      case 'list':
        const ListTag = element.props.ordered ? 'ol' : 'ul'
        const listItems = element.props.items?.split('\n') || []
        return (
          <ListTag style={baseStyle} onClick={onSelect}>
            {listItems.map((item, i) => (
              <li key={i}>{item.trim() || `Item ${i + 1}`}</li>
            ))}
          </ListTag>
        )
      case 'select':
        const selectOptions = element.props.options?.split('\n') || []
        return (
          <select style={baseStyle} onClick={onSelect} disabled>
            {element.props.placeholder && (
              <option value="" disabled>{element.props.placeholder}</option>
            )}
            {selectOptions.map((opt, i) => (
              <option key={i} value={opt.trim()}>{opt.trim() || `Option ${i + 1}`}</option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <label style={baseStyle} onClick={onSelect}>
            <input type="checkbox" checked={element.props.checked || false} readOnly />
            <span style={{ marginLeft: '0.5rem' }}>{element.props.label || 'Checkbox'}</span>
          </label>
        )
      case 'radio':
        return (
          <label style={baseStyle} onClick={onSelect}>
            <input type="radio" name={element.props.name || 'radio-group'} checked={element.props.checked || false} readOnly />
            <span style={{ marginLeft: '0.5rem' }}>{element.props.label || 'Radio'}</span>
          </label>
        )
      case 'label':
        return (
          <label htmlFor={element.props.for || ''} style={baseStyle} onClick={onSelect}>
            {element.props.text || 'Label'}
          </label>
        )
      case 'span':
        return (
          <span style={baseStyle} onClick={onSelect}>
            {element.props.text || 'Span text'}
          </span>
        )
      case 'table':
        const rows = element.props.rows || 3
        const cols = element.props.cols || 3
        const hasHeader = element.props.header !== false
        return (
          <table style={baseStyle} onClick={onSelect}>
            {hasHeader && (
              <thead>
                <tr>
                  {Array.from({ length: cols }).map((_, i) => (
                    <th key={i} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                      Header {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                  {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                      Cell {r + 1}-{c + 1}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'video':
        return (
          <video
            src={element.props.src || ''}
            controls={element.props.controls !== false}
            style={baseStyle}
            onClick={onSelect}
          >
            Your browser does not support the video tag.
          </video>
        )
      case 'iframe':
        return (
          <iframe
            src={element.props.src || 'https://www.example.com'}
            width={element.props.width || '600'}
            height={element.props.height || '400'}
            style={baseStyle}
            title="Embedded content"
            onClick={onSelect}
          />
        )
      case 'form':
        return (
          <form
            action={element.props.action || '#'}
            method={element.props.method || 'post'}
            style={baseStyle}
            onClick={onSelect}
            onSubmit={(e) => e.preventDefault()}
          >
            <p style={{ margin: 0, color: '#666' }}>Form container - Add inputs here</p>
          </form>
        )
      default:
        return <div style={baseStyle} onClick={onSelect}>Unknown Element: {element.type}</div>
    }
  }

  return (
    <div
      ref={!isLocked ? drag : null}
      className={`canvas-element ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isLocked ? 'locked' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        zIndex: element.zIndex || (isSelected ? 1000 : isDragging ? 1001 : 1)
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
              disabled={isLocked}
              onResize={(updates) => {
                // Handle both style and position updates from resizer
                if (updates.style && updates.position) {
                  onUpdate({ 
                    style: updates.style, 
                    position: updates.position 
                  })
                } else if (updates.style) {
                  onUpdate({ style: updates.style })
                }
              }}
              minWidth={element.type === 'image' ? 50 : element.type === 'divider' ? 50 : 30}
              minHeight={element.type === 'image' ? 50 : element.type === 'divider' ? 1 : 20}
            />
            <div className="element-controls">
              <button
                className={`control-btn lock-btn ${isLocked ? 'locked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleLock()
                }}
                title={isLocked ? 'Unlock' : 'Lock'}
              >
                {isLocked ? '🔒' : '🔓'}
              </button>
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
          {isLocked && <span className="lock-indicator">🔒</span>}
        </div>
      )}
    </div>
  )
}

export default CanvasElement




import React from 'react'
import { useDrag } from 'react-dnd'
import './Sidebar.css'

const ELEMENT_TYPES = [
  {
    type: 'navbar',
    label: 'Navbar',
    icon: '📋',
    defaultProps: { text: 'Home About Contact' },
    defaultStyle: { backgroundColor: '#333', color: '#fff', padding: '1rem' }
  },
  {
    type: 'button',
    label: 'Button',
    icon: '🔘',
    defaultProps: { text: 'Click Me', variant: 'primary' },
    defaultStyle: { padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: '📝',
    defaultProps: { text: 'Heading', level: 1 },
    defaultStyle: { fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: '📄',
    defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    defaultStyle: { fontSize: '1rem', lineHeight: '1.6', margin: '1rem 0' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    defaultProps: { src: 'https://via.placeholder.com/400x300', alt: 'Image' },
    defaultStyle: { width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '8px' }
  },
  {
    type: 'input',
    label: 'Input',
    icon: '📥',
    defaultProps: { placeholder: 'Enter text...', type: 'text' },
    defaultStyle: { padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📝',
    defaultProps: { placeholder: 'Enter your message...', rows: 4 },
    defaultStyle: { padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%', resize: 'vertical' }
  },
  {
    type: 'card',
    label: 'Card',
    icon: '🎴',
    defaultProps: { title: 'Card Title', content: 'Card content goes here...' },
    defaultStyle: { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '➖',
    defaultProps: {},
    defaultStyle: { borderTop: '1px solid #ddd', margin: '1rem 0' }
  },
  {
    type: 'container',
    label: 'Container',
    icon: '📦',
    defaultProps: {},
    defaultStyle: { padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', minHeight: '100px' }
  }
]

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: element,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <div
      ref={drag}
      className={`sidebar-element ${isDragging ? 'dragging' : ''}`}
    >
      <span className="element-icon">{element.icon}</span>
      <span className="element-label">{element.label}</span>
    </div>
  )
}

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Elements</h2>
        <p className="sidebar-subtitle">Drag to canvas</p>
      </div>
      <div className="sidebar-content">
        {ELEMENT_TYPES.map((element, index) => (
          <DraggableElement key={index} element={element} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar





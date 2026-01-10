import React, { useState, useEffect } from 'react'
import './PropertiesPanel.css'

const PropertiesPanel = ({ element, onUpdate }) => {
  const [localProps, setLocalProps] = useState({})
  const [localStyle, setLocalStyle] = useState({})
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (element) {
      setLocalProps(element.props || {})
      setLocalStyle(element.style || {})
      setImageError(false)
    }
  }, [element])

  if (!element) {
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="panel-empty">
          <p>Select an element to edit properties</p>
        </div>
      </div>
    )
  }

  const handlePropChange = (key, value) => {
    const newProps = { ...localProps, [key]: value }
    setLocalProps(newProps)
    onUpdate(element.id, { props: newProps })
  }

  const handleStyleChange = (key, value) => {
    const newStyle = { ...localStyle, [key]: value }
    setLocalStyle(newStyle)
    onUpdate(element.id, { style: newStyle })
  }

  const renderPropertyInputs = () => {
    const inputs = []

    // Common props
    if (element.type === 'button' || element.type === 'heading' || element.type === 'paragraph') {
      inputs.push(
        <div key="text" className="property-group">
          <label>Text</label>
          <input
            type="text"
            value={localProps.text || ''}
            onChange={(e) => handlePropChange('text', e.target.value)}
          />
        </div>
      )
    }

    if (element.type === 'heading') {
      inputs.push(
        <div key="level" className="property-group">
          <label>Level (1-6)</label>
          <input
            type="number"
            min="1"
            max="6"
            value={localProps.level || 1}
            onChange={(e) => handlePropChange('level', parseInt(e.target.value))}
          />
        </div>
      )
    }

    if (element.type === 'button') {
      inputs.push(
        <div key="variant" className="property-group">
          <label>Variant</label>
          <select
            value={localProps.variant || 'primary'}
            onChange={(e) => handlePropChange('variant', e.target.value)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="success">Success</option>
            <option value="danger">Danger</option>
          </select>
        </div>
      )
    }

    if (element.type === 'image') {
      inputs.push(
        <>
          <div key="src" className="property-group">
            <label>Image URL</label>
            <input
              type="url"
              value={localProps.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {localProps.src && (
              <div className="image-preview">
                {!imageError ? (
                  <img 
                    src={localProps.src} 
                    alt="Preview" 
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="image-error">
                    Invalid image URL
                  </div>
                )}
              </div>
            )}
          </div>
          <div key="alt" className="property-group">
            <label>Alt Text</label>
            <input
              type="text"
              value={localProps.alt || ''}
              onChange={(e) => handlePropChange('alt', e.target.value)}
              placeholder="Image description"
            />
          </div>
        </>
      )
    }

    if (element.type === 'input' || element.type === 'textarea') {
      inputs.push(
        <div key="placeholder" className="property-group">
          <label>Placeholder</label>
          <input
            type="text"
            value={localProps.placeholder || ''}
            onChange={(e) => handlePropChange('placeholder', e.target.value)}
          />
        </div>
      )
    }

    if (element.type === 'card') {
      inputs.push(
        <>
          <div key="title" className="property-group">
            <label>Title</label>
            <input
              type="text"
              value={localProps.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
            />
          </div>
          <div key="content" className="property-group">
            <label>Content</label>
            <textarea
              value={localProps.content || ''}
              onChange={(e) => handlePropChange('content', e.target.value)}
              rows={3}
            />
          </div>
        </>
      )
    }

    if (element.type === 'navbar') {
      inputs.push(
        <div key="text" className="property-group">
          <label>Menu Items (space separated)</label>
          <input
            type="text"
            value={localProps.text || ''}
            onChange={(e) => handlePropChange('text', e.target.value)}
          />
        </div>
      )
    }

    return inputs
  }

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Properties</h3>
        <span className="element-type-badge">{element.type}</span>
      </div>
      <div className="panel-content">
        <div className="section">
          <h4>Element Properties</h4>
          {renderPropertyInputs()}
        </div>

        <div className="section">
          <h4>Style</h4>
          <div className="property-group">
            <label>Background Color</label>
            <input
              type="color"
              value={localStyle.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
          </div>
          <div className="property-group">
            <label>Color</label>
            <input
              type="color"
              value={localStyle.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
          <div className="property-group">
            <label>Font Size (px)</label>
            <input
              type="number"
              value={parseInt(localStyle.fontSize) || 16}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
            />
          </div>
          <div className="property-group">
            <label>Padding (px)</label>
            <input
              type="number"
              value={parseInt(localStyle.padding) || 0}
              onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
            />
          </div>
          <div className="property-group">
            <label>Margin (px)</label>
            <input
              type="number"
              value={parseInt(localStyle.margin) || 0}
              onChange={(e) => handleStyleChange('margin', `${e.target.value}px`)}
            />
          </div>
          <div className="property-group">
            <label>Border Radius (px)</label>
            <input
              type="number"
              value={parseInt(localStyle.borderRadius) || 0}
              onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
            />
          </div>
          <div className="property-group">
            <label>Width (px or %)</label>
            <input
              type="text"
              value={localStyle.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="e.g., 100px or 50%"
            />
          </div>
          <div className="property-group">
            <label>Height (px or %)</label>
            <input
              type="text"
              value={localStyle.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="e.g., 100px or 50%"
            />
          </div>
        </div>

        <div className="section">
          <h4>Position</h4>
          <div className="property-group">
            <label>X Position (px)</label>
            <input
              type="number"
              value={element.position?.x || 0}
              onChange={(e) => onUpdate(element.id, {
                position: { ...element.position, x: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="property-group">
            <label>Y Position (px)</label>
            <input
              type="number"
              value={element.position?.y || 0}
              onChange={(e) => onUpdate(element.id, {
                position: { ...element.position, y: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel




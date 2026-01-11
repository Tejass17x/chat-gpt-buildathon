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

    if (element.type === 'link') {
      inputs.push(
        <>
          <div key="text" className="property-group">
            <label>Link Text</label>
            <input
              type="text"
              value={localProps.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
            />
          </div>
          <div key="href" className="property-group">
            <label>URL</label>
            <input
              type="url"
              value={localProps.href || ''}
              onChange={(e) => handlePropChange('href', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div key="target" className="property-group">
            <label>Target</label>
            <select
              value={localProps.target || '_self'}
              onChange={(e) => handlePropChange('target', e.target.value)}
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>
        </>
      )
    }

    if (element.type === 'list') {
      inputs.push(
        <>
          <div key="items" className="property-group">
            <label>Items (one per line)</label>
            <textarea
              value={localProps.items || ''}
              onChange={(e) => handlePropChange('items', e.target.value)}
              rows={4}
              placeholder="Item 1&#10;Item 2&#10;Item 3"
            />
          </div>
          <div key="ordered" className="property-group">
            <label>
              <input
                type="checkbox"
                checked={localProps.ordered || false}
                onChange={(e) => handlePropChange('ordered', e.target.checked)}
              />
              Ordered List
            </label>
          </div>
        </>
      )
    }

    if (element.type === 'select') {
      inputs.push(
        <>
          <div key="placeholder" className="property-group">
            <label>Placeholder</label>
            <input
              type="text"
              value={localProps.placeholder || ''}
              onChange={(e) => handlePropChange('placeholder', e.target.value)}
            />
          </div>
          <div key="options" className="property-group">
            <label>Options (one per line)</label>
            <textarea
              value={localProps.options || ''}
              onChange={(e) => handlePropChange('options', e.target.value)}
              rows={4}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        </>
      )
    }

    if (element.type === 'checkbox' || element.type === 'radio') {
      inputs.push(
        <>
          <div key="label" className="property-group">
            <label>Label Text</label>
            <input
              type="text"
              value={localProps.label || ''}
              onChange={(e) => handlePropChange('label', e.target.value)}
            />
          </div>
          <div key="checked" className="property-group">
            <label>
              <input
                type="checkbox"
                checked={localProps.checked || false}
                onChange={(e) => handlePropChange('checked', e.target.checked)}
              />
              Checked
            </label>
          </div>
          {element.type === 'radio' && (
            <div key="name" className="property-group">
              <label>Group Name</label>
              <input
                type="text"
                value={localProps.name || ''}
                onChange={(e) => handlePropChange('name', e.target.value)}
                placeholder="radio-group"
              />
            </div>
          )}
        </>
      )
    }

    if (element.type === 'label') {
      inputs.push(
        <>
          <div key="text" className="property-group">
            <label>Label Text</label>
            <input
              type="text"
              value={localProps.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
            />
          </div>
          <div key="for" className="property-group">
            <label>For (Element ID)</label>
            <input
              type="text"
              value={localProps.for || ''}
              onChange={(e) => handlePropChange('for', e.target.value)}
              placeholder="element-id"
            />
          </div>
        </>
      )
    }

    if (element.type === 'span') {
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

    if (element.type === 'table') {
      inputs.push(
        <>
          <div key="rows" className="property-group">
            <label>Rows</label>
            <input
              type="number"
              min="1"
              value={localProps.rows || 3}
              onChange={(e) => handlePropChange('rows', parseInt(e.target.value) || 1)}
            />
          </div>
          <div key="cols" className="property-group">
            <label>Columns</label>
            <input
              type="number"
              min="1"
              value={localProps.cols || 3}
              onChange={(e) => handlePropChange('cols', parseInt(e.target.value) || 1)}
            />
          </div>
          <div key="header" className="property-group">
            <label>
              <input
                type="checkbox"
                checked={localProps.header !== false}
                onChange={(e) => handlePropChange('header', e.target.checked)}
              />
              Show Header Row
            </label>
          </div>
        </>
      )
    }

    if (element.type === 'video') {
      inputs.push(
        <>
          <div key="src" className="property-group">
            <label>Video URL</label>
            <input
              type="url"
              value={localProps.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
          </div>
          <div key="controls" className="property-group">
            <label>
              <input
                type="checkbox"
                checked={localProps.controls !== false}
                onChange={(e) => handlePropChange('controls', e.target.checked)}
              />
              Show Controls
            </label>
          </div>
        </>
      )
    }

    if (element.type === 'iframe') {
      inputs.push(
        <>
          <div key="src" className="property-group">
            <label>URL</label>
            <input
              type="url"
              value={localProps.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              placeholder="https://www.example.com"
            />
          </div>
          <div key="width" className="property-group">
            <label>Width</label>
            <input
              type="text"
              value={localProps.width || '600'}
              onChange={(e) => handlePropChange('width', e.target.value)}
            />
          </div>
          <div key="height" className="property-group">
            <label>Height</label>
            <input
              type="text"
              value={localProps.height || '400'}
              onChange={(e) => handlePropChange('height', e.target.value)}
            />
          </div>
        </>
      )
    }

    if (element.type === 'form') {
      inputs.push(
        <>
          <div key="action" className="property-group">
            <label>Action URL</label>
            <input
              type="text"
              value={localProps.action || '#'}
              onChange={(e) => handlePropChange('action', e.target.value)}
            />
          </div>
          <div key="method" className="property-group">
            <label>Method</label>
            <select
              value={localProps.method || 'post'}
              onChange={(e) => handlePropChange('method', e.target.value)}
            >
              <option value="get">GET</option>
              <option value="post">POST</option>
            </select>
          </div>
        </>
      )
    }

    if (element.type === 'container') {
      inputs.push(
        <div key="children" className="property-group">
          <label>Content</label>
          <textarea
            value={localProps.children || ''}
            onChange={(e) => handlePropChange('children', e.target.value)}
            rows={3}
            placeholder="Container content"
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




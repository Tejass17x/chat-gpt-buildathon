import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import CodeGenerator from './components/CodeGenerator'
import './App.css'

function App() {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [showCodePanel, setShowCodePanel] = useState(false)

  const handleDrop = (element, position) => {
    // Find the highest z-index to ensure new element is on top
    const maxZIndex = elements.length > 0 
      ? Math.max(...elements.map(el => el.zIndex || 1)) 
      : 0
    
    // Get all locked elements that overlap with the new position
    const overlappingLockedElements = elements.filter(el => {
      if (!el.locked) return false
      // Check if drop position is near locked element (threshold for overlap detection)
      const threshold = 100 // pixels
      const distanceX = Math.abs(el.position.x - position.x)
      const distanceY = Math.abs(el.position.y - position.y)
      return distanceX < threshold && distanceY < threshold
    })

    // If dropping on locked elements, put locked elements to back and new element to front
    let newZIndex = maxZIndex + 1
    if (overlappingLockedElements.length > 0) {
      // Put locked elements to back (z-index 1)
      const updatedElements = elements.map(el => {
        if (overlappingLockedElements.some(lockEl => lockEl.id === el.id)) {
          return { ...el, zIndex: 1 }
        }
        return el
      })
      
      // New element gets high z-index to be on top
      const newElement = {
        id: Date.now().toString(),
        type: element.type,
        props: element.defaultProps || {},
        position: position,
        style: element.defaultStyle || {},
        locked: false,
        zIndex: maxZIndex + 1
      }
      setElements([...updatedElements, newElement])
      return
    }

    // Normal drop - no locked elements overlapping
    const newElement = {
      id: Date.now().toString(),
      type: element.type,
      props: element.defaultProps || {},
      position: position,
      style: element.defaultStyle || {},
      locked: false,
      zIndex: newZIndex
    }
    setElements([...elements, newElement])
  }

  const handleUpdateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
    // Update selected element if it's the one being updated
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates })
    }
  }

  const handleToggleLock = (id) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        return { ...el, locked: !el.locked }
      }
      return el
    }))
    // Update selected element if it's the one being locked/unlocked
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, locked: !selectedElement.locked })
    }
  }

  const handleDeleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setElements([])
      setSelectedElement(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>⚡ Drag Drop UI Builder</h1>
          <span className="subtitle">Professional Interface Designer</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowCodePanel(!showCodePanel)}
          >
            {showCodePanel ? 'Hide' : 'View'} Code
          </button>
          <button className="btn btn-secondary" onClick={handleClearCanvas}>
            Clear Canvas
          </button>
        </div>
      </header>

      <div className="app-body">
        <Sidebar />
        <Canvas
          elements={elements}
          onDrop={handleDrop}
          onSelectElement={setSelectedElement}
          selectedElement={selectedElement}
          onDeleteElement={handleDeleteElement}
          onUpdateElement={handleUpdateElement}
          onToggleLock={handleToggleLock}
        />
        <PropertiesPanel
          element={selectedElement}
          onUpdate={handleUpdateElement}
        />
      </div>

      {showCodePanel && (
        <CodeGenerator elements={elements} onClose={() => setShowCodePanel(false)} />
      )}
    </div>
  )
}

export default App




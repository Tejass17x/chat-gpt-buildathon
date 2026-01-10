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
    const newElement = {
      id: Date.now().toString(),
      type: element.type,
      props: element.defaultProps || {},
      position: position,
      style: element.defaultStyle || {}
    }
    setElements([...elements, newElement])
  }

  const handleUpdateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
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
          <h1>🎨 Reverse GPT</h1>
          <span className="subtitle">Drag & Drop Builder</span>
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




import React, { useState } from 'react'
import './CodeGenerator.css'

const CodeGenerator = ({ elements, onClose }) => {
  const [activeTab, setActiveTab] = useState('html')

  const generateHTML = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated UI</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
`

    elements.forEach((element) => {
      const styleString = Object.entries(element.style || {})
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ')

      switch (element.type) {
        case 'navbar':
          html += `        <nav style="${styleString}">\n`
          html += `            <ul style="list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;">\n`
          element.props.text?.split(' ').forEach((item) => {
            html += `                <li>${item}</li>\n`
          })
          html += `            </ul>\n`
          html += `        </nav>\n`
          break
        case 'button':
          html += `        <button class="btn-${element.props.variant || 'primary'}" style="${styleString}">${element.props.text || ''}</button>\n`
          break
        case 'heading':
          html += `        <h${element.props.level || 1} style="${styleString}">${element.props.text || ''}</h${element.props.level || 1}>\n`
          break
        case 'paragraph':
          html += `        <p style="${styleString}">${element.props.text || ''}</p>\n`
          break
        case 'image':
          html += `        <img src="${element.props.src || ''}" alt="${element.props.alt || ''}" style="${styleString}" />\n`
          break
        case 'input':
          html += `        <input type="${element.props.type || 'text'}" placeholder="${element.props.placeholder || ''}" style="${styleString}" />\n`
          break
        case 'textarea':
          html += `        <textarea placeholder="${element.props.placeholder || ''}" rows="${element.props.rows || 4}" style="${styleString}"></textarea>\n`
          break
        case 'card':
          html += `        <div class="card" style="${styleString}">\n`
          html += `            <h3>${element.props.title || ''}</h3>\n`
          html += `            <p>${element.props.content || ''}</p>\n`
          html += `        </div>\n`
          break
        case 'divider':
          html += `        <hr style="${styleString}" />\n`
          break
        case 'container':
          html += `        <div style="${styleString}">\n`
          html += `            <!-- Container content -->\n`
          html += `        </div>\n`
          break
      }
    })

    html += `    </div>
    <script src="script.js"></script>
</body>
</html>`

    return html
  }

  const generateCSS = () => {
    let css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f5f5;
    padding: 2rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Button Styles */
.btn-primary {
    background: #667eea;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: #5568d3;
}

.btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-secondary:hover {
    background: #5a6268;
}

.btn-success {
    background: #28a745;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-success:hover {
    background: #218838;
}

.btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-danger:hover {
    background: #c82333;
}

/* Card Styles */
.card {
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
}

.card p {
    margin: 0;
    color: #666;
}

/* Input Styles */
input, textarea {
    font-family: inherit;
    font-size: 1rem;
}

input:focus, textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Navbar Styles */
nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

nav ul li {
    cursor: pointer;
    transition: color 0.2s;
}

nav ul li:hover {
    color: #667eea;
}
`

    // Add element-specific styles
    elements.forEach((element, index) => {
      const styleString = Object.entries(element.style || {})
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ')

      if (styleString) {
        css += `\n/* Element ${index + 1} - ${element.type} */\n`
        css += `.element-${index + 1} {\n    ${styleString}\n}\n`
      }
    })

    return css
  }

  const generateJS = () => {
    let js = `// Generated JavaScript for UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // Button click handlers
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            // Add your button click logic here
        });
    });

    // Navbar link handlers
    const navLinks = document.querySelectorAll('nav ul li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Nav link clicked:', this.textContent);
            // Add your navigation logic here
        });
    });

    // Input handlers
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            console.log('Input changed:', this.value);
            // Add your input handling logic here
        });
    });

    // Image load handlers
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            console.log('Image loaded:', this.src);
        });
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
        });
    });
});

// Utility functions
function showAlert(message) {
    alert(message);
}

function logToConsole(message) {
    console.log(message);
}
`

    return js
  }

  const getCode = () => {
    switch (activeTab) {
      case 'html':
        return generateHTML()
      case 'css':
        return generateCSS()
      case 'js':
        return generateJS()
      default:
        return ''
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode())
    alert('Code copied to clipboard!')
  }

  return (
    <div className="code-generator-overlay" onClick={onClose}>
      <div className="code-generator" onClick={(e) => e.stopPropagation()}>
        <div className="code-header">
          <h2>Generated Code</h2>
          <div className="code-actions">
            <button className="btn-copy" onClick={copyToClipboard}>
              📋 Copy
            </button>
            <button className="btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className="code-tabs">
          <button
            className={`tab ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            HTML
          </button>
          <button
            className={`tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            CSS
          </button>
          <button
            className={`tab ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => setActiveTab('js')}
          >
            JavaScript
          </button>
        </div>
        <div className="code-content">
          <pre>
            <code>{getCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CodeGenerator





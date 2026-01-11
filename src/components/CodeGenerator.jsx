import React, { useState, useEffect, useCallback } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import './CodeGenerator.css'

const CodeGenerator = ({ elements, onClose }) => {
  const [activeTab, setActiveTab] = useState('html')
  const [generatedCode, setGeneratedCode] = useState({
    html: '',
    css: '',
    js: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useGemini, setUseGemini] = useState(true)

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
    <div class="canvas-container">
`

    // Sort elements by z-index to maintain layering
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))

    sortedElements.forEach((element, index) => {
      // Combine inline styles with position
      const inlineStyle = { ...element.style }
      inlineStyle.position = 'absolute'
      inlineStyle.left = `${element.position?.x || 0}px`
      inlineStyle.top = `${element.position?.y || 0}px`
      inlineStyle.zIndex = element.zIndex || index + 1
      
      const styleString = Object.entries(inlineStyle)
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          return `${cssKey}: ${value}`
        })
        .join('; ')

      switch (element.type) {
        case 'navbar':
          html += `        <nav id="element-${element.id}" style="${styleString}">\n`
          html += `            <ul style="list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;">\n`
          element.props.text?.split(' ').forEach((item) => {
            html += `                <li>${item}</li>\n`
          })
          html += `            </ul>\n`
          html += `        </nav>\n`
          break
        case 'button':
          html += `        <button id="element-${element.id}" class="btn-${element.props.variant || 'primary'}" style="${styleString}">${element.props.text || ''}</button>\n`
          break
        case 'heading':
          const headingTag = `h${element.props.level || 1}`
          html += `        <${headingTag} id="element-${element.id}" style="${styleString}">${element.props.text || ''}</${headingTag}>\n`
          break
        case 'paragraph':
          html += `        <p id="element-${element.id}" style="${styleString}">${element.props.text || ''}</p>\n`
          break
        case 'image':
          html += `        <img id="element-${element.id}" src="${element.props.src || ''}" alt="${element.props.alt || ''}" style="${styleString}" />\n`
          break
        case 'input':
          html += `        <input id="element-${element.id}" type="${element.props.type || 'text'}" placeholder="${element.props.placeholder || ''}" style="${styleString}" />\n`
          break
        case 'textarea':
          html += `        <textarea id="element-${element.id}" placeholder="${element.props.placeholder || ''}" rows="${element.props.rows || 4}" style="${styleString}"></textarea>\n`
          break
        case 'card':
          html += `        <div id="element-${element.id}" class="card" style="${styleString}">\n`
          html += `            <h3>${element.props.title || ''}</h3>\n`
          html += `            <p>${element.props.content || ''}</p>\n`
          html += `        </div>\n`
          break
        case 'divider':
          html += `        <hr id="element-${element.id}" style="${styleString}" />\n`
          break
        case 'container':
          html += `        <div id="element-${element.id}" style="${styleString}">\n`
          html += `            ${element.props.children || 'Container'}\n`
          html += `        </div>\n`
          break
        case 'link':
          html += `        <a id="element-${element.id}" href="${element.props.href || '#'}" target="${element.props.target || '_self'}" style="${styleString}">${element.props.text || 'Link'}</a>\n`
          break
        case 'list':
          const listTag = element.props.ordered ? 'ol' : 'ul'
          const listItems = element.props.items?.split('\n') || []
          html += `        <${listTag} id="element-${element.id}" style="${styleString}">\n`
          listItems.forEach(item => {
            html += `            <li>${item.trim() || 'Item'}</li>\n`
          })
          html += `        </${listTag}>\n`
          break
        case 'select':
          const selectOptions = element.props.options?.split('\n') || []
          html += `        <select id="element-${element.id}" style="${styleString}">\n`
          if (element.props.placeholder) {
            html += `            <option value="" disabled>${element.props.placeholder}</option>\n`
          }
          selectOptions.forEach(opt => {
            html += `            <option value="${opt.trim()}">${opt.trim() || 'Option'}</option>\n`
          })
          html += `        </select>\n`
          break
        case 'checkbox':
          html += `        <label id="element-${element.id}" style="${styleString}">\n`
          html += `            <input type="checkbox" ${element.props.checked ? 'checked' : ''} />\n`
          html += `            <span>${element.props.label || 'Checkbox'}</span>\n`
          html += `        </label>\n`
          break
        case 'radio':
          html += `        <label id="element-${element.id}" style="${styleString}">\n`
          html += `            <input type="radio" name="${element.props.name || 'radio-group'}" ${element.props.checked ? 'checked' : ''} />\n`
          html += `            <span>${element.props.label || 'Radio'}</span>\n`
          html += `        </label>\n`
          break
        case 'label':
          html += `        <label id="element-${element.id}" for="${element.props.for || ''}" style="${styleString}">${element.props.text || 'Label'}</label>\n`
          break
        case 'span':
          html += `        <span id="element-${element.id}" style="${styleString}">${element.props.text || 'Span text'}</span>\n`
          break
        case 'table':
          const tableRows = element.props.rows || 3
          const tableCols = element.props.cols || 3
          const hasTableHeader = element.props.header !== false
          html += `        <table id="element-${element.id}" style="${styleString}">\n`
          if (hasTableHeader) {
            html += `            <thead>\n                <tr>\n`
            for (let i = 0; i < tableCols; i++) {
              html += `                    <th style="border: 1px solid #ddd; padding: 0.5rem;">Header ${i + 1}</th>\n`
            }
            html += `                </tr>\n            </thead>\n`
          }
          html += `            <tbody>\n`
          for (let r = 0; r < tableRows; r++) {
            html += `                <tr>\n`
            for (let c = 0; c < tableCols; c++) {
              html += `                    <td style="border: 1px solid #ddd; padding: 0.5rem;">Cell ${r + 1}-${c + 1}</td>\n`
            }
            html += `                </tr>\n`
          }
          html += `            </tbody>\n        </table>\n`
          break
        case 'video':
          html += `        <video id="element-${element.id}" src="${element.props.src || ''}" ${element.props.controls !== false ? 'controls' : ''} style="${styleString}">Your browser does not support the video tag.</video>\n`
          break
        case 'iframe':
          html += `        <iframe id="element-${element.id}" src="${element.props.src || ''}" width="${element.props.width || '600'}" height="${element.props.height || '400'}" style="${styleString}" title="Embedded content"></iframe>\n`
          break
        case 'form':
          html += `        <form id="element-${element.id}" action="${element.props.action || '#'}" method="${element.props.method || 'post'}" style="${styleString}">\n`
          html += `            <p>Form container - Add inputs here</p>\n`
          html += `        </form>\n`
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
    background: #f8fafc;
    padding: 0;
    margin: 0;
    overflow: auto;
}

.canvas-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    background: #f8fafc;
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

    // Add element-specific styles with exact positioning
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
    
    sortedElements.forEach((element, index) => {
      const elementId = `element-${element.id}`
      const styles = { ...element.style }
      
      // Ensure position is absolute
      styles.position = 'absolute'
      styles.left = `${element.position?.x || 0}px`
      styles.top = `${element.position?.y || 0}px`
      styles.zIndex = element.zIndex || index + 1
      
      const styleString = Object.entries(styles)
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          return `    ${cssKey}: ${value};`
        })
        .join('\n')

      css += `\n/* Element ${index + 1} - ${element.type} (ID: ${element.id}) */\n`
      css += `#${elementId} {\n${styleString}\n}\n`
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

    // Link click handlers
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Link clicked:', this.href);
            // Add your navigation logic here
        });
    });

    // Select change handlers
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('Select changed:', this.value);
            // Add your select handling logic here
        });
    });

    // Checkbox change handlers
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('Checkbox changed:', this.checked);
            // Add your checkbox logic here
        });
    });

    // Radio change handlers
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Radio changed:', this.name, this.value);
            // Add your radio logic here
        });
    });

    // Form submit handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted:', this.action);
            // Add your form submission logic here
        });
    });

    // Video handlers
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', function() {
            console.log('Video playing');
        });
        video.addEventListener('pause', function() {
            console.log('Video paused');
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

  // Generate code using Gemini API
  const generateCodeWithGemini = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setError('Please set your Gemini API key in .env file (VITE_GEMINI_API_KEY). Get your key from: https://makersuite.google.com/app/apikey')
      setUseGemini(false)
      // Fallback to local generation
      setGeneratedCode({
        html: generateHTML(),
        css: generateCSS(),
        js: generateJS()
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validate API key format
      if (!apiKey || apiKey.trim().length === 0) {
        throw new Error('API key is empty')
      }

      const genAI = new GoogleGenerativeAI(apiKey.trim())
      
      // Use gemini-1.5-flash as primary model (most reliable and fast)
      // Will fallback to gemini-pro if this fails during API call
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Prepare complete canvas data for Gemini - sort by z-index
      const sortedElements = [...elements].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
      
      const canvasData = {
        elements: sortedElements.map((el, index) => ({
          id: el.id,
          type: el.type,
          position: { x: el.position?.x || 0, y: el.position?.y || 0 },
          zIndex: el.zIndex || index + 1,
          style: el.style || {},
          props: el.props || {},
          locked: el.locked || false
        }))
      }

      const prompt = `You are a professional web developer. Generate EXACT code that matches a drag-and-drop canvas UI.

CANVAS DATA (JSON):
${JSON.stringify(canvasData, null, 2)}

INSTRUCTIONS:
Generate HTML, CSS, and JavaScript code that EXACTLY reproduces this canvas layout.

CRITICAL REQUIREMENTS:
1. HTML: Create elements in the exact order (sorted by z-index). Use IDs like "element-{id}" for each element.
2. CSS: Use ABSOLUTE positioning for ALL elements:
   - position: absolute
   - left: {position.x}px
   - top: {position.y}px  
   - z-index: {zIndex}
   - Include ALL styles from element.style object
3. JavaScript: Add event handlers for interactive elements (buttons, inputs, nav links)
4. Match EXACTLY: positions, styles, props, z-index layering
5. Use semantic HTML5, modern CSS3, and clean JavaScript

Return code in this JSON format (NO markdown, NO code blocks, just raw JSON):
{
  "html": "<!DOCTYPE html>...complete HTML...",
  "css": "/* Complete CSS with absolute positioning */",
  "js": "// Complete JavaScript"
}

The generated code must look EXACTLY like the canvas when rendered.`

      // Generate content using the standard API
      let result, response, text
      
      try {
        result = await model.generateContent(prompt)
        response = result.response
        text = response.text()
      } catch (apiCallError) {
        // If gemini-1.5-flash fails, try gemini-pro as fallback
        if (apiCallError.message?.includes('model') || apiCallError.message?.includes('404')) {
          console.log('Primary model failed, trying gemini-pro...')
          try {
            const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' })
            result = await fallbackModel.generateContent(prompt)
            response = result.response
            text = response.text()
          } catch (fallbackError) {
            // If both fail, throw the original error
            throw apiCallError
          }
        } else {
          throw apiCallError
        }
      }
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API. Please try again.')
      }

      // Parse JSON from response
      let parsedResponse
      try {
        // Try to extract JSON if wrapped in markdown code blocks
        let cleanText = text.trim()
        
        // Remove markdown code blocks if present
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        
        // Find JSON object
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          parsedResponse = JSON.parse(cleanText)
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Response:', text)
        // Fallback: try to extract code sections
        const htmlMatch = text.match(/<html[\s\S]*<\/html>/i) || text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || text.match(/<body[\s\S]*<\/body>/i)
        const cssMatch = text.match(/\/\*[\s\S]*?\*\//) || text.match(/[a-zA-Z][^{]*\{[^}]*\}/)
        const jsMatch = text.match(/function[\s\S]*?\}/) || text.match(/document\.[\s\S]*?\);/)
        
        parsedResponse = {
          html: htmlMatch ? htmlMatch[0] : generateHTML(),
          css: cssMatch ? cssMatch[0] : generateCSS(),
          js: jsMatch ? jsMatch[0] : generateJS()
        }
        setError('Could not parse Gemini response as JSON. Using extracted code sections.')
      }

      setGeneratedCode({
        html: parsedResponse.html || generateHTML(),
        css: parsedResponse.css || generateCSS(),
        js: parsedResponse.js || generateJS()
      })
    } catch (err) {
      console.error('Gemini API Error:', err)
      console.error('Error details:', {
        message: err?.message,
        status: err?.status,
        statusText: err?.statusText,
        error: err?.error,
        response: err?.response
      })
      
      // Extract detailed error message from various error formats
      let errorMessage = 'Unknown error'
      
      // Try to extract from different error structures
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      } else if (err?.error?.error?.message) {
        errorMessage = err.error.error.message
      } else if (err?.statusText) {
        errorMessage = err.statusText
      } else if (err?.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err?.toString) {
        errorMessage = err.toString()
      }
      
      // Log full error for debugging
      try {
        console.log('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      } catch (e) {
        console.log('Could not stringify error:', err)
      }
      
      // Handle specific error types with user-friendly messages
      const errorStr = errorMessage.toLowerCase()
      
      if (errorStr.includes('api_key') || errorStr.includes('401') || errorStr.includes('invalid key') || errorStr.includes('unauthorized')) {
        setError('Invalid API key. Please verify your VITE_GEMINI_API_KEY in .env file and restart the server.')
      } else if (errorStr.includes('403') || errorStr.includes('permission') || errorStr.includes('forbidden') || errorStr.includes('access denied')) {
        setError('API access denied. Please enable Gemini API in Google Cloud Console or check API key permissions.')
      } else if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('rate limit') || errorStr.includes('resource exhausted')) {
        setError('API quota/rate limit exceeded. Please try again later or check your usage limits.')
      } else if (errorStr.includes('model') || errorStr.includes('not found') || errorStr.includes('404')) {
        setError('Gemini model not available. Trying local generation instead.')
      } else if (errorStr.includes('network') || errorStr.includes('fetch') || errorStr.includes('connection')) {
        setError('Network error. Please check your internet connection and try again.')
      } else {
        // Show the actual error message for debugging
        setError(`Gemini API Error: ${errorMessage}. Check browser console for details. Using local generation.`)
      }
      
      setUseGemini(false)
      // Fallback to local generation
      setGeneratedCode({
        html: generateHTML(),
        css: generateCSS(),
        js: generateJS()
      })
    } finally {
      setIsLoading(false)
    }
  }, [elements])

  // Initialize code generation on component mount or when elements change
  useEffect(() => {
    if (elements.length === 0) {
      setGeneratedCode({ html: '', css: '', js: '' })
      return
    }

    if (useGemini) {
      generateCodeWithGemini()
    } else {
      // Use local generation
      setGeneratedCode({
        html: generateHTML(),
        css: generateCSS(),
        js: generateJS()
      })
    }
  }, [elements.length, useGemini, generateCodeWithGemini])

  const getCode = () => {
    if (isLoading) {
      return 'Generating code with Gemini AI...\nPlease wait...'
    }

    if (error && !generatedCode.html) {
      return error
    }

    switch (activeTab) {
      case 'html':
        return generatedCode.html || generateHTML()
      case 'css':
        return generatedCode.css || generateCSS()
      case 'js':
        return generatedCode.js || generateJS()
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
          <div>
            <h2>Generated Code</h2>
            <div className="api-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useGemini}
                  onChange={(e) => setUseGemini(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Use Gemini AI</span>
              </label>
              {isLoading && <span className="loading-indicator">⏳ Generating...</span>}
              {error && <span className="error-indicator">⚠️ {error}</span>}
            </div>
          </div>
          <div className="code-actions">
            {!isLoading && (
              <button className="btn-regenerate" onClick={generateCodeWithGemini} disabled={!useGemini}>
                🔄 Regenerate
              </button>
            )}
            <button className="btn-copy" onClick={copyToClipboard} disabled={isLoading}>
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





import React from 'react'
import ReactDOM from 'react-dom/client'
import IMCCalculator from './components/IMCCalculator.jsx'
import './index.css' // Importa o CSS global (Tailwind)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IMCCalculator />
  </React.StrictMode>,
)

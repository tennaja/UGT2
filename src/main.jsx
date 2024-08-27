import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'



console.error = () => { }
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

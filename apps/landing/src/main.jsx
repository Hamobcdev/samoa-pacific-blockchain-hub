import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GovernmentGateway from './pages/GovernmentGateway'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
const isGovRoute = window.location.pathname === '/government'

root.render(
  <React.StrictMode>
    {isGovRoute ? <GovernmentGateway /> : <App />}
  </React.StrictMode>
)

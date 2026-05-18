import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
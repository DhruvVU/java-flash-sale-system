import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Home';
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import AddProduct from './AddProduct';
import Products from './Products';
import Orders from './Orders';
import Customers from './Customers';
import Register from './Register';
import CustomerDashboard from './CustomerDashboard';
import CustomerLogin from './CustomerLogin';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  // if no key, send back to login
  if(!isAuthenticated) {
    return <Navigate to="/customerLogin" replace />;
  }

  // if key exists, pass forward
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route path='/register' element={<Register />}/>

        {/* admin dashboard route */}
        <Route 
          path='/admin' 
          element={
            <ProtectedRoute>
              <Admin  />
            </ProtectedRoute>
          }
        />

        {/* Add product route */}
        <Route
          path='/admin/add'
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* Add products page route */}
        <Route
          path='/admin/products'
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* Orders page */}
        <Route
          path='/admin/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Customers list page */}
        <Route
          path='/admin/customers'
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* Customer Login page */}
        <Route 
          path='/customerLogin' 
          element={
              <CustomerLogin  />
          }
        />

        {/* Customer Dashboard page */}
        <Route 
          path='/customer-dashboard' 
          element={
            <ProtectedRoute>
              <CustomerDashboard  />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
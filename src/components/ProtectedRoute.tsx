import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // let token: string | null = null;

  // if (window.api && typeof window.api.getToken === 'function') {
  //   token = window.api.getToken();
  // } else {
  //   // Fallback to localStorage for development
  //   token = localStorage.getItem('token');
  // }

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;

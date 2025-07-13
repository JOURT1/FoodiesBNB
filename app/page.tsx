'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import DevPanel from '@/components/DevPanel';
import { authService } from '@/lib/auth';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'foodie' | 'restaurant'>('foodie');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserType(currentUser.userType);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (type: 'foodie' | 'restaurant', userData: any) => {
    setUserType(type);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            Foodies<span className="text-red-500">BNB</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard userType={userType} user={user} onLogout={handleLogout} />
      )}
      
      {/* Panel de desarrollo solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && <DevPanel />}
    </>
  );
}
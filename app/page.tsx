'use client';

import { useState, useEffect } from 'react';
import UserLoginForm from '@/components/UserLoginForm';
import RestaurantLoginForm from '@/components/RestaurantLoginForm';
import Dashboard from '@/components/Dashboard';
import RestaurantDashboard from '@/components/RestaurantDashboard';
import DevPanel from '@/components/DevPanel';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'foodie' | 'restaurant'>('foodie');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState<'user' | 'restaurant' | null>(null);
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserType(currentUser.userType);
      setIsLoggedIn(true);
    }
    
    // Verificar si el dev panel debe mostrarse (por URL o localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const devFromUrl = urlParams.get('dev') === 'true';
    const devFromStorage = localStorage.getItem('showDevPanel') === 'true';
    
    if (devFromUrl) {
      localStorage.setItem('showDevPanel', 'true');
      setShowDevPanel(true);
    } else if (devFromStorage) {
      setShowDevPanel(true);
    }
    
    // Escuchar combinación de teclas Ctrl+Shift+D para mostrar/ocultar dev panel
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const newValue = !showDevPanel;
        setShowDevPanel(newValue);
        localStorage.setItem('showDevPanel', newValue.toString());
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    setIsLoading(false);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showDevPanel]);

  const handleUserLogin = (userData: any) => {
    setUserType('foodie');
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleRestaurantLogin = (userData: any) => {
    setUserType('restaurant');
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setLoginType(null);
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
          {loginType === null ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-8">
                <div className="mb-8">
                  <h1 className="text-6xl font-bold mb-4">
                    Foodies<span className="text-red-500">BNB</span>
                  </h1>
                  <p className="text-xl text-gray-600">
                    Descubre experiencias gastronómicas únicas
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    ¿Cómo quieres acceder?
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setLoginType('user')}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
                      size="lg"
                    >
                      Soy un Foodie
                    </Button>
                    <Button
                      onClick={() => setLoginType('restaurant')}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                      size="lg"
                    >
                      Tengo un Restaurante
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : loginType === 'user' ? (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-6">
                  <Button
                    onClick={() => setLoginType(null)}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Volver a opciones
                  </Button>
                </div>
                <UserLoginForm onLogin={handleUserLogin} />
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-6">
                  <Button
                    onClick={() => setLoginType(null)}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Volver a opciones
                  </Button>
                </div>
                <RestaurantLoginForm onLogin={handleRestaurantLogin} />
              </div>
            </div>
          )}
        </div>
      ) : userType === 'restaurant' ? (
        <RestaurantDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Dashboard userType={userType} user={user} onLogout={handleLogout} />
      )}
      
      {/* Panel de desarrollo - accesible con Ctrl+Shift+D o ?dev=true en la URL */}
      {showDevPanel && <DevPanel />}
    </>
  );
}
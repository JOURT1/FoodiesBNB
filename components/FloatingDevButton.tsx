'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import DevPanel from './DevPanel';

export default function FloatingDevButton() {
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    // Verificar si el dev panel debe mostrarse desde localStorage
    const devFromStorage = localStorage.getItem('showDevPanel') === 'true';
    setShowDevPanel(devFromStorage);
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const devFromStorage = localStorage.getItem('showDevPanel') === 'true';
      setShowDevPanel(devFromStorage);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios manuales al localStorage con menor intervalo para mayor responsividad
    const interval = setInterval(() => {
      const devFromStorage = localStorage.getItem('showDevPanel') === 'true';
      if (devFromStorage !== showDevPanel) {
        setShowDevPanel(devFromStorage);
      }
    }, 50); // Reducir a 50ms para mayor responsividad
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [showDevPanel]);

  const toggleDevPanel = () => {
    const newValue = !showDevPanel;
    setShowDevPanel(newValue);
    localStorage.setItem('showDevPanel', newValue.toString());
  };

  const closeDevPanel = () => {
    setShowDevPanel(false);
    localStorage.setItem('showDevPanel', 'false');
  };

  return (
    <>
      {/* Botón flotante siempre visible cuando el panel está cerrado */}
      {!showDevPanel && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={toggleDevPanel}
            className="bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg"
            size="sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* DevPanel */}
      {showDevPanel && (
        <DevPanel 
          isOpen={showDevPanel} 
          onClose={closeDevPanel} 
        />
      )}
    </>
  );
}

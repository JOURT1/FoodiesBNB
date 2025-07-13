'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trash2, EyeOff, Store } from 'lucide-react';
import { authService } from '@/lib/auth';

interface DevPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DevPanel({ isOpen = false, onClose }: DevPanelProps) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const registeredUsers = authService.getRegisteredUsers();
    setUsers(registeredUsers);
  }, [isOpen]);

  const refreshUsers = () => {
    const registeredUsers = authService.getRegisteredUsers();
    setUsers(registeredUsers);
  };

  const userCount = users.filter(user => user.userType === 'foodie').length;
  const restaurantCount = users.filter(user => user.userType === 'restaurant').length;

  const clearAllUsers = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los usuarios registrados?')) {
      localStorage.removeItem('foodiesBnbUsers');
      localStorage.removeItem('foodiesBnbCurrentUser');
      localStorage.removeItem('foodiesBnbVisits');
      localStorage.removeItem('foodiesBnbFavorites');
      localStorage.removeItem('foodiesBnbRestaurants'); // También limpiar restaurantes
      setUsers([]);
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Panel de Desarrollo</CardTitle>
          <Button
            onClick={() => {
              onClose && onClose();
            }}
            size="sm"
            className="h-6 w-6 p-0"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Usuarios: {userCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Store className="h-3 w-3" />
              <span className="text-xs">Restaurantes: {restaurantCount}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={refreshUsers} size="sm" className="h-6 text-xs">
              Actualizar
            </Button>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {users.map((user, index) => (
              <div key={user.id} className="p-2 bg-gray-50 rounded text-xs">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-gray-600">{user.email}</div>
                <Badge className="text-xs">
                  {user.userType === 'foodie' ? 'Foodie' : 'Restaurante'}
                </Badge>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No hay usuarios registrados
              </p>
            )}
          </div>
          
          <Button
            onClick={clearAllUsers}
            size="sm"
            className="w-full bg-red-500 hover:bg-red-600 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpiar Todo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trash2, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function DevPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    const registeredUsers = authService.getRegisteredUsers();
    setUsers(registeredUsers);
  }, []);

  const refreshUsers = () => {
    const registeredUsers = authService.getRegisteredUsers();
    setUsers(registeredUsers);
  };

  const clearAllUsers = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los usuarios registrados?')) {
      localStorage.removeItem('foodiesBnbUsers');
      localStorage.removeItem('foodiesBnbCurrentUser');
      localStorage.removeItem('foodiesBnbVisits');
      localStorage.removeItem('foodiesBnbFavorites');
      setUsers([]);
      window.location.reload();
    }
  };

  if (!showDevPanel) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDevPanel(true)}
          className="bg-blue-500 hover:bg-blue-600 rounded-full"
          size="sm"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Panel de Desarrollo</CardTitle>
          <Button
            onClick={() => setShowDevPanel(false)}
            size="sm"
            className="h-6 w-6 p-0"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Usuarios registrados: {users.length}</span>
            </div>
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

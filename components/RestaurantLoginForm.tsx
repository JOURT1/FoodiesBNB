'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Store, Code } from 'lucide-react';
import { authService } from '@/lib/auth';
import DevPanel from './DevPanel';

interface RestaurantLoginFormProps {
  onLogin: (user: any) => void;
}

export default function RestaurantLoginForm({ onLogin }: RestaurantLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    // Verificar si el dev panel debe mostrarse desde localStorage
    const devFromStorage = localStorage.getItem('showDevPanel') === 'true';
    setShowDevPanel(devFromStorage);
  }, []);

  const toggleDevPanel = () => {
    const newValue = !showDevPanel;
    setShowDevPanel(newValue);
    localStorage.setItem('showDevPanel', newValue.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const result = await authService.register({
          fullName,
          email,
          password,
          userType: 'restaurant'
        });

        if (result.success) {
          setSuccess('¡Cuenta de restaurante creada exitosamente! Ahora puedes iniciar sesión.');
          setIsSignUp(false);
          setFullName('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(result.error || 'Error al crear la cuenta');
        }
      } else {
        const result = await authService.login({ email, password });
        
        if (result.success) {
          if (result.user.userType !== 'restaurant') {
            setError('Esta cuenta no es de restaurante. Use el login de usuarios.');
            return;
          }
          onLogin(result.user);
        } else {
          setError(result.error || 'Error al iniciar sesión');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Store className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? 'Registrar Restaurante' : 'Iniciar Sesión - Restaurante'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? 'Registra tu restaurante y conecta con foodies' 
              : 'Accede a tu panel de restaurante'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre del Restaurante</Label>
                <Input
                  id="fullName"
                  placeholder="Ingresa el nombre de tu restaurante"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="restaurante@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Registrar Restaurante' : 'Iniciar Sesión'}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              {isSignUp ? '¿Ya tienes una cuenta de restaurante?' : '¿No tienes una cuenta de restaurante?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-red-500 hover:underline font-medium"
                disabled={loading}
              >
                {isSignUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Botón Dev Panel */}
      <div className="mt-4 text-center">
        <Button
          onClick={toggleDevPanel}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Code className="h-4 w-4 mr-2" />
          {showDevPanel ? 'Ocultar' : 'Mostrar'} Panel de Desarrollo
        </Button>
      </div>

      {/* Panel de Desarrollo */}
      {showDevPanel && <DevPanel />}
    </div>
  );
}

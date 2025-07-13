'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth';

interface LoginFormProps {
  onLogin: (type: 'foodie' | 'restaurant', user: any) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [selectedType, setSelectedType] = useState<'foodie' | 'restaurant'>('foodie');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validación de confirmación de contraseña
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const result = await authService.register({
          fullName,
          email,
          password,
          userType: selectedType
        });

        if (result.success) {
          setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
          setFullName('');
        } else {
          throw new Error(result.error || 'Error al crear la cuenta');
        }
      } else {
        // Iniciar sesión
        const result = await authService.login({ email, password });

        if (result.success) {
          onLogin(result.user.userType, result.user);
        } else {
          throw new Error(result.error || 'Error al iniciar sesión');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl font-bold mb-2">
            Foodies<span className="text-red-500">BNB</span>
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Únete a la comunidad de FoodiesBNB' 
              : 'Ingresa con tu cuenta registrada'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                className={`${
                  selectedType === 'foodie' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedType('foodie')}
              >
                Soy Foodie
              </Button>
              <Button
                type="button"
                className={`${
                  selectedType === 'restaurant' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedType('restaurant')}
              >
                Soy Restaurante
              </Button>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
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
            
            {!isSignUp && (
              <div className="text-center">
                <a href="#" className="text-sm text-red-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
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

          {/* Información de demo */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <strong>Demo:</strong> Crea una cuenta nueva o usa las credenciales de prueba que registres
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
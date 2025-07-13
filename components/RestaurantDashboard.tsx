'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Image, 
  Star, 
  Users,
  Eye,
  Plus,
  Save,
  LogOut,
  Upload,
  X,
  Calendar,
  DollarSign,
  Code
} from 'lucide-react';

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  openingHours: string;
  cuisine: string;
  imageUrl: string;
  priceRange: string;
  gallery: string[];
  menu: MenuItem[];
  availableTables: number;
  acceptsReservations: boolean;
  specialties: string[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface RestaurantDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function RestaurantDashboard({ user, onLogout }: RestaurantDashboardProps) {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: user.fullName || '',
    description: '',
    address: '',
    phone: '',
    openingHours: '',
    cuisine: '',
    imageUrl: '',
    priceRange: '$$',
    gallery: [],
    menu: [],
    availableTables: 10,
    acceptsReservations: true,
    specialties: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasInfo, setHasInfo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'gallery' | 'menu'>('info');
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    image: ''
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    // Cargar información del restaurante
    const savedInfo = localStorage.getItem(`restaurant_${user.id}`);
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      // Asegurar que todas las propiedades requeridas existan
      const normalizedInfo = {
        ...parsed,
        gallery: parsed.gallery || [],
        menu: parsed.menu || [],
        specialties: parsed.specialties || []
      };
      setRestaurantInfo(normalizedInfo);
      setHasInfo(true);
    } else {
      setIsEditing(true); // Editar automáticamente si no hay info
    }
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem(`restaurant_${user.id}`, JSON.stringify(restaurantInfo));
      
      // También guardar en la lista global de restaurantes para que los usuarios los vean
      const allRestaurants = JSON.parse(localStorage.getItem('foodiesBnbRestaurants') || '[]');
      const existingIndex = allRestaurants.findIndex((r: any) => r.ownerId === user.id);
      
      const restaurantData = {
        ...restaurantInfo,
        ownerId: user.id,
        ownerEmail: user.email,
        id: existingIndex >= 0 ? allRestaurants[existingIndex].id : Date.now().toString(),
        createdAt: existingIndex >= 0 ? allRestaurants[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        allRestaurants[existingIndex] = restaurantData;
      } else {
        allRestaurants.push(restaurantData);
      }
      
      localStorage.setItem('foodiesBnbRestaurants', JSON.stringify(allRestaurants));
      
      // Emitir evento para que otros componentes se actualicen
      window.dispatchEvent(new CustomEvent('restaurantsUpdated'));
      
      setHasInfo(true);
      setIsEditing(false);
      setMessage('Información guardada exitosamente');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al guardar la información');
    } finally {
      setSaving(false);
    }
  };

  const addToGallery = () => {
    if (newImageUrl.trim()) {
      setRestaurantInfo({
        ...restaurantInfo,
        gallery: [...(restaurantInfo.gallery || []), newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeFromGallery = (index: number) => {
    setRestaurantInfo({
      ...restaurantInfo,
      gallery: (restaurantInfo.gallery || []).filter((_, i) => i !== index)
    });
  };

  const addMenuItem = () => {
    if (newMenuItem.name.trim() && newMenuItem.price > 0) {
      const menuItem = {
        ...newMenuItem,
        id: Date.now().toString()
      };
      setRestaurantInfo({
        ...restaurantInfo,
        menu: [...(restaurantInfo.menu || []), menuItem]
      });
      setNewMenuItem({
        id: '',
        name: '',
        description: '',
        price: 0,
        category: '',
        image: ''
      });
    }
  };

  const removeMenuItem = (id: string) => {
    setRestaurantInfo({
      ...restaurantInfo,
      menu: (restaurantInfo.menu || []).filter(item => item.id !== id)
    });
  };

  const mockStats = {
    views: Math.floor(Math.random() * 500) + 50,
    favorites: Math.floor(Math.random() * 100) + 10,
    visits: Math.floor(Math.random() * 200) + 20
  };

  const toggleDevPanel = () => {
    // Solo abrir el panel, el cierre se maneja desde el panel mismo
    localStorage.setItem('showDevPanel', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel del Restaurante</h1>
                <p className="text-gray-600">Bienvenido, {user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={toggleDevPanel}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                size="sm"
              >
                <Code className="h-4 w-4" />
                Dev
              </Button>
              <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.views}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.favorites}</div>
              <p className="text-xs text-muted-foreground">Total acumulado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.visits}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Gestión del Restaurante */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión del Restaurante</CardTitle>
                <CardDescription>
                  {hasInfo 
                    ? 'Gestiona la información, galería y menú de tu restaurante' 
                    : 'Completa la información de tu restaurante para aparecer en FoodiesBNB'}
                </CardDescription>
              </div>
              {hasInfo && !isEditing && (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {/* Pestañas */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Información Básica
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'gallery' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Galería ({restaurantInfo.gallery?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'menu' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Menú ({restaurantInfo.menu?.length || 0})
              </button>
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Restaurante</Label>
                        <Input
                          id="name"
                          value={restaurantInfo.name}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                          placeholder="Nombre de tu restaurante"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cuisine">Tipo de Cocina</Label>
                        <Input
                          id="cuisine"
                          value={restaurantInfo.cuisine}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, cuisine: e.target.value})}
                          placeholder="Ej: Italiana, Mexicana, Asiática"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={restaurantInfo.description}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, description: e.target.value})}
                        placeholder="Describe tu restaurante, especialidades, ambiente..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          value={restaurantInfo.address}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                          placeholder="Dirección completa"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={restaurantInfo.phone}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                          placeholder="Número de contacto"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Horario</Label>
                        <Input
                          id="hours"
                          value={restaurantInfo.openingHours}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, openingHours: e.target.value})}
                          placeholder="Ej: Lun-Dom 10:00-22:00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="priceRange">Rango de Precios</Label>
                        <select
                          id="priceRange"
                          value={restaurantInfo.priceRange}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, priceRange: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="$">$ - Económico</option>
                          <option value="$$">$$ - Moderado</option>
                          <option value="$$$">$$$ - Costoso</option>
                          <option value="$$$$">$$$$ - Muy Costoso</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tables">Mesas Disponibles</Label>
                        <Input
                          id="tables"
                          type="number"
                          value={restaurantInfo.availableTables}
                          onChange={(e) => setRestaurantInfo({...restaurantInfo, availableTables: parseInt(e.target.value) || 0})}
                          placeholder="Número de mesas"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Imagen Principal</Label>
                      <Input
                        id="imageUrl"
                        value={restaurantInfo.imageUrl}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, imageUrl: e.target.value})}
                        placeholder="URL de la imagen principal de tu restaurante"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="reservations"
                        checked={restaurantInfo.acceptsReservations}
                        onChange={(e) => setRestaurantInfo({...restaurantInfo, acceptsReservations: e.target.checked})}
                      />
                      <Label htmlFor="reservations">Acepta reservas</Label>
                    </div>
                  </>
                ) : hasInfo ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      {restaurantInfo.imageUrl && (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={restaurantInfo.imageUrl}
                            alt={restaurantInfo.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{restaurantInfo.name}</h3>
                        <p className="text-gray-600 mb-4">{restaurantInfo.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge>{restaurantInfo.cuisine}</Badge>
                          <Badge variant="outline">{restaurantInfo.priceRange}</Badge>
                          {restaurantInfo.acceptsReservations && (
                            <Badge className="bg-green-100 text-green-800">
                              <Calendar className="h-3 w-3 mr-1" />
                              Acepta Reservas
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{restaurantInfo.address || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{restaurantInfo.phone || 'No especificado'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{restaurantInfo.openingHours || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{restaurantInfo.availableTables} mesas disponibles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Completa la información de tu restaurante
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Agrega información sobre tu restaurante para que los foodies puedan encontrarte
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pestaña de Galería */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Agregar Imágenes a la Galería</h3>
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="URL de la imagen"
                        className="flex-1"
                      />
                      <Button onClick={addToGallery} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(restaurantInfo.gallery || []).map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Galería ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      {isEditing && (
                        <Button
                          onClick={() => removeFromGallery(index)}
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {(restaurantInfo.gallery?.length || 0) === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay imágenes en la galería
                      </h3>
                      <p className="text-gray-500">
                        {isEditing ? 'Agrega imágenes para mostrar tu restaurante' : 'Edita para agregar imágenes'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pestaña de Menú */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium">Agregar Platillo al Menú</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre del Platillo</Label>
                        <Input
                          value={newMenuItem.name}
                          onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                          placeholder="Nombre del platillo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Input
                          value={newMenuItem.category}
                          onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                          placeholder="Ej: Entrada, Plato Principal, Postre"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                        placeholder="Descripción del platillo"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Precio</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newMenuItem.price}
                          onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value) || 0})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Imagen (opcional)</Label>
                        <Input
                          value={newMenuItem.image}
                          onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                          placeholder="URL de la imagen del platillo"
                        />
                      </div>
                    </div>
                    <Button onClick={addMenuItem} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Platillo
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {(restaurantInfo.menu?.length || 0) > 0 ? (
                    <div className="grid gap-4">
                      {(restaurantInfo.menu || []).map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4 flex-1">
                              {item.image && (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  {item.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-green-600">${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            {isEditing && (
                              <Button
                                onClick={() => removeMenuItem(item.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay platillos en el menú
                      </h3>
                      <p className="text-gray-500">
                        {isEditing ? 'Agrega platillos a tu menú' : 'Edita para agregar platillos'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {isEditing && (
              <div className="flex gap-3 pt-6 border-t">
                <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Todo
                    </>
                  )}
                </Button>
                {hasInfo && (
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, MapPin, Heart, LogOut, Calendar, Clock, Users, 
  CheckCircle, X, Edit, Eye, EyeOff, BarChart3, TrendingUp, DollarSign, 
  Settings, Target, Activity, Percent, CreditCard
} from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import RestaurantDetails from './RestaurantDetails';
import VisitModal from './VisitModal';
import { mockRestaurants, localStorageUtils, quitoZones, premiumCuisines } from '@/lib/mockData';
import { authService } from '@/lib/auth';

interface DashboardProps {
  userType: 'foodie' | 'restaurant';
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ userType, user, onLogout }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get('tab');
    return tabFromUrl || (userType === 'restaurant' ? 'dashboard' : 'explorar');
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [showRestaurantDetails, setShowRestaurantDetails] = useState(false);
  const [selectedRestaurantForDetails, setSelectedRestaurantForDetails] = useState<any>(null);
  
  // Estados para manejo del perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    bio: user.bio || '',
    preferences: user.preferences || []
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setVisits(localStorageUtils.getVisits());
    setFavorites(localStorageUtils.getFavorites());
    
    const userRestaurants = JSON.parse(localStorage.getItem('foodiesBnbRestaurants') || '[]');
    
    const normalizeRestaurant = (restaurant: any) => ({
      ...restaurant,
      location: restaurant.location || restaurant.zone || '',
      zone: restaurant.zone || restaurant.location || '',
      address: restaurant.address || restaurant.location || '',
      coordinates: restaurant.coordinates || null,
      menu: restaurant.menu || [],
      gallery: restaurant.gallery || [restaurant.image],
      phone: restaurant.phone || '',
      isPremium: restaurant.isPremium || false,
      benefits: restaurant.benefits || [],
      availableSlots: restaurant.availableSlots || ['12:00', '13:00', '19:00', '20:00'],
      tables: restaurant.tables || 10,
      acceptsReservations: restaurant.acceptsReservations !== false
    });
    
    const normalizedMockRestaurants = mockRestaurants.map(normalizeRestaurant);
    const normalizedUserRestaurants = userRestaurants.map(normalizeRestaurant);
    
    setAllRestaurants([...normalizedMockRestaurants, ...normalizedUserRestaurants]);
    
    const handleFavoritesChange = () => setFavorites(localStorageUtils.getFavorites());
    const handleVisitScheduled = () => setVisits(localStorageUtils.getVisits());
    const handleRestaurantsUpdate = () => {
      const userRestaurants = JSON.parse(localStorage.getItem('foodiesBnbRestaurants') || '[]');
      const normalizedMockRestaurants = mockRestaurants.map(normalizeRestaurant);
      const normalizedUserRestaurants = userRestaurants.map(normalizeRestaurant);
      setAllRestaurants([...normalizedMockRestaurants, ...normalizedUserRestaurants]);
    };
    
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('visitScheduled', handleVisitScheduled);
    window.addEventListener('restaurantsUpdated', handleRestaurantsUpdate);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('visitScheduled', handleVisitScheduled);
      window.removeEventListener('restaurantsUpdated', handleRestaurantsUpdate);
    };
  }, []);

  const filteredRestaurants = allRestaurants.filter(restaurant => {
    if (!restaurant.name || !restaurant.cuisine) return false;
    
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === 'all' || 
                          restaurant.zone === selectedLocation || 
                          (restaurant.location && restaurant.location.includes(selectedLocation));
    const matchesCuisine = !selectedCuisine || selectedCuisine === 'all' || 
                         restaurant.cuisine === selectedCuisine || 
                         restaurant.cuisine.includes(selectedCuisine);
    
    return matchesSearch && matchesLocation && matchesCuisine;
  });

  const favoriteRestaurants = allRestaurants.filter(restaurant => 
    favorites.includes(restaurant.id)
  );

  const handleScheduleVisit = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setShowVisitModal(true);
  };

  const handleVisitScheduled = () => {
    setShowVisitModal(false);
    setSelectedRestaurant(null);
    setVisits(localStorageUtils.getVisits());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Por confirmar reserva del restaurante';
      case 'cancelled': return 'Cancelada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const handleDetailsClick = (restaurant: any) => {
    setSelectedRestaurantForDetails(restaurant);
    setShowRestaurantDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedRestaurantForDetails(null);
    setShowRestaurantDetails(false);
  };

  const handleToggleFavorite = (restaurantId: string) => {
    const currentFavorites = localStorageUtils.getFavorites();
    if (currentFavorites.includes(restaurantId)) {
      localStorageUtils.removeFavorite(restaurantId);
    } else {
      localStorageUtils.addFavorite(restaurantId);
    }
    setFavorites(localStorageUtils.getFavorites());
  };

  const handleCancelVisit = (visitId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      localStorageUtils.updateVisitStatus(visitId, 'cancelled');
      setVisits(localStorageUtils.getVisits());
    }
  };

  const handleAcceptVisit = (visitId: string) => {
    localStorageUtils.updateVisitStatus(visitId, 'confirmed');
    setVisits(localStorageUtils.getVisits());
  };

  const handleRejectVisit = (visitId: string) => {
    if (confirm('¿Estás seguro de que quieres rechazar esta reserva?')) {
      localStorageUtils.updateVisitStatus(visitId, 'rejected');
      setVisits(localStorageUtils.getVisits());
    }
  };

  const restaurantVisits = userType === 'restaurant' ? 
    visits.filter(visit => {
      const userRestaurants = JSON.parse(localStorage.getItem('foodiesBnbRestaurants') || '[]');
      const userOwnedRestaurants = userRestaurants.filter((restaurant: any) => restaurant.ownerId === user.id);
      
      return userOwnedRestaurants.some((restaurant: any) => restaurant.id === visit.restaurantId) ||
             (user.email === 'restaurant@foodiesbnb.com' && mockRestaurants.some(r => r.id === visit.restaurantId));
    }) : [];

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    
    try {
      const result = await authService.updateProfile(user.id, profileData);
      
      if (result.success) {
        setProfileMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditingProfile(false);
        
        if (result.user) {
          user.fullName = result.user.fullName;
          user.phone = result.user.phone;
          user.bio = result.user.bio;
          user.preferences = result.user.preferences;
        }
      } else {
        setProfileMessage({ type: 'error', text: result.error || 'Error al actualizar perfil' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Error al actualizar perfil' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setProfileMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setProfileLoading(false);
      return;
    }
    
    try {
      const result = await authService.changePassword(
        user.id, 
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      if (result.success) {
        setProfileMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setProfileMessage({ type: 'error', text: result.error || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Error al cambiar contraseña' });
    } finally {
      setProfileLoading(false);
    }
  };

  const getRestaurantStats = () => {
    const totalVisits = restaurantVisits.length;
    const confirmedVisits = restaurantVisits.filter(visit => visit.status === 'confirmed').length;
    const pendingVisits = restaurantVisits.filter(visit => visit.status === 'pending').length;
    const rejectedVisits = restaurantVisits.filter(visit => visit.status === 'rejected').length;
    
    const totalGuests = restaurantVisits.reduce((total, visit) => {
      return visit.status === 'confirmed' ? total + visit.partySize : total;
    }, 0);
    
    const avgTicketPerPerson = 25;
    const monthlyRevenue = totalGuests * avgTicketPerPerson;
    const dailyRevenue = monthlyRevenue / 30;
    
    const confirmationRate = totalVisits > 0 ? Math.round((confirmedVisits / totalVisits) * 100) : 0;
    const occupancyRate = Math.min((totalGuests / (30 * 40)) * 100, 100);
    
    return {
      totalVisits,
      confirmedVisits,
      pendingVisits,
      rejectedVisits,
      totalGuests,
      monthlyRevenue: Math.round(monthlyRevenue),
      dailyRevenue: Math.round(dailyRevenue),
      confirmationRate,
      occupancyRate: Math.round(occupancyRate)
    };
  };

  const stats = userType === 'restaurant' ? getRestaurantStats() : null;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('tab', tabId);
    router.push(`/?${currentParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  const tabs = userType === 'restaurant' ? [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'estadisticas', label: 'Estadísticas' },
    { id: 'configuracion', label: 'Configuración' },
    { id: 'explorar', label: 'Ver Restaurantes' }
  ] : [
    { id: 'explorar', label: 'Explorar Restaurantes' },
    { id: 'visitas', label: 'Mis Visitas' },
    { id: 'favoritos', label: 'Favoritos' },
    { id: 'perfil', label: 'Mi Perfil' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold">
              Foodies<span className="text-red-500">BNB</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">¡Hola, {user.fullName || user.email}!</span>
              <Button
                onClick={onLogout}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FoodiesBNB Quito Premium</h1>
          <p className="text-gray-600">Descubre los mejores restaurantes premium de Quito, Ecuador</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                className={`px-4 py-2 text-sm ${
                  activeTab === tab.id 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab for Restaurant */}
        {activeTab === 'dashboard' && userType === 'restaurant' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Dashboard del Restaurante</h3>
                <p className="text-gray-600">Análisis de ventas y rendimiento</p>
              </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-700">Ingresos Mensuales</p>
                      <p className="text-2xl font-bold text-green-900">${stats?.monthlyRevenue || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-700">Total Reservas</p>
                      <p className="text-2xl font-bold text-blue-900">{stats?.totalVisits || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-700">Tasa Confirmación</p>
                      <p className="text-2xl font-bold text-purple-900">{stats?.confirmationRate || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-700">Comensales</p>
                      <p className="text-2xl font-bold text-orange-900">{stats?.totalGuests || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleTabChange('reservas')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Gestionar Reservas ({stats?.pendingVisits || 0})
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleTabChange('estadisticas')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Estadísticas
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleTabChange('configuracion')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reservas Tab for Restaurant */}
        {activeTab === 'reservas' && userType === 'restaurant' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Reservas Recibidas</h3>
              <Badge className="bg-blue-100 text-blue-800">
                {restaurantVisits.length} reserva{restaurantVisits.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {restaurantVisits.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes reservas</h3>
                <p className="text-gray-500">Las reservas aparecerán aquí.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {restaurantVisits.map((visit) => (
                  <Card key={visit.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Users className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{visit.customerName}</h4>
                              <Badge className={getStatusColor(visit.status)}>
                                {getStatusText(visit.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {visit.visitDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {visit.visitTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {visit.partySize} personas
                              </span>
                            </div>
                          </div>
                        </div>
                        {visit.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleAcceptVisit(visit.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleRejectVisit(visit.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estadísticas Tab for Restaurant */}
        {activeTab === 'estadisticas' && userType === 'restaurant' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Estadísticas Detalladas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ingresos Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${stats?.monthlyRevenue || 0}</div>
                  <p className="text-xs text-gray-500">Este mes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tasa de Ocupación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.occupancyRate || 0}%</div>
                  <p className="text-xs text-gray-500">Promedio</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Configuración Tab for Restaurant */}
        {activeTab === 'configuracion' && userType === 'restaurant' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Configuración</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileMessage.text && (
                  <div className={`p-3 rounded-md ${
                    profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {profileMessage.text}
                  </div>
                )}
                
                {!isEditingProfile ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <p className="text-sm text-gray-900">{user.fullName || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    <Button onClick={() => setIsEditingProfile(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                      >
                        {profileLoading ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Explorar Tab */}
        {activeTab === 'explorar' && (
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar restaurantes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ubicaciones</SelectItem>
                      {quitoZones.filter(zone => zone.value !== 'all').map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de cocina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {premiumCuisines.filter(cuisine => cuisine.value !== 'all').map((cuisine) => (
                        <SelectItem key={cuisine.value} value={cuisine.value}>{cuisine.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Restaurantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isFavorite={favorites.includes(restaurant.id)}
                  onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
                  onDetailsClick={() => handleDetailsClick(restaurant)}
                  onScheduleVisit={() => handleScheduleVisit(restaurant)}
                />
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron restaurantes.</p>
              </div>
            )}
          </div>
        )}

        {/* Visitas Tab for Foodies */}
        {activeTab === 'visitas' && userType === 'foodie' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Mis Visitas</h3>
            
            {visits.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes visitas</h3>
                <p className="text-gray-500">Explora restaurantes y programa tu primera visita.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {visits.map((visit) => {
                  const restaurant = allRestaurants.find(r => r.id === visit.restaurantId);
                  if (!restaurant) return null;
                  
                  return (
                    <Card key={visit.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{restaurant.name}</h4>
                                <Badge className={getStatusColor(visit.status)}>
                                  {getStatusText(visit.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{restaurant.zone}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {visit.visitDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {visit.visitTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {visit.partySize} personas
                                </span>
                              </div>
                            </div>
                          </div>
                          {visit.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleCancelVisit(visit.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Favoritos Tab for Foodies */}
        {activeTab === 'favoritos' && userType === 'foodie' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Mis Favoritos</h3>
            
            {favoriteRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes favoritos</h3>
                <p className="text-gray-500">Marca restaurantes como favoritos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={true}
                    onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
                    onDetailsClick={() => handleDetailsClick(restaurant)}
                    onScheduleVisit={() => handleScheduleVisit(restaurant)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Perfil Tab for Foodies */}
        {activeTab === 'perfil' && userType === 'foodie' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Mi Perfil</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{visits.length}</div>
                    <div className="text-sm text-gray-600">Total visitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {visits.filter(v => v.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-gray-600">Confirmadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {visits.filter(v => v.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{favoriteRestaurants.length}</div>
                    <div className="text-sm text-gray-600">Favoritos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modals */}
      {showVisitModal && selectedRestaurant && (
        <VisitModal
          restaurant={selectedRestaurant}
          onClose={() => setShowVisitModal(false)}
          onSchedule={handleVisitScheduled}
        />
      )}

      {showRestaurantDetails && selectedRestaurantForDetails && (
        <RestaurantDetails
          restaurant={selectedRestaurantForDetails}
          onClose={handleCloseDetails}
          onReserve={() => {
            handleCloseDetails();
            handleScheduleVisit(selectedRestaurantForDetails);
          }}
          isFavorite={favorites.includes(selectedRestaurantForDetails.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedRestaurantForDetails.id)}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, Heart, LogOut, Calendar, Clock, Users, Star, CheckCircle } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import VisitModal from './VisitModal';
import { mockRestaurants, localStorageUtils } from '@/lib/mockData';

interface DashboardProps {
  userType: 'foodie' | 'restaurant';
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ userType, user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('explorar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setVisits(localStorageUtils.getVisits());
    setFavorites(localStorageUtils.getFavorites());
    
    // Listener para cambios en favoritos
    const handleFavoritesChange = () => {
      setFavorites(localStorageUtils.getFavorites());
    };
    
    // Listener para nuevas visitas
    const handleVisitScheduled = () => {
      setVisits(localStorageUtils.getVisits());
    };
    
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('visitScheduled', handleVisitScheduled);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('visitScheduled', handleVisitScheduled);
    };
  }, []);

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === 'all' || restaurant.location.includes(selectedLocation);
    const matchesCuisine = !selectedCuisine || selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    
    return matchesSearch && matchesLocation && matchesCuisine;
  });

  const favoriteRestaurants = mockRestaurants.filter(restaurant => 
    favorites.includes(restaurant.id)
  );

  const handleScheduleVisit = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setShowVisitModal(true);
  };

  const handleVisitScheduled = () => {
    setShowVisitModal(false);
    setSelectedRestaurant(null);
    setVisits(localStorageUtils.getVisits()); // Refresh visits
  };

  const handleLogout = () => {
    onLogout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const tabs = [
    { id: 'explorar', label: 'Explorar Restaurantes', active: true },
    { id: 'visitas', label: 'Mis Visitas', active: false },
    { id: 'favoritos', label: 'Favoritos', active: false },
    { id: 'perfil', label: 'Mi Perfil', active: false }
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
                onClick={handleLogout}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel del Foodie</h1>
          <p className="text-gray-600">Explora y conecta con restaurantes locales.</p>
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
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'explorar' && (
          <>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar restaurantes por nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-40">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Madrid">Madrid</SelectItem>
                      <SelectItem value="Barcelona">Barcelona</SelectItem>
                      <SelectItem value="Valencia">Valencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCuisine} onValueChange={(value) => setSelectedCuisine(value === 'all' ? '' : value)}>
                    <SelectTrigger className="w-44">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo de cocina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Mexicana">Mexicana</SelectItem>
                      <SelectItem value="Japonesa">Japonesa</SelectItem>
                      <SelectItem value="Italiana">Italiana</SelectItem>
                      <SelectItem value="Mediterránea">Mediterránea</SelectItem>
                      <SelectItem value="Fusión">Fusión</SelectItem>
                      <SelectItem value="Española">Española</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onScheduleVisit={handleScheduleVisit}
                />
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron restaurantes con los filtros seleccionados.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'visitas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Mis Visitas</h3>
              <Badge className="bg-blue-100 text-blue-800">
                {visits.length} visita{visits.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {visits.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes visitas programadas</h3>
                <p className="text-gray-500 mb-4">Explora restaurantes y programa tu primera visita.</p>
                <Button 
                  onClick={() => setActiveTab('explorar')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Explorar Restaurantes
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {visits.map((visit) => (
                  <Card key={visit.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={visit.restaurantImage}
                          alt={visit.restaurantName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{visit.restaurantName}</h4>
                            <Badge className={getStatusColor(visit.status)}>
                              {getStatusText(visit.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{visit.restaurantLocation}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(visit.visitDate).toLocaleDateString('es-ES')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {visit.visitTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {visit.partySize} persona{visit.partySize !== 1 ? 's' : ''}
                            </div>
                          </div>
                          {visit.specialRequests && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Notas:</strong> {visit.specialRequests}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favoritos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Restaurantes Favoritos</h3>
              <Badge className="bg-red-100 text-red-800">
                {favoriteRestaurants.length} favorito{favoriteRestaurants.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {favoriteRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes favoritos aún</h3>
                <p className="text-gray-500 mb-4">Marca restaurantes como favoritos para encontrarlos fácilmente.</p>
                <Button 
                  onClick={() => setActiveTab('explorar')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Explorar Restaurantes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onScheduleVisit={handleScheduleVisit}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Mi Perfil</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-gray-900">{user.fullName || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de cuenta</label>
                  <Badge className="ml-2">
                    {user.userType === 'foodie' ? 'Foodie' : 'Restaurante'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Miembro desde</label>
                  <p className="text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'Hoy'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{visits.length}</div>
                    <div className="text-sm text-gray-600">Visitas programadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{favoriteRestaurants.length}</div>
                    <div className="text-sm text-gray-600">Restaurantes favoritos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {visits.filter(v => v.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-gray-600">Visitas confirmadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Visit Modal */}
      {showVisitModal && selectedRestaurant && (
        <VisitModal
          restaurant={selectedRestaurant}
          onClose={() => setShowVisitModal(false)}
          onSchedule={handleVisitScheduled}
        />
      )}
    </div>
  );
}
export const mockRestaurants = [
  {
    id: '1',
    name: 'La Taquería Mexicana',
    cuisine: 'Mexicana',
    location: 'Calle Principal 123, Madrid',
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Auténtica comida mexicana con ingredientes frescos y sabores tradicionales.',
    priceRange: '$15-25',
    openHours: '12:00 - 00:00',
    benefits: ['Ofertas exclusivas para Foodies', 'Contenido para redes sociales', 'Descuentos especiales'],
    availableSlots: ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00']
  },
  {
    id: '2',
    name: 'Sushi Sakura',
    cuisine: 'Japonesa',
    location: 'Av. Central 45, Barcelona',
    rating: 4.8,
    reviewCount: 93,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sushi fresco preparado por chefs japoneses con técnicas tradicionales.',
    priceRange: '$30-50',
    openHours: '18:00 - 23:00',
    benefits: ['Experiencia exclusiva de chef', 'Fotos profesionales', 'Platos de degustación gratuitos'],
    availableSlots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
  },
  {
    id: '3',
    name: 'Pasta Bella',
    cuisine: 'Italiana',
    location: 'Plaza Mayor 8, Valencia',
    rating: 4.3,
    reviewCount: 75,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Pasta artesanal italiana con salsas caseras y ingredientes importados.',
    priceRange: '$18-28',
    openHours: '12:00 - 15:00, 19:00 - 23:00',
    benefits: ['Clase de cocina gratuita', 'Descuento del 20%', 'Postre de cortesía'],
    availableSlots: ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00']
  },
  {
    id: '4',
    name: 'El Jardín Mediterráneo',
    cuisine: 'Mediterránea',
    location: 'Calle del Mar 67, Valencia',
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cocina mediterránea con productos locales y vista al mar.',
    priceRange: '$25-40',
    openHours: '13:00 - 16:00, 20:00 - 24:00',
    benefits: ['Mesa con vista al mar', 'Cata de vinos gratuita', 'Menú degustación especial'],
    availableSlots: ['13:00', '14:00', '15:00', '20:00', '21:00', '22:00', '23:00']
  },
  {
    id: '5',
    name: 'Fusión Creativa',
    cuisine: 'Fusión',
    location: 'Barrio Gótico 234, Barcelona',
    rating: 4.4,
    reviewCount: 89,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cocina de fusión innovadora que combina sabores de todo el mundo.',
    priceRange: '$35-55',
    openHours: '19:00 - 01:00',
    benefits: ['Cocktails de autor gratuitos', 'Acceso al chef', 'Experiencia gastronómica única'],
    availableSlots: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
  },
  {
    id: '6',
    name: 'Tapas del Abuelo',
    cuisine: 'Española',
    location: 'Calle Cervantes 45, Madrid',
    rating: 4.2,
    reviewCount: 203,
    image: 'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Tapas tradicionales españolas en un ambiente acogedor y familiar.',
    priceRange: '$10-20',
    openHours: '11:00 - 02:00',
    benefits: ['Tapas ilimitadas por 2 horas', 'Sangría de cortesía', 'Ambiente tradicional auténtico'],
    availableSlots: ['11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  }
];

// Local storage utilities for the MVP
export const localStorageUtils = {
  // Visits management
  addVisit: (visit: {
    id: string;
    restaurantId: string;
    visitDate: string;
    visitTime: string;
    partySize: number;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    restaurantName?: string;
    restaurantImage?: string;
    restaurantLocation?: string;
  }) => {
    const visits = localStorageUtils.getVisits();
    visits.push({ ...visit, createdAt: new Date().toISOString() });
    localStorage.setItem('foodiesBnbVisits', JSON.stringify(visits));
  },
  
  getVisits: () => {
    const visits = localStorage.getItem('foodiesBnbVisits');
    return visits ? JSON.parse(visits) : [];
  },
  
  updateVisitStatus: (visitId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const visits = localStorageUtils.getVisits();
    const updatedVisits = visits.map((visit: any) => 
      visit.id === visitId ? { ...visit, status } : visit
    );
    localStorage.setItem('foodiesBnbVisits', JSON.stringify(updatedVisits));
  },

  // Favorites management
  addFavorite: (restaurantId: string) => {
    const favorites = localStorageUtils.getFavorites();
    if (!favorites.includes(restaurantId)) {
      favorites.push(restaurantId);
      localStorage.setItem('foodiesBnbFavorites', JSON.stringify(favorites));
    }
  },
  
  removeFavorite: (restaurantId: string) => {
    const favorites = localStorageUtils.getFavorites();
    const updatedFavorites = favorites.filter((id: string) => id !== restaurantId);
    localStorage.setItem('foodiesBnbFavorites', JSON.stringify(updatedFavorites));
  },
  
  getFavorites: () => {
    const favorites = localStorage.getItem('foodiesBnbFavorites');
    return favorites ? JSON.parse(favorites) : [];
  },
  
  isFavorite: (restaurantId: string) => {
    const favorites = localStorageUtils.getFavorites();
    return favorites.includes(restaurantId);
  }
};
export const mockRestaurants = [
  {
    id: '1',
    name: 'QUITO GO Restaurant & Lounge',
    cuisine: 'Internacional Premium',
    location: 'La Floresta, Quito',
    address: 'Av. 12 de Octubre N24-593 y Cordero, Quito 170135',
    coordinates: { lat: -0.1865, lng: -78.4792 },
    zone: 'La Floresta',
    rating: 4.9,
    reviewCount: 342,
    image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Experiencia gastronómica premium en el corazón de Quito. Fusión de sabores internacionales con ingredientes locales de alta calidad.',
    priceRange: '$$$$',
    openHours: '12:00 - 00:00',
    phone: '+593 2-256-1890',
    isPremium: true,
    benefits: ['Experiencia gastronómica exclusiva', 'Contenido profesional para redes', 'Mesa preferencial', 'Cóctel de bienvenida'],
    availableSlots: ['12:00', '12:30', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00'],
    menu: [
      { id: '1', name: 'Ceviche de Corvina Premium', description: 'Corvina fresca, leche de tigre especial, camote confitado', price: 28, category: 'Entradas', image: 'https://images.pexels.com/photos/13737761/pexels-photo-13737761.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Lomo de Res Angus', description: 'Corte premium, reducción de vino tinto, vegetales de temporada', price: 45, category: 'Principales', image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Trucha de los Andes', description: 'Trucha local, quinoa crujiente, salsa de maracuyá', price: 32, category: 'Principales', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 25,
    acceptsReservations: true
  },
  {
    id: '2',
    name: 'La Choza Náutica',
    cuisine: 'Mariscos Premium',
    location: 'La Mariscal',
    address: 'Av. Amazonas N23-85 y Veintimilla, Quito 170135',
    coordinates: { lat: -0.1964, lng: -78.4892 },
    zone: 'La Mariscal',
    rating: 4.7,
    reviewCount: 289,
    image: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'El mejor restaurante de mariscos en Quito. Productos frescos traídos diariamente desde la costa ecuatoriana.',
    priceRange: '$$$',
    openHours: '12:00 - 22:00',
    phone: '+593 2-252-4567',
    isPremium: true,
    benefits: ['Langostinos de cortesía', 'Degustación de ceviches', 'Descuento 15%', 'Foto con el chef'],
    availableSlots: ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
    menu: [
      { id: '1', name: 'Ceviche de Langostinos', description: 'Langostinos gigantes, leche de tigre tradicional', price: 24, category: 'Ceviches', image: 'https://images.pexels.com/photos/13737761/pexels-photo-13737761.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Parrillada Marina', description: 'Langosta, camarones, pulpo, pescado del día', price: 65, category: 'Principales', image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Encebollado Quiteño', description: 'Versión premium del plato tradicional', price: 18, category: 'Tradicional', image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 18,
    acceptsReservations: true
  },
  {
    id: '3',
    name: 'Casa Gangotena Restaurant',
    cuisine: 'Alta Cocina Ecuatoriana',
    location: 'Centro Histórico',
    address: 'Bolívar Oe6-41 y Cuenca, Plaza San Francisco, Quito 170401',
    coordinates: { lat: -0.2186, lng: -78.5127 },
    zone: 'Centro Histórico',
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Restaurante boutique en una casona colonial. Alta cocina ecuatoriana con vista privilegiada al Centro Histórico de Quito.',
    priceRange: '$$$$',
    openHours: '18:30 - 23:00',
    phone: '+593 2-400-8000',
    isPremium: true,
    benefits: ['Menú degustación exclusivo', 'Vista panorámica', 'Servicio personalizado', 'Maridaje de vinos'],
    availableSlots: ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00'],
    menu: [
      { id: '1', name: 'Locro de Papa Deconstruido', description: 'Interpretación moderna del clásico ecuatoriano', price: 22, category: 'Entradas', image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Cordero de los Andes', description: 'Cordero en cocción lenta, papas nativas, hierbas andinas', price: 42, category: 'Principales', image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Chocolate y Cacao Nacional', description: 'Postre con cacao fino de aroma ecuatoriano', price: 16, category: 'Postres', image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 12,
    acceptsReservations: true
  },
  {
    id: '4',
    name: 'Alma Restaurante',
    cuisine: 'Fusión Contemporánea',
    location: 'Cumbayá',
    address: 'Av. Interoceánica Km 12.5, Centro Comercial Scala Shopping, Cumbayá',
    coordinates: { lat: -0.1975, lng: -78.4328 },
    zone: 'Cumbayá',
    rating: 4.6,
    reviewCount: 234,
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Restaurante de fusión contemporánea con los mejores ingredientes locales e internacionales. Ambiente moderno en el valle de Cumbayá.',
    priceRange: '$$$',
    openHours: '12:00 - 23:00',
    phone: '+593 2-289-7890',
    isPremium: true,
    benefits: ['Terraza con vista al valle', 'Menú de temporada', 'Descuento 20%', 'Cocktails premium'],
    availableSlots: ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00'],
    menu: [
      { id: '1', name: 'Tartar de Atún Rojo', description: 'Atún de calidad sushi, aguacate, citrus andino', price: 26, category: 'Entradas', image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Risotto de Quinoa', description: 'Quinoa real, hongos silvestres, queso de cabra artesanal', price: 24, category: 'Principales', image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Cheesecake de Maracuyá', description: 'Postre signature con maracuyá de los valles', price: 12, category: 'Postres', image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 20,
    acceptsReservations: true
  },
  {
    id: '5',
    name: 'Astrid y Gastón Quito',
    cuisine: 'Peruana de Autor',
    location: 'La Carolina',
    address: 'Av. Eloy Alfaro N35-17 y Portugal, Quito 170518',
    coordinates: { lat: -0.1768, lng: -78.4820 },
    zone: 'La Carolina',
    rating: 4.9,
    reviewCount: 412,
    image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'La prestigiosa cadena de Gastón Acurio llega a Quito. Cocina peruana de vanguardia con los más altos estándares internacionales.',
    priceRange: '$$$$',
    openHours: '12:30 - 15:00, 19:00 - 23:00',
    phone: '+593 2-600-2100',
    isPremium: true,
    benefits: ['Menú degustación exclusivo', 'Maridaje con piscos premium', 'Experiencia chef', 'Mesa del chef'],
    availableSlots: ['12:30', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00'],
    menu: [
      { id: '1', name: 'Tiradito Nikkei', description: 'Pescado del Pacífico, leche de tigre, toques japoneses', price: 32, category: 'Signature', image: 'https://images.pexels.com/photos/13737761/pexels-photo-13737761.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Anticucho de Corazón', description: 'Preparación tradicional con técnicas contemporáneas', price: 28, category: 'Clásicos', image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Causa Limeña Deconstruida', description: 'Papa amarilla, cangrejo, palta, ajíes peruanos', price: 24, category: 'Entradas', image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 15,
    acceptsReservations: true
  },
  {
    id: '6',
    name: 'Café Mosaico',
    cuisine: 'Contemporánea Ecuatoriana',
    location: 'El Panecillo',
    address: 'Manuel Samaniego N8-95 y Antepara, Quito 170143',
    coordinates: { lat: -0.2358, lng: -78.5186 },
    zone: 'El Panecillo',
    rating: 4.5,
    reviewCount: 187,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Restaurante con la mejor vista panorámica de Quito. Cocina ecuatoriana contemporánea en un ambiente único.',
    priceRange: '$$',
    openHours: '08:00 - 22:00',
    phone: '+593 2-254-2871',
    isPremium: true,
    benefits: ['Vista panorámica 360°', 'Desayunos premium', 'Café de especialidad', 'Atardeceres únicos'],
    availableSlots: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    menu: [
      { id: '1', name: 'Desayuno Quiteño Premium', description: 'Huevos de campo, quesos artesanales, pan de casa', price: 16, category: 'Desayunos', image: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '2', name: 'Trucha del Antisana', description: 'Trucha fresca, vegetales orgánicos, quinoa real', price: 22, category: 'Principales', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: '3', name: 'Café de Especialidad', description: 'Granos selectos del Ecuador, métodos artesanales', price: 8, category: 'Bebidas', image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    tables: 22,
    acceptsReservations: true
  }
];

// Zonas premium de Quito
export const quitoZones = [
  { value: 'all', label: 'Todas las Zonas' },
  { value: 'La Floresta', label: 'La Floresta' },
  { value: 'La Mariscal', label: 'La Mariscal' },
  { value: 'Centro Histórico', label: 'Centro Histórico' },
  { value: 'Cumbayá', label: 'Cumbayá' },
  { value: 'La Carolina', label: 'La Carolina' },
  { value: 'El Panecillo', label: 'El Panecillo' },
  { value: 'La Condamine', label: 'La Condamine' },
  { value: 'González Suárez', label: 'González Suárez' }
];

// Tipos de cocina premium
export const premiumCuisines = [
  { value: 'all', label: 'Todos los Tipos' },
  { value: 'Internacional Premium', label: 'Internacional Premium' },
  { value: 'Mariscos Premium', label: 'Mariscos Premium' },
  { value: 'Alta Cocina Ecuatoriana', label: 'Alta Cocina Ecuatoriana' },
  { value: 'Fusión Contemporánea', label: 'Fusión Contemporánea' },
  { value: 'Peruana de Autor', label: 'Peruana de Autor' },
  { value: 'Contemporánea Ecuatoriana', label: 'Contemporánea Ecuatoriana' }
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
    status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
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
  
  updateVisitStatus: (visitId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'rejected') => {
    const visits = localStorageUtils.getVisits();
    const updatedVisits = visits.map((visit: any) => 
      visit.id === visitId ? { ...visit, status, updatedAt: new Date().toISOString() } : visit
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
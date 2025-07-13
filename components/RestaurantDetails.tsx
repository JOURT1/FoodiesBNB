'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Heart,
  Calendar,
  Users,
  ExternalLink,
  Camera,
  DollarSign,
  Gift
} from 'lucide-react';

interface RestaurantDetailsProps {
  restaurant: any;
  onClose: () => void;
  onReserve: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function RestaurantDetails({ 
  restaurant, 
  onClose, 
  onReserve, 
  isFavorite, 
  onToggleFavorite 
}: RestaurantDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMenuCategory, setActiveMenuCategory] = useState('all');

  const openGoogleMaps = () => {
    if (restaurant.coordinates) {
      const url = `https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (restaurant.address) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(restaurant.address)}`;
      window.open(url, '_blank');
    }
  };

  const menuCategories: string[] = restaurant.menu ? 
    ['all', ...Array.from(new Set((restaurant.menu as any[]).map((item: any) => item.category).filter((cat: any): cat is string => typeof cat === 'string')))] : ['all'];

  const filteredMenu = restaurant.menu ? 
    restaurant.menu.filter((item: any) => 
      activeMenuCategory === 'all' || item.category === activeMenuCategory
    ) : [];

  const galleryImages = restaurant.gallery || [restaurant.image];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
            {restaurant.isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                PREMIUM
              </Badge>
            )}
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Gallery */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={galleryImages[activeImageIndex]}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                }}
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {galleryImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-12 h-12 rounded overflow-hidden border-2 ${
                      index === activeImageIndex ? 'border-white' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Rating and Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
              </div>
              <Button
                onClick={onToggleFavorite}
                variant="ghost"
                size="sm"
                className={`rounded-full bg-white hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isFavorite ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart className={`h-5 w-5 transition-all duration-300 ${
                  isFavorite 
                    ? 'fill-current scale-110' 
                    : 'hover:text-red-300'
                }`} />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{restaurant.cuisine}</Badge>
                <Badge variant="outline">{restaurant.zone}</Badge>
              </div>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>

            {/* Contact and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{restaurant.address}</span>
                  <Button
                    onClick={openGoogleMaps}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{restaurant.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{restaurant.openHours}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{restaurant.tables || 'N/A'} mesas disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {restaurant.acceptsReservations ? 'Acepta reservas' : 'Sin reservas'}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            {restaurant.benefits && restaurant.benefits.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Gift className="h-5 w-5 text-red-500" />
                  Beneficios FoodiesBNB
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {restaurant.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Menu */}
            {restaurant.menu && restaurant.menu.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Menú
                </h3>

                {/* Menu Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {menuCategories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setActiveMenuCategory(category)}
                      variant={activeMenuCategory === category ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {category === 'all' ? 'Todos' : category}
                    </Button>
                  ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {filteredMenu.map((item: any) => (
                    <Card key={item.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {item.category}
                                </Badge>
                              </div>
                              <span className="font-semibold text-green-600 text-lg">
                                ${item.price}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="border-t p-6 bg-gray-50 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              onClick={onReserve}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              disabled={!restaurant.acceptsReservations}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {restaurant.acceptsReservations ? 'Hacer Reserva' : 'No Acepta Reservas'}
            </Button>
            <Button
              onClick={openGoogleMaps}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Ver en Maps
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

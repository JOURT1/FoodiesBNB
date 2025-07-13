'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MapPin, Clock, Gift } from 'lucide-react';
import { localStorageUtils } from '@/lib/mockData';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    location: string;
    rating: number;
    reviewCount: number;
    image: string;
    description: string;
    priceRange: string;
    openHours: string;
    benefits?: string[];
  };
  onScheduleVisit: (restaurant: any) => void;
  onDetailsClick?: (restaurant: any) => void;
  onToggleFavorite?: (restaurantId: string) => void;
  isFavorite?: boolean;
}

export default function RestaurantCard({ 
  restaurant, 
  onScheduleVisit, 
  onDetailsClick,
  onToggleFavorite,
  isFavorite: propIsFavorite
}: RestaurantCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  // Sincronizar el estado local con la prop isFavorite
  useEffect(() => {
    if (propIsFavorite !== undefined) {
      setLocalIsFavorite(propIsFavorite);
    } else {
      // Fallback al localStorage si no se pasa la prop
      setLocalIsFavorite(localStorageUtils.isFavorite(restaurant.id));
    }
  }, [propIsFavorite, restaurant.id]);

  // Estado final que se usa para el rendering
  const isFavorite = propIsFavorite !== undefined ? propIsFavorite : localIsFavorite;

  const handleFavoriteToggle = () => {
    if (onToggleFavorite) {
      onToggleFavorite(restaurant.id);
    } else {
      // Fallback al comportamiento anterior
      const newIsFavorite = !isFavorite;
      if (isFavorite) {
        localStorageUtils.removeFavorite(restaurant.id);
      } else {
        localStorageUtils.addFavorite(restaurant.id);
      }
      setLocalIsFavorite(newIsFavorite);
      
      // Disparar evento para actualizar el dashboard
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { restaurantId: restaurant.id, isFavorite: newIsFavorite }
      }));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              isFavorite 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-gray-400 hover:text-red-300'
            }`}
          />
        </button>
        {restaurant.benefits && restaurant.benefits.length > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              <Gift className="h-3 w-3 mr-1" />
              Beneficios
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <Badge className="mt-1 bg-gray-100 text-gray-700">
              {restaurant.cuisine}
            </Badge>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {renderStars(restaurant.rating)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {restaurant.rating} ({restaurant.reviewCount})
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{restaurant.openHours}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {restaurant.description}
          </p>

          {restaurant.benefits && restaurant.benefits.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-1">Beneficios exclusivos:</p>
              <p className="text-xs text-green-600">
                {restaurant.benefits[0]}
              </p>
            </div>
          )}
          
          <div className="flex justify-end items-center pt-3 gap-2">
            <div className="flex gap-2">
              {onDetailsClick && (
                <Button
                  onClick={() => onDetailsClick(restaurant)}
                  variant="outline"
                  size="sm"
                >
                  Ver Detalles
                </Button>
              )}
              <Button
                onClick={() => onScheduleVisit(restaurant)}
                className="bg-red-500 hover:bg-red-600"
                size="sm"
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
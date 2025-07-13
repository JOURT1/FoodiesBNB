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
}

export default function RestaurantCard({ restaurant, onScheduleVisit }: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(localStorageUtils.isFavorite(restaurant.id));
  }, [restaurant.id]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      localStorageUtils.removeFavorite(restaurant.id);
    } else {
      localStorageUtils.addFavorite(restaurant.id);
    }
    setIsFavorite(!isFavorite);
    
    // Disparar evento para actualizar el dashboard
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { restaurantId: restaurant.id, isFavorite: !isFavorite }
    }));
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
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
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
          
          <div className="flex justify-between items-center pt-3">
            <span className="font-semibold text-green-600">
              {restaurant.priceRange}
            </span>
            <Button
              onClick={() => onScheduleVisit(restaurant)}
              className="bg-red-500 hover:bg-red-600"
            >
              Programar Visita
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
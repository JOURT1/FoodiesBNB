'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MessageCircle, Gift, Check } from 'lucide-react';
import { localStorageUtils } from '@/lib/mockData';

interface VisitModalProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    location: string;
    image: string;
    benefits?: string[];
    availableSlots?: string[];
  };
  onClose: () => void;
  onSchedule: () => void;
}

export default function VisitModal({ restaurant, onClose, onSchedule }: VisitModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const visit = {
        id: Date.now().toString(),
        restaurantId: restaurant.id,
        visitDate: formData.date,
        visitTime: formData.time,
        partySize: parseInt(formData.guests),
        specialRequests: formData.notes,
        status: 'pending' as const,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        restaurantLocation: restaurant.location
      };

      localStorageUtils.addVisit(visit);
      setSuccess(true);
      
      // Disparar evento para actualizar el dashboard
      window.dispatchEvent(new CustomEvent('visitScheduled', {
        detail: { visit }
      }));
      
      setTimeout(() => {
        onSchedule();
      }, 2000);
    } catch (error) {
      console.error('Error scheduling visit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = restaurant.availableSlots || [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  if (success) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Visita Programada!</h3>
            <p className="text-gray-600 mb-4">
              Tu visita a {restaurant.name} ha sido programada para el {formData.date} a las {formData.time}.
            </p>
            <p className="text-sm text-gray-500">
              Recibirás una confirmación por email pronto.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reservar Mesa
          </DialogTitle>
          <DialogDescription>
            Reserva tu mesa en {restaurant.name} y disfruta de beneficios exclusivos
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex gap-3">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
              <p className="text-sm text-gray-500">{restaurant.location}</p>
            </div>
          </div>
        </div>

        {restaurant.benefits && restaurant.benefits.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Beneficios incluidos:</span>
            </div>
            <ul className="space-y-1">
              {restaurant.benefits.map((benefit, index) => (
                <li key={index} className="text-xs text-green-600 flex items-start gap-2">
                  <Check className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="time">Hora disponible</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })} required>
                <SelectTrigger>
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="guests">Número de personas</Label>
            <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'persona' : 'personas'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notas especiales (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Menciona cualquier petición especial, restricción alimentaria, celebración especial..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              Al confirmar tu visita, el restaurante podrá contactarte para coordinar los detalles finales.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              onClick={onClose} 
              className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={isSubmitting || !formData.date || !formData.time}
            >
              {isSubmitting ? 'Programando...' : 'Confirmar Visita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
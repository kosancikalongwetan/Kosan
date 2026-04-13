import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Coffee, Wind, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';

const properties = [
  {
    id: 1,
    name: 'Kosan Modern Jakarta Pusat',
    location: 'Jakarta Pusat, DKI Jakarta',
    price: 'Rp 1.500.000',
    rating: 4.8,
    reviews: 124,
    amenities: ['WiFi', 'AC', 'TV', 'Dapur'],
    image: 'Modern cozy bedroom with minimalist design'
  },
  {
    id: 2,
    name: 'Apartemen Studio Bandung',
    location: 'Dago, Bandung',
    price: 'Rp 2.000.000',
    rating: 4.9,
    reviews: 98,
    amenities: ['WiFi', 'AC', 'TV', 'Parkir'],
    image: 'Stylish studio apartment with city view'
  },
  {
    id: 3,
    name: 'Kosan Eksklusif Surabaya',
    location: 'Gubeng, Surabaya',
    price: 'Rp 1.800.000',
    rating: 4.7,
    reviews: 156,
    amenities: ['WiFi', 'AC', 'Laundry', 'Dapur'],
    image: 'Exclusive boarding house with modern facilities'
  },
  {
    id: 4,
    name: 'Kosan Dekat Kampus Yogyakarta',
    location: 'Sleman, Yogyakarta',
    price: 'Rp 1.200.000',
    rating: 4.6,
    reviews: 89,
    amenities: ['WiFi', 'AC', 'Parkir', 'Security'],
    image: 'Student-friendly accommodation near campus'
  },
  {
    id: 5,
    name: 'Apartemen Furnished Semarang',
    location: 'Pemuda, Semarang',
    price: 'Rp 2.200.000',
    rating: 4.8,
    reviews: 76,
    amenities: ['WiFi', 'AC', 'TV', 'Gym'],
    image: 'Fully furnished apartment with amenities'
  },
  {
    id: 6,
    name: 'Kosan Premium Malang',
    location: 'Lowokwaru, Malang',
    price: 'Rp 1.600.000',
    rating: 4.9,
    reviews: 112,
    amenities: ['WiFi', 'AC', 'Dapur', 'Laundry'],
    image: 'Premium boarding house with complete facilities'
  }
];

const amenityIcons = {
  'WiFi': Wifi,
  'AC': Wind,
  'TV': Tv,
  'Dapur': Coffee,
  'Parkir': MapPin,
  'Laundry': Coffee,
  'Security': MapPin,
  'Gym': Coffee
};

const FeaturedProperties = ({ onBookNow }) => {
  const handleBookNow = (property) => {
    onBookNow({
      location: property.location,
      propertyName: property.name,
      checkInDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <section id="properties" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Properti Pilihan</h2>
          <p className="text-gray-600 text-lg">Hunian terbaik dengan harga terjangkau</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => {
            const IconComponent = amenityIcons[property.amenities[0]] || Wifi;
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img alt={property.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Terjangkau
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{property.name}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={16} className="text-black" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-black fill-black" size={16} />
                      <span className="font-semibold text-gray-900">{property.rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">({property.reviews} ulasan)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div key={amenity} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                          <Icon size={14} className="text-gray-600" />
                          <span className="text-xs text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Mulai dari</p>
                      <p className="text-2xl font-bold text-black">{property.price}<span className="text-sm text-gray-600">/bulan</span></p>
                    </div>
                    <Button 
                      onClick={() => handleBookNow(property)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      Pesan Sekarang
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
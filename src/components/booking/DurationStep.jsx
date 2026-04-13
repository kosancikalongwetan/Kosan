import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';

const packages = [
  { id: 1, duration: 1, label: '1 Jam', price: 50000, description: 'Cocok untuk istirahat singkat' },
  { id: 2, duration: 2, label: '2 Jam', price: 95000, description: 'Hemat Rp 5.000', discount: true },
  { id: 3, duration: 3, label: '3 Jam', price: 135000, description: 'Hemat Rp 15.000', discount: true },
  { id: 4, duration: 4, label: '4 Jam', price: 170000, description: 'Hemat Rp 30.000', popular: true },
  { id: 5, duration: 5, label: '5 Jam', price: 200000, description: 'Hemat Rp 50.000', discount: true },
  { id: 6, duration: 6, label: '6 Jam', price: 225000, description: 'Hemat Rp 75.000', discount: true },
  { id: 7, duration: 12, label: '12 Jam', price: 400000, description: 'Hemat Rp 200.000', popular: true },
  { id: 8, duration: 24, label: '24 Jam', price: 750000, description: 'Hemat Rp 450.000', discount: true }
];

const DurationStep = ({ bookingData, updateBookingData }) => {
  const handlePackageSelect = (pkg) => {
    updateBookingData({
      duration: pkg.duration,
      package: pkg.label,
      totalPrice: pkg.price
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Pilih Durasi & Paket</h3>
      <p className="text-gray-600 mb-6">Pilih durasi menginap yang sesuai dengan kebutuhan Anda</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const isSelected = bookingData.duration === pkg.duration;
          
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePackageSelect(pkg)}
              className={`
                relative border-2 rounded-xl p-6 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-black bg-gray-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                }
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                  Populer
                </div>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4 bg-black text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-black" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pkg.label}</span>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-black">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </p>
              </div>

              <p className={`text-sm ${pkg.discount ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
                {pkg.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {bookingData.duration && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6"
        >
          <h4 className="font-bold text-gray-900 mb-2">💡 Tips Hemat</h4>
          <p className="text-gray-700 text-sm">
            Semakin lama durasi yang Anda pilih, semakin besar penghematan yang didapatkan!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DurationStep;
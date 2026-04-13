import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SummaryStep = ({ bookingData }) => {
  const { toast } = useToast();

  const handlePayment = () => {
    toast({
      title: "🚧 Fitur Pembayaran Belum Tersedia",
      description: "Sistem pembayaran sedang dalam pengembangan. Anda dapat request implementasinya di prompt berikutnya! 🚀",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Ringkasan Pemesanan</h3>
      <p className="text-gray-600 mb-6">Periksa kembali detail pemesanan Anda sebelum melanjutkan pembayaran</p>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4">Detail Properti</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-black mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-semibold text-gray-900">{bookingData.propertyName}</p>
                <p className="text-sm text-gray-600">{bookingData.propertyAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-black mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Tanggal Check-in</p>
                <p className="font-semibold text-gray-900">{formatDate(bookingData.checkInDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-black mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Waktu Check-in</p>
                <p className="font-semibold text-gray-900">{bookingData.checkInTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-black mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Paket Durasi</p>
                <p className="font-semibold text-gray-900">{bookingData.package}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4">Rincian Pembayaran</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Harga Paket</span>
              <span className="font-semibold text-gray-900">Rp {bookingData.totalPrice?.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Biaya Layanan</span>
              <span className="font-semibold text-gray-900">Rp 10.000</span>
            </div>

            <div className="border-t-2 border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
                <span className="text-2xl font-bold text-black">
                  Rp {((bookingData.totalPrice || 0) + 10000).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <CreditCard className="text-black" size={20} />
            Metode Pembayaran
          </h4>
          <p className="text-gray-700 text-sm mb-4">
            Pilih metode pembayaran yang tersedia untuk menyelesaikan pemesanan Anda.
          </p>
          
          <div className="space-y-2">
            {['Transfer Bank', 'E-Wallet (GoPay, OVO, Dana)', 'Kartu Kredit/Debit'].map((method) => (
              <label key={method} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-black transition-colors">
                <input type="radio" name="payment" className="text-black accent-black" />
                <span className="text-gray-900">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg font-bold"
        >
          Bayar Sekarang - Rp {((bookingData.totalPrice || 0) + 10000).toLocaleString('id-ID')}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Dengan melanjutkan pembayaran, Anda menyetujui{' '}
          <a href="#" className="text-black hover:underline">Syarat & Ketentuan</a>
          {' '}dan{' '}
          <a href="#" className="text-black hover:underline">Kebijakan Privasi</a>
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryStep;
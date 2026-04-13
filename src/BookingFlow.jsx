import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import StepIndicator from '@/components/booking/StepIndicator';
import LocationStep from '@/components/booking/LocationStep';
import DateStep from '@/components/booking/DateStep';
import TimeStep from '@/components/booking/TimeStep';
import DurationStep from '@/components/booking/DurationStep';
import SummaryStep from '@/components/booking/SummaryStep';

const BookingFlow = ({ initialData, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    location: initialData?.location || '',
    propertyName: initialData?.propertyName || '',
    checkInDate: initialData?.checkInDate || '',
    checkInTime: '',
    duration: null,
    package: null,
    totalPrice: 0
  });

  const totalSteps = 5;

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.location && bookingData.propertyName;
      case 2:
        return bookingData.checkInDate;
      case 3:
        return bookingData.checkInTime;
      case 4:
        return bookingData.duration && bookingData.package;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="bg-black text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Pesan Hunian</h2>
            <p className="text-gray-300 text-sm mt-1">Lengkapi data pemesanan Anda</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <LocationStep 
                key="location"
                bookingData={bookingData}
                updateBookingData={updateBookingData}
              />
            )}
            {currentStep === 2 && (
              <DateStep 
                key="date"
                bookingData={bookingData}
                updateBookingData={updateBookingData}
              />
            )}
            {currentStep === 3 && (
              <TimeStep 
                key="time"
                bookingData={bookingData}
                updateBookingData={updateBookingData}
              />
            )}
            {currentStep === 4 && (
              <DurationStep 
                key="duration"
                bookingData={bookingData}
                updateBookingData={updateBookingData}
              />
            )}
            {currentStep === 5 && (
              <SummaryStep 
                key="summary"
                bookingData={bookingData}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <ChevronLeft size={20} />
            Kembali
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white hover:bg-gray-800"
            >
              Lanjut
              <ChevronRight size={20} />
            </button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingFlow;
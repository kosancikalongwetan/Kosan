import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from '@/pages/Home';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Helmet>
          <title>Kosan - Temukan Hunian Nyaman & Modern di Indonesia</title>
          <meta name="description" content="Platform pemesanan kos dan apartemen dengan standar kualitas tinggi, aman, dan transparan di seluruh Indonesia." />
        </Helmet>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
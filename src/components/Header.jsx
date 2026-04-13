import React from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
const Header = ({
  onLoginClick,
  onSignupClick
}) => {
  return <header className="fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand Name */}
        <div className="flex items-center gap-2">
          <img src="https://horizons-cdn.hostinger.com/fe0ceffa-a268-4ed7-9517-b00266208690/82f0ec3177ec7c28e1cd03e5f4aac30f.jpg" alt="Kosan Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight text-gray-900"></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">Beranda</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">Cari Kos</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">Sewakan Kos</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">Bantuan</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-sm font-medium" onClick={onLoginClick}>
            Masuk
          </Button>
          <Button className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-6 rounded-full" onClick={onSignupClick}>
            Daftar
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>;
};
export default Header;
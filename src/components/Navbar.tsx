import React, { useState, useEffect } from 'react';
import { Search, Music, Download, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchQuery }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'glass-card border-b border-primary/20' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music className="h-8 w-8 text-primary animate-glow" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">lyricus</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 glass-card border-primary/30 bg-background/20 backdrop-blur-md focus:border-primary/50 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="glass-button">
              <Download className="h-4 w-4 mr-2" />
              Downloads
            </Button>
            <Button className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
              Add Lyrics
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 p-4 space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 glass-card border-primary/30 bg-background/20 backdrop-blur-md"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="glass-button justify-start">
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </Button>
              <Button className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 justify-start">
                Add Lyrics
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
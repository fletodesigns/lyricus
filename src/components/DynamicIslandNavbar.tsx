import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search, Music, Download, Menu, X, Home, Library, Plus, Users, TrendingUp, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DynamicIslandNavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  currentSong?: string;
}

const DynamicIslandNavbar: React.FC<DynamicIslandNavbarProps> = ({ 
  onSearch, 
  searchQuery, 
  currentSong 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const islandRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Library, label: 'Browse' },
    { path: '/trending', icon: TrendingUp, label: 'Trending' },
    { path: '/artists', icon: Users, label: 'Artists' },
    { path: '/add', icon: Plus, label: 'Add Lyrics' },
    { path: '/about', icon: Info, label: 'About' },
    { path: '/contact', icon: Mail, label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Island animations
  useEffect(() => {
    if (islandRef.current) {
      gsap.to(islandRef.current, {
        width: isExpanded ? '400px' : isScrolled ? '200px' : '160px',
        height: isExpanded ? '300px' : '48px',
        borderRadius: isExpanded ? '24px' : '24px',
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [isExpanded, isScrolled]);

  // Search expansion animation
  useEffect(() => {
    if (searchRef.current) {
      gsap.to(searchRef.current, {
        width: isSearchExpanded ? '300px' : '0px',
        opacity: isSearchExpanded ? 1 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isSearchExpanded]);

  // Menu animation
  useEffect(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        height: isMobileMenuOpen ? 'auto' : '0px',
        opacity: isMobileMenuOpen ? 1 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isMobileMenuOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsExpanded(false);
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('#dynamic-search') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Dynamic Island */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div
          ref={islandRef}
          className={`glass-card transition-all duration-400 ease-out ${
            isScrolled ? 'shadow-glow' : 'shadow-glass'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, hsl(var(--background) / 0.8), hsl(var(--background) / 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsl(var(--primary) / 0.2)'
          }}
        >
          {!isExpanded ? (
            /* Collapsed State */
            <div className="flex items-center justify-between h-12 px-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Music className="h-5 w-5 text-primary animate-glow" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                </div>
                {isScrolled && (
                  <span className="text-sm font-semibold gradient-text">lyricus</span>
                )}
              </div>

              {currentSong && (
                <div className="hidden md:flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground truncate max-w-[100px]">
                    {currentSong}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={toggleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsExpanded(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* Expanded State */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Music className="h-6 w-6 text-primary animate-glow" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <span className="text-lg font-bold gradient-text">lyricus</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`glass-button justify-start h-10 ${
                        isActive ? 'bg-primary/20 text-primary border-primary/30' : ''
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Floating Search */}
        <div
          ref={searchRef}
          className="absolute top-14 left-1/2 transform -translate-x-1/2 glass-card overflow-hidden"
          style={{ width: '0px', opacity: 0 }}
        >
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dynamic-search"
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 glass-card border-primary/30 bg-background/20 backdrop-blur-md"
                onBlur={() => setIsSearchExpanded(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fallback Menu */}
      <div
        ref={menuRef}
        className="fixed top-16 left-4 right-4 z-40 md:hidden glass-card overflow-hidden"
        style={{ height: '0px', opacity: 0 }}
      >
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`glass-button justify-start w-full ${
                  isActive ? 'bg-primary/20 text-primary border-primary/30' : ''
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Backdrop */}
      {(isExpanded || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-background/20 backdrop-blur-sm z-30"
          onClick={() => {
            setIsExpanded(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default DynamicIslandNavbar;
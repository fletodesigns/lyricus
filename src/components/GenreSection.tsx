import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Heart, Headphones, Mic, Guitar, Piano, Drum } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const GenreSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const genres = [
    { name: 'Pop', icon: Heart, color: 'from-pink-500/20 to-purple-500/20', count: '2.5k' },
    { name: 'Rock', icon: Guitar, color: 'from-orange-500/20 to-red-500/20', count: '1.8k' },
    { name: 'Hip Hop', icon: Mic, color: 'from-blue-500/20 to-cyan-500/20', count: '1.2k' },
    { name: 'Electronic', icon: Headphones, color: 'from-purple-500/20 to-indigo-500/20', count: '900' },
    { name: 'Classical', icon: Piano, color: 'from-yellow-500/20 to-amber-500/20', count: '650' },
    { name: 'Jazz', icon: Drum, color: 'from-green-500/20 to-teal-500/20', count: '420' },
  ];

  useEffect(() => {
    if (sectionRef.current && cardsRef.current) {
      // Section title animation
      gsap.fromTo(sectionRef.current.querySelector('.section-title'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true
          }
        }
      );

      // Cards wave animation
      gsap.fromTo(cardsRef.current.children,
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, []);

  const handleGenreClick = (genre: string) => {
    navigate('/browse', { state: { selectedGenre: genre } });
  };

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary-glow/10"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary-glow rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="section-title text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Explore by Genre</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover lyrics from your favorite music genres and explore new ones
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => {
            const Icon = genre.icon;
            
            return (
              <Card 
                key={genre.name}
                className="glass-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:scale-105"
                onClick={() => handleGenreClick(genre.name)}
              >
                <CardContent className="p-6">
                  <div className={`w-full h-32 bg-gradient-to-br ${genre.color} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden`}>
                    <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 group-hover:to-primary/20 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold gradient-text mb-2 group-hover:text-primary transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {genre.count} songs available
                    </p>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="glass-button w-full group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30"
                    >
                      Explore {genre.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="glass-button border-primary/30 text-foreground hover:bg-primary/10 px-8 py-3"
            onClick={() => navigate('/browse')}
          >
            Browse All Genres
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GenreSection;
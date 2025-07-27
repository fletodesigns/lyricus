import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Music, Calendar, TrendingUp } from 'lucide-react';
import LyricsCard from './LyricsCard';
import { Button } from '@/components/ui/button';
import { getAllLyrics, type Lyric } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedSectionProps {
  onViewLyric: (lyric: Lyric) => void;
  onDownload: (id: number) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onViewLyric, onDownload }) => {
  const [featuredLyrics, setFeaturedLyrics] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allLyrics = await getAllLyrics();
        // Get random featured lyrics (simulate featured logic)
        const shuffled = [...allLyrics].sort(() => 0.5 - Math.random());
        setFeaturedLyrics(shuffled.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured lyrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!isLoading && sectionRef.current && cardsRef.current) {
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

      // Cards stagger animation
      gsap.fromTo(cardsRef.current.children,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-primary/20 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/10 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-4">
                  <div className="h-6 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/10 rounded"></div>
                    <div className="h-3 bg-primary/10 rounded w-5/6"></div>
                    <div className="h-3 bg-primary/10 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4">
        <div className="section-title text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-primary mr-3 animate-glow" />
            <h2 className="text-4xl font-bold gradient-text">Featured Lyrics</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked songs that have captured hearts around the world
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredLyrics.map((lyric) => (
            <LyricsCard
              key={lyric.id}
              lyric={lyric}
              onView={onViewLyric}
              onDownload={onDownload}
            />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 px-8 py-3"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            View All Featured
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
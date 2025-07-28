import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Music, Plus } from 'lucide-react';
import LyricsCard from './LyricsCard';
import { Button } from '@/components/ui/button';
import { getAllLyrics, type Lyric } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

interface RecentSectionProps {
  onViewLyric: (lyric: Lyric) => void;
  onDownload: (id: number) => void;
}

const RecentSection: React.FC<RecentSectionProps> = ({ onViewLyric, onDownload }) => {
  const [recentLyrics, setRecentLyrics] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const allLyrics = await getAllLyrics();
        // Sort by ID (assuming higher ID = more recent) and take latest 4
        const sorted = [...allLyrics].sort((a, b) => b.id - a.id);
        setRecentLyrics(sorted.slice(0, 4));
      } catch (error) {
        console.error('Error fetching recent lyrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  useEffect(() => {
    if (!isLoading && sectionRef.current && cardsRef.current) {
      // Section animation
      gsap.fromTo(sectionRef.current.querySelector('.section-content'),
        { x: -100, opacity: 0 },
        {
          x: 0,
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

      // Cards horizontal stagger
      gsap.fromTo(cardsRef.current.children,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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
      <section className="py-20 bg-gradient-to-r from-background/50 to-background/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-primary/20 rounded-lg w-48 mb-4"></div>
            <div className="h-4 bg-primary/10 rounded w-80 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-4">
                  <div className="h-6 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/10 rounded"></div>
                    <div className="h-3 bg-primary/10 rounded w-5/6"></div>
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
      <div className="absolute top-12 left-12 w-48 h-48 bg-primary/6 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-12 right-12 w-56 h-56 bg-primary-glow/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary-dark/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="section-content">
          <div className="flex items-center mb-4">
            <Clock className="h-7 w-7 text-primary mr-3 animate-glow" />
            <h2 className="text-3xl font-bold gradient-text">Latest Additions</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Fresh lyrics just added to our collection. Be the first to discover these new gems.
          </p>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {recentLyrics.map((lyric) => (
              <LyricsCard
                key={lyric.id}
                lyric={lyric}
                onView={onViewLyric}
                onDownload={onDownload}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {recentLyrics.length} recent additions
            </div>
            <Button 
              variant="outline"
              className="glass-button border-primary/30 text-foreground hover:bg-primary/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your Lyrics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentSection;
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2, AlertCircle, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LyricsCard from '@/components/LyricsCard';
import LyricsModal from '@/components/LyricsModal';
import { getAllLyrics, downloadLyric, searchLyrics, type Lyric } from '@/services/api';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [filteredLyrics, setFilteredLyrics] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  const lyricsGridRef = useRef<HTMLDivElement>(null);

  // Fetch lyrics on component mount
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllLyrics();
        setLyrics(data);
        setFilteredLyrics(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lyrics';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [toast]);

  // Handle search
  useEffect(() => {
    const filtered = searchLyrics(lyrics, searchQuery);
    setFilteredLyrics(filtered);
  }, [lyrics, searchQuery]);

  // GSAP animations for lyrics grid
  useEffect(() => {
    if (!isLoading && lyricsGridRef.current) {
      gsap.fromTo(
        lyricsGridRef.current.children,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: lyricsGridRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, [isLoading, filteredLyrics]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewLyric = (lyric: Lyric) => {
    setSelectedLyric(lyric);
    setIsModalOpen(true);
  };

  const handleDownload = async (id: number) => {
    try {
      await downloadLyric(id);
      toast({
        title: "Success",
        description: "Lyric downloaded successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download lyric';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLyric(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      
      <Hero />

      {/* Lyrics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Discover Amazing Lyrics
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of beautiful songs from talented artists around the world
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="glass-card p-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Loading beautiful lyrics...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-16">
            <div className="glass-card p-8 text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredLyrics.length === 0 && searchQuery && (
          <div className="flex items-center justify-center py-16">
            <div className="glass-card p-8 text-center max-w-md">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No lyrics found</h3>
              <p className="text-muted-foreground">
                Try searching for a different song or artist
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredLyrics.length > 0 && (
          <div 
            ref={lyricsGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredLyrics.map((lyric) => (
              <LyricsCard
                key={lyric.id}
                lyric={lyric}
                onView={handleViewLyric}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && searchQuery && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              {filteredLyrics.length} result{filteredLyrics.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}
      </section>

      <LyricsModal
        lyric={selectedLyric}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Index;

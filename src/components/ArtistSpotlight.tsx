import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Star, Music, ArrowRight, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAllLyrics, type Lyric } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const ArtistSpotlight: React.FC = () => {
  const [topArtists, setTopArtists] = useState<Array<{
    name: string;
    songCount: number;
    songs: Lyric[];
    initials: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const allLyrics = await getAllLyrics();
        
        // Group lyrics by artist
        const artistMap = new Map<string, Lyric[]>();
        allLyrics.forEach(lyric => {
          const artist = lyric.artist_name;
          if (!artistMap.has(artist)) {
            artistMap.set(artist, []);
          }
          artistMap.get(artist)!.push(lyric);
        });

        // Convert to array and sort by song count
        const artists = Array.from(artistMap.entries()).map(([name, songs]) => ({
          name,
          songCount: songs.length,
          songs,
          initials: name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
        })).sort((a, b) => b.songCount - a.songCount).slice(0, 4);

        setTopArtists(artists);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, []);

  useEffect(() => {
    if (!isLoading && sectionRef.current && cardsRef.current) {
      // Section animation
      gsap.fromTo(sectionRef.current.querySelector('.section-header'),
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

      // Artist cards animation
      gsap.fromTo(cardsRef.current.children,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
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
            <div className="h-8 bg-primary/20 rounded-lg w-64 mb-4"></div>
            <div className="h-4 bg-primary/10 rounded w-96 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
                  <div className="h-6 bg-primary/20 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-primary/10 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-l from-background/60 to-background/40 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-glow/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="section-header text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary mr-3 animate-glow" />
            <h2 className="text-4xl font-bold gradient-text">Artist Spotlight</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented artists behind the most loved lyrics in our collection
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topArtists.map((artist, index) => (
            <Card 
              key={artist.name}
              className="glass-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:scale-105"
              onClick={() => navigate('/artists', { state: { selectedArtist: artist.name } })}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <Avatar className="w-20 h-20 mx-auto border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                      {artist.initials}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Star className="h-6 w-6 text-yellow-400 animate-pulse" fill="currentColor" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold gradient-text mb-2 group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                
                <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                  <Music className="h-4 w-4 mr-1" />
                  {artist.songCount} song{artist.songCount !== 1 ? 's' : ''}
                </div>

                <div className="space-y-2 mb-4">
                  {artist.songs.slice(0, 2).map((song) => (
                    <div key={song.id} className="text-xs text-muted-foreground bg-background/20 rounded-full px-3 py-1">
                      {song.song_name}
                    </div>
                  ))}
                  {artist.songs.length > 2 && (
                    <div className="text-xs text-primary">
                      +{artist.songs.length - 2} more
                    </div>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="glass-button w-full group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30"
                >
                  <Play className="mr-2 h-3 w-3" />
                  View Songs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 px-8 py-3"
            onClick={() => navigate('/artists')}
          >
            <Users className="mr-2 h-5 w-5" />
            View All Artists
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistSpotlight;
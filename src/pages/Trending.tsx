import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Music, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import LyricsCard from '@/components/LyricsCard';
import LyricsModal from '@/components/LyricsModal';
import { getAllLyrics, downloadLyric, type Lyric } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Trending = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [trendingLyrics, setTrendingLyrics] = useState<Lyric[]>([]);
  const [popularArtists, setPopularArtists] = useState<Array<{
    name: string;
    songCount: number;
    songs: Lyric[];
  }>>([]);
  const [recentHits, setRecentHits] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allLyrics = await getAllLyrics();
        setLyrics(allLyrics);

        // Simulate trending logic (in real app, this would be based on actual metrics)
        const shuffled = [...allLyrics].sort(() => 0.5 - Math.random());
        setTrendingLyrics(shuffled.slice(0, 9));
        setRecentHits(shuffled.slice(9, 15));

        // Group by artists for popular artists
        const artistMap = new Map<string, Lyric[]>();
        allLyrics.forEach(lyric => {
          const artist = lyric.artist_name;
          if (!artistMap.has(artist)) {
            artistMap.set(artist, []);
          }
          artistMap.get(artist)!.push(lyric);
        });

        const artists = Array.from(artistMap.entries()).map(([name, songs]) => ({
          name,
          songCount: songs.length,
          songs
        })).sort((a, b) => b.songCount - a.songCount).slice(0, 6);

        setPopularArtists(artists);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch trending data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download lyric",
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLyric(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DynamicIslandNavbar onSearch={() => {}} searchQuery="" />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-primary/20 rounded-lg w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="glass-card p-6 space-y-4">
                    <div className="h-6 bg-primary/20 rounded"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-primary/10 rounded"></div>
                      <div className="h-3 bg-primary/10 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={() => {}} searchQuery="" />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-primary mr-3 animate-glow" />
              <h1 className="text-5xl font-bold gradient-text">Trending</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Discover what's hot right now in the world of lyrics
            </p>
          </div>

          {/* Trending Tabs */}
          <Tabs defaultValue="trending" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 glass-card">
              <TabsTrigger value="trending" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Flame className="h-4 w-4 mr-2" />
                Trending Now
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Star className="h-4 w-4 mr-2" />
                Popular Artists
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Calendar className="h-4 w-4 mr-2" />
                Recent Hits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-2">🔥 Trending Lyrics</h2>
                <p className="text-muted-foreground">The most popular lyrics this week</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingLyrics.map((lyric, index) => (
                  <div key={lyric.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-gradient-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                    )}
                    <LyricsCard
                      lyric={lyric}
                      onView={handleViewLyric}
                      onDownload={handleDownload}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-2">⭐ Popular Artists</h2>
                <p className="text-muted-foreground">Artists with the most songs in our collection</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularArtists.map((artist, index) => (
                  <Card key={artist.name} className="glass-card hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="gradient-text">{artist.name}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Music className="h-4 w-4 mr-1" />
                          {artist.songCount}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {artist.songs.slice(0, 3).map((song) => (
                        <div 
                          key={song.id}
                          className="flex items-center justify-between p-2 bg-background/20 rounded-lg hover:bg-background/30 transition-colors cursor-pointer"
                          onClick={() => handleViewLyric(song)}
                        >
                          <span className="text-sm font-medium">{song.song_name}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Music className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {artist.songs.length > 3 && (
                        <div className="text-center text-xs text-primary">
                          +{artist.songs.length - 3} more songs
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-2">📅 Recent Hits</h2>
                <p className="text-muted-foreground">Latest additions that are gaining popularity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentHits.map((lyric) => (
                  <LyricsCard
                    key={lyric.id}
                    lyric={lyric}
                    onView={handleViewLyric}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4 animate-glow" />
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  See Your Song Trending?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add your favorite lyrics to help them climb the trending charts!
                </p>
                <Button size="lg" className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                  Add Lyrics Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LyricsModal
        lyric={selectedLyric}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Trending;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, Music, Search, User, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import LyricsCard from '@/components/LyricsCard';
import LyricsModal from '@/components/LyricsModal';
import { getAllLyrics, downloadLyric, type Lyric } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Artists = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [artists, setArtists] = useState<Array<{
    name: string;
    songCount: number;
    songs: Lyric[];
    initials: string;
  }>>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<typeof artists>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Get selected artist from navigation state
  useEffect(() => {
    if (location.state?.selectedArtist) {
      setSelectedArtist(location.state.selectedArtist);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allLyrics = await getAllLyrics();
        setLyrics(allLyrics);

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
        const artistsData = Array.from(artistMap.entries()).map(([name, songs]) => ({
          name,
          songCount: songs.length,
          songs: songs.sort((a, b) => b.id - a.id), // Sort songs by ID (newest first)
          initials: name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
        })).sort((a, b) => b.songCount - a.songCount);

        setArtists(artistsData);
        setFilteredArtists(artistsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch artists data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter artists based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  }, [artists, searchQuery]);

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

  const selectedArtistData = artists.find(artist => artist.name === selectedArtist);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DynamicIslandNavbar onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-primary/20 rounded-lg w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="glass-card p-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-primary/20 rounded mb-2"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3 mx-auto"></div>
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
      <DynamicIslandNavbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary mr-3 animate-glow" />
              <h1 className="text-5xl font-bold gradient-text">
                {selectedArtist ? selectedArtist : 'Artists'}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              {selectedArtist 
                ? `Explore all songs by ${selectedArtist}` 
                : 'Discover talented artists and their amazing lyrics'
              }
            </p>
          </div>

          {!selectedArtist && (
            <>
              {/* Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card border-primary/30 bg-background/20"
                  />
                </div>
              </div>

              {/* Artists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist, index) => (
                  <Card 
                    key={artist.name}
                    className="glass-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:scale-105"
                    onClick={() => setSelectedArtist(artist.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-6">
                        <Avatar className="w-20 h-20 mx-auto border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                            {artist.initials}
                          </AvatarFallback>
                        </Avatar>
                        {index < 3 && (
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

                      <div className="space-y-1 mb-4">
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
                        <User className="mr-2 h-3 w-3" />
                        View Songs
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArtists.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-2">No artists found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </>
          )}

          {/* Selected Artist View */}
          {selectedArtist && selectedArtistData && (
            <>
              <div className="flex justify-center mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedArtist(null)}
                  className="glass-button border-primary/30"
                >
                  ← Back to All Artists
                </Button>
              </div>

              <div className="text-center mb-8">
                <Avatar className="w-32 h-32 mx-auto border-4 border-primary/30 mb-4">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl font-bold">
                    {selectedArtistData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center text-muted-foreground">
                  <Music className="h-5 w-5 mr-2" />
                  {selectedArtistData.songCount} song{selectedArtistData.songCount !== 1 ? 's' : ''} available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedArtistData.songs.map((lyric) => (
                  <LyricsCard
                    key={lyric.id}
                    lyric={lyric}
                    onView={handleViewLyric}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </>
          )}
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

export default Artists;
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search as SearchIcon, Filter, SortAsc, SortDesc, Music, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import LyricsCard from '@/components/LyricsCard';
import LyricsModal from '@/components/LyricsModal';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import { useToast } from '@/hooks/use-toast';
import { getAllLyrics, searchLyrics, downloadLyric, type Lyric } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

type SortOption = 'title' | 'artist' | 'date' | 'relevance';
type SortDirection = 'asc' | 'desc';

const Search: React.FC = () => {
  const [allLyrics, setAllLyrics] = useState<Lyric[]>([]);
  const [filteredLyrics, setFilteredLyrics] = useState<Lyric[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get unique artists and genres
  const uniqueArtists = [...new Set(allLyrics.map(lyric => lyric.artist_name))].sort();
  const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'Country', 'R&B'];

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const data = await getAllLyrics();
        setAllLyrics(data);
        setFilteredLyrics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch lyrics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [toast]);

  useEffect(() => {
    let results = searchLyrics(allLyrics, searchQuery);

    // Apply filters
    if (selectedArtist) {
      results = results.filter(lyric => lyric.artist_name === selectedArtist);
    }

    if (selectedGenre) {
      // This would need to be implemented in the API/data structure
      // For now, we'll simulate genre filtering
      results = results.filter(() => Math.random() > 0.3); // Simulate filtering
    }

    // Apply sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.song_name.localeCompare(b.song_name);
          break;
        case 'artist':
          comparison = a.artist_name.localeCompare(b.artist_name);
          break;
        case 'date':
          comparison = new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
          break;
        case 'relevance':
        default:
          // Keep original order for relevance
          return 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredLyrics(results);
  }, [allLyrics, searchQuery, selectedArtist, selectedGenre, sortBy, sortDirection]);

  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoading && resultsRef.current && filteredLyrics.length > 0) {
      gsap.fromTo(resultsRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [filteredLyrics, isLoading]);

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

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedArtist('');
    setSortBy('relevance');
    setSortDirection('desc');
  };

  const activeFiltersCount = [selectedGenre, selectedArtist].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      {/* Hero Search Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary-glow/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

        <div ref={searchRef} className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <SearchIcon className="h-12 w-12 text-primary mr-4 animate-glow" />
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">Search</h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find your favorite lyrics from thousands of songs
          </p>

          {/* Main Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs, artists, lyrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg glass-card border-primary/30 bg-background/20 backdrop-blur-md focus:border-primary/50"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button border-primary/30 text-foreground hover:bg-primary/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {filteredLyrics.length} results found
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="py-8 border-t border-primary/10 bg-background/20 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue placeholder="All genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All genres</SelectItem>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Artist</label>
                  <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue placeholder="All artists" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All artists</SelectItem>
                      {uniqueArtists.map(artist => (
                        <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="title">Song Title</SelectItem>
                      <SelectItem value="artist">Artist</SelectItem>
                      <SelectItem value="date">Release Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Order</label>
                  <Button
                    variant="outline"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="w-full glass-button border-primary/30 justify-start"
                  >
                    {sortDirection === 'asc' ? (
                      <SortAsc className="mr-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="mr-2 h-4 w-4" />
                    )}
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedGenre && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Genre: {selectedGenre}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedGenre('')} />
                    </Badge>
                  )}
                  {selectedArtist && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Artist: {selectedArtist}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedArtist('')} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-primary">
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="py-16 relative">
        {/* Background Elements */}
        <div className="absolute top-16 left-16 w-64 h-64 bg-primary/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-primary-glow/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="glass-card p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Searching through lyrics...</p>
              </div>
            </div>
          ) : filteredLyrics.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card p-8 max-w-md mx-auto">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold gradient-text mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 
                    `No lyrics found for "${searchQuery}". Try different keywords or adjust your filters.` :
                    'Start typing to search through our lyrics collection.'
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      <LyricsModal
        lyric={selectedLyric}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Search;

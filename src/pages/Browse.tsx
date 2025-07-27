import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Music, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import LyricsCard from '@/components/LyricsCard';
import LyricsModal from '@/components/LyricsModal';
import { getAllLyrics, searchLyrics, downloadLyric, type Lyric } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Browse = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [filteredLyrics, setFilteredLyrics] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Get selected genre from navigation state
  useEffect(() => {
    if (location.state?.selectedGenre) {
      setSelectedGenre(location.state.selectedGenre.toLowerCase());
    }
  }, [location.state]);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLyrics();
        setLyrics(data);
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

  // Filter and sort lyrics
  useEffect(() => {
    let filtered = searchLyrics(lyrics, searchQuery);

    // Apply genre filter
    if (selectedGenre !== 'all') {
      // Simple genre matching - in a real app, you'd have genre data
      filtered = filtered.filter(lyric => 
        lyric.song_name.toLowerCase().includes(selectedGenre) ||
        lyric.artist_name.toLowerCase().includes(selectedGenre)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.song_name.localeCompare(b.song_name));
        break;
      case 'artist':
        filtered.sort((a, b) => a.artist_name.localeCompare(b.artist_name));
        break;
    }

    setFilteredLyrics(filtered);
  }, [lyrics, searchQuery, selectedGenre, sortBy]);

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

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Browse Lyrics</h1>
            <p className="text-xl text-muted-foreground">
              Discover and explore our complete collection of lyrics
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search songs, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card border-primary/30 bg-background/20"
                  />
                </div>

                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px] glass-card border-primary/30">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-primary/30">
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hip hop">Hip Hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] glass-card border-primary/30">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-primary/30">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="artist">By Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="glass-button"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="glass-button"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredLyrics.length} songs found`}
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-6 bg-primary/20 rounded mb-4"></div>
                  <div className="h-4 bg-primary/10 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/10 rounded"></div>
                    <div className="h-3 bg-primary/10 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLyrics.length === 0 ? (
            <div className="text-center py-16">
              <Music className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">No lyrics found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search or filters' : 'No lyrics available'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
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

export default Browse;
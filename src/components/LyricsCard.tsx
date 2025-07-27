import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Music, Download, Eye, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Lyric {
  id: number;
  song_name: string;
  artist_name: string;
  release_date: string;
  lyrics: string;
}

interface LyricsCardProps {
  lyric: Lyric;
  onView: (lyric: Lyric) => void;
  onDownload: (id: number) => void;
}

const LyricsCard: React.FC<LyricsCardProps> = ({ lyric, onView, onDownload }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation
    gsap.fromTo(card, 
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateLyrics = (lyrics: string, maxLength: number = 150) => {
    if (lyrics.length <= maxLength) return lyrics;
    return lyrics.substring(0, maxLength) + '...';
  };

  return (
    <Card ref={cardRef} className="glass-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-xl font-bold gradient-text group-hover:text-primary transition-colors">
              {lyric.song_name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <User className="h-4 w-4 mr-1" />
              {lyric.artist_name}
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(lyric.release_date)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateLyrics(lyric.lyrics)}
          </p>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          onClick={() => onView(lyric)}
          variant="ghost"
          size="sm"
          className="glass-button flex-1 hover:bg-primary/10 hover:text-primary border-primary/20"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Lyrics
        </Button>
        <Button
          onClick={() => onDownload(lyric.id)}
          variant="ghost"
          size="sm"
          className="glass-button hover:bg-primary/10 hover:text-primary border-primary/20"
        >
          <Download className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LyricsCard;
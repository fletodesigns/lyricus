import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Download, Calendar, User, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Lyric {
  id: number;
  song_name: string;
  artist_name: string;
  release_date: string;
  lyrics: string;
}

interface LyricsModalProps {
  lyric: Lyric | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (id: number) => void;
}

const LyricsModal: React.FC<LyricsModalProps> = ({ lyric, isOpen, onClose, onDownload }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && lyric && contentRef.current) {
      const tl = gsap.timeline();
      
      // Animate the content
      tl.fromTo(contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );

      // Animate lyrics with stagger
      if (lyricsRef.current) {
        const lines = lyricsRef.current.innerHTML.split('\n');
        lyricsRef.current.innerHTML = lines.map(line => `<p class="lyrics-line">${line}</p>`).join('');
        
        gsap.fromTo('.lyrics-line',
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
        );
      }
    }
  }, [isOpen, lyric]);

  if (!lyric) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-hidden">
        <div ref={contentRef}>
          <DialogHeader className="space-y-4 pb-6 border-b border-primary/20">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-bold gradient-text flex items-center">
                  <Music className="h-8 w-8 mr-3 text-primary" />
                  {lyric.song_name}
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  by {lyric.artist_name}
                </DialogDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Released on {formatDate(lyric.release_date)}
                </div>
              </div>
              <Button
                onClick={() => onDownload(lyric.id)}
                className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>

          <div className="custom-scrollbar overflow-y-auto max-h-[60vh] py-6">
            <div ref={lyricsRef} className="space-y-4">
              {lyric.lyrics.split('\n').map((line, index) => (
                <p 
                  key={index} 
                  className="text-foreground leading-relaxed text-lg lyrics-line"
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-primary/20">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Enjoying this song? Share it with friends!
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="glass-button"
                >
                  Close
                </Button>
                <Button
                  onClick={() => onDownload(lyric.id)}
                  className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LyricsModal;
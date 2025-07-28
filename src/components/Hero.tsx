import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Music, Sparkles, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate title
    tl.fromTo(titleRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Animate subtitle
    tl.fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Animate buttons
    tl.fromTo(buttonsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Animate floating icons
    tl.fromTo(iconsRef.current?.children,
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
      "-=0.8"
    );

    // Add floating animation
    gsap.to(iconsRef.current?.children, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.3
    });

  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-primary-dark/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-primary-glow/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Floating Icons */}
      <div ref={iconsRef} className="absolute inset-0 pointer-events-none">
        <Music className="absolute top-20 left-20 h-12 w-12 text-primary/30 animate-float" />
        <Sparkles className="absolute top-40 right-32 h-8 w-8 text-primary-glow/40 animate-float" style={{ animationDelay: '1s' }} />
        <Headphones className="absolute bottom-32 left-40 h-10 w-10 text-primary/25 animate-float" style={{ animationDelay: '3s' }} />
        <Music className="absolute bottom-20 right-20 h-6 w-6 text-primary-glow/35 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text leading-tight"
        >
          lyricus
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Discover, read, and download lyrics from your favorite songs. 
          Experience music in a whole new way with our modern platform.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            <Music className="mr-2 h-5 w-5" />
            Explore Lyrics
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="glass-button border-primary/30 text-foreground hover:bg-primary/10 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Add New Song
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 text-center transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold gradient-text mb-2">10k+</div>
            <div className="text-muted-foreground">Songs Available</div>
          </div>
          <div className="glass-card p-6 text-center transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold gradient-text mb-2">5k+</div>
            <div className="text-muted-foreground">Artists Featured</div>
          </div>
          <div className="glass-card p-6 text-center transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold gradient-text mb-2">100k+</div>
            <div className="text-muted-foreground">Downloads</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
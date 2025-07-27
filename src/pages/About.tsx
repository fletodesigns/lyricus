import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Music, Users, Download, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // Story animation
    if (storyRef.current) {
      gsap.fromTo(storyRef.current.children,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, []);

  const stats = [
    { icon: Music, label: 'Songs', value: '10,000+' },
    { icon: Users, label: 'Artists', value: '5,000+' },
    { icon: Download, label: 'Downloads', value: '100k+' },
    { icon: Heart, label: 'Happy Users', value: '50k+' },
  ];

  const team = [
    { name: 'Alex Chen', role: 'Founder & Developer', initials: 'AC' },
    { name: 'Sarah Kim', role: 'Content Curator', initials: 'SK' },
    { name: 'Mike Johnson', role: 'UI/UX Designer', initials: 'MJ' },
    { name: 'Emma Davis', role: 'Community Manager', initials: 'ED' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={() => {}} searchQuery="" />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div ref={heroRef} className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
                About Lyricus
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                We're passionate about bringing the beauty of music and lyrics to everyone. 
                Our platform celebrates the art of songwriting and connects music lovers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                  <Heart className="mr-2 h-5 w-5" />
                  Join Our Community
                </Button>
                <Button size="lg" variant="outline" className="glass-button border-primary/30">
                  <Music className="mr-2 h-5 w-5" />
                  Explore Lyrics
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-background/50 to-background/30">
          <div className="container mx-auto px-4">
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="glass-card text-center hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4 animate-glow" />
                      <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div ref={storyRef} className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold gradient-text text-center mb-12">Our Story</h2>
              
              <div className="space-y-8">
                <Card className="glass-card">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold gradient-text mb-4">The Beginning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lyricus was born from a simple idea: making beautiful lyrics easily accessible to everyone. 
                      We noticed that while music streaming was revolutionized, finding and reading lyrics remained fragmented. 
                      Our goal was to create a unified, elegant platform for lyrics discovery.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold gradient-text mb-4">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We believe lyrics are poetry set to music. They tell stories, evoke emotions, and connect us to artists and each other. 
                      Our mission is to celebrate this art form by providing a beautiful, intuitive platform where lyrics can be discovered, 
                      appreciated, and shared with the world.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold gradient-text mb-4">Looking Forward</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We're constantly working to improve the Lyricus experience. From advanced search capabilities to 
                      community features and artist collaborations, we're building the future of lyrics platforms. 
                      Join us on this journey to celebrate the beautiful intersection of music and words.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-l from-background/60 to-background/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">
                The passionate people behind Lyricus
              </p>
            </div>

            <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="glass-card text-center hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                      {member.initials}
                    </div>
                    <h3 className="text-lg font-bold gradient-text mb-2">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold gradient-text mb-6">Get In Touch</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button size="lg" variant="outline" className="glass-button border-primary/30">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Button>
              </div>

              <div className="flex justify-center gap-6 mt-8">
                <Button variant="ghost" size="icon" className="glass-button">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass-button">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass-button">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
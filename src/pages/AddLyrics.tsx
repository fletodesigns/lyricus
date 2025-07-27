import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Calendar, User, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import { addLyric, type NewLyric } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AddLyrics = () => {
  const [formData, setFormData] = useState<NewLyric>({
    song_name: '',
    artist_name: '',
    release_date: '',
    lyrics: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof NewLyric, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.song_name || !formData.artist_name || !formData.lyrics) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addLyric(formData);
      
      toast({
        title: "Success",
        description: "Lyrics added successfully!",
      });
      
      // Reset form
      setFormData({
        song_name: '',
        artist_name: '',
        release_date: '',
        lyrics: ''
      });
      
      // Navigate to browse page after a short delay
      setTimeout(() => {
        navigate('/browse');
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lyrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={() => {}} searchQuery="" />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary mr-3 animate-glow" />
              <h1 className="text-4xl font-bold gradient-text">Add New Lyrics</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Share your favorite lyrics with the community
            </p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => navigate('/browse')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </div>

          {/* Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gradient-text">
                <Music className="h-6 w-6 mr-2" />
                Song Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="song_name" className="flex items-center">
                      <Music className="h-4 w-4 mr-2" />
                      Song Title *
                    </Label>
                    <Input
                      id="song_name"
                      type="text"
                      placeholder="Enter song title"
                      value={formData.song_name}
                      onChange={(e) => handleInputChange('song_name', e.target.value)}
                      className="glass-card border-primary/30 bg-background/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artist_name" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Artist Name *
                    </Label>
                    <Input
                      id="artist_name"
                      type="text"
                      placeholder="Enter artist name"
                      value={formData.artist_name}
                      onChange={(e) => handleInputChange('artist_name', e.target.value)}
                      className="glass-card border-primary/30 bg-background/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release_date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Release Date
                  </Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => handleInputChange('release_date', e.target.value)}
                    className="glass-card border-primary/30 bg-background/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lyrics" className="flex items-center">
                    <Music className="h-4 w-4 mr-2" />
                    Lyrics *
                  </Label>
                  <Textarea
                    id="lyrics"
                    placeholder="Enter the song lyrics here...

Verse 1:
...

Chorus:
..."
                    value={formData.lyrics}
                    onChange={(e) => handleInputChange('lyrics', e.target.value)}
                    className="glass-card border-primary/30 bg-background/20 min-h-[300px] custom-scrollbar"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Tip: Use line breaks to separate verses, choruses, and bridges
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full"></div>
                        Adding Lyrics...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Lyrics
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="glass-button border-primary/30"
                    onClick={() => setFormData({
                      song_name: '',
                      artist_name: '',
                      release_date: '',
                      lyrics: ''
                    })}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Adding Lyrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Formatting</h4>
                  <ul className="space-y-1">
                    <li>• Use empty lines to separate sections</li>
                    <li>• Label sections (Verse 1, Chorus, etc.)</li>
                    <li>• Keep original capitalization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Accuracy</h4>
                  <ul className="space-y-1">
                    <li>• Double-check spelling and punctuation</li>
                    <li>• Ensure lyrics match the official version</li>
                    <li>• Include featured artists in the title</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddLyrics;
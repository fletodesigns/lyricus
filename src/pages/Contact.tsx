import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DynamicIslandNavbar from '@/components/DynamicIslandNavbar';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@lyricus.com',
      description: 'Send us an email anytime'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      content: 'Available 24/7',
      description: 'Chat with our support team'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      description: 'Visit our headquarters'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DynamicIslandNavbar onSearch={() => {}} searchQuery="" />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary mr-3 animate-glow" />
              <h1 className="text-5xl font-bold gradient-text">Contact Us</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions, suggestions, or feedback? We'd love to hear from you. 
              Get in touch with our team and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <MessageCircle className="h-6 w-6 mr-2" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <div key={info.title} className="flex items-start space-x-4">
                        <div className="bg-primary/20 rounded-lg p-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{info.title}</h3>
                          <p className="text-primary font-medium">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <Clock className="h-6 w-6 mr-2" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Live Chat</span>
                    <span className="font-medium">Instant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">Same day</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <Send className="h-6 w-6 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="glass-card border-primary/30 bg-background/20"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="glass-card border-primary/30 bg-background/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="glass-card border-primary/30 bg-background/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="glass-card border-primary/30 bg-background/20 min-h-[150px] custom-scrollbar"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="glass-button border-primary/30"
                        onClick={() => setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          message: ''
                        })}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-center gradient-text text-2xl">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How can I add lyrics to Lyricus?</h4>
                      <p className="text-sm text-muted-foreground">
                        Simply visit our "Add Lyrics" page and fill out the form with the song information and lyrics.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Can I download lyrics for offline use?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! Every song page has a download button that generates a beautiful PDF of the lyrics.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Is Lyricus free to use?</h4>
                      <p className="text-sm text-muted-foreground">
                        Absolutely! Lyricus is completely free for everyone to use and enjoy.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How do you ensure lyrics accuracy?</h4>
                      <p className="text-sm text-muted-foreground">
                        Our community helps maintain accuracy through submissions and feedback. We also verify popular songs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
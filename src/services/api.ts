const API_BASE_URL = 'https://lyricus-api.onrender.com/api/lyrics';

export interface Lyric {
  id: number;
  song_name: string;
  artist_name: string;
  release_date: string;
  lyrics: string;
}

export interface NewLyric {
  song_name: string;
  artist_name: string;
  release_date: string;
  lyrics: string;
}

// Get all lyrics
export const getAllLyrics = async (): Promise<Lyric[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch lyrics: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching all lyrics:', error);
    throw error;
  }
};

// Get specific lyric by ID
export const getLyricById = async (id: number): Promise<Lyric> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lyric: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching lyric ${id}:`, error);
    throw error;
  }
};

// Add new lyric
export const addLyric = async (lyric: NewLyric): Promise<Lyric> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lyric),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add lyric: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding lyric:', error);
    throw error;
  }
};

// Download lyric as PDF
export const downloadLyric = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/download/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to download lyric: ${response.statusText}`);
    }
    
    // Get filename from response headers or create default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `lyric-${id}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error(`Error downloading lyric ${id}:`, error);
    throw error;
  }
};

// Search lyrics (client-side filtering)
export const searchLyrics = (lyrics: Lyric[], query: string): Lyric[] => {
  if (!query.trim()) return lyrics;
  
  const searchTerm = query.toLowerCase().trim();
  return lyrics.filter(lyric => 
    lyric.song_name.toLowerCase().includes(searchTerm) ||
    lyric.artist_name.toLowerCase().includes(searchTerm) ||
    lyric.lyrics.toLowerCase().includes(searchTerm)
  );
};
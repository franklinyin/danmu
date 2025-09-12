import React, { useState, useCallback, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ConfigPanel from './components/ConfigPanel';
import { Danmu } from './types';
import { parseDanmuXML } from './utils';

function App() {
  const [danmus, setDanmus] = useState<Danmu[]>([]);
  const [isDanmuEnabled, setIsDanmuEnabled] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddDanmu = useCallback((newDanmus: Danmu[]) => {
    setDanmus(prev => [...prev, ...newDanmus]);
  }, []);

  const handleClearDanmu = useCallback(() => {
    setDanmus([]);
    // Clear danmu elements from DOM
    const danmuContainer = document.querySelector('.danmu-container');
    if (danmuContainer) {
      danmuContainer.innerHTML = '';
    }
  }, []);

  const handleToggleDanmu = useCallback(() => {
    setIsDanmuEnabled(prev => !prev);
  }, []);

  const handleSeek = useCallback(() => {
    // Reset displayed status of all danmus
    setDanmus(prev => prev.map(danmu => ({
      ...danmu,
      displayed: false
    })));
  }, []);


  // Auto-load video URL and mock danmus on page load
  useEffect(() => {
    // Set a default video URL (you can change this to your backend URL)
    setVideoUrl('https://storage.googleapis.com/campaign-assets-void/assets/tutorial/tutorial-draft-1.mov');
    
    // Load danmus from URL automatically
    const loadDanmusFromUrl = async () => {
      try {
        console.log('Loading danmus from URL...');
        // Replace this URL with your Google Cloud Storage URL
        const danmuUrl = 'https://storage.googleapis.com/campaign-assets-void/assets/tutorial/mock_danmus.xml';
        const response = await fetch(danmuUrl);
        const xmlText = await response.text();
        console.log('XML loaded, parsing...');
        const danmus = parseDanmuXML(xmlText);
        console.log('Parsed danmus:', danmus.length, 'danmus loaded');
        console.log('First few danmus:', danmus.slice(0, 5));
        setDanmus(danmus);
      } catch (error) {
        console.error('Failed to load danmus from URL:', error);
        // Fallback: create some test danmus if URL fails
        const fallbackDanmus = [
          {
            time: 2,
            mode: 1,
            fontSize: 25,
            color: 16777215,
            timestamp: Math.floor(Date.now() / 1000),
            pool: 0,
            senderHash: 'fallback1',
            dbID: 'fallback1',
            text: 'AI-Powered Marketing Revolution',
            displayed: false
          },
          {
            time: 5,
            mode: 1,
            fontSize: 25,
            color: 16711680,
            timestamp: Math.floor(Date.now() / 1000),
            pool: 0,
            senderHash: 'fallback2',
            dbID: 'fallback2',
            text: 'Create Stunning Social Media Campaigns',
            displayed: false
          },
          {
            time: 8,
            mode: 4,
            fontSize: 25,
            color: 65280,
            timestamp: Math.floor(Date.now() / 1000),
            pool: 0,
            senderHash: 'fallback3',
            dbID: 'fallback3',
            text: 'Amazing AI technology!',
            displayed: false
          }
        ];
        console.log('Using fallback danmus:', fallbackDanmus.length);
        setDanmus(fallbackDanmus);
      }
    };
    
    loadDanmusFromUrl();
  }, []);

  return (
    <div style={{
      fontFamily: "'Microsoft YaHei', sans-serif",
      backgroundColor: '#f4f4f4',
      margin: 0,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h1>Custom Danmu Video Player</h1>
      
      <VideoPlayer 
        danmus={danmus}
        isDanmuEnabled={isDanmuEnabled}
        onSeek={handleSeek}
        videoUrl={videoUrl}
      />
      
      <ConfigPanel
        onAddDanmu={handleAddDanmu}
        onClearDanmu={handleClearDanmu}
        onToggleDanmu={handleToggleDanmu}
        isDanmuEnabled={isDanmuEnabled}
      />
    </div>
  );
}

export default App;
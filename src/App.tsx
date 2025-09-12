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
    
    // Load mock danmus automatically
    const loadMockDanmus = async () => {
      try {
        console.log('Loading mock danmus...');
        const response = await fetch('/mock_danmus.xml');
        const xmlText = await response.text();
        console.log('XML loaded, parsing...');
        const danmus = parseDanmuXML(xmlText);
        console.log('Parsed danmus:', danmus.length, 'danmus loaded');
        console.log('First few danmus:', danmus.slice(0, 5));
        
        // Add a test danmu that appears immediately
        const testDanmu = {
          time: 0.5,
          mode: 1,
          fontSize: 25,
          color: 16777215,
          timestamp: Math.floor(Date.now() / 1000),
          pool: 0,
          senderHash: 'test123',
          dbID: 'test456',
          text: 'TEST DANMU - System Working!',
          displayed: false
        };
        
        setDanmus([testDanmu, ...danmus]);
      } catch (error) {
        console.error('Failed to load mock danmus:', error);
      }
    };
    
    loadMockDanmus();
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
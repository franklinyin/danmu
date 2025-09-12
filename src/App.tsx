import React, { useState, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ConfigPanel from './components/ConfigPanel';
import { Danmu } from './types';

function App() {
  const [danmus, setDanmus] = useState<Danmu[]>([]);
  const [isDanmuEnabled, setIsDanmuEnabled] = useState(true);

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
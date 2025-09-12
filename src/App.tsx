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
    // 清除DOM中的弹幕元素
    const danmuContainer = document.querySelector('.danmu-container');
    if (danmuContainer) {
      danmuContainer.innerHTML = '';
    }
  }, []);

  const handleToggleDanmu = useCallback(() => {
    setIsDanmuEnabled(prev => !prev);
  }, []);

  const handleSeek = useCallback(() => {
    // 重置所有弹幕的displayed状态
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
      <h1>备份-自定义弹幕视频播放器</h1>
      
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
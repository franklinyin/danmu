import React, { useState } from 'react';
import { Danmu } from '../types';
import { parseDanmuXML } from '../utils';

interface ConfigPanelProps {
  onAddDanmu: (danmus: Danmu[]) => void;
  onClearDanmu: () => void;
  onToggleDanmu: () => void;
  isDanmuEnabled: boolean;
}

export default function ConfigPanel({ 
  onAddDanmu, 
  onClearDanmu, 
  onToggleDanmu, 
  isDanmuEnabled 
}: ConfigPanelProps) {
  const [danmuInput, setDanmuInput] = useState('');

  const loadVideoFile = () => {
    const input = document.getElementById('videoFileInput') as HTMLInputElement;
    input?.click();
  };

  const loadDanmuFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const xmlText = e.target?.result as string;
      const danmus = parseDanmuXML(xmlText);
      onAddDanmu(danmus);
      alert(`成功加载 ${danmus.length} 条弹幕`);
    };
    reader.readAsText(file);
  };

  const addDanmuFromInput = () => {
    const inputText = danmuInput.trim();
    if (!inputText) return;

    const lines = inputText.split('\n');
    const newDanmus: Danmu[] = [];
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        newDanmus.push({
          time: parseFloat(parts[0]),
          mode: parseInt(parts[1]),
          color: parseInt(parts[2]),
          text: parts.slice(3).join(',').trim(),
          fontSize: 25, // 默认大小
          timestamp: Math.floor(Date.now() / 1000),
          pool: 0,
          senderHash: Math.random().toString(16).substr(2, 8),
          dbID: Math.random().toString(16).substr(2, 16),
          displayed: false
        });
      }
    });

    onAddDanmu(newDanmus);
    alert(`成功添加 ${lines.length} 条弹幕`);
    setDanmuInput('');
  };

  return (
    <div style={{
      width: '800px',
      backgroundColor: '#fff',
      padding: '15px',
      marginTop: '20px',
      borderRadius: '4px',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          视频文件:
        </label>
        <button
          onClick={loadVideoFile}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer'
          }}
        >
          选择视频文件
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          添加弹幕 (格式: 时间(秒),模式,颜色,内容):
        </label>
        <textarea
          value={danmuInput}
          onChange={(e) => setDanmuInput(e.target.value)}
          placeholder="例如: 10,1,16777215,这是一条弹幕"
          style={{
            width: '100%',
            height: '100px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <small>模式: 1=滚动 4=底部 5=顶部 | 颜色: 十进制RGB值(如16777215=白色)</small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          或上传弹幕XML文件:
        </label>
        <input
          type="file"
          accept=".xml"
          onChange={loadDanmuFile}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px'
      }}>
        <div>
          <button
            onClick={addDanmuFromInput}
            style={{
              backgroundColor: '#00a1d6',
              color: 'white',
              padding: '8px 15px',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0087b0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00a1d6'}
          >
            添加弹幕
          </button>
          <button
            onClick={onClearDanmu}
            style={{
              backgroundColor: '#00a1d6',
              color: 'white',
              padding: '8px 15px',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0087b0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00a1d6'}
          >
            清除弹幕
          </button>
        </div>
        <div>
          <button
            onClick={onToggleDanmu}
            style={{
              backgroundColor: '#00a1d6',
              color: 'white',
              padding: '8px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0087b0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00a1d6'}
          >
            {isDanmuEnabled ? '弹幕开' : '弹幕关'}
          </button>
        </div>
      </div>
    </div>
  );
}
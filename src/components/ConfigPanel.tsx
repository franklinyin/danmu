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
      alert(`Successfully loaded ${danmus.length} danmus`);
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
          fontSize: 25, // Default size
          timestamp: Math.floor(Date.now() / 1000),
          pool: 0,
          senderHash: Math.random().toString(16).substr(2, 8),
          dbID: Math.random().toString(16).substr(2, 16),
          displayed: false
        });
      }
    });

    onAddDanmu(newDanmus);
    alert(`Successfully added ${lines.length} danmus`);
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
          Video File:
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
          Select Video File
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          Add Danmu (Format: time(seconds),mode,color,content):
        </label>
        <textarea
          value={danmuInput}
          onChange={(e) => setDanmuInput(e.target.value)}
          placeholder="Example: 10,1,16777215,This is a danmu"
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
        <small>Mode: 1=scroll 4=bottom 5=top | Color: decimal RGB value (e.g. 16777215=white)</small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          Or upload danmu XML file:
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
            Add Danmu
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
            Clear Danmu
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
            {isDanmuEnabled ? 'Danmu On' : 'Danmu Off'}
          </button>
        </div>
      </div>
    </div>
  );
}
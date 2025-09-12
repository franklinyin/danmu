import React, { useEffect, useRef } from 'react';
import { Danmu, DanmuElement } from '../types';

interface DanmuContainerProps {
  danmus: Danmu[];
  currentTime: number;
  isEnabled: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function DanmuContainer({ 
  danmus, 
  currentTime, 
  isEnabled, 
  containerRef 
}: DanmuContainerProps) {
  const renderingRef = useRef(false);

  useEffect(() => {
    if (!isEnabled || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Clear inactive danmus
    const oldDanmus = container.querySelectorAll('.danmu') as NodeListOf<DanmuElement>;
    oldDanmus.forEach(danmu => {
      if (!danmu.isActive) {
        danmu.remove();
      }
    });

    // Check danmus at current time
    danmus.forEach(danmu => {
      if (Math.abs(danmu.time - currentTime) < 0.1 && !danmu.displayed) {
        danmu.displayed = true;
        
        // Create danmu element
        const danmuElement = document.createElement('div') as DanmuElement;
        danmuElement.className = 'danmu';
        danmuElement.textContent = danmu.text;
        danmuElement.style.cssText = `
          position: absolute;
          white-space: nowrap;
          font-size: ${danmu.fontSize}px;
          text-shadow: 1px 1px 2px #000;
          pointer-events: none;
          user-select: none;
          will-change: transform;
          color: #${danmu.color.toString(16).padStart(6, '0')};
        `;
        
        // Set danmu position and animation based on mode
        switch (danmu.mode) {
          case 1: // Scrolling danmu
            danmuElement.style.top = `${Math.random() * (containerHeight - danmu.fontSize)}px`;
            danmuElement.style.left = `${containerWidth}px`;
            danmuElement.isActive = true;
            
            container.appendChild(danmuElement);
            
            // Get danmu width
            const danmuWidth = danmuElement.offsetWidth;
            
            // Animation
            const duration = Math.max(5, 10 - (danmuWidth / containerWidth) * 5);
            danmuElement.style.transition = `transform ${duration}s linear`;
            danmuElement.style.transform = `translateX(-${containerWidth + danmuWidth}px)`;
            
            setTimeout(() => {
              danmuElement.isActive = false;
            }, duration * 1000);
            break;
            
          case 4: // Bottom fixed danmu
            danmuElement.style.bottom = '10px';
            danmuElement.style.left = '50%';
            danmuElement.style.transform = 'translateX(-50%)';
            danmuElement.isActive = true;
            
            container.appendChild(danmuElement);
            
            setTimeout(() => {
              danmuElement.isActive = false;
            }, 3000);
            break;
            
          case 5: // Top fixed danmu
            danmuElement.style.top = '10px';
            danmuElement.style.left = '50%';
            danmuElement.style.transform = 'translateX(-50%)';
            danmuElement.isActive = true;
            
            container.appendChild(danmuElement);
            
            setTimeout(() => {
              danmuElement.isActive = false;
            }, 3000);
            break;
        }
      }
    });
  }, [currentTime, danmus, isEnabled, containerRef]);

  return (
    <div 
      ref={containerRef}
      className="danmu-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 54px)',
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '4px 4px 0 0',
        opacity: isEnabled ? 1 : 0
      }}
    />
  );
}
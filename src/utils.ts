// Format time (seconds -> MM:SS)
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Parse danmu XML
export function parseDanmuXML(xmlText: string): any[] {
  const danmuRegex = /<d p="([^"]+)">([^<]+)<\/d>/g;
  let match;
  const danmus = [];
  
  while ((match = danmuRegex.exec(xmlText)) !== null) {
    const params = match[1].split(',');
    const text = match[2].trim();
    
    if (params.length >= 8 && text) {
      danmus.push({
        time: parseFloat(params[0]),
        mode: parseInt(params[1]),
        fontSize: parseInt(params[2]),
        color: parseInt(params[3]),
        timestamp: parseInt(params[4]),
        pool: parseInt(params[5]),
        senderHash: params[6],
        dbID: params[7],
        text: text,
        displayed: false
      });
    }
  }
  
  return danmus;
}
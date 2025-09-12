#!/usr/bin/env python3
"""
Danmu Sorter - Sorts danmu XML file by timestamp
"""

import re
import sys
from typing import List, Tuple

def parse_danmu_line(line: str) -> Tuple[float, str]:
    """Parse a danmu line and extract timestamp and full line"""
    # Match the pattern: <d p="timestamp,other_params">content</d>
    match = re.match(r'<d p="([0-9.]+),', line.strip())
    if match:
        timestamp = float(match.group(1))
        return timestamp, line.strip()
    else:
        # If no timestamp found, return 0 for sorting purposes
        return 0.0, line.strip()

def sort_danmu_file(input_file: str, output_file: str = None):
    """Sort danmu file by timestamp"""
    if output_file is None:
        output_file = input_file.replace('.xml', '_sorted.xml')
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Extract header and footer
        header_lines = []
        danmu_lines = []
        footer_lines = []
        
        in_danmu_section = False
        
        for line in lines:
            if line.strip() == '<i>':
                in_danmu_section = True
                header_lines.append(line)
            elif line.strip() == '</i>':
                in_danmu_section = False
                footer_lines.append(line)
            elif in_danmu_section and line.strip().startswith('<d '):
                danmu_lines.append(line)
            else:
                if in_danmu_section:
                    danmu_lines.append(line)
                else:
                    header_lines.append(line)
        
        # Sort danmu lines by timestamp
        danmu_with_timestamps = []
        for line in danmu_lines:
            if line.strip().startswith('<d '):
                timestamp, full_line = parse_danmu_line(line)
                danmu_with_timestamps.append((timestamp, full_line))
            else:
                # Keep non-danmu lines at the beginning
                danmu_with_timestamps.append((0.0, line.strip()))
        
        # Sort by timestamp
        danmu_with_timestamps.sort(key=lambda x: x[0])
        
        # Write sorted file
        with open(output_file, 'w', encoding='utf-8') as f:
            # Write header
            for line in header_lines:
                f.write(line)
            
            # Write sorted danmu lines
            for timestamp, line in danmu_with_timestamps:
                f.write(line + '\n')
            
            # Write footer
            for line in footer_lines:
                f.write(line)
        
        print(f"✅ Successfully sorted danmu file!")
        print(f"📁 Input:  {input_file}")
        print(f"📁 Output: {output_file}")
        print(f"📊 Total danmu entries: {len([x for x in danmu_with_timestamps if x[1].startswith('<d ')])}")
        
        # Show time range
        timestamps = [x[0] for x in danmu_with_timestamps if x[0] > 0]
        if timestamps:
            print(f"⏰ Time range: {min(timestamps):.1f}s - {max(timestamps):.1f}s")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found!")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python sort_danmu.py <input_file> [output_file]")
        print("Example: python sort_danmu.py mock_danmus.xml")
        print("Example: python sort_danmu.py mock_danmus.xml sorted_danmus.xml")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    sort_danmu_file(input_file, output_file)

if __name__ == "__main__":
    main()

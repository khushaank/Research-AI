import os
import json
import datetime
from pathlib import Path

# Configuration
ASSET_DIR = "assets/research"
OUTPUT_FILE = "research_manifest.json"
ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'}

def scan_directory(directory):
    items = []
    # Convert directory to Path object for easier handling
    base_path = Path(directory)
    
    if not base_path.exists():
        os.makedirs(base_path)
        print(f"Created directory: {base_path}")
        return items

    for file_path in base_path.glob('**/*'):
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
            # Get relative path for web access
            relative_path = file_path.relative_to(Path("."))
            # Ensure forward slashes for web URLs regardless of OS
            web_path = str(relative_path).replace(os.sep, '/')
            
            # Simple metadata extraction
            name = file_path.stem.replace('_', ' ').title()
            file_type = 'pdf' if file_path.suffix.lower() == '.pdf' else 'image'
            
            # Get file stats
            stats = file_path.stat()
            created = datetime.datetime.fromtimestamp(stats.st_ctime).isoformat()
            
            items.append({
                "id": str(hash(web_path)),
                "title": name,
                "type": file_type,
                "path": web_path,
                "date": created,
                "description": f"Research document: {name}"
            })
            
    # Sort by date (newest first)
    items.sort(key=lambda x: x['date'], reverse=True)
    return items

def main():
    print("Scanning for research documents...")
    items = scan_directory(ASSET_DIR)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2)
        
    print(f"Index generated! Found {len(items)} items.")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

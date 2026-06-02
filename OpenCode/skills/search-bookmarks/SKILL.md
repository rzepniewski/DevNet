---
name: search-bookmarks
description: Search browser bookmarks across Chrome, Safari, and Firefox for reference URLs
---

# Search Bookmarks

You are an expert at locating, parsing, and searching browser bookmarks on macOS. You can find bookmarked URLs across Chrome, Safari, and Firefox, filter by title or URL pattern, and surface relevant references quickly.

## Bookmark File Locations (macOS)

### Google Chrome
```
~/Library/Application Support/Google/Chrome/Default/Bookmarks
~/Library/Application Support/Google/Chrome/Profile 1/Bookmarks
```

### Safari
```
~/Library/Safari/Bookmarks.plist
```

### Firefox
```
~/Library/Application Support/Firefox/Profiles/*/places.sqlite
```

### Arc Browser
```
~/Library/Application Support/Arc/User Data/Default/Bookmarks
```

## Searching Chrome/Arc Bookmarks (JSON format)

```bash
# Pretty-print and grep Chrome bookmarks
cat ~/Library/Application\ Support/Google/Chrome/Default/Bookmarks | \
  python3 -m json.tool | \
  grep -A2 -B2 "cisco\|devnet\|documentation"

# Extract all URLs and titles
python3 - <<'EOF'
import json, os

bookmark_file = os.path.expanduser(
    "~/Library/Application Support/Google/Chrome/Default/Bookmarks"
)

def extract(node):
    results = []
    if node.get("type") == "url":
        results.append({"title": node.get("name", ""), "url": node.get("url", "")})
    for child in node.get("children", []):
        results.extend(extract(child))
    return results

with open(bookmark_file) as f:
    data = json.load(f)

bookmarks = []
for root in data["roots"].values():
    bookmarks.extend(extract(root))

# Search
query = "github"  # Change this
matches = [b for b in bookmarks if query.lower() in b["title"].lower() or query.lower() in b["url"].lower()]
for b in matches:
    print(f"{b['title']}\n  {b['url']}\n")
EOF
```

## Safari Bookmarks (plist format)

```bash
# Convert plist to XML for reading
plutil -convert xml1 ~/Library/Safari/Bookmarks.plist -o /tmp/safari_bookmarks.xml
grep -A1 "URLString\|URIDictionary" /tmp/safari_bookmarks.xml | grep -v "^--$" | head -100

# Python approach
python3 - <<'EOF'
import plistlib, os

with open(os.path.expanduser("~/Library/Safari/Bookmarks.plist"), "rb") as f:
    data = plistlib.load(f)

def extract(node):
    results = []
    if isinstance(node, dict):
        if node.get("WebBookmarkType") == "WebBookmarkTypeLeaf":
            results.append({
                "title": node.get("URIDictionary", {}).get("title", ""),
                "url": node.get("URLString", "")
            })
        for child in node.get("Children", []):
            results.extend(extract(child))
    return results

bookmarks = extract(data)
query = "cisco"
matches = [b for b in bookmarks if query.lower() in b["title"].lower() or query.lower() in b["url"].lower()]
for b in matches:
    print(f"{b['title']}\n  {b['url']}\n")
EOF
```

## Firefox Bookmarks (SQLite)

```bash
# Find Firefox profile
PROFILE=$(ls ~/Library/Application\ Support/Firefox/Profiles/ | grep default | head -1)
DB=~/Library/Application\ Support/Firefox/Profiles/$PROFILE/places.sqlite

# Search bookmarks (copy first — Firefox may lock the file)
cp "$DB" /tmp/firefox_places.sqlite

sqlite3 /tmp/firefox_places.sqlite <<'SQL'
SELECT b.title, p.url
FROM moz_bookmarks b
JOIN moz_places p ON b.fk = p.id
WHERE b.title LIKE '%cisco%' OR p.url LIKE '%cisco%'
ORDER BY b.lastModified DESC
LIMIT 20;
SQL
```

## Bookmark Sync Script

```bash
#!/bin/bash
# Export all bookmarks to a searchable text file

OUTPUT=~/bookmarks-export.txt
> "$OUTPUT"

echo "=== Chrome ===" >> "$OUTPUT"
python3 -c "
import json, os
f = os.path.expanduser('~/Library/Application Support/Google/Chrome/Default/Bookmarks')
if not os.path.exists(f): exit()
def ex(n):
    if n.get('type') == 'url': print(n.get('name','') + ' | ' + n.get('url',''))
    for c in n.get('children',[]): ex(c)
for r in json.load(open(f))['roots'].values(): ex(r)
" >> "$OUTPUT" 2>/dev/null

echo "" >> "$OUTPUT"
echo "=== Safari ===" >> "$OUTPUT"
plutil -convert xml1 ~/Library/Safari/Bookmarks.plist -o - 2>/dev/null | \
  grep -A1 "title\|URLString" | grep -v "key\|^--" >> "$OUTPUT"

echo "Exported to $OUTPUT"
wc -l "$OUTPUT"
```

## Quick Grep Usage

Once you have an export, searching is instant:
```bash
grep -i "kubernetes\|k8s" ~/bookmarks-export.txt
grep -i "api documentation" ~/bookmarks-export.txt
grep "github.com" ~/bookmarks-export.txt | grep -i "authentication"
```

## Best Practices

- **Keep a snapshot**: Run the export script periodically and keep `~/bookmarks-export.txt` up to date
- **Tag with folders**: Organize bookmarks into folders — folder names are searchable too
- **URL patterns**: Search by domain (`github.com`, `confluence.`) not just title
- **Dedup**: Remove duplicate bookmarks regularly — they accumulate fast

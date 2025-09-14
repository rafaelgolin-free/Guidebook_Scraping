# Hostfully Content Scraper

A Puppeteer-based web scraper that extracts content from the `guest-print-preview` element on the Hostfully print page.

## Features

- 🎯 Targets specific element by ID (`guest-print-preview`)
- ⏳ Waits for element to load properly
- 📄 Extracts both text and HTML content
- 💾 Saves content to timestamped files
- 🛡️ Includes error handling and timeout management
- 🚀 Configurable browser options

## Installation

1. Install Node.js (if not already installed)
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage

```bash
npm start
```

### Or run directly:

```bash
node scraper.js
```

## Output

The script will:

1. Open a browser window (set `headless: true` in the script for background operation)
2. Navigate to `https://v2.hostfully.com/gmfftsx/print`
3. Wait for the `guest-print-preview` element to load
4. Extract the content
5. Save the content to timestamped files:
   - `hostfully-content-[timestamp].txt` (plain text)
   - `hostfully-content-[timestamp].html` (HTML content)

## Configuration

You can modify the script to:

- Change browser settings (headless mode, viewport, etc.)
- Adjust timeout values
- Modify the target URL or element selector
- Change output file formats

## Error Handling

The script includes comprehensive error handling for:

- Network timeouts
- Element not found
- Browser launch issues
- Page load failures

## Requirements

- Node.js 14+
- Puppeteer 21+
- Internet connection

## Notes

- The script uses a realistic user agent to avoid detection
- Browser arguments are optimized for compatibility
- Content is extracted in multiple formats (text, HTML)
- Files are saved with timestamps to avoid overwrites


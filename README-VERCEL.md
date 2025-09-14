# Hostfully Scraper - Vercel Deployment

This project can be deployed to Vercel as a serverless API endpoint.

## How to Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Deploy the project**:

   ```bash
   vercel
   ```

3. **Follow the prompts** to link your project to Vercel.

## How to Use the API

Once deployed, you can call the scraper in several ways:

### 1. Direct HTTP Request

```bash
curl https://your-app-name.vercel.app/api/scrape
```

### 2. From JavaScript/Node.js

```javascript
const response = await fetch("https://your-app-name.vercel.app/api/scrape");
const data = await response.json();
console.log(data.data.innerText);
```

### 3. From a Web Browser

Simply visit: `https://your-app-name.vercel.app/api/scrape`

### 4. From a Webhook/External Service

You can trigger the scraper from:

- Zapier
- IFTTT
- GitHub Actions
- Any service that can make HTTP requests

## API Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    "innerText": "Extracted text content...",
    "innerHTML": "<div>HTML content...</div>",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Limitations

- **Execution Time**: Limited to 30 seconds (configurable in vercel.json)
- **Memory**: Limited memory allocation for browser processes
- **Cold Starts**: First request may be slower due to serverless cold start
- **Rate Limits**: Vercel has rate limits on serverless functions

## Local Development

To test the API locally:

```bash
# Install dependencies
npm install

# Run the local development server
vercel dev
```

Then visit: `http://localhost:3000/api/scrape`

## Environment Variables

You can add environment variables in the Vercel dashboard if needed for configuration.

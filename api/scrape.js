const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET and POST requests
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let browser;

  try {
    console.log("🚀 Starting browser on Vercel...");

    // Launch browser with Vercel-compatible settings
    browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("📄 Navigating to the target page...");

    // Navigate to the target URL
    await page.goto("https://v2.hostfully.com/gmfftsx/print", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log("⏳ Waiting for the guest-print-preview element...");

    // Wait for the specific element to be present
    await page.waitForSelector("#guest-print-preview", {
      timeout: 10000,
    });

    console.log("✅ Element found! Extracting content...");

    // Extract the content from the element
    const content = await page.evaluate(() => {
      const element = document.getElementById("guest-print-preview");
      if (!element) {
        return null;
      }

      // Get different types of content
      return {
        innerHTML: element.innerHTML,
        innerText: element.innerText,
        textContent: element.textContent,
        outerHTML: element.outerHTML,
      };
    });

    if (content) {
      console.log("📋 Content extracted successfully!");

      // Return the content as JSON
      return res.status(200).json({
        success: true,
        data: {
          innerText: content.innerText,
          innerHTML: content.innerHTML,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      console.log(
        '❌ Element with ID "guest-print-preview" not found or has no content'
      );
      return res.status(404).json({
        success: false,
        error: "Element not found or has no content",
      });
    }
  } catch (error) {
    console.error("❌ Error occurred:", error.message);

    let errorMessage = "An error occurred while scraping";
    if (error.message.includes("timeout")) {
      errorMessage =
        "The page took too long to load or the element might not exist";
    } else if (error.message.includes("net::ERR_")) {
      errorMessage = "Network error - check your internet connection";
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message,
    });
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }
  }
}

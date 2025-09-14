const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const path = require("path");

async function scrapeHostfullyContent() {
  let browser;

  try {
    console.log("🚀 Starting browser...");

    // Try to get chromium path with fallback
    let executablePath;
    try {
      executablePath = chromium.path;
      console.log("📍 Chromium path:", executablePath);

      // If chromium.path is undefined, try alternative methods
      if (!executablePath) {
        console.log("⚠️ chromium.path is undefined, trying alternative...");
        // Try to find chromium in node_modules
        const chromiumPath = path.join(
          __dirname,
          "node_modules",
          "chromium",
          "bin",
          "chromium.exe"
        );
        if (require("fs").existsSync(chromiumPath)) {
          executablePath = chromiumPath;
          console.log("📍 Found chromium at:", executablePath);
        } else {
          // Use system Chrome as fallback
          executablePath =
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
          console.log("📍 Using system Chrome as fallback:", executablePath);
        }
      }
    } catch (error) {
      console.log("⚠️ Error getting chromium path:", error.message);
      // Use system Chrome as fallback
      executablePath =
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      console.log("📍 Using system Chrome as fallback:", executablePath);
    }

    // Launch browser with options for better compatibility
    browser = await puppeteer.launch({
      headless: true, // Set to true for headless mode
      executablePath: executablePath,
      defaultViewport: null,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
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
      return content.innerText;
    } else {
      console.log(
        '❌ Element with ID "guest-print-preview" not found or has no content'
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error occurred:", error.message);

    if (error.message.includes("timeout")) {
      console.log(
        "💡 The page might be taking too long to load or the element might not exist"
      );
    } else if (error.message.includes("net::ERR_")) {
      console.log("💡 Network error - check your internet connection");
    }

    return null;
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }
  }
}

// Run the scraper
if (require.main === module) {
  scrapeHostfullyContent()
    .then((result) => {
      if (result) {
        console.log(result);
        console.log("\n✅ Scraping completed successfully!");
        return result;
      } else {
        console.log("\n❌ Scraping failed or no content found");
        process.exit(1);
        return null;
      }
    })
    .catch((error) => {
      console.error("💥 Unexpected error:", error);
      process.exit(1);
    });
}

module.exports = { scrapeHostfullyContent };

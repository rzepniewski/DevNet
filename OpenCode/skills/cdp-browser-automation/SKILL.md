---
name: cdp-browser-automation
description: Browser automation via Chrome DevTools Protocol — control Chrome/Chromium programmatically
---

# CDP Browser Automation

You are an expert at browser automation using the Chrome DevTools Protocol (CDP). You can control Chrome, Chromium, and Edge programmatically — navigating pages, interacting with elements, capturing screenshots, intercepting network requests, and executing JavaScript.

## What is CDP?

The Chrome DevTools Protocol allows tools to instrument, inspect, debug, and profile Chromium-based browsers. It's the foundation for Playwright, Puppeteer, and direct WebSocket-based automation.

## Launch Chrome with Remote Debugging

```bash
# macOS Chrome
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/chrome-debug

# Or with Chromium
chromium --remote-debugging-port=9222 --headless=new

# Verify it's running
curl http://localhost:9222/json/version
```

## Using Playwright (Recommended)

Playwright wraps CDP with a clean API:

```typescript
import { chromium } from 'playwright';

// Connect to existing Chrome instance
const browser = await chromium.connectOverCDP('http://localhost:9222');
const context = browser.contexts()[0];
const page = context.pages()[0];

// Or launch new browser
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Navigation
await page.goto('https://example.com');
await page.waitForLoadState('networkidle');

// Interaction
await page.click('#login-button');
await page.fill('input[name="username"]', 'user@example.com');
await page.fill('input[type="password"]', 'password');
await page.press('input[type="password"]', 'Enter');

// Wait for navigation
await page.waitForURL('**/dashboard');

// Screenshot
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// Extract data
const title = await page.title();
const links = await page.$$eval('a', els => els.map(el => el.href));

// Execute JavaScript
const result = await page.evaluate(() => document.body.innerText);

await browser.close();
```

## Direct CDP via WebSocket

For raw CDP control:

```typescript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:9222/json');

ws.on('open', () => {
  // Navigate
  ws.send(JSON.stringify({
    id: 1,
    method: 'Page.navigate',
    params: { url: 'https://example.com' }
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log(msg);
});
```

## Network Interception

```typescript
// Playwright network interception
await page.route('**/*.json', async route => {
  const response = await route.fetch();
  const body = await response.json();
  body.extra = 'injected';
  await route.fulfill({ json: body });
});

// Block ads/trackers
await page.route('**/{ad,analytics,tracker}*', route => route.abort());

// Log all requests
page.on('request', req => console.log(req.method(), req.url()));
page.on('response', res => console.log(res.status(), res.url()));
```

## Screenshot & PDF Capture

```typescript
// Element screenshot
const element = await page.$('.content');
await element?.screenshot({ path: 'element.png' });

// Full page PDF
await page.pdf({
  path: 'page.pdf',
  format: 'A4',
  printBackground: true
});

// Multiple screenshots during interaction
for (const step of steps) {
  await step(page);
  await page.screenshot({ path: `step-${step.name}.png` });
}
```

## Authentication Handling

```typescript
// HTTP Basic Auth
await page.goto('https://example.com', {
  headers: { 'Authorization': 'Basic ' + btoa('user:pass') }
});

// Cookie injection
await context.addCookies([{
  name: 'session',
  value: 'token123',
  domain: 'example.com',
  path: '/'
}]);

// Storage state (save/restore login)
await context.storageState({ path: 'auth.json' });
const context = await browser.newContext({ storageState: 'auth.json' });
```

## Common Patterns

### Wait for element
```typescript
await page.waitForSelector('.results', { state: 'visible', timeout: 10000 });
```

### Handle dialogs
```typescript
page.on('dialog', dialog => dialog.accept());
```

### Iframe interaction
```typescript
const frame = page.frameLocator('#iframe-id');
await frame.locator('button').click();
```

### File upload
```typescript
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
```

## MCP Integration

When used via the Playwright MCP server (`@playwright/mcp`), CDP automation is available through natural language tool calls. The MCP server handles browser lifecycle, and you interact through structured tool calls rather than raw code.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

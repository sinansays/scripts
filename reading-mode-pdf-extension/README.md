# Reading Mode Print to PDF (Chrome Extension, MV3)

A minimal Chrome extension that adds a floating **"📄 Print Reading Mode to PDF"** button when a Reading Mode-like pane is detected on the page.

## What it does

1. Detects Reading Mode pane candidates using multiple selectors and heuristics (including shadow DOM scanning).
2. Shows a fixed top-right print button only when Reading Mode is detected.
3. On click, extracts clean content from the detected pane.
4. Opens a temporary print window with print-friendly styling.
5. Calls `window.print()` automatically and closes after printing.

If direct extraction fails (Chrome internals may be inaccessible in some builds), the extension offers a **manual paste fallback** so you can still quickly print/save as PDF.

## Install (Load unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `reading-mode-pdf-extension/`.

## Usage

1. Open a webpage and enable Chrome Reading Mode (side pane).
2. When detected, click **📄 Print Reading Mode to PDF**.
3. In the print dialog, choose **Save as PDF** (Chrome often remembers this choice if already used).

### Manual fallback mode

If the button does not appear due to Chrome UI isolation in your version:

- Press **Alt+Shift+P** to force-toggle the button visibility for this tab.
- Click the button and paste Reading Mode text when prompted.

(() => {
  if (window.__readingModePdfExtensionLoaded) return;
  window.__readingModePdfExtensionLoaded = true;

  const BUTTON_ID = 'rm-print-pdf-button';
  const MANUAL_FLAG_KEY = '__rmPrintManualMode';

  const state = {
    readingRoot: null,
    readingModeDetected: false,
    observer: null,
  };

  function createButton() {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.textContent = '📄 Print Reading Mode to PDF';
    button.style.position = 'fixed';
    button.style.top = '16px';
    button.style.right = '16px';
    button.style.zIndex = '2147483647';
    button.style.padding = '10px 14px';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.background = '#1a73e8';
    button.style.color = '#fff';
    button.style.font = '600 13px/1.2 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.22)';
    button.style.cursor = 'pointer';
    button.style.display = 'none';
    button.title = 'Extract Reading Mode content and open print dialog';

    button.addEventListener('mouseenter', () => {
      button.style.background = '#1558b0';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = '#1a73e8';
    });

    button.addEventListener('click', onPrintClick);
    document.documentElement.appendChild(button);
    return button;
  }

  function getAllRoots() {
    const roots = [document];
    const queue = [document.documentElement];

    while (queue.length) {
      const node = queue.shift();
      if (!node) continue;

      if (node.shadowRoot) {
        roots.push(node.shadowRoot);
        queue.push(...node.shadowRoot.querySelectorAll('*'));
      }

      queue.push(...node.children);
    }

    return roots;
  }

  function findBySelectors(root) {
    const selectors = [
      '#reader-mode-container',
      '#read-anything-app',
      'read-anything-app',
      '.reading-mode',
      '[class*="reading-mode"]',
      '[id*="reader-mode"]',
      '[id*="read-anything"]',
      '[class*="read-anything"]',
      '[aria-label*="Reading mode" i]',
      '[data-testid*="reading" i]'
    ];

    for (const selector of selectors) {
      const found = root.querySelector(selector);
      if (found && found.textContent && found.textContent.trim().length > 120) {
        return found;
      }
    }

    return null;
  }

  function findLikelyReadablePane(root) {
    const candidates = root.querySelectorAll('aside, section, div, article, main');
    let best = null;
    let bestScore = 0;

    candidates.forEach((el) => {
      const text = (el.innerText || '').trim();
      if (text.length < 400) return;

      const idClass = `${el.id || ''} ${(el.className || '').toString()}`.toLowerCase();
      const hasReaderHint = /read|reader|article|mode|summary/.test(idClass) ? 2 : 0;
      const rect = el.getBoundingClientRect();
      const sizeScore = rect.width > 260 && rect.height > 240 ? 2 : 0;
      const densityScore = Math.min(6, Math.floor(text.length / 1000));
      const score = hasReaderHint + sizeScore + densityScore;

      if (score > bestScore) {
        best = el;
        bestScore = score;
      }
    });

    return bestScore >= 4 ? best : null;
  }

  function findReadingModeRoot() {
    const roots = getAllRoots();

    for (const root of roots) {
      const explicit = findBySelectors(root);
      if (explicit) return explicit;
    }

    for (const root of roots) {
      const likely = findLikelyReadablePane(root);
      if (likely) return likely;
    }

    for (const iframe of document.querySelectorAll('iframe')) {
      try {
        const iDoc = iframe.contentDocument;
        if (!iDoc) continue;
        const explicit = findBySelectors(iDoc);
        if (explicit) return explicit;
      } catch (_) {
        // Cross-origin iframe not readable from content script.
      }
    }

    return null;
  }

  function cleanCloneForPrint(source) {
    const clone = source.cloneNode(true);

    clone.querySelectorAll('script, style, noscript, iframe, svg, canvas, video, audio, form, nav, header, footer, aside, button, input, select, textarea, [role="banner"], [role="navigation"], [role="complementary"]').forEach((el) => {
      el.remove();
    });

    clone.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style');
      el.removeAttribute('class');
      el.removeAttribute('id');
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('on') || attr.name.startsWith('data-')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return clone;
  }

  function extractCleanContent() {
    const root = state.readingRoot || findReadingModeRoot();
    if (!root) return null;

    const clone = cleanCloneForPrint(root);
    const textLength = (clone.textContent || '').trim().length;

    if (textLength < 250) {
      const fallback = document.querySelector('article, main, [role="main"]');
      if (fallback) {
        const fallbackClone = cleanCloneForPrint(fallback);
        if ((fallbackClone.textContent || '').trim().length > textLength) {
          return fallbackClone.innerHTML;
        }
      }
    }

    return clone.innerHTML;
  }

  function getManualContentFallback() {
    const input = window.prompt(
      'Reading Mode content could not be accessed directly.\n\n' +
      'Copy text from the Reading Mode pane and paste it here.\n' +
      'Then press OK to print it to PDF.',
      ''
    );

    if (!input || !input.trim()) return null;

    return input
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  }

  function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function openPrintWindow(cleanHtml) {
    const w = window.open('', '_blank', 'noopener,noreferrer,width=960,height=740');
    if (!w) {
      alert('Popup blocked. Please allow popups for this site to print Reading Mode content.');
      return;
    }

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reading Mode Print</title>
  <style>
    @page { margin: 12mm; }
    html, body { background: #fff !important; color: #000 !important; }
    body {
      font: 16px/1.55 Georgia, "Times New Roman", serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }
    * {
      background: transparent !important;
      color: #000 !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    img, picture, video, audio, iframe, nav, aside, footer, header, button { display: none !important; }
    a { color: #000 !important; text-decoration: none !important; }
    p, li, blockquote { orphans: 3; widows: 3; }
    h1, h2, h3, h4 { page-break-after: avoid; }
    @media print {
      body { margin: 0 auto; }
    }
  </style>
</head>
<body>
  <main>${cleanHtml}</main>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 120);
    });

    window.addEventListener('afterprint', () => {
      setTimeout(() => window.close(), 120);
    });

    // Fallback close in case afterprint doesn't fire.
    setTimeout(() => window.close(), 120000);
  <\/script>
</body>
</html>`;

    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function onPrintClick() {
    let cleanContent = extractCleanContent();

    if (!cleanContent) {
      cleanContent = getManualContentFallback();
    }

    if (!cleanContent) {
      alert('No readable content found. Open Reading Mode and try again.');
      return;
    }

    openPrintWindow(cleanContent);
  }

  function updateButtonVisibility() {
    const button = document.getElementById(BUTTON_ID);
    if (!button) return;

    const root = findReadingModeRoot();
    state.readingRoot = root;
    state.readingModeDetected = Boolean(root);

    const manual = sessionStorage.getItem(MANUAL_FLAG_KEY) === '1';
    button.style.display = (state.readingModeDetected || manual) ? 'block' : 'none';
  }

  function observeDomChanges() {
    state.observer = new MutationObserver(() => {
      updateButtonVisibility();
    });

    state.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  function installKeyboardFallback() {
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        const enabled = sessionStorage.getItem(MANUAL_FLAG_KEY) !== '1';
        sessionStorage.setItem(MANUAL_FLAG_KEY, enabled ? '1' : '0');
        updateButtonVisibility();
        alert(
          enabled
            ? 'Manual mode ON: print button forced visible for this tab session.'
            : 'Manual mode OFF: print button only shows when Reading Mode is detected.'
        );
      }
    });
  }

  function init() {
    createButton();
    installKeyboardFallback();
    observeDomChanges();
    updateButtonVisibility();
    setInterval(updateButtonVisibility, 2500);
  }

  init();
})();

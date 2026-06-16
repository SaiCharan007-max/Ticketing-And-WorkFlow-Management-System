// ============================================================
//  Shanks Ticketing API — Premium Swagger UI Configuration
// ============================================================

const CSS = `

/* ── Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── CSS Variables ── */
:root {
  --st-bg:           #0a0c10;
  --st-surface:      #111318;
  --st-surface-2:    #181c24;
  --st-border:       #1e2330;
  --st-border-glow:  #2a3450;
  --st-gold:         #c9a84c;
  --st-gold-dim:     #8a6a28;
  --st-gold-glow:    rgba(201,168,76,0.12);
  --st-text:         #e8eaf0;
  --st-muted:        #6b7280;
  --st-code:         #a8c4e8;
  --st-green:        #4ade80;
  --st-red:          #f87171;
  --st-blue:         #60a5fa;
  --st-orange:       #fb923c;
  --st-purple:       #c084fc;
  --st-radius:       8px;
  --st-radius-lg:    12px;
  --st-font:         'Inter', -apple-system, sans-serif;
  --st-mono:         'JetBrains Mono', monospace;
}

/* ── Reset / Base ── */
body,
.swagger-ui {
  background: var(--st-bg) !important;
  font-family: var(--st-font) !important;
  color: var(--st-text) !important;
}

/* ── Hide default top bar ── */
.topbar { display: none !important; }

/* ══════════════════════════════════════════
   CUSTOM HERO HEADER
══════════════════════════════════════════ */
.swagger-ui .information-container {
  background: var(--st-surface) !important;
  border-bottom: 1px solid var(--st-border) !important;
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
  overflow: hidden;
}

/* Animated grid background on hero */
.swagger-ui .information-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--st-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--st-border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
  animation: gridDrift 20s linear infinite;
  pointer-events: none;
}

@keyframes gridDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

/* Gold shimmer bar at top */
.swagger-ui .information-container::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--st-gold-dim) 20%,
    var(--st-gold) 50%,
    var(--st-gold-dim) 80%,
    transparent 100%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,100% { opacity: 0.6; }
  50%      { opacity: 1; }
}

.swagger-ui .information-container .info {
  position: relative;
  z-index: 1;
  padding: 48px 40px 40px !important;
  max-width: 900px;
}

/* Title */
.swagger-ui .information-container .info .title {
  font-family: var(--st-font) !important;
  font-size: 32px !important;
  font-weight: 600 !important;
  color: var(--st-text) !important;
  letter-spacing: -0.5px;
  margin-bottom: 12px !important;
}

/* Animated gold dot before title */
.swagger-ui .information-container .info .title::before {
  content: '⬡';
  color: var(--st-gold);
  margin-right: 12px;
  font-size: 22px;
  vertical-align: middle;
  display: inline-block;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Version badge */
.swagger-ui .information-container .info .title small,
.swagger-ui .info .title small {
  font-size: 11px !important;
  font-weight: 500 !important;
  background: var(--st-gold-glow) !important;
  color: var(--st-gold) !important;
  border: 1px solid var(--st-gold-dim) !important;
  border-radius: 99px !important;
  padding: 3px 10px !important;
  margin-left: 12px !important;
  vertical-align: middle;
  letter-spacing: 0.5px;
}

/* Description text */
.swagger-ui .info p,
.swagger-ui .info .description p {
  color: var(--st-muted) !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
}

/* Contact / license links */
.swagger-ui .info a {
  color: var(--st-gold) !important;
  text-decoration: none !important;
  border-bottom: 1px solid var(--st-gold-dim);
  transition: border-color 0.2s;
}
.swagger-ui .info a:hover {
  border-color: var(--st-gold);
}

/* ══════════════════════════════════════════
   TAG SECTION HEADERS
══════════════════════════════════════════ */
.swagger-ui .opblock-tag {
  background: var(--st-surface) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius-lg) !important;
  padding: 14px 20px !important;
  margin: 24px 0 8px !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;
  cursor: pointer;
}

.swagger-ui .opblock-tag:hover {
  border-color: var(--st-border-glow) !important;
  box-shadow: 0 0 0 1px var(--st-gold-glow) inset !important;
}

.swagger-ui .opblock-tag h3 {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: var(--st-text) !important;
  letter-spacing: -0.2px;
}

.swagger-ui .opblock-tag small {
  color: var(--st-muted) !important;
  font-size: 12px !important;
}

/* Expand/collapse arrow */
.swagger-ui .opblock-tag svg {
  fill: var(--st-muted) !important;
  transition: transform 0.25s;
}
.swagger-ui .opblock-tag.is-open svg {
  fill: var(--st-gold) !important;
}

/* ══════════════════════════════════════════
   OPERATION BLOCKS
══════════════════════════════════════════ */
.swagger-ui .opblock {
  background: var(--st-surface) !important;
  border-radius: var(--st-radius-lg) !important;
  border: 1px solid var(--st-border) !important;
  margin: 6px 0 !important;
  box-shadow: none !important;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.15s !important;
}

.swagger-ui .opblock:hover {
  border-color: var(--st-border-glow) !important;
  transform: translateY(-1px);
}

/* Method colour strips */
.swagger-ui .opblock.opblock-get    { border-left: 3px solid var(--st-blue)   !important; }
.swagger-ui .opblock.opblock-post   { border-left: 3px solid var(--st-green)  !important; }
.swagger-ui .opblock.opblock-put    { border-left: 3px solid var(--st-orange) !important; }
.swagger-ui .opblock.opblock-patch  { border-left: 3px solid var(--st-purple) !important; }
.swagger-ui .opblock.opblock-delete { border-left: 3px solid var(--st-red)    !important; }

/* Opblock summary row */
.swagger-ui .opblock .opblock-summary {
  background: transparent !important;
  border-bottom: none !important;
  padding: 12px 16px !important;
  align-items: center;
}

.swagger-ui .opblock.opblock-is-open .opblock-summary {
  border-bottom: 1px solid var(--st-border) !important;
}

/* Method badges */
.swagger-ui .opblock-summary-method {
  border-radius: var(--st-radius) !important;
  font-family: var(--st-mono) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  min-width: 62px !important;
  text-align: center !important;
  padding: 5px 0 !important;
}

.swagger-ui .opblock.opblock-get    .opblock-summary-method { background: rgba(96,165,250,0.15) !important; color: var(--st-blue)   !important; }
.swagger-ui .opblock.opblock-post   .opblock-summary-method { background: rgba(74,222,128,0.15) !important; color: var(--st-green)  !important; }
.swagger-ui .opblock.opblock-put    .opblock-summary-method { background: rgba(251,146,60,0.15) !important; color: var(--st-orange) !important; }
.swagger-ui .opblock.opblock-patch  .opblock-summary-method { background: rgba(192,132,252,0.15)!important; color: var(--st-purple) !important; }
.swagger-ui .opblock.opblock-delete .opblock-summary-method { background: rgba(248,113,113,0.15)!important; color: var(--st-red)    !important; }

/* Path text */
.swagger-ui .opblock-summary-path {
  font-family: var(--st-mono) !important;
  font-size: 13px !important;
  color: var(--st-text) !important;
}
.swagger-ui .opblock-summary-path__deprecated {
  text-decoration: line-through !important;
  color: var(--st-muted) !important;
}

/* Summary description */
.swagger-ui .opblock-summary-description {
  color: var(--st-muted) !important;
  font-size: 13px !important;
}

/* Expand arrow in summary */
.swagger-ui .opblock-summary svg { fill: var(--st-muted) !important; }
.swagger-ui .opblock.opblock-is-open .opblock-summary svg { fill: var(--st-gold) !important; }

/* ── Operation body ── */
.swagger-ui .opblock-body {
  background: var(--st-surface-2) !important;
}

/* ── Parameters table ── */
.swagger-ui table tbody tr td,
.swagger-ui table thead tr th {
  background: transparent !important;
  border-color: var(--st-border) !important;
  color: var(--st-text) !important;
  font-size: 13px !important;
}
.swagger-ui .parameter__name { color: var(--st-text) !important; font-family: var(--st-mono) !important; font-size: 13px !important; }
.swagger-ui .parameter__type { color: var(--st-muted) !important; font-size: 12px !important; }
.swagger-ui .parameter__in   { color: var(--st-gold-dim) !important; font-size: 11px !important; }
.swagger-ui .parameter__deprecated { color: var(--st-red) !important; font-size: 11px !important; }

/* Required badge */
.swagger-ui .parameter__name.required::after {
  color: var(--st-red) !important;
}

/* ══════════════════════════════════════════
   INPUTS & TEXTAREAS
══════════════════════════════════════════ */
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui input[type=email],
.swagger-ui textarea,
.swagger-ui select {
  background: var(--st-bg) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius) !important;
  color: var(--st-text) !important;
  font-family: var(--st-mono) !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  transition: border-color 0.2s !important;
}
.swagger-ui input:focus,
.swagger-ui textarea:focus {
  border-color: var(--st-gold-dim) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px var(--st-gold-glow) !important;
}

/* ══════════════════════════════════════════
   BUTTONS
══════════════════════════════════════════ */
.swagger-ui .btn {
  font-family: var(--st-font) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border-radius: var(--st-radius) !important;
  border: 1px solid var(--st-border-glow) !important;
  color: var(--st-text) !important;
  background: var(--st-surface) !important;
  padding: 7px 16px !important;
  transition: all 0.18s !important;
  cursor: pointer;
}
.swagger-ui .btn:hover {
  border-color: var(--st-gold-dim) !important;
  background: var(--st-gold-glow) !important;
}

.swagger-ui .btn.execute {
  background: var(--st-gold) !important;
  border-color: var(--st-gold) !important;
  color: #0a0c10 !important;
  font-weight: 600 !important;
}
.swagger-ui .btn.execute:hover {
  background: #d4b063 !important;
  box-shadow: 0 0 16px var(--st-gold-glow) !important;
}

.swagger-ui .btn.cancel {
  border-color: var(--st-red) !important;
  color: var(--st-red) !important;
}
.swagger-ui .btn.cancel:hover {
  background: rgba(248,113,113,0.08) !important;
}

.swagger-ui .btn.authorize {
  border-color: var(--st-gold) !important;
  color: var(--st-gold) !important;
  background: var(--st-gold-glow) !important;
}
.swagger-ui .btn.authorize svg { fill: var(--st-gold) !important; }
.swagger-ui .btn.authorize:hover {
  background: rgba(201,168,76,0.2) !important;
}

/* ══════════════════════════════════════════
   RESPONSES
══════════════════════════════════════════ */
.swagger-ui .responses-inner {
  background: var(--st-surface-2) !important;
  border-top: 1px solid var(--st-border) !important;
}

.swagger-ui .response-col_status { color: var(--st-text) !important; font-family: var(--st-mono) !important; }

/* Status code colours */
.swagger-ui .response-col_status .response-undocumented { color: var(--st-muted) !important; }

/* Code / response body */
.swagger-ui .microlight,
.swagger-ui code,
.swagger-ui pre {
  background: var(--st-bg) !important;
  color: var(--st-code) !important;
  font-family: var(--st-mono) !important;
  font-size: 12.5px !important;
  border-radius: var(--st-radius) !important;
  border: 1px solid var(--st-border) !important;
}

/* Highlight colours inside microlight */
.swagger-ui .microlight .number,
.swagger-ui .microlight .string  { color: #86efac !important; }
.swagger-ui .microlight .keyword { color: var(--st-purple) !important; }
.swagger-ui .microlight .comment { color: var(--st-muted) !important; }

/* ══════════════════════════════════════════
   MODELS / SCHEMAS
══════════════════════════════════════════ */
.swagger-ui section.models {
  background: var(--st-surface) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius-lg) !important;
  margin-top: 32px !important;
}

.swagger-ui section.models h4 {
  color: var(--st-text) !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid var(--st-border) !important;
  margin: 0 !important;
}

.swagger-ui .model-box {
  background: var(--st-surface-2) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius) !important;
}

.swagger-ui .model { color: var(--st-text) !important; font-family: var(--st-mono) !important; font-size: 12.5px !important; }

.swagger-ui .prop-format { color: var(--st-gold-dim) !important; }
.swagger-ui .prop-type   { color: var(--st-blue) !important; }

/* ══════════════════════════════════════════
   SERVER SELECTOR
══════════════════════════════════════════ */
.swagger-ui .servers label {
  color: var(--st-muted) !important;
  font-size: 13px !important;
}

.swagger-ui .servers > label select {
  background: var(--st-bg) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius) !important;
  color: var(--st-text) !important;
  font-family: var(--st-mono) !important;
  font-size: 13px !important;
}

/* ══════════════════════════════════════════
   AUTHORIZE MODAL
══════════════════════════════════════════ */
.swagger-ui .dialog-ux .modal-ux {
  background: var(--st-surface) !important;
  border: 1px solid var(--st-border-glow) !important;
  border-radius: var(--st-radius-lg) !important;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6) !important;
}

.swagger-ui .dialog-ux .modal-ux-header {
  background: var(--st-surface) !important;
  border-bottom: 1px solid var(--st-border) !important;
  padding: 20px 24px !important;
}

.swagger-ui .dialog-ux .modal-ux-header h3 {
  color: var(--st-text) !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

.swagger-ui .dialog-ux .modal-ux-content {
  background: var(--st-surface) !important;
  padding: 24px !important;
}

.swagger-ui .auth-container label {
  color: var(--st-muted) !important;
  font-size: 12px !important;
}

/* ══════════════════════════════════════════
   FILTER BAR
══════════════════════════════════════════ */
.swagger-ui .filter .operation-filter-input {
  background: var(--st-surface) !important;
  border: 1px solid var(--st-border) !important;
  border-radius: var(--st-radius) !important;
  color: var(--st-text) !important;
  font-family: var(--st-font) !important;
  font-size: 13px !important;
  padding: 10px 16px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  transition: border-color 0.2s !important;
}
.swagger-ui .filter .operation-filter-input:focus {
  border-color: var(--st-gold-dim) !important;
  outline: none !important;
}

/* ══════════════════════════════════════════
   SCROLLBAR
══════════════════════════════════════════ */
::-webkit-scrollbar               { width: 6px; height: 6px; }
::-webkit-scrollbar-track         { background: var(--st-bg); }
::-webkit-scrollbar-thumb         { background: var(--st-border-glow); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover   { background: var(--st-gold-dim); }

/* ══════════════════════════════════════════
   LOADING ANIMATION
══════════════════════════════════════════ */
.swagger-ui .loading-container {
  background: var(--st-bg) !important;
}
.swagger-ui .loading-container .loading::after {
  border-color: var(--st-gold) transparent transparent transparent !important;
}

/* ══════════════════════════════════════════
   MISC
══════════════════════════════════════════ */
.swagger-ui .markdown p,
.swagger-ui .markdown li { color: var(--st-muted) !important; font-size: 13px !important; }

.swagger-ui .opblock-section-header {
  background: transparent !important;
  border-bottom: 1px solid var(--st-border) !important;
}
.swagger-ui .opblock-section-header label,
.swagger-ui .opblock-section-header h4 {
  color: var(--st-muted) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase !important;
}

.swagger-ui .tab li { color: var(--st-muted) !important; }
.swagger-ui .tab li.active { color: var(--st-text) !important; border-bottom: 2px solid var(--st-gold) !important; }

/* Response content-type selector */
.swagger-ui .content-type { color: var(--st-muted) !important; border-color: var(--st-border) !important; }

/* Copy-to-clipboard icon */
.swagger-ui .curl-command .copy-to-clipboard { background: var(--st-surface) !important; border-color: var(--st-border) !important; }

/* External docs link */
.swagger-ui .info__extdocs { color: var(--st-gold) !important; }

/* ── Fade-in on load ── */
.swagger-ui .wrapper {
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ── Custom JS injected after Swagger UI loads ──────────────────────
const JS = `
  // Inject favicon
  (function() {
    var link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%230a0c10%22/><text y=%2224%22 x=%224%22 font-size=%2222%22>⬡</text></svg>';
    document.head.appendChild(link);
  })();

  // Animate opblocks in on expand
  (function() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.classList && node.classList.contains('opblock-body')) {
            node.style.animation = 'none';
            node.style.opacity = '0';
            node.style.transform = 'translateY(-4px)';
            requestAnimationFrame(function() {
              node.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  })();
`;

// ══════════════════════════════════════════
//  swaggerUi.setup() configuration
// ══════════════════════════════════════════
const SwaggerUi = {
  customSiteTitle: "Shanks Ticketing API",
  customfavIcon: "/favicon.ico",     // optional — override with your own
  customCss: CSS,
  customJs: `data:text/javascript,${encodeURIComponent(JS)}`,

  // Swagger UI options
  swaggerOptions: {
    // Start with all sections collapsed for a clean first impression
    docExpansion: "none",

    // Show request duration in responses
    displayRequestDuration: true,

    // Persist auth tokens across page reloads
    persistAuthorization: true,

    // Show operationId in each endpoint (turn off if you prefer cleaner look)
    displayOperationId: false,

    // Deep-link to anchors (enables shareable URLs to specific endpoints)
    deepLinking: true,

    // Sort endpoints: "alpha" | "method" | null (spec order)
    operationsSorter: "alpha",

    // Sort tags alphabetically
    tagsSorter: "alpha",

    // Show filter input above endpoint list
    filter: true,

    // Max number of tagged operations to show before collapse
    // maxDisplayedTags: 10,

    // Syntax-highlight response bodies (slight perf cost on huge responses)
    syntaxHighlight: {
      activate: true,
      theme: "monokai",
    },

    // Try-it-out is enabled by default per endpoint
    tryItOutEnabled: false,

    // Number of response examples shown
    defaultModelExpandDepth: 2,
    defaultModelsExpandDepth: 1,
  },
};

export default SwaggerUi;
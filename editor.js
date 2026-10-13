/**
 * SYNTHORA AI - Rich Output Editor Component
 * Formatting, AI micro-adjustments, export options, and live metrics
 */

const EditorComponent = {
  canvasEl: null,
  wordCountEl: null,
  charCountEl: null,
  readingTimeEl: null,
  currentTitle: 'Untitled Generation',
  currentType: 'Blog',

  init() {
    this.canvasEl = document.getElementById('aiEditorCanvas');
    this.wordCountEl = document.getElementById('editorWordCount');
    this.charCountEl = document.getElementById('editorCharCount');
    this.readingTimeEl = document.getElementById('editorReadingTime');

    if (!this.canvasEl) return;

    // Listen to changes in the editor
    this.canvasEl.addEventListener('input', () => {
      this.updateMetrics();
    });

    // Formatting buttons in toolbar
    document.querySelectorAll('[data-edit-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.getAttribute('data-edit-cmd');
        const val = btn.getAttribute('data-edit-val') || null;
        document.execCommand(cmd, false, val);
        this.canvasEl.focus();
        this.updateMetrics();
      });
    });

    this.updateMetrics();
  },

  setContent(html, title = 'Untitled Generation', type = 'Blog', stream = false) {
    if (!this.canvasEl) return;
    this.currentTitle = title;
    this.currentType = type;

    if (!stream) {
      this.canvasEl.innerHTML = html;
      this.updateMetrics();
      return;
    }

    // Stream typewriter effect
    this.canvasEl.innerHTML = '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const fullText = html;
    let idx = 0;
    
    // Quick chunk streamer for smooth 60fps rendering without lag
    const chunkSize = 15;
    const interval = setInterval(() => {
      idx += chunkSize;
      this.canvasEl.innerHTML = fullText.slice(0, idx) + '<span class="ai-stream-cursor">|</span>';
      this.updateMetrics();

      if (idx >= fullText.length) {
        clearInterval(interval);
        this.canvasEl.innerHTML = fullText;
        this.updateMetrics();
      }
    }, 20);
  },

  getContent() {
    return this.canvasEl ? this.canvasEl.innerHTML : '';
  },

  getPlainText() {
    return this.canvasEl ? this.canvasEl.innerText : '';
  },

  updateMetrics() {
    if (!this.canvasEl) return;
    const text = this.canvasEl.innerText.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    if (this.wordCountEl) this.wordCountEl.textContent = `${words} words`;
    if (this.charCountEl) this.charCountEl.textContent = `${chars} chars`;
    if (this.readingTimeEl) this.readingTimeEl.textContent = `${minutes} min read`;
  },

  // --- Quick AI Transformations ---
  async improve() {
    Toast.info('Enhancing clarity and sentence flow...');
    const content = this.getContent();
    const improved = await AIEngine.improveWriting(content);
    this.setContent(improved, this.currentTitle, this.currentType, false);
    Toast.success('Writing enhanced with higher precision.');
  },

  async shorten() {
    Toast.info('Condensing into punchier, high-impact phrasing...');
    const content = this.getContent();
    const shortened = await AIEngine.shortenContent(content);
    this.setContent(shortened, this.currentTitle, this.currentType, false);
    Toast.success('Content streamlined.');
  },

  async expand() {
    Toast.info('Expanding context with in-depth strategic analysis...');
    const content = this.getContent();
    const expanded = await AIEngine.expandContent(content);
    this.setContent(expanded, this.currentTitle, this.currentType, false);
    Toast.success('Content expanded with empirical depth.');
  },

  // --- Export Actions ---
  copyToClipboard() {
    const text = this.getPlainText();
    if (!text) {
      Toast.error('Editor is empty.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      Toast.success('Content copied to clipboard!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      Toast.success('Content copied to clipboard!');
    });
  },

  download(format = 'markdown') {
    const content = format === 'html' ? this.getContent() : this.getPlainText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format === 'markdown' ? 'md' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.success(`Downloaded as ${format.toUpperCase()} file.`);
  },

  saveToHistory() {
    const content = this.getContent();
    if (!content.trim()) {
      Toast.error('Cannot save empty content.');
      return;
    }
    const text = this.getPlainText();
    const words = text.split(/\s+/).filter(Boolean).length;

    StorageService.addHistoryItem({
      title: this.currentTitle || 'Custom Creation',
      type: this.currentType || 'Custom',
      platform: 'Saved Draft',
      wordCount: words,
      content: content
    });

    Toast.success('Saved to your Content History!');
    if (typeof App !== 'undefined' && App.renderHistory) {
      App.renderHistory();
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EditorComponent };
}

/**
 * SYNTHORA AI - Modal Manager
 * Handles Auth modals (Login, Signup, Forgot), Quick Search (Cmd+K), and Settings
 */

const ModalManager = {
  activeModal: null,

  init() {
    // Keyboard shortcuts: ESC to close, Cmd/Ctrl + K to open search
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open('quickSearchModal');
      }
    });

    // Close when clicking overlay backdrop
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    });

    // Close buttons inside modals
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Switch between Login and Signup inside modals
    const toSignup = document.getElementById('switchModalToSignup');
    if (toSignup) {
      toSignup.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
        this.open('signupModal');
      });
    }

    const toLogin = document.getElementById('switchModalToLogin');
    if (toLogin) {
      toLogin.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
        this.open('loginModal');
      });
    }

    const forgotLink = document.getElementById('linkForgotPassword');
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
        this.open('forgotPasswordModal');
      });
    }

    // Quick Search Input Filtering
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterQuickSearch(e.target.value);
      });
    }
  },

  open(modalId) {
    this.close();
    const target = document.getElementById(modalId);
    if (target) {
      target.classList.add('active');
      this.activeModal = target;
      document.body.style.overflow = 'hidden';

      // Auto-focus first input if exists
      const firstInput = target.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  },

  close() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      this.activeModal = null;
      document.body.style.overflow = '';
    }
  },

  filterQuickSearch(query) {
    const term = query.toLowerCase().trim();
    const resultsBox = document.getElementById('globalSearchResults');
    if (!resultsBox) return;

    if (!term) {
      // Show default top suggestions
      resultsBox.innerHTML = `
        <div class="search-category-label">QUICK NAVIGATION</div>
        <div class="search-result-item" onclick="App.navigateTo('writer'); ModalManager.close();">
          <span>✍️</span> <div><strong>AI Writer Studio</strong><p>Universal multi-modal content generator</p></div>
        </div>
        <div class="search-result-item" onclick="App.navigateTo('social'); ModalManager.close();">
          <span>📱</span> <div><strong>Social Media Studio</strong><p>Create posts for LinkedIn, Instagram & X</p></div>
        </div>
        <div class="search-result-item" onclick="App.navigateTo('seo'); ModalManager.close();">
          <span>🔍</span> <div><strong>Blog & SEO Studio</strong><p>Keyword suggestions & full article blueprints</p></div>
        </div>
        <div class="search-result-item" onclick="App.navigateTo('templates'); ModalManager.close();">
          <span>⚡</span> <div><strong>Template Library</strong><p>18+ high-conversion framework templates</p></div>
        </div>
      `;
      return;
    }

    // Filter templates and tools
    let matches = [];
    if (typeof SYNTHORA_TEMPLATES !== 'undefined') {
      matches = SYNTHORA_TEMPLATES.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      ).slice(0, 5);
    }

    if (matches.length === 0) {
      resultsBox.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-dim);">
          No matching tools or templates found for "${query}".
        </div>
      `;
      return;
    }

    resultsBox.innerHTML = `
      <div class="search-category-label">MATCHING TEMPLATES & TOOLS</div>
      ${matches.map(m => `
        <div class="search-result-item" onclick="App.useTemplate('${m.id}'); ModalManager.close();">
          <span>${m.icon}</span>
          <div>
            <strong>${m.title}</strong>
            <p>${m.description}</p>
          </div>
          <span class="badge badge-purple" style="margin-left:auto;">${m.category}</span>
        </div>
      `).join('')}
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModalManager };
}

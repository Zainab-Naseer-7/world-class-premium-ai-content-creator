/**
 * SYNTHORA AI - Core Application Orchestrator
 * View routing, dashboard studios, AI generation flows, templates, history, and analytics
 */

const App = {
  currentView: 'landing', // 'landing' or 'dashboard'
  currentStudioSection: 'writer', // 'overview', 'writer', 'social', 'seo', 'templates', 'history', 'analytics', 'settings'
  activeSocialPlatform: 'instagram',

  init() {
    // Initialize components
    EditorComponent.init();
    ModalManager.init();
    LandingPage.init();

    // Setup global listeners
    this.setupNavigation();
    this.setupWriterControls();
    this.setupSocialStudio();
    this.setupSeoStudio();
    this.setupTemplates();
    this.setupHistory();
    this.setupAnalytics();
    this.setupThemeToggle();
    this.updateCreditsUI();
    this.setupAuthForms();

    // Default to Landing view
    this.showLanding();
  },

  // --- View Routing (Landing <-> Studio) ---
  showLanding() {
    this.currentView = 'landing';
    document.getElementById('publicLandingView').style.display = 'block';
    document.getElementById('appStudioView').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  enterStudio(section = 'writer') {
    this.currentView = 'dashboard';
    document.getElementById('publicLandingView').style.display = 'none';
    document.getElementById('appStudioView').style.display = 'flex';
    this.navigateTo(section);
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  navigateTo(sectionId) {
    this.currentStudioSection = sectionId;

    // Update active state in sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all view panes and show target
    document.querySelectorAll('.studio-pane').forEach(pane => {
      pane.style.display = 'none';
    });

    const targetPane = document.getElementById(`pane-${sectionId}`);
    if (targetPane) {
      targetPane.style.display = 'block';
      targetPane.classList.add('animate-fade-in');
    }

    // Specific pane initializations
    if (sectionId === 'history') this.renderHistory();
    if (sectionId === 'templates') this.renderTemplates();
    if (sectionId === 'analytics') this.renderAnalytics();

    // Close mobile drawer if open
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  },

  // --- Navigation & Header Listeners ---
  setupNavigation() {
    // Enter Studio buttons across landing page
    document.querySelectorAll('[data-action="enter-studio"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const section = btn.getAttribute('data-target-section') || 'writer';
        this.enterStudio(section);
      });
    });

    // Exit Studio back to landing page
    const exitBtn = document.getElementById('btnExitToLanding');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLanding();
      });
    }

    // Sidebar navigation clicks
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.navigateTo(section);
      });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('appSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  },

  // --- AI Writer Generation Flow ---
  setupWriterControls() {
    const genBtn = document.getElementById('btnGenerateContent');
    const statusBox = document.getElementById('aiStatusIndicator');
    const statusText = document.getElementById('aiStatusText');
    const creativitySlider = document.getElementById('writerCreativity');
    const creativityVal = document.getElementById('creativityVal');

    if (creativitySlider && creativityVal) {
      creativitySlider.addEventListener('input', (e) => {
        creativityVal.textContent = parseFloat(e.target.value).toFixed(1);
      });
    }

    // Tone Pills Selection
    document.querySelectorAll('.tone-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.tone-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    if (!genBtn) return;

    genBtn.addEventListener('click', async () => {
      const topicInput = document.getElementById('writerTopicInput');
      const topic = topicInput ? topicInput.value.trim() : '';

      if (!topic) {
        Toast.error('Please enter what you want to create.');
        if (topicInput) topicInput.focus();
        return;
      }

      const type = document.getElementById('writerContentType').value;
      const activeTonePill = document.querySelector('.tone-pill.active');
      const tone = activeTonePill ? activeTonePill.getAttribute('data-tone') : 'Professional';
      const language = document.getElementById('writerLanguage').value;
      const length = document.getElementById('writerLength').value;
      const audience = document.getElementById('writerAudience').value || 'Target Audience';
      const keywords = document.getElementById('writerKeywords').value || '';
      const variations = parseInt(document.getElementById('writerVariations').value) || 1;

      // Update UI to generating state
      genBtn.classList.add('is-generating');
      genBtn.innerHTML = '<span class="spinner-icon"></span> Synthesizing Content...';
      if (statusBox) statusBox.classList.add('visible');

      try {
        const result = await AIEngine.generate({
          topic,
          type,
          tone,
          audience,
          language,
          length,
          keywords,
          variations,
          onProgress: (stepText) => {
            if (statusText) statusText.textContent = stepText;
          }
        });

        // Insert into Rich Editor with streaming animation
        EditorComponent.setContent(result.content, result.title, result.type, true);

        // Deduct credits and save history
        StorageService.deductWords(result.wordCount);
        this.updateCreditsUI();
        StorageService.addHistoryItem({
          title: result.title,
          type: result.type,
          platform: result.platform,
          wordCount: result.wordCount,
          tone: result.tone,
          content: result.content
        });

        Toast.success(`Generated ${result.wordCount} words for ${type}!`);
      } catch (err) {
        Toast.error('AI generation encountered an error. Please retry.');
      } finally {
        genBtn.classList.remove('is-generating');
        genBtn.innerHTML = 'Generate Content ✦';
        if (statusBox) statusBox.classList.remove('visible');
      }
    });
  },

  // --- Social Media Studio ---
  setupSocialStudio() {
    const tabs = document.querySelectorAll('.social-tab');
    const genBtn = document.getElementById('btnGenSocial');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeSocialPlatform = tab.getAttribute('data-platform');
        this.updateSocialPreviewPlatform(this.activeSocialPlatform);
      });
    });

    if (genBtn) {
      genBtn.addEventListener('click', async () => {
        const topic = document.getElementById('socialTopicInput').value.trim() || 'Accelerating Startup Growth';
        const tone = document.getElementById('socialToneSelect').value;

        genBtn.classList.add('is-generating');
        genBtn.innerHTML = '<span class="spinner-icon"></span> Generating...';

        try {
          const result = await AIEngine.generate({
            topic,
            type: 'Social Post',
            tone,
            audience: 'Social Media Community',
            length: 'Short'
          });

          const previewBody = document.getElementById('socialPostTextPreview');
          if (previewBody) previewBody.innerHTML = result.content;
          Toast.success(`Crafted post for ${this.activeSocialPlatform.toUpperCase()}!`);
        } catch (e) {
          Toast.error('Could not generate social copy.');
        } finally {
          genBtn.classList.remove('is-generating');
          genBtn.innerHTML = 'Generate Social Post ✦';
        }
      });
    }
  },

  updateSocialPreviewPlatform(platform) {
    const badge = document.getElementById('socialPlatformBadge');
    const handle = document.getElementById('socialPlatformHandle');
    if (badge) badge.textContent = platform.toUpperCase();
    if (handle) {
      if (platform === 'linkedin') handle.textContent = '@asfandyar • 2nd • VP Product';
      else if (platform === 'x') handle.textContent = '@asfandyar_ai • 2h';
      else if (platform === 'youtube') handle.textContent = 'Synthora Creators • 128K subscribers';
      else handle.textContent = '@synthora.official';
    }
  },

  // --- Blog & SEO Studio ---
  setupSeoStudio() {
    const seoBtn = document.getElementById('btnGenSeo');
    if (seoBtn) {
      seoBtn.addEventListener('click', async () => {
        const topic = document.getElementById('seoTopicInput').value.trim() || 'Next-Gen Autonomous AI Agents';
        const keywords = document.getElementById('seoKeywordsInput').value.trim() || 'AI agents, workflow automation, LLM orchestration';

        seoBtn.classList.add('is-generating');
        seoBtn.innerHTML = '<span class="spinner-icon"></span> Optimizing...';

        try {
          const result = await AIEngine.generate({
            topic,
            type: 'SEO Article',
            tone: 'Educational',
            audience: 'Organic Search Traffic',
            keywords,
            length: 'Medium'
          });

          // Update SEO score audit
          const audit = AIEngine.calculateSeoScore(topic, keywords, result.content);
          const scoreEl = document.getElementById('seoScoreValue');
          if (scoreEl) scoreEl.textContent = audit.score;

          const checklistEl = document.getElementById('seoChecklistContainer');
          if (checklistEl) {
            checklistEl.innerHTML = audit.checklist.map(item => `
              <li class="seo-checklist-item ${item.passed ? 'check-pass' : 'check-warn'}">
                <span>${item.passed ? '✓' : '⚠'}</span>
                <span>${item.label}</span>
              </li>
            `).join('');
          }

          // Populate output preview
          const outputEl = document.getElementById('seoOutputPreview');
          if (outputEl) outputEl.innerHTML = result.content;

          Toast.success(`SEO Blueprint ready with score ${audit.score}/100!`);
        } catch (e) {
          Toast.error('SEO Generation failed.');
        } finally {
          seoBtn.classList.remove('is-generating');
          seoBtn.innerHTML = 'Generate SEO Blueprint ✦';
        }
      });
    }
  },

  // --- Templates Library ---
  setupTemplates() {
    const searchInput = document.getElementById('templateSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderTemplates(e.target.value);
      });
    }
  },

  renderTemplates(filterTerm = '') {
    const grid = document.getElementById('templatesGrid');
    if (!grid || typeof SYNTHORA_TEMPLATES === 'undefined') return;

    const term = filterTerm.toLowerCase().trim();
    const activeCategoryPill = document.querySelector('.category-pill.active');
    const activeCat = activeCategoryPill ? activeCategoryPill.getAttribute('data-cat') : 'all';

    const filtered = SYNTHORA_TEMPLATES.filter(tmpl => {
      const matchCat = activeCat === 'all' || tmpl.category.toLowerCase() === activeCat.toLowerCase();
      const matchSearch = !term || tmpl.title.toLowerCase().includes(term) || tmpl.description.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📂</div>
          <h4 class="empty-state-title">No templates found</h4>
          <p class="empty-state-desc">Try clearing your search query or selecting a different category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(t => `
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-purple">${t.category}</span>
          <span style="font-size: 1.35rem;">${t.icon}</span>
        </div>
        <h4 class="template-title">${t.title}</h4>
        <p class="template-desc">${t.description}</p>
        <button class="btn btn-secondary btn-sm" onclick="App.useTemplate('${t.id}')">
          Use Template →
        </button>
      </div>
    `).join('');
  },

  useTemplate(templateId) {
    if (typeof SYNTHORA_TEMPLATES === 'undefined') return;
    const tmpl = SYNTHORA_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    this.enterStudio('writer');

    const topicInput = document.getElementById('writerTopicInput');
    const typeSelect = document.getElementById('writerContentType');
    const audienceInput = document.getElementById('writerAudience');

    if (topicInput) topicInput.value = tmpl.prompt;
    if (typeSelect && tmpl.defaultType) typeSelect.value = tmpl.defaultType;
    if (audienceInput && tmpl.defaultAudience) audienceInput.value = tmpl.defaultAudience;

    // Set tone
    document.querySelectorAll('.tone-pill').forEach(pill => {
      if (pill.getAttribute('data-tone') === tmpl.defaultTone) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    Toast.success(`Template "${tmpl.title}" loaded! Click Generate to create.`);
  },

  filterTemplateCategory(cat, element) {
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    if (element) element.classList.add('active');
    this.renderTemplates();
  },

  // --- History Table ---
  setupHistory() {
    const search = document.getElementById('historySearchInput');
    if (search) {
      search.addEventListener('input', () => this.renderHistory());
    }

    const filterType = document.getElementById('historyFilterType');
    if (filterType) {
      filterType.addEventListener('change', () => this.renderHistory());
    }
  },

  renderHistory() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;

    const items = StorageService.getHistory();
    const searchVal = (document.getElementById('historySearchInput')?.value || '').toLowerCase().trim();
    const filterType = document.getElementById('historyFilterType')?.value || 'all';

    const filtered = items.filter(item => {
      const matchSearch = !searchVal || item.title.toLowerCase().includes(searchVal);
      const matchType = filterType === 'all' || item.type === filterType;
      return matchSearch && matchType;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <h4 class="empty-state-title">No content generations found</h4>
              <p class="empty-state-desc">Generate new content in the AI Writer Studio to see your history logged here.</p>
              <button class="btn btn-primary btn-sm" onclick="App.navigateTo('writer')">Start Creating ✦</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr>
        <td>
          <span style="cursor:pointer; color:${item.favorite ? '#f59e0b' : 'var(--text-dim)'}" onclick="App.toggleHistoryFavorite('${item.id}')">
            ${item.favorite ? '★' : '☆'}
          </span>
        </td>
        <td class="history-title-cell" title="${item.title}">${item.title}</td>
        <td><span class="badge badge-purple">${item.type}</span></td>
        <td>${item.platform || 'Web'}</td>
        <td style="font-family:var(--font-mono);">${item.wordCount || 0}</td>
        <td class="history-actions-cell">
          <button class="btn-icon" title="Open in Editor" onclick="App.openHistoryItem('${item.id}')">✍️</button>
          <button class="btn-icon" title="Copy Text" onclick="App.copyHistoryItem('${item.id}')">📋</button>
          <button class="btn-icon" title="Delete" onclick="App.deleteHistoryItem('${item.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  openHistoryItem(id) {
    const items = StorageService.getHistory();
    const target = items.find(i => i.id === id);
    if (!target) return;

    this.navigateTo('writer');
    EditorComponent.setContent(target.content, target.title, target.type, false);
    Toast.info(`Loaded "${target.title}" into editor.`);
  },

  copyHistoryItem(id) {
    const items = StorageService.getHistory();
    const target = items.find(i => i.id === id);
    if (!target) return;

    const plain = target.content.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plain).then(() => {
      Toast.success('Copied to clipboard!');
    });
  },

  deleteHistoryItem(id) {
    StorageService.deleteHistoryItem(id);
    this.renderHistory();
    Toast.info('Item removed from history.');
  },

  toggleHistoryFavorite(id) {
    StorageService.toggleFavorite(id);
    this.renderHistory();
  },

  // --- Analytics View ---
  setupAnalytics() {},

  renderAnalytics() {
    const history = StorageService.getHistory();
    const credits = StorageService.getCredits();

    const totalWords = history.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
    const totalGens = history.length;

    const elWords = document.getElementById('statTotalWords');
    const elGens = document.getElementById('statTotalGens');
    const elCreditsUsed = document.getElementById('statCreditsUsed');

    if (elWords) elWords.textContent = totalWords.toLocaleString();
    if (elGens) elGens.textContent = totalGens.toString();
    if (elCreditsUsed) elCreditsUsed.textContent = `${credits.used.toLocaleString()} / ${credits.total.toLocaleString()}`;
  },

  // --- Credit Bar UI Update ---
  updateCreditsUI() {
    const credits = StorageService.getCredits();
    const label = document.getElementById('topbarCreditCount');
    const bar = document.getElementById('topbarCreditBar');

    if (label) label.textContent = `${credits.used.toLocaleString()} / ${credits.total.toLocaleString()}`;
    if (bar) {
      const pct = Math.min(100, Math.round((credits.used / credits.total) * 100));
      bar.style.width = `${pct}%`;
    }
  },

  // --- Theme Toggle ---
  setupThemeToggle() {
    const toggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = StorageService.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        StorageService.setTheme(next);
        Toast.info(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      });
    });
  },

  // --- Authentication Forms & Settings ---
  setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        ModalManager.close();
        Toast.success('Welcome back to Synthora AI!');
        this.enterStudio('writer');
      });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        ModalManager.close();
        Toast.success('Account successfully created! Welcome aboard.');
        this.enterStudio('writer');
      });
    }

    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        ModalManager.close();
        Toast.success('Password reset link sent to your email.');
      });
    }
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App };
}

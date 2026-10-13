/**
 * SYNTHORA AI - Local Storage Service
 * State persistence for content history, theme, credits, and user settings
 */

const StorageService = {
  KEYS: {
    HISTORY: 'synthora_history_items',
    THEME: 'synthora_theme_mode',
    CREDITS: 'synthora_user_credits',
    SETTINGS: 'synthora_user_settings',
    USER: 'synthora_current_user'
  },

  // --- Theme Management ---
  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  // --- Credits Management ---
  getCredits() {
    const credits = localStorage.getItem(this.KEYS.CREDITS);
    if (!credits) {
      const initial = { used: 11760, total: 100000 };
      this.setCredits(initial);
      return initial;
    }
    try {
      return JSON.parse(credits);
    } catch (e) {
      return { used: 11760, total: 100000 };
    }
  },

  setCredits(creditsObj) {
    localStorage.setItem(this.KEYS.CREDITS, JSON.stringify(creditsObj));
  },

  deductWords(wordCount) {
    const current = this.getCredits();
    current.used = Math.min(current.total, current.used + wordCount);
    this.setCredits(current);
    return current;
  },

  // --- History Management ---
  getHistory() {
    const raw = localStorage.getItem(this.KEYS.HISTORY);
    if (!raw) {
      // Seed with initial history items if empty
      if (typeof SYNTHORA_INITIAL_HISTORY !== 'undefined') {
        this.saveHistory(SYNTHORA_INITIAL_HISTORY);
        return [...SYNTHORA_INITIAL_HISTORY];
      }
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveHistory(historyArray) {
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(historyArray));
  },

  addHistoryItem(item) {
    const list = this.getHistory();
    const newItem = {
      id: 'gen-' + Date.now(),
      date: new Date().toISOString(),
      favorite: false,
      ...item
    };
    list.unshift(newItem);
    this.saveHistory(list);
    return newItem;
  },

  deleteHistoryItem(id) {
    const list = this.getHistory().filter(item => item.id !== id);
    this.saveHistory(list);
    return list;
  },

  toggleFavorite(id) {
    const list = this.getHistory();
    const target = list.find(item => item.id === id);
    if (target) {
      target.favorite = !target.favorite;
      this.saveHistory(list);
    }
    return list;
  },

  // --- User Profile & Settings ---
  getUser() {
    const raw = localStorage.getItem(this.KEYS.USER);
    if (!raw) {
      return {
        name: 'Asfandyar',
        email: 'creator@synthora.ai',
        tier: 'Pro Member',
        isLoggedIn: true
      };
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return { name: 'Asfandyar', email: 'creator@synthora.ai', tier: 'Pro Member', isLoggedIn: true };
    }
  },

  setUser(userObj) {
    localStorage.setItem(this.KEYS.USER, JSON.stringify(userObj));
  },

  resetDefault() {
    localStorage.removeItem(this.KEYS.HISTORY);
    localStorage.removeItem(this.KEYS.CREDITS);
    localStorage.removeItem(this.KEYS.SETTINGS);
    const initialCredits = { used: 11760, total: 100000 };
    this.setCredits(initialCredits);
    if (typeof SYNTHORA_INITIAL_HISTORY !== 'undefined') {
      this.saveHistory(SYNTHORA_INITIAL_HISTORY);
    }
  }
};

// Initialize Theme on load
(function initStorage() {
  const currentTheme = StorageService.getTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService };
}

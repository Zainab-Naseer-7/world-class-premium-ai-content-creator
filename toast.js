/**
 * SYNTHORA AI - Toast Notification System
 * Non-intrusive micro-feedback toasts for copies, saves, favorites, and actions
 */

const Toast = {
  container: null,

  _init() {
    if (!this.container) {
      let existing = document.getElementById('synthoraToastContainer');
      if (!existing) {
        existing = document.createElement('div');
        existing.id = 'synthoraToastContainer';
        existing.className = 'toast-container';
        document.body.appendChild(existing);
      }
      this.container = existing;
    }
  },

  show(message, type = 'info', duration = 3500) {
    this._init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span style="font-weight:700; color: ${type === 'success' ? '#10b981' : type === 'error' ? '#f43f5e' : '#8b5cf6'};">${icon}</span>
      <span style="flex:1;">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Toast };
}

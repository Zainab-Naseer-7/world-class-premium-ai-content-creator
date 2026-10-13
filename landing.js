/**
 * SYNTHORA AI - Landing Page Controller
 * Interactive live demo, pricing switcher, FAQ accordion, and floating card effects
 */

const LandingPage = {
  isYearly: false,

  init() {
    this.setupLiveDemo();
    this.setupPricingToggle();
    this.setupFaqAccordion();
    this.setupSmoothScroll();
  },

  // --- Live Interactive Demo in Hero ---
  setupLiveDemo() {
    const presetChips = document.querySelectorAll('.preset-chip');
    const demoInput = document.getElementById('demoInputTopic');
    const demoBtn = document.getElementById('demoGenerateBtn');
    const demoOutput = document.getElementById('demoOutputArea');
    const demoOpenStudioBtn = document.getElementById('demoOpenStudioBtn');

    if (!demoBtn) return;

    // Presets
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const topic = chip.getAttribute('data-topic');
        if (demoInput) demoInput.value = topic;
      });
    });

    // Quick Generate
    demoBtn.addEventListener('click', async () => {
      const topic = (demoInput && demoInput.value.trim()) || 'Autonomous AI Workflows for Modern Teams';
      demoBtn.classList.add('is-generating');
      demoBtn.innerHTML = '<span class="spinner-icon"></span> Synthesizing Copy...';

      demoOutput.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; color:var(--primary-400); margin:auto;">
          <span class="spinner-icon"></span>
          <span>Orchestrating tone & creative narrative...</span>
        </div>
      `;

      try {
        const result = await AIEngine.generate({
          topic,
          type: 'Social Post',
          tone: 'Persuasive',
          audience: 'Growth Marketers & Founders',
          length: 'Short'
        });

        demoOutput.innerHTML = `
          <div style="animation: fadeIn 0.3s ease;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <span class="badge badge-purple">High-Conversion Output</span>
              <span style="font-size:0.75rem; color:var(--text-dim);">${result.wordCount} words • Generated in 0.8s</span>
            </div>
            <div style="font-size:0.9375rem; line-height:1.7; color:var(--text-primary);">${result.content}</div>
          </div>
        `;

        if (demoOpenStudioBtn) {
          demoOpenStudioBtn.style.display = 'inline-flex';
          demoOpenStudioBtn.onclick = () => {
            App.navigateTo('writer');
            EditorComponent.setContent(result.content, result.title, result.type, false);
            const writerTopic = document.getElementById('writerTopicInput');
            if (writerTopic) writerTopic.value = topic;
            Toast.success('Loaded into AI Studio Workspace!');
          };
        }
      } catch (err) {
        demoOutput.innerHTML = '<p style="color:var(--accent-rose);">Generation paused. Please try again.</p>';
      } finally {
        demoBtn.classList.remove('is-generating');
        demoBtn.innerHTML = 'Generate Sample ✦';
      }
    });
  },

  // --- Pricing Switcher ---
  setupPricingToggle() {
    const toggle = document.getElementById('pricingSwitch');
    const labelMonthly = document.getElementById('labelMonthly');
    const labelYearly = document.getElementById('labelYearly');
    const pricePro = document.getElementById('pricePro');
    const priceBusiness = document.getElementById('priceBusiness');

    if (!toggle) return;

    const updatePricing = () => {
      if (this.isYearly) {
        toggle.classList.add('yearly');
        labelYearly.classList.add('active');
        labelMonthly.classList.remove('active');
        if (pricePro) pricePro.textContent = '$23';
        if (priceBusiness) priceBusiness.textContent = '$63';
      } else {
        toggle.classList.remove('yearly');
        labelMonthly.classList.add('active');
        labelYearly.classList.remove('active');
        if (pricePro) pricePro.textContent = '$29';
        if (priceBusiness) priceBusiness.textContent = '$79';
      }
    };

    toggle.addEventListener('click', () => {
      this.isYearly = !this.isYearly;
      updatePricing();
    });

    if (labelMonthly) {
      labelMonthly.addEventListener('click', () => {
        this.isYearly = false;
        updatePricing();
      });
    }

    if (labelYearly) {
      labelYearly.addEventListener('click', () => {
        this.isYearly = true;
        updatePricing();
      });
    }
  },

  // --- FAQ Accordion ---
  setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close others for clean accordion behavior
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  },

  // --- Smooth Anchor Scrolling ---
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LandingPage };
}

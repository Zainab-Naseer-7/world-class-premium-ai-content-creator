/**
 * SYNTHORA AI - Templates Catalog Data
 * 18+ Production-Grade Templates across 9 Core Categories
 */

const SYNTHORA_TEMPLATES = [
  // --- Marketing ---
  {
    id: 'tmpl-pas-marketing',
    title: 'PAS Framework Sales Copy',
    category: 'Marketing',
    icon: '🎯',
    description: 'Problem-Agitate-Solve copy structured to trigger emotional urgency and drive direct conversions.',
    defaultType: 'Advertisement',
    defaultTone: 'Persuasive',
    defaultAudience: 'Growth Marketers & Founders',
    prompt: 'Write a high-converting sales copy using the Problem-Agitate-Solve framework for: [Your Product/Service]. Focus on reducing manual friction and saving 10+ hours per week.'
  },
  {
    id: 'tmpl-aida-copy',
    title: 'AIDA Formula Launch Copy',
    category: 'Marketing',
    icon: '🚀',
    description: 'Attention, Interest, Desire, and Action blueprint tailored for product announcements and launches.',
    defaultType: 'Marketing Copy',
    defaultTone: 'Creative',
    defaultAudience: 'Early Adopters & Tech Enthusiasts',
    prompt: 'Create a compelling product launch narrative using the AIDA framework for: [New Feature or SaaS Launch]. Highlight early bird benefits.'
  },

  // --- Social Media ---
  {
    id: 'tmpl-linkedin-viral-hook',
    title: 'Viral LinkedIn Story & Hook',
    category: 'Social Media',
    icon: '💼',
    description: 'High-retention LinkedIn post with a 2-line scroll-stopping hook, vulnerability/lesson arc, and engagement CTA.',
    defaultType: 'Social Post',
    defaultTone: 'Storytelling',
    defaultAudience: 'B2B Professionals & Founders',
    prompt: 'Write an authentic, viral-style LinkedIn post about: [A hard lesson learned while scaling a startup or career breakthrough]. Include 3 actionable takeaways and an open question.'
  },
  {
    id: 'tmpl-x-thread',
    title: 'X / Twitter Authority Thread',
    category: 'Social Media',
    icon: '⚡',
    description: 'A 6-part tweet thread designed for bookmarking, retweets, and profile authority growth.',
    defaultType: 'Social Post',
    defaultTone: 'Educational',
    defaultAudience: 'Tech & Creator Community',
    prompt: 'Craft a punchy 6-tweet thread breaking down: [A complex framework, mental model, or AI productivity stack]. Keep each tweet under 240 chars.'
  },
  {
    id: 'tmpl-insta-caption',
    title: 'Instagram Carousel & Caption',
    category: 'Social Media',
    icon: '📸',
    description: 'High-save carousel slide breakdown with a rich caption, emoji pacing, and top-ranking hashtag clusters.',
    defaultType: 'Social Post',
    defaultTone: 'Casual',
    defaultAudience: 'Visual Creators & Lifestyle Consumers',
    prompt: 'Write an Instagram post breakdown with 5 carousel slide concepts and an engaging caption for: [Creative Tips / Industry Insights]. Include 10 targeted hashtags.'
  },

  // --- Business ---
  {
    id: 'tmpl-cold-outreach',
    title: 'High-Response B2B Cold Email',
    category: 'Business',
    icon: '✉️',
    description: 'Non-spammy, highly personalized cold outreach email with a low-friction call-to-action.',
    defaultType: 'Email',
    defaultTone: 'Professional',
    defaultAudience: 'Enterprise Executives & Directors',
    prompt: 'Draft a personalized 75-word B2B cold outreach email to a VP of Marketing offering: [A high-ROI growth audit]. Keep the CTA soft and conversational.'
  },
  {
    id: 'tmpl-investor-update',
    title: 'Monthly Investor Update Memo',
    category: 'Business',
    icon: '📊',
    description: 'Crisp startup investor update covering MRR growth, product highlights, hurdles, and asks.',
    defaultType: 'Custom',
    defaultTone: 'Professional',
    defaultAudience: 'Angel Investors & VCs',
    prompt: 'Generate an executive monthly investor update for [Startup Name]. Include MRR metrics (+22% MoM), key product releases, churn rate, and 2 specific hiring asks.'
  },

  // --- E-commerce ---
  {
    id: 'tmpl-shopify-desc',
    title: 'Shopify Conversion Description',
    category: 'E-commerce',
    icon: '🛍️',
    description: 'Benefit-driven product description with sensory adjectives, bullet points, and social proof triggers.',
    defaultType: 'Product Description',
    defaultTone: 'Luxury',
    defaultAudience: 'Discerning Shoppers',
    prompt: 'Write a luxurious, high-converting product description for: [Premium Leather Backpack / Artisanal Watch]. Emphasize craftsmanship, durability, and lifestyle status.'
  },
  {
    id: 'tmpl-amazon-bullets',
    title: 'Amazon SEO Bullet Points',
    category: 'E-commerce',
    icon: '📦',
    description: '5 keyword-rich, skimmable Amazon listing feature bullets answering top customer objections.',
    defaultType: 'Product Description',
    defaultTone: 'Persuasive',
    defaultAudience: 'Amazon Prime Buyers',
    prompt: 'Create 5 Amazon listing bullet points with capitalized header keywords for: [Ergonomic Wireless Keyboard]. Emphasize battery life and wrist comfort.'
  },

  // --- SEO ---
  {
    id: 'tmpl-seo-pillar',
    title: 'SEO Pillar Article Blueprint',
    category: 'SEO',
    icon: '🔍',
    description: 'Comprehensive 2,500-word article outline with H2/H3 search intents and semantic keywords.',
    defaultType: 'SEO Article',
    defaultTone: 'Educational',
    defaultAudience: 'Organic Searchers & Researchers',
    prompt: 'Generate a comprehensive SEO pillar guide outline on: [The Future of Autonomous AI Agents in 2026]. Include primary keywords, LSI terms, and FAQ schema.'
  },
  {
    id: 'tmpl-meta-generator',
    title: 'High-CTR Meta Title & Description',
    category: 'SEO',
    icon: '🏷️',
    description: 'SERP-optimized title and description with character limits strictly under 60 and 155 chars.',
    defaultType: 'SEO Article',
    defaultTone: 'Minimal',
    defaultAudience: 'Google Search Traffic',
    prompt: 'Generate 3 high-CTR Meta Title and Meta Description pairs for a page targeting: [Best AI Video Editors for Creators].'
  },

  // --- Email ---
  {
    id: 'tmpl-onboarding-sequence',
    title: 'SaaS Welcome Onboarding Email',
    category: 'Email',
    icon: '👋',
    description: 'Warm, action-oriented onboarding welcome email that drives the user to their first "Aha!" moment.',
    defaultType: 'Email',
    defaultTone: 'Friendly',
    defaultAudience: 'New SaaS Trial Users',
    prompt: 'Write a delightful welcome email for new signups to Synthora AI. Guide them to complete their first AI generation in under 60 seconds.'
  },
  {
    id: 'tmpl-promotional-blast',
    title: 'Flash Sale Urgency Email',
    category: 'Email',
    icon: '🔥',
    description: 'Urgency-driven campaign email for limited-time offers with clear countdown cues and risk-free guarantees.',
    defaultType: 'Email',
    defaultTone: 'Persuasive',
    defaultAudience: 'Existing Subscribers',
    prompt: 'Write an engaging flash sale email offering 30% off annual plans for the next 48 hours. Focus on ROI and future-proofing your business.'
  },

  // --- Advertising ---
  {
    id: 'tmpl-fb-ad',
    title: 'High-CTR Facebook / Meta Ad',
    category: 'Advertising',
    icon: '📱',
    description: 'Hook, body copy, and CTA button copy crafted for Meta feed and story placements.',
    defaultType: 'Advertisement',
    defaultTone: 'Casual',
    defaultAudience: 'Social Media Scrollers',
    prompt: 'Create 3 variations of Facebook Ad copy (Primary text, Headline, Description) for: [AI Social Media Manager]. Target burned-out content creators.'
  },
  {
    id: 'tmpl-google-ad',
    title: 'Google Responsive Search Ads',
    category: 'Advertising',
    icon: '🔎',
    description: '5 dynamic headlines (under 30 chars) and 3 descriptions (under 90 chars) maximizing Ad Strength.',
    defaultType: 'Advertisement',
    defaultTone: 'Minimal',
    defaultAudience: 'High-Intent Searchers',
    prompt: 'Write Google Responsive Search Ad assets for: [Enterprise AI Writing Software]. Include exact search terms and value propositions.'
  },

  // --- YouTube ---
  {
    id: 'tmpl-youtube-script',
    title: 'Viral YouTube Video Script Outline',
    category: 'YouTube',
    icon: '🎥',
    description: 'First 30-second retention hook, narrative progression, B-roll cues, and mid-roll retention booster.',
    defaultType: 'Script',
    defaultTone: 'Storytelling',
    defaultAudience: 'YouTube Viewers',
    prompt: 'Develop an engaging YouTube video script outline titled: [How AI is Secretly Reshaping Every Creative Industry]. Include visual cues and timecodes.'
  },
  {
    id: 'tmpl-youtube-desc',
    title: 'YouTube Description & Timestamp Cloud',
    category: 'YouTube',
    icon: '▶️',
    description: 'Search-optimized description with chapters, affiliate links, and community questions.',
    defaultType: 'Script',
    defaultTone: 'Friendly',
    defaultAudience: 'Video Audience & Subscribers',
    prompt: 'Create a full YouTube description for a video on [10x Faster Content Workflows with AI]. Include chapters, resource links, and 5 hashtags.'
  },

  // --- Personal Branding ---
  {
    id: 'tmpl-founder-story',
    title: 'Founder Origin Story & Milestone',
    category: 'Personal Branding',
    icon: '✨',
    description: 'Inspiring personal narrative showcasing the struggle, turning point, and lessons behind building a brand.',
    defaultType: 'Blog',
    defaultTone: 'Storytelling',
    defaultAudience: 'Followers, Customers & Peers',
    prompt: 'Write an inspiring personal brand essay about: [Leaving a comfortable corporate job to bootstrap an AI company]. Frame it around grit, focus, and modern leverage.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SYNTHORA_TEMPLATES };
}

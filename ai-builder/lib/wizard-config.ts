export interface WizardTemplate {
  id: string
  name: string
  icon: string
  description: string
  sections: string[]
}

type SectionSize = 's' | 'm' | 'l'

type TemplateLayoutResult = {
  pageLayouts: string[]
  pageSectionSizes: string[]
  contentSections: string[]
  carouselCount: number
  galleryCount: number
}

export const WEBSITE_TEMPLATES: Record<'ecommerce' | 'business' | 'general', WizardTemplate[]> = {
  ecommerce: [
    { id: 'online-store', name: 'Online Store', icon: '🏪', description: 'Full-featured online store with product catalog, shopping cart, and checkout', sections: ['Nav', 'Hero Banner', 'Product Catalog', 'Cart', 'Reviews', 'Footer'] },
    { id: 'fashion-store', name: 'Fashion Store', icon: '👗', description: 'Elegant fashion e-commerce with lookbook gallery and size guides', sections: ['Nav', 'Lookbook Hero', 'Collections', 'Size Guide', 'Reviews', 'Footer'] },
    { id: 'electronics-shop', name: 'Electronics Shop', icon: '📱', description: 'Tech store with product comparisons, specifications, and reviews', sections: ['Nav', 'Hero Banner', 'Product Catalog', 'Specs', 'Reviews', 'Footer'] },
    { id: 'marketplace', name: 'Marketplace', icon: '🌐', description: 'Multi-vendor marketplace with seller profiles and commission system', sections: ['Nav', 'Search Bar', 'Listings', 'Sellers', 'Footer'] },
    { id: 'digital-products', name: 'Digital Products', icon: '💾', description: 'Sell digital downloads, courses, and software with instant delivery', sections: ['Nav', 'Hero', 'Products', 'Pricing Plans', 'Footer'] },
    { id: 'subscription-box', name: 'Subscription Box', icon: '📦', description: 'Recurring subscription service with membership tiers and plans', sections: ['Nav', 'Hero', 'Pricing Plans', 'Gallery', 'Footer'] },
    { id: 'grocery-store', name: 'Grocery Store', icon: '🛒', description: 'Online grocery with categories, fresh produce, and home delivery', sections: ['Nav', 'Search Bar', 'Categories', 'Product Catalog', 'Delivery', 'Footer'] },
    { id: 'jewelry-shop', name: 'Jewelry Shop', icon: '💍', description: 'Luxury jewelry store with high-res galleries and custom orders', sections: ['Nav', 'Gallery', 'Collections', 'Contact', 'Footer'] },
    { id: 'bookstore', name: 'Bookstore', icon: '📚', description: 'Online bookstore with author pages, reviews, and recommendations', sections: ['Nav', 'Hero', 'Categories', 'Authors', 'Footer'] },
    { id: 'furniture-store', name: 'Furniture Store', icon: '🛋️', description: 'Furniture e-commerce with 3D previews and room planners', sections: ['Nav', 'Hero', 'Product Catalog', 'Rooms', 'Footer'] },
    { id: 'pet-store', name: 'Pet Store', icon: '🐾', description: 'Pet supplies shop with product categories and care guides', sections: ['Nav', 'Hero Banner', 'Categories', 'Services', 'Footer'] },
    { id: 'toy-store', name: 'Toy Store', icon: '🧸', description: "Children's toy shop with age categories and gift guides", sections: ['Nav', 'Hero', 'Categories', 'Gift Guide', 'Footer'] },
  ],
  business: [
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Restaurant website with menu, online ordering, and reservations', sections: ['Nav', 'Hero Banner', 'Menu', 'Gallery', 'Reservations', 'Footer'] },
    { id: 'salon-spa', name: 'Salon & Spa', icon: '💇', description: 'Beauty salon with service booking, staff profiles, and gallery', sections: ['Nav', 'Hero', 'Services', 'Staff Team', 'Booking', 'Footer'] },
    { id: 'real-estate', name: 'Real Estate', icon: '🏡', description: 'Property listings with search filters, virtual tours, and agent contact', sections: ['Nav', 'Hero', 'Search Bar', 'Listings', 'Agent Team', 'Footer'] },
    { id: 'gym-fitness', name: 'Gym & Fitness', icon: '💪', description: 'Fitness center with class schedules, membership plans, and trainers', sections: ['Nav', 'Hero Banner', 'Classes', 'Staff Team', 'Pricing Plans', 'Footer'] },
    { id: 'medical-clinic', name: 'Medical Clinic', icon: '🏥', description: 'Healthcare website with appointment booking and doctor profiles', sections: ['Nav', 'Hero', 'Services', 'Doctor Team', 'Booking', 'Footer'] },
    { id: 'law-firm', name: 'Law Firm', icon: '⚖️', description: 'Professional law firm with practice areas, case studies, and consultation', sections: ['Nav', 'Hero', 'Services', 'Staff Team', 'Contact', 'Footer'] },
    { id: 'construction', name: 'Construction Co.', icon: '🏗️', description: 'Construction and contracting with project portfolios, services, and quotes', sections: ['Nav', 'Hero Banner', 'Services', 'Portfolio', 'Quote', 'Footer'] },
    { id: 'dental-clinic', name: 'Dental Clinic', icon: '🦷', description: 'Dental practice with services, team bios, and online booking', sections: ['Nav', 'Hero', 'Services', 'Staff Team', 'Booking', 'Footer'] },
    { id: 'auto-repair', name: 'Auto Repair', icon: '🔧', description: 'Auto service shop with maintenance schedules and repair quotes', sections: ['Nav', 'Hero', 'Services', 'Quote', 'Contact', 'Footer'] },
    { id: 'photography', name: 'Photography Studio', icon: '📸', description: 'Photographer portfolio with booking calendar and pricing packages', sections: ['Nav', 'Gallery', 'Pricing Plans', 'About', 'Booking', 'Footer'] },
    { id: 'accounting', name: 'Accounting Firm', icon: '💼', description: 'Professional accounting services with client portal and resources', sections: ['Nav', 'Hero', 'Services', 'Staff Team', 'Contact', 'Footer'] },
    { id: 'hotel', name: 'Hotel & Resort', icon: '🏨', description: 'Hotel booking with room listings, amenities, and reservations', sections: ['Nav', 'Hero Banner', 'Rooms', 'Amenities', 'Booking', 'Footer'] },
    { id: 'consulting', name: 'Business Consulting', icon: '📊', description: 'Consulting firm with expertise areas, case studies, and contact', sections: ['Nav', 'Hero', 'Services', 'Portfolio', 'Contact', 'Footer'] },
    { id: 'cleaning-service', name: 'Cleaning Service', icon: '🧹', description: 'Professional cleaning with service packages and online booking', sections: ['Nav', 'Hero', 'Services', 'Pricing Plans', 'Booking', 'Footer'] },
    { id: 'catering', name: 'Catering Service', icon: '🍱', description: 'Event catering with menu options, packages, and inquiry forms', sections: ['Nav', 'Hero', 'Menu', 'Gallery', 'Contact', 'Footer'] },
    { id: 'moving-company', name: 'Moving Company', icon: '🚚', description: 'Moving services with quotes calculator and service areas', sections: ['Nav', 'Hero', 'Services', 'Quote', 'Footer'] },
  ],
  general: [
    { id: 'landing-page', name: 'Landing Page', icon: '📄', description: 'Clean landing page with hero, features, and call-to-action', sections: ['Nav', 'Hero Banner', 'Features', 'About', 'Contact', 'Footer'] },
    { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Creative portfolio with project gallery and about section', sections: ['Nav', 'Hero', 'Gallery', 'About', 'Contact', 'Footer'] },
    { id: 'blog', name: 'Blog', icon: '📝', description: 'Personal or company blog with articles, categories, and comments', sections: ['Nav', 'Header', 'Posts Feed', 'Sidebar', 'Newsletter', 'Footer'] },
    { id: 'agency', name: 'Digital Agency', icon: '🎯', description: 'Creative agency with services, team, and portfolio', sections: ['Nav', 'Hero Banner', 'Services', 'Portfolio', 'Staff Team', 'Footer'] },
    { id: 'saas', name: 'SaaS Landing', icon: '☁️', description: 'Software product landing page with pricing and features', sections: ['Nav', 'Hero', 'Features', 'Pricing Plans', 'FAQ', 'Footer'] },
    { id: 'event', name: 'Event', icon: '🎉', description: 'Event website with schedule, speakers, and ticket registration', sections: ['Nav', 'Hero Banner', 'Schedule', 'Speakers', 'Register', 'Footer'] },
    { id: 'nonprofit', name: 'Non-Profit', icon: '❤️', description: 'Charity organization with donation forms and impact stories', sections: ['Nav', 'Hero', 'Mission', 'Gallery', 'Donate', 'Footer'] },
    { id: 'education', name: 'Online Learning', icon: '🎓', description: 'Educational platform with courses, instructors, and enrollment', sections: ['Nav', 'Hero', 'Courses', 'Staff Team', 'Enroll', 'Footer'] },
    { id: 'podcast', name: 'Podcast', icon: '🎙️', description: 'Podcast website with episodes, player, and subscription options', sections: ['Nav', 'Hero', 'Episodes', 'Subscribe', 'Footer'] },
    { id: 'resume', name: 'Resume/CV', icon: '📋', description: 'Professional resume with experience, skills, and contact info', sections: ['Hero Banner', 'About', 'Portfolio', 'Contact', 'Footer'] },
    { id: 'wedding', name: 'Wedding', icon: '💒', description: 'Wedding website with RSVP, registry, and event details', sections: ['Hero Banner', 'Story', 'Gallery', 'Schedule', 'RSVP', 'Footer'] },
    { id: 'news', name: 'News Portal', icon: '📰', description: 'News website with articles, categories, and breaking news', sections: ['Nav', 'Hero Banner', 'Categories', 'Posts Feed', 'Footer'] },
    { id: 'magazine', name: 'Online Magazine', icon: '📖', description: 'Digital magazine with featured articles and subscriptions', sections: ['Nav', 'Hero Banner', 'Sections', 'Posts Feed', 'Subscribe', 'Footer'] },
    { id: 'community', name: 'Community Forum', icon: '👥', description: 'Community platform with discussions, members, and events', sections: ['Nav', 'Hero', 'Discussions', 'Members', 'Footer'] },
    { id: 'directory', name: 'Business Directory', icon: '📍', description: 'Local business directory with listings and reviews', sections: ['Nav', 'Search Bar', 'Listings', 'Reviews', 'Footer'] },
    { id: 'coming-soon', name: 'Coming Soon', icon: '⏰', description: 'Launch page with countdown timer and email signup', sections: ['Hero Banner', 'Countdown', 'Newsletter', 'Footer'] },
  ],
}

export function getSectionColor(sectionName: string): string {
  const l = sectionName.toLowerCase()
  if (l.includes('nav')) return '#334155'
  if (l.includes('footer')) return '#1e293b'
  if (l.includes('hero') || l.includes('banner') || l.includes('header')) return '#2563eb'
  if (l.includes('product') || l.includes('catalog') || l.includes('listing') || l.includes('collection') || l.includes('lookbook')) return '#7c3aed'
  if (l.includes('gallery') || l.includes('portfolio') || l.includes('photo') || l.includes('lookbook')) return '#db2777'
  if (l.includes('service') || l.includes('feature') || l.includes('class') || l.includes('menu') || l.includes('amenity')) return '#4f46e5'
  if (l.includes('about') || l.includes('story') || l.includes('mission') || l.includes('team') || l.includes('staff') || l.includes('doctor') || l.includes('agent')) return '#0d9488'
  if (l.includes('contact') || l.includes('booking') || l.includes('reserve') || l.includes('rsvp') || l.includes('enroll') || l.includes('register') || l.includes('subscribe') || l.includes('quote')) return '#16a34a'
  if (l.includes('review') || l.includes('testimonial')) return '#d97706'
  if (l.includes('price') || l.includes('plan') || l.includes('package') || l.includes('tier')) return '#ea580c'
  if (l.includes('search')) return '#0284c7'
  return '#6b7280'
}

export const NAV_STYLE_OPTIONS = [
  { id: 'top-nav', label: 'Top Bar', icon: '▬', desc: 'Standard top navigation' },
  { id: 'sticky-nav', label: 'Sticky Top', icon: '📌', desc: 'Stays visible while scrolling' },
  { id: 'centered-nav', label: 'Centered', icon: '◉', desc: 'Centered links in a clean top row' },
  { id: 'split-nav', label: 'Split Nav', icon: '⫶', desc: 'Brand in center with links on both sides' },
  { id: 'mega-menu', label: 'Mega Menu', icon: '▦', desc: 'Large dropdown menu with grouped links' },
  { id: 'side-drawer', label: 'Side Drawer', icon: '◧', desc: 'Slide-in sidebar menu' },
  { id: 'hamburger', label: 'Hamburger', icon: '☰', desc: 'Collapsed mobile-friendly menu' },
  { id: 'tab-bar', label: 'Tab Bar', icon: '⊟', desc: 'Bottom tab navigation' },
  { id: 'floating-nav', label: 'Floating', icon: '◌', desc: 'Floating pill-style navigation bar' },
  { id: 'breadcrumbs', label: 'Breadcrumbs', icon: '›', desc: 'Path-style navigation for deep pages' },
  { id: 'no-nav', label: 'No Nav', icon: '✕', desc: 'No navigation bar' },
]

export const BASE_ASSET_ZONES = [
  { key: 'background', label: 'Background', hint: 'Full-page or section background' },
  { key: 'hero', label: 'Hero Photo', hint: 'Main image in the hero/banner' },
  { key: 'content', label: 'Content Photo', hint: 'About or services section image' },
  { key: 'footer_bg', label: 'Footer Background', hint: 'Image behind the footer' },
]

function normalizeTemplateSection(sectionName: string): string {
  const name = sectionName.toLowerCase()
  if (name.includes('nav')) return 'nav'
  if (name.includes('footer')) return 'footer'
  if (name.includes('hero') || name.includes('banner') || name.includes('header')) return 'hero'
  if (name.includes('carousel') || name.includes('slide')) return 'carousel'
  if (name.includes('feature')) return 'features'
  if (name.includes('service') || name.includes('class') || name.includes('menu') || name.includes('amenit')) return 'services'
  if (name.includes('about') || name.includes('story') || name.includes('mission')) return 'about'
  if (name.includes('team') || name.includes('staff') || name.includes('member') || name.includes('agent') || name.includes('doctor') || name.includes('author') || name.includes('speaker')) return 'team'
  if (name.includes('portfolio')) return 'portfolio'
  if (name.includes('gallery') || name.includes('lookbook')) return 'gallery'
  if (name.includes('testimonial') || name.includes('review')) return 'testimonials'
  if (name.includes('blog') || name.includes('post') || name.includes('news') || name.includes('episode')) return 'blog'
  if (name.includes('pricing') || name.includes('plan') || name.includes('tier') || name.includes('package')) return 'pricing'
  if (name.includes('faq')) return 'faq'
  if (name.includes('contact') || name.includes('booking') || name.includes('reserve') || name.includes('rsvp') || name.includes('register') || name.includes('enroll') || name.includes('quote') || name.includes('subscribe')) return 'contact'
  if (name.includes('newsletter')) return 'newsletter'
  if (name.includes('search')) return 'search'
  if (name.includes('sidebar')) return 'sidebar'
  if (name.includes('map') || name.includes('location')) return 'map'
  if (name.includes('cart') || name.includes('checkout') || name.includes('delivery')) return 'pricing'
  if (name.includes('listing') || name.includes('catalog') || name.includes('collection') || name.includes('category') || name.includes('product') || name.includes('course') || name.includes('room') || name.includes('discussion') || name.includes('episode')) return 'services'
  return 'features'
}

function toRowToken(ids: string[]): string {
  if (ids.length <= 1) return ids[0]
  return `row:${ids.join('|')}`
}

function toSizeToken(sizes: SectionSize[]): string {
  if (sizes.length <= 1) return sizes[0]
  return sizes.join('|')
}

export function buildTemplateLayout(sections: string[] = []): TemplateLayoutResult {
  const mapped = sections
    .map(normalizeTemplateSection)
    .map((value) => value.trim())
    .filter(Boolean)

  const orderedUnique: string[] = []
  for (const id of mapped) {
    if (!orderedUnique.includes(id)) orderedUnique.push(id)
  }

  const hasNav = orderedUnique.includes('nav')
  const hasFooter = orderedUnique.includes('footer')
  const middle = orderedUnique.filter((id) => id !== 'nav' && id !== 'footer')
  const rows: Array<{ ids: string[]; sizes: SectionSize[] }> = []
  const pairFriendly = ['features', 'services', 'about', 'team', 'portfolio', 'testimonials', 'blog', 'pricing', 'faq', 'newsletter', 'search']

  if (hasNav) rows.push({ ids: ['nav'], sizes: ['s'] })

  let index = 0
  while (index < middle.length) {
    const current = middle[index]
    const next = middle[index + 1]
    const third = middle[index + 2]

    if (current === 'hero' || current === 'header') {
      rows.push({ ids: [current], sizes: ['l'] })
      index += 1
      continue
    }

    if (current === 'contact' || current === 'map') {
      rows.push({ ids: [current], sizes: ['m'] })
      index += 1
      continue
    }

    if ((current === 'carousel' && next === 'gallery') || (current === 'gallery' && next === 'carousel')) {
      rows.push({ ids: [current, next], sizes: ['m', 'm'] })
      index += 2
      continue
    }

    if (
      next &&
      third &&
      pairFriendly.includes(current) &&
      pairFriendly.includes(next) &&
      pairFriendly.includes(third)
    ) {
      rows.push({ ids: [current, next, third], sizes: ['s', 'm', 's'] })
      index += 3
      continue
    }

    if (next && pairFriendly.includes(current) && pairFriendly.includes(next)) {
      rows.push({ ids: [current, next], sizes: ['m', 'm'] })
      index += 2
      continue
    }

    if (pairFriendly.includes(current)) {
      rows.push({ ids: [current], sizes: ['m'] })
      index += 1
      continue
    }

    rows.push({ ids: [current], sizes: ['m'] })
    index += 1
  }

  if (hasFooter) rows.push({ ids: ['footer'], sizes: ['s'] })
  if (rows.length === 0) {
    rows.push({ ids: ['nav'], sizes: ['s'] })
    rows.push({ ids: ['hero'], sizes: ['l'] })
    rows.push({ ids: ['services', 'about'], sizes: ['m', 'm'] })
    rows.push({ ids: ['contact'], sizes: ['m'] })
    rows.push({ ids: ['footer'], sizes: ['s'] })
  }

  const pageLayouts = rows.map((row) => toRowToken(row.ids))
  const pageSectionSizes = rows.map((row) => toSizeToken(row.sizes))

  const contentSet = new Set<string>()
  if (orderedUnique.includes('hero')) contentSet.add('hero')
  if (orderedUnique.includes('about')) contentSet.add('about')
  if (orderedUnique.includes('services') || orderedUnique.includes('features')) contentSet.add('services')
  if (orderedUnique.includes('portfolio') || orderedUnique.includes('gallery')) contentSet.add('portfolio')
  if (orderedUnique.includes('testimonials')) contentSet.add('testimonials')
  if (orderedUnique.includes('contact')) contentSet.add('contact')
  if (orderedUnique.includes('blog')) contentSet.add('blog')
  if (orderedUnique.includes('pricing')) contentSet.add('pricing')
  if (orderedUnique.includes('team')) contentSet.add('team')
  if (orderedUnique.includes('faq')) contentSet.add('faq')

  return {
    pageLayouts,
    pageSectionSizes,
    contentSections: Array.from(contentSet),
    carouselCount: orderedUnique.includes('carousel') ? 3 : 0,
    galleryCount: orderedUnique.includes('gallery') ? 4 : 0,
  }
}

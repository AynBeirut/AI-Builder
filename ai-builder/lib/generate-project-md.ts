/**
 * Generates a structured project.md "brain" document from project name + metadata.
 * This file is injected into the Agent's system prompt so every build is 100% accurate.
 */

import { getFontLabel } from "@/lib/font-options"

type MetaRecord = Record<string, unknown>

const str = (v: unknown): string => (v != null ? String(v) : '')

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(str).map(s => s.trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
  return []
}

export function generateProjectMd(name: string, meta: MetaRecord): string {
  const lines: string[] = []
  const hasText = (v: unknown): boolean => str(v).trim().length > 0

  lines.push(`# Project Brief: ${name}`)
  lines.push('')

  // ── Brand & Design ────────────────────────────────────────────────────────
  lines.push('## Brand & Design')
  if (meta.brandName)      lines.push(`- **Brand Name:** ${str(meta.brandName)}`)
  if (meta.primaryColor)   lines.push(`- **Primary Color:** ${str(meta.primaryColor)}`)
  if (meta.brandColors) {
    const colors = Array.isArray(meta.brandColors) ? (meta.brandColors as string[]) : [str(meta.brandColors)]
    if (colors.length > 0) {
      const labels = ['Primary', 'Secondary', 'Accent']
      const colorList = colors.map((c, i) => `${labels[i] || `Color ${i+1}`}: ${c}`).join(' | ')
      lines.push(`- **Brand Colors:** ${colorList}`)
    }
  }
  if (meta.template)       lines.push(`- **Template / Style:** ${str(meta.template)}`)
  if (meta.fontFamily)     lines.push(`- **Preferred Font:** ${getFontLabel(str(meta.fontFamily))}`)
  if (meta.numberOfPages)  lines.push(`- **Number of Pages:** ${str(meta.numberOfPages)}`)
  if (meta.pageNames) {
    const pages = Array.isArray(meta.pageNames) ? (meta.pageNames as string[]).join(', ') : str(meta.pageNames)
    lines.push(`- **Pages:** ${pages}`)
  }
  if (meta.logo) {
    const logoVal = str(meta.logo)
    lines.push(`- **Logo:** ${logoVal.startsWith('data:') ? 'images/logo.jpg' : logoVal}`)
  }
  if (meta.images) {
    const imgs = meta.images as unknown[]
    if (Array.isArray(imgs) && imgs.length > 0) {
      const imgRefs = imgs.map((img, i) => {
        const s = str(img)
        return s.startsWith('data:') ? `images/brand-image-${i + 1}.jpg` : s
      })
      lines.push(`- **Images:** ${imgRefs.join(', ')}`)
    }
  }
  lines.push('')

  // ── Company Info ──────────────────────────────────────────────────────────
  lines.push('## Company Info')
  if (meta.mission) lines.push(`- **Mission:** ${str(meta.mission)}`)
  if (meta.vision)  lines.push(`- **Vision:** ${str(meta.vision)}`)
  if (meta.aboutUs) lines.push(`- **About:** ${str(meta.aboutUs)}`)
  if (meta.servicesDescription) lines.push(`- **Services Overview:** ${str(meta.servicesDescription)}`)
  if (meta.servicesList) {
    const list = Array.isArray(meta.servicesList) ? (meta.servicesList as string[]).join(', ') : str(meta.servicesList)
    if (list) lines.push(`- **Services List:** ${list}`)
  }
  lines.push('')

  // ── Contact ───────────────────────────────────────────────────────────────
  lines.push('## Contact')
  if (meta.phone)    lines.push(`- **Phone:** ${str(meta.phone)}`)
  if (meta.email)    lines.push(`- **Email:** ${str(meta.email)}`)
  if (meta.location) lines.push(`- **Location:** ${str(meta.location)}`)
  lines.push('')

  // ── Social Media ──────────────────────────────────────────────────────────
  lines.push('## Social Media')
  if (meta.facebook)  lines.push(`- **Facebook:** ${str(meta.facebook)}`)
  if (meta.twitter)   lines.push(`- **Twitter:** ${str(meta.twitter)}`)
  if (meta.linkedin)  lines.push(`- **LinkedIn:** ${str(meta.linkedin)}`)
  if (meta.instagram) lines.push(`- **Instagram:** ${str(meta.instagram)}`)
  lines.push('')

  // ── Template Options ────────────────────────────────────────────────────────
  const hasOptions =
    meta.navType ||
    meta.navigationStyle ||
    meta.extras ||
    meta.carouselCount ||
    meta.galleryCount
  if (hasOptions) {
    lines.push('## Template Options')
    const canonicalNavType = str(meta.navType || meta.navigationStyle)
    if (canonicalNavType) {
      lines.push(`- **Navigation Style:** ${canonicalNavType}`)
    }
    if (meta.extras) {
      const ex = Array.isArray(meta.extras) ? (meta.extras as string[]).join(', ') : str(meta.extras)
      if (ex) lines.push(`- **Extra Components:** ${ex}`)
    }
    if (meta.carouselCount) lines.push(`- **Carousel Slides:** ${str(meta.carouselCount)}`)
    if (meta.galleryCount)  lines.push(`- **Gallery Images:** ${str(meta.galleryCount)}`)
    lines.push('')
  }

  // ── Wizard Structure ─────────────────────────────────────────────────────
  const hasWizardStructure =
    meta.templateSections ||
    meta.contentSections ||
    meta.pageLayouts ||
    meta.pageSectionSizes ||
    meta.sectionPageMap ||
    meta.pageCarousel ||
    meta.pageGallery

  if (hasWizardStructure) {
    lines.push('## Wizard Structure')

    const templateSections = toStringArray(meta.templateSections)
    if (templateSections.length > 0) {
      lines.push(`- **Template Blocks:** ${templateSections.join(' → ')}`)
    }

    const selectedSections = toStringArray(meta.contentSections)
    if (selectedSections.length > 0) {
      lines.push(`- **Selected Content Blocks:** ${selectedSections.join(', ')}`)
    }

    const pageLayouts = (meta.pageLayouts as Record<string, unknown>) || {}
    const pageSectionSizes = (meta.pageSectionSizes as Record<string, unknown>) || {}
    const pageCarousel = (meta.pageCarousel as Record<string, unknown>) || {}
    const pageGallery = (meta.pageGallery as Record<string, unknown>) || {}
    const pageNames = toStringArray(meta.pageNames)
    const layoutPages = Object.keys(pageLayouts)
    const sizePages = Object.keys(pageSectionSizes)
    const pages = Array.from(new Set([...pageNames, ...layoutPages, ...sizePages]))

    if (pages.length > 0) {
      for (const page of pages) {
        lines.push(`### ${page}`)

        const pageBlocks = toStringArray(pageLayouts[page])
        if (pageBlocks.length > 0) {
          const readableBlocks = pageBlocks.map((block) => {
            if (block.startsWith('row:')) {
              const items = block
                .slice(4)
                .split('|')
                .map((value) => value.trim())
                .filter(Boolean)
              return `[${items.join(' + ')}]`
            }
            return block
          })
          lines.push(`- **Layout Blocks (order):** ${readableBlocks.join(' → ')}`)
        }

        const sizeList = toStringArray(pageSectionSizes[page])
        if (sizeList.length > 0) {
          const normalized = sizeList.map((s, idx) => {
            if (s.includes('|')) {
              const multi = s
                .split('|')
                .map((part) => part.trim().toLowerCase())
                .map((part) => (part === 's' ? 'Small' : part === 'l' ? 'Large' : 'Medium'))
              return `${idx + 1}:${multi.join(' + ')}`
            }
            const v = s.toLowerCase()
            const readable = v === 's' ? 'Small' : v === 'l' ? 'Large' : 'Medium'
            return `${idx + 1}:${readable}`
          })
          lines.push(`- **Block Sizes (by order):** ${normalized.join(' | ')}`)
        }

        const carouselCount = Number(pageCarousel[page] || 0)
        const galleryCount = Number(pageGallery[page] || 0)
        if (Number.isFinite(carouselCount) && carouselCount > 0) {
          lines.push(`- **Carousel Slides:** ${carouselCount}`)
        }
        if (Number.isFinite(galleryCount) && galleryCount > 0) {
          lines.push(`- **Gallery Images:** ${galleryCount}`)
        }
      }
    }

    const sectionPageMap = (meta.sectionPageMap as Record<string, unknown>) || {}
    const sectionKeys = Object.keys(sectionPageMap)
    if (sectionKeys.length > 0) {
      lines.push('### Section to Page Mapping')
      for (const sectionName of sectionKeys) {
        const mappedPages = toStringArray(sectionPageMap[sectionName])
        if (mappedPages.length > 0) {
          lines.push(`- **${sectionName}:** ${mappedPages.join(', ')}`)
        }
      }
    }

    lines.push('')
  }

  // ── Pages & Images ─────────────────────────────────────────────────────────
  // Use pageImagePaths (lightweight paths) if available; fall back to pageImages keys
  const piPaths = (meta.pageImagePaths || meta.pageImages) as Record<string, Record<string, string>> | undefined
  if (piPaths) {
    const pageNames = Object.keys(piPaths)
    if (pageNames.length > 0) {
      lines.push('## Pages & Images')
      for (const page of pageNames) {
        const sections = Object.keys(piPaths[page] || {}).filter(s => piPaths[page][s])
        lines.push(`### ${page}`)
        if (sections.length > 0) {
          for (const section of sections) {
            const val = piPaths[page][section]
            // If it's a path (not base64), write it directly; if base64, generate path
            const imgRef = val && val.startsWith('data:')
              ? `images/${page.toLowerCase().replace(/\s+/g, '-')}-${section}.jpg`
              : (val || 'uploaded')
            lines.push(`- **${section}:** ${imgRef}`)
          }
        } else {
          lines.push('- No images uploaded yet')
        }
      }
      lines.push('')
    }
  }

  // ── Planner Session Recap ─────────────────────────────────────────────────
  if (meta.plannerRecap) {
    lines.push('## Planner Session Recap')
    lines.push(str(meta.plannerRecap))
    lines.push('')
  }

  // ── Build Plan ────────────────────────────────────────────────────────────
  if (meta.buildPlan) {
    lines.push('## Build Plan')
    lines.push(str(meta.buildPlan))
    lines.push('')
  }

  // ── Todo List ─────────────────────────────────────────────────────────────
  if (meta.todoList) {
    lines.push('## Todo List')
    lines.push(str(meta.todoList))
    lines.push('')
  }

  if (meta.customBriefNotes && str(meta.customBriefNotes).trim()) {
    lines.push('## Custom Notes')
    lines.push(str(meta.customBriefNotes).trim())
    lines.push('')
  }

  lines.push('## Pre-Build Focus Checklist')

  const hasPageLayoutData =
    Object.keys((meta.pageLayouts as Record<string, unknown>) || {}).length > 0 ||
    Object.keys((meta.sectionPageMap as Record<string, unknown>) || {}).length > 0

  const hasImageAssets =
    hasText(meta.logo) ||
    toStringArray(meta.images).length > 0 ||
    Object.keys((meta.pageImagePaths as Record<string, unknown>) || {}).length > 0

  const hasAudienceSignal =
    hasText(meta.targetAudience) ||
    hasText(meta.category) ||
    hasText(meta.contentTone) ||
    hasText(meta.description) ||
    hasText(meta.aboutUs)

  const hasGoalSignal =
    hasText(meta.primaryGoal) ||
    hasText(meta.callToAction) ||
    hasText(meta.mission) ||
    hasText(meta.description)

  const checklist: Array<{ label: string; known: boolean }> = [
    { label: 'Brand name', known: hasText(meta.brandName) || hasText(name) },
    { label: 'Target audience', known: hasAudienceSignal },
    { label: 'Primary conversion goal / CTA', known: hasGoalSignal },
    { label: 'Page list', known: toStringArray(meta.pageNames).length > 0 || hasText(meta.numberOfPages) || hasPageLayoutData },
    { label: 'Core content blocks', known: toStringArray(meta.contentSections).length > 0 || toStringArray(meta.templateSections).length > 0 || hasPageLayoutData },
    { label: 'Color palette', known: hasText(meta.primaryColor) || toStringArray(meta.brandColors).length > 0 },
    { label: 'Typography preference', known: hasText(meta.fontFamily) },
    { label: 'Feature priorities', known: toStringArray(meta.specialFeatures).length > 0 || toStringArray(meta.extras).length > 0 },
    { label: 'Proof assets (testimonials / portfolio / logos)', known: hasText(meta.testimonials) || hasText(meta.portfolio) || hasText(meta.caseStudies) || hasImageAssets },
    { label: 'Contact details', known: hasText(meta.email) || hasText(meta.phone) || hasText(meta.location) },
  ]

  lines.push('### Known')
  const knownItems = checklist.filter((item) => item.known)
  if (knownItems.length > 0) {
    for (const item of knownItems) lines.push(`- ${item.label}`)
  } else {
    lines.push('- None yet')
  }

  lines.push('')
  lines.push('### Missing (ask before build starts)')
  const missingItems = checklist.filter((item) => !item.known)
  if (missingItems.length > 0) {
    for (const item of missingItems) lines.push(`- ${item.label}`)
  } else {
    lines.push('- No critical gaps detected')
  }
  lines.push('')

  return lines.join('\n')
}

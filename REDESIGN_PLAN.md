# Gulf Solar Website Redesign Plan

## Branch: `new-design`

---

## Overview
Complete redesign of Gulf Solar website with new branding (Deep Navy + Gold), modern layout, scroll animations, and sun parallax effect.

## Brand Colors
- **Deep Navy**: #1D26536 (Primary)
- **Gold**: #FFC343 (Accent)
- **Off-White**: #F4F4F6 (Background)
- **Light Gray**: #D1D5D9 (Secondary)

## New Sections (Top to Bottom)

### 1. Hero Section
- Full viewport height
- Large headline: "Solar systems designed for island life."
- Subheadline about Hauraki Gulf specialization
- Sun parallax animation (rises as you scroll down, sets as you scroll up)
- Two CTAs: "Get Your Free Quote" + "View Our Work"
- Background: Island imagery (placeholder for now)

### 2. Stats Section
- 3-column grid with animated counters
- Stats:
  1. Total savings tracked (animated counter)
  2. Remote islands served (animated counter) - NEW
  3. Years serving the Gulf (animated counter) - NEW
- REMOVE: Installations count
- Scroll-triggered animation

### 3. Services Section
- Numbered cards (01, 02, 03 style like Greentech)
- Services:
  1. Residential Solar
  2. Commercial Systems
  3. Remote Island Specialists (highlighted)
- Icon + description for each
- Hover effects

### 4. Solar Estimator Section
- Keep existing calculator functionality
- Update styling to match new brand colors
- Clean card design with navy background
- Prominent placement

### 5. Testimonials Carousel
- 5-6 fictional testimonials from island residents
- Names/locations:
  - Sarah & Mike, Waiheke Island
  - James, Great Barrier Island
  - The Hendersons, Rakino Island
  - Local business owner
  - More TBD
- Avatar placeholders (circular, gold border)
- Carousel with auto-play

### 6. Remote Coverage Section (NEW)
- "We come to you" messaging
- Visual showing Hauraki Gulf coverage
- List of islands served
- Badge/icon showing ferry/boat access
- Map placeholder

### 7. Contact Section
- Contact form (name, email, phone, island/location, message)
- Phone number display
- Email display
- Quick contact buttons

### 8. Footer
- Clean, minimal
- Logo
- Contact info
- Social links
- Copyright

---

## Phase 1: Layout & Structure

### Tasks:
1. ✅ Update color scheme in tailwind.config.js
2. ✅ Create new page sections structure
3. ✅ Build Hero section with sun animation placeholder
4. ✅ Build Stats section
5. ✅ Build Services section
6. ✅ Update Calculator styling
7. ✅ Build Testimonials section (fictional content)
8. ✅ Build Remote Coverage section
9. ✅ Build Contact section
10. ✅ Build Footer
11. ✅ Update navigation

### Phase 2: Animations

### Tasks:
1. Install shadcn scroll animation component
2. Implement scroll-triggered reveals
3. Implement sun parallax effect
4. Implement stat counter animations
5. Test all animations

---

## Files to Create/Modify

### New Files:
- `app/_components/Hero.js`
- `app/_components/StatsSection.js`
- `app/_components/ServicesGrid.js`
- `app/_components/IslandCoverage.js`
- `app/_components/ContactSection.js`
- `app/_components/Footer.js`
- `app/_components/SunParallax.js` (sun animation component)
- `app/_components/ScrollReveal.js`

### Modified Files:
- `tailwind.config.js` - Update colors
- `app/page.js` - Complete rewrite with new structure
- `app/_components/Calculator.js` - Update styling
- `app/_components/TestimonialsCarousel.js` - Update content
- `app/layout.js` - Update meta, fonts if needed

---

## Current Status

**Phase**: 1 - Layout & Structure ✅ COMPLETE
**Phase**: 2 - Animations ✅ COMPLETE
**Progress**: All phases completed. Site is fully functional with smooth animations.
**Status**: ✅ READY FOR IMAGES/VIDEO

---

## Phase 1 Summary ✅

**Completed Tasks:**
1. Updated Tailwind config with new brand colors (Navy + Gold)
2. Created Hero section with sun animation placeholder
3. Created Stats section with new stats (removed installs count)
4. Created Services grid with numbered cards (01-03 style)
5. Updated Calculator styling to match new brand
6. Created Testimonials section with 5 fictional testimonials
7. Created Island Coverage section with 12 islands listed
8. Created Contact section with form and contact info
9. Created Footer with branding and links
10. Updated main page.js with new structure
11. Fixed scrolling issue (removed overflow-hidden)
12. Verified build passes successfully

---

## Phase 2 Summary ✅

**Installed:**
- Framer Motion for smooth animations (shadcn component unavailable)

**Animations Implemented:**

### Hero Section
- ✅ Sun rises as you scroll down (parallax effect with useScroll/useTransform)
- ✅ Content fades out as you scroll past hero
- ✅ Background gradient parallax movement
- ✅ Logo grid stagger animation on load
- ✅ Headline and CTA fade-in animations
- ✅ Smooth scroll indicator bounce

### Stats Section  
- ✅ Scroll-triggered reveal with stagger effect
- ✅ Stats cards animate in sequence
- ✅ Counter animations for numbers
- ✅ Hover effects on cards

### Services Section
- ✅ Scroll-triggered reveal
- ✅ Service cards stagger in from bottom
- ✅ Hover lift effect (cards rise up on hover)
- ✅ Number scale animation
- ✅ Features list stagger animation
- ✅ "Our Specialty" badge spring animation

### Testimonials Section
- ✅ Auto-rotating carousel (6 second intervals)
- ✅ Smooth fade transitions between testimonials
- ✅ Avatar scale animation
- ✅ Navigation dots animate width on active
- ✅ Quote marks subtle animation

### Island Coverage Section
- ✅ Islands grid stagger animation (each island pops in)
- ✅ Island cards hover scale effect
- ✅ Feature cards slide up on scroll
- ✅ Icon spring animation
- ✅ CTA button hover effects

### Contact Section
- ✅ Left column slides in from left
- ✅ Right form slides in from right
- ✅ Form fields stagger in sequence
- ✅ Contact info items stagger animation
- ✅ Button hover/tap effects

### Global Animations
- ✅ Smooth scroll behavior (CSS scroll-behavior)
- ✅ Consistent easing curves across all animations
- ✅ Optimized with will-change and transform3d
- ✅ Reduced motion support (respects user preferences)

**Build Status**: ✅ Success
**Dev Server**: ✅ Running on http://localhost:3000
**Files Created**: 9 new components + ScrollReveal utility
**Files Modified**: 10 files total

---

## Notes

- Keep existing calculator logic, just update styling
- Use placeholder images for now - user will provide real ones later
- Sun animation should be subtle but noticeable
- Mobile-first responsive design
- Performance optimization for scroll animations

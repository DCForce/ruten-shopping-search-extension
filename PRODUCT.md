# Product Requirements Document: Multi-Platform Shopping Search Extension

## Product Overview

**Product Name:** 多平台購物搜尋 (Multi-Platform Shopping Search)
**Version:** 1.2.3
**Platform:** Chrome Extension
**Target Market:** Taiwan
**Product Type:** Browser Productivity Tool

### Executive Summary

Multi-Platform Shopping Search is a Chrome extension designed to streamline the online shopping experience for Taiwanese consumers. The product addresses the common pain point of manually visiting multiple e-commerce platforms to compare prices and product availability. By enabling users to search across 10 major platforms with a single action, we reduce friction in the product discovery and price comparison process.

## Problem Statement

### User Pain Points

1. **Time-consuming manual searches**: Users need to open multiple tabs and manually search on each platform
2. **Context switching overhead**: Copying and pasting search terms across different sites is tedious
3. **Lost opportunities**: Users may miss better deals by not checking all available platforms
4. **History tracking**: No centralized way to track what products users have searched for across platforms
5. **Platform overload**: Not all shopping contexts require all platforms (e.g., streaming sites don't need shopping context menus)

### Market Opportunity

- Taiwan's e-commerce market is highly fragmented with multiple dominant players
- Price-conscious consumers regularly compare across platforms
- No single platform has achieved monopoly status, making multi-platform search essential
- Growing MTG (Magic: The Gathering) and gaming community needs specialized platform access

## Product Vision

**Mission:** Empower Taiwanese online shoppers to make informed purchasing decisions by providing instant, friction-free access to multiple shopping platforms.

**Vision:** Become the essential tool for every online shopper in Taiwan, saving users time and helping them discover the best deals across the entire e-commerce ecosystem.

## Target Users

### Primary Personas

**1. The Savvy Shopper (張小華)**
- Age: 25-40
- Behavior: Compares prices before every purchase
- Frequency: Shops online 3-5 times per week
- Pain point: Wastes 10-15 minutes per search comparing platforms
- Goal: Find the best deal quickly

**2. The Collector (陳大明)**
- Age: 20-35
- Interest: MTG cards, board games, collectibles
- Behavior: Tracks specific items across multiple sellers
- Pain point: Manually checking specialized gaming platforms
- Goal: Never miss a rare card listing

**3. The Book Lover (林雅婷)**
- Age: 30-50
- Interest: Books across multiple bookstores
- Behavior: Checks availability and delivery times
- Pain point: Different bookstores have different inventory
- Goal: Find books quickly with best delivery options

## Core Features & User Stories

### 1. Context Menu Search

**Priority:** P0 (Must Have)

**User Story:**
As a user browsing any website, when I select product text and right-click, I want to see search options for all enabled platforms so that I can quickly check prices without manually visiting each site.

**Acceptance Criteria:**
- Context menu appears on text selection
- "Search all platforms" option opens all enabled platforms
- Individual platform options available
- New tabs open with search results
- Context menu hidden on disabled domains

**Business Value:** Core differentiator, reduces search time from 5+ minutes to 5 seconds

---

### 2. Platform Management System

**Priority:** P0 (Must Have)

**User Story:**
As a user with specific shopping needs, I want to enable/disable platforms by category so that I only see relevant search options for my current shopping context.

**Acceptance Criteria:**
- Three categories visible: Shopping, Books, Games
- Category-level toggle enables/disables all platforms in category
- Individual platform toggles available
- Settings persist across browser sessions
- Settings sync across devices via Chrome Storage Sync

**Business Value:** Reduces cognitive load, improves user experience for niche shoppers

**Supported Platforms:**

| Category | Platforms | Business Rationale |
|----------|-----------|-------------------|
| Shopping | momo, PChome, 露天拍賣, 蝦皮, Yahoo | Top 5 Taiwan e-commerce platforms by market share |
| Books | 博客來, 誠品, Taaze | Dominant online bookstores in Taiwan |
| Games | Scryfall, 遊戲平方 | MTG card search and Taiwan gaming store |

---

### 3. Search History Tracking

**Priority:** P1 (Should Have)

**User Story:**
As a user researching multiple products, I want to see my search history with timestamps so that I can revisit previous searches and track my shopping research.

**Acceptance Criteria:**
- Automatically records all searches
- Displays search term, timestamp, and platform
- Maximum 100 entries (FIFO deletion)
- Individual entry deletion available
- Stored in local storage for performance

**Business Value:** Increases user retention, provides re-engagement opportunities

**Technical Constraints:**
- 100 entry limit prevents storage bloat
- Local storage (not sync) for performance optimization

---

### 4. Smart Wishlist Management

**Priority:** P1 (Should Have)

**User Story:**
As a user tracking products over time, I want to save items to a wishlist with URLs so that I can quickly access products I'm considering purchasing.

**Acceptance Criteria:**
- Manual text/URL entry supported
- Auto-detection of valid URLs (http/https only)
- One-click "Add current page" button
- Duplicate URL prevention
- Clickable links for URL entries
- Plain text fallback for non-URL entries

**Business Value:** Increases user engagement, provides purchase intent data

**Implementation Details:**
- URL validation using JavaScript URL constructor
- Extracts hostname as default name for URLs
- Sync storage for cross-device wishlist access

---

### 5. Disabled Sites Management

**Priority:** P2 (Nice to Have)

**User Story:**
As a user browsing entertainment sites, I want to disable the context menu on specific domains so that I don't see shopping options in inappropriate contexts.

**Acceptance Criteria:**
- Add/remove domains via settings UI
- Domain matching includes subdomains
- Default disabled: netflix.com
- Real-time context menu updates on tab change
- Settings persist across sessions

**Business Value:** Reduces user annoyance, improves perceived intelligence of extension

**Technical Implementation:**
- Hostname extraction via URL API
- Subdomain matching: `hostname === site || hostname.endsWith('.${site}')`
- Dynamic menu refresh on `chrome.tabs.onActivated`

---

## User Experience Flow

### Primary Flow: Quick Search
```
1. User selects product text on any webpage
2. Right-click opens context menu
3. User clicks "Search all platforms" OR specific platform
4. New tabs open with search results
5. Search recorded in history automatically
```

**Time to value:** < 5 seconds

### Secondary Flow: Wishlist Management
```
1. User finds interesting product page
2. Opens extension popup
3. Clicks "Add current page" button
4. Item saved with page title and URL
5. User can access later from any device
```

**Time to value:** < 10 seconds

## Success Metrics

### Primary KPIs

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Daily Active Users | 1,000+ | Chrome Analytics |
| Avg Searches per User per Day | 3+ | Storage analytics |
| User Retention (7-day) | 60%+ | Usage tracking |
| Wishlist Utilization Rate | 40%+ | % users with 1+ wishlist items |

### Secondary Metrics

- Average platforms enabled per user
- History deletion rate (user dissatisfaction indicator)
- Disabled sites list growth (feature adoption)
- Category toggle usage frequency

## Technical Architecture

### Storage Strategy

**Chrome Storage Sync (8KB limit):**
- Sites configuration
- Wishlist items
- Disabled sites list
- **Rationale:** Enables cross-device experience

**Chrome Storage Local (10MB limit):**
- Search history (100 entries)
- **Rationale:** Performance optimization for frequent writes

### Performance Considerations

- Context menu updates debounced to prevent UI lag
- Lazy loading of popup UI components
- Webpack bundling reduces extension size
- Minimal permissions for user trust

### Security & Privacy

- **No data collection:** All data stored locally
- **No external API calls:** Pure client-side operation
- **Minimal permissions:** Only storage, contextMenus, activeTab, tabs
- **HTTPS enforcement:** Only valid HTTPS URLs in wishlist

## Release Strategy

### Version 1.2.3 (Current)
- ✅ All core features implemented
- ✅ Published on Chrome Web Store
- ✅ Basic documentation complete

### Future Roadmap

**Version 1.3.0 (Next)**
- Export search history to CSV
- Keyboard shortcuts for quick search
- Customizable platform URL templates
- Dark mode support

**Version 1.4.0**
- Price tracking integration (if API available)
- Browser notifications for wishlist items
- Advanced filtering in search history

**Version 2.0.0 (Future)**
- Support for Edge/Firefox
- Cloud sync option for wishlist
- Collaborative wishlists (family/friends)

## Go-to-Market Strategy

### Distribution Channels
1. **Chrome Web Store** (Primary)
   - Current: 10+ active users
   - Target: 5,000+ installs in 6 months

2. **Developer Community**
   - GitHub repository for open-source contributions
   - Reddit posts in r/Taiwan shopping communities

3. **Word of Mouth**
   - MTG Taiwan communities (Scryfall integration unique value)
   - Shopping deal forums (PTT, Dcard)

### Marketing Messaging

**Value Proposition:**
"Compare prices across Taiwan's top shopping platforms in one click. Never overpay again."

**Key Differentiators:**
- ✅ Taiwan-focused platform selection
- ✅ Category-based organization (Shopping/Books/Games)
- ✅ Completely free, no ads
- ✅ Privacy-first (no data collection)

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Platform URL changes | High | Medium | Monitor platform changes, quick update process |
| Chrome API deprecation | High | Low | Follow Chrome Extension roadmap, early adoption of new APIs |
| Low user adoption | Medium | Medium | Improve onboarding, add tutorial |
| Competitor emergence | Low | Medium | Open source advantage, community building |

## Dependencies & Constraints

### Technical Dependencies
- Chrome Extension Manifest V3 compliance
- Webpack 5 build system
- Chrome Storage API availability

### Business Constraints
- No monetization strategy (free product)
- Volunteer maintenance model
- No dedicated design resources

### External Dependencies
- Shopping platform URLs remain stable
- Chrome Web Store approval process
- GitHub for distribution and collaboration

## Open Questions

1. Should we implement price tracking if platform APIs become available?
2. Is there demand for mobile browser support (Kiwi Browser, etc.)?
3. Should we add affiliate links for monetization?
4. Would users pay for premium features (price alerts, advanced history)?

## Appendix

### User Feedback Analysis
_(To be populated with Chrome Web Store reviews and GitHub issues)_

### Competitive Analysis
- **PriceSpy Taiwan**: Full website, not extension, slower workflow
- **Generic price comparison extensions**: Not Taiwan-focused, missing local platforms
- **Manual bookmarks**: No search history, no category management

### Technical Specifications
- Manifest Version: 3
- Minimum Chrome Version: 88+
- Bundle Size: <100KB
- Permissions: storage, contextMenus, activeTab, tabs

---

**Document Owner:** Product Management
**Last Updated:** 2025-09-30
**Status:** Living Document
**Review Cycle:** Quarterly
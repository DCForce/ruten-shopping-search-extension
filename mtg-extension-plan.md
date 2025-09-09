# MTG Extension Transformation Plan

## Overview
Transform the current multi-platform shopping extension into an MTG-focused card data browser and collection manager targeting MTG players who want to browse/store card information from Scryfall, EDHREC, and other MTG sites.

## Phase 1: Core Infrastructure Changes

### 1. Rebrand Extension Identity
- Update `manifest.json` name/description to "MTG Card Explorer" or similar
- Replace current icons with MTG-themed icons
- Update README and documentation
- Change extension description to focus on MTG card research and collection management

### 2. Refactor Site Configuration
- Remove non-MTG shopping platforms (momo, PChome, Yahoo, 蝦皮, 博客來, 誠品, Taaze)
- Keep and enhance MTG-focused sites:
  - **Scryfall** (enhanced with advanced search syntax)
  - **EDHREC** (deck recommendations and statistics)
  - **Gamesquare** (card purchasing in Taiwan)
- Add new MTG sites:
  - **MTGWiki** - Card lore and comprehensive information
  - **Gatherer** - Official Wizards card database
  - **MTGTop8** - Tournament decklists and meta analysis
  - **EDHTop16** - Competitive Commander data
  - **MTGGoldfish** - Price tracking and meta analysis
  - **Archidekt** - Deck building platform

## Phase 2: Enhanced MTG Features

### 3. Card Data Integration
- Integrate Scryfall API for real-time card data retrieval
- Add card preview popups when hovering over selected card names
- Display card images, current prices, and format legality
- Cache card data locally to reduce API calls
- Support for different card printings and versions

### 4. Smart Card Recognition
- Improve text selection to recognize MTG card names with proper formatting
- Handle card name variations (e.g., "Lightning Bolt" vs "lightning bolt")
- Support set codes and collector numbers (e.g., "M21-123")
- Recognize card names in different languages
- Auto-suggest corrections for misspelled card names

## Phase 3: Collection Management

### 5. Transform Wishlist to Card Collection
- Convert current wishlist to "Card Collection" with MTG-specific fields:
  - Card name and set
  - Condition (Near Mint, Lightly Played, etc.)
  - Quantity owned
  - Foil/Non-foil status
  - Purchase price and date acquired
  - Current market value
- Include collection value calculation and tracking
- Export collection to popular formats (CSV, MTG Arena, MTGO)

### 6. Deck Tracking
- Add "Decklists" tab alongside collection
- Support multiple deck formats:
  - Commander/EDH (100 cards, singleton)
  - Standard/Modern (60+ cards)
  - Limited formats (40+ cards)
- Import/export deck formats:
  - MTG Arena export format
  - MTGO .dek files
  - Plain text decklists
  - Archidekt/Moxfield URLs
- Deck analysis features:
  - Mana curve visualization
  - Color distribution
  - Card type breakdown

## Phase 4: Advanced MTG Tools

### 7. Format Legality Checker
- Show which formats selected cards are legal in
- Quick format reference with rotation information
- Ban list integration and updates
- Format-specific card recommendations

### 8. Price Comparison and Tracking
- Integrate with multiple pricing sources:
  - TCGPlayer API (if available)
  - CardKingdom pricing
  - Local store prices (Taiwan-specific)
- Show price trends and historical data
- Alert system for price drops on collection/wishlist cards
- Price tracking for entire collection value

### 9. Deck Building Assistant
- Suggest cards based on commander/strategy
- EDHREC integration for popular card recommendations
- Synergy suggestions based on selected cards
- Budget deck building tools

## Technical Implementation Details

### New Storage Schema
```javascript
// Replace current shopping sites configuration
const mtgSites = {
  'scryfall': {
    name: 'Scryfall',
    url: 'https://scryfall.com/search?q=',
    type: 'database',
    apiUrl: 'https://api.scryfall.com/cards/search?q='
  },
  'edhrec': {
    name: 'EDHREC',
    url: 'https://edhrec.com/cards/',
    type: 'recommendations'
  },
  // ... other MTG sites
};

// New card collection storage
const cardCollection = {
  cards: [
    {
      id: 'scryfall-uuid',
      name: 'Lightning Bolt',
      set: 'M21',
      collectorNumber: '163',
      condition: 'NM',
      quantity: 4,
      foil: false,
      acquiredDate: '2024-01-15',
      purchasePrice: 2.50,
      currentPrice: 3.00
    }
  ]
};
```

### API Integrations
- **Scryfall REST API** for card data and high-quality images
- **MTGJSON** for comprehensive card database and set information
- **TCGPlayer API** for pricing (if available)
- **EDHREC data scraping** for recommendation statistics

### UI Enhancements
- Card image previews with hover functionality
- MTG mana symbol rendering using Scryfall symbology
- Format legality indicators with color coding
- Collection statistics dashboard
- Deck visualization tools (mana curve, pie charts)
- Search autocomplete with card name suggestions

## Migration Strategy

### Data Migration
- Convert existing wishlist items to card collection format
- Preserve search history but add MTG-specific metadata
- Maintain user settings and preferences where applicable

### User Experience
- Provide migration guide for existing users
- Offer option to export old shopping data before conversion
- Gradual feature rollout to maintain extension stability

## Development Phases Timeline

1. **Phase 1** (Week 1-2): Core infrastructure and rebranding
2. **Phase 2** (Week 3-4): MTG features and API integration
3. **Phase 3** (Week 5-6): Collection management system
4. **Phase 4** (Week 7-8): Advanced tools and polish

## Success Metrics
- User adoption among MTG players
- Card collection management usage
- API call efficiency and caching effectiveness
- User feedback on MTG-specific features
- Extension performance with enhanced functionality

This plan maintains the extension's core architecture while completely pivoting to serve MTG players' needs for card research, collection management, and deck building assistance.
# Bundai Web - Implementation Plan

## Project Overview
**Current Stack:** React + Vite + Tailwind CSS v4 + Apollo Client
**Backend:** GraphQL API at ~/projects/server
**Goal:** Fix core functionality, improve landing page for mobile conversion, add server-side kanji data

---

## Implementation Plan

### Phase 1: Fix Core Functionality (Priority: CRITICAL)

#### 1.1 Fix Login Flow
- [ ] Verify login mutation works with real GraphQL API
- [ ] Fix login state persistence after page reload
- [ ] Add proper error messages for failed login
- [ ] Test login → dashboard navigation

#### 1.2 Fix Signup Flow
- [ ] Verify signup mutation works
- [ ] Add proper error handling
- [ ] Test signup → login flow
- [ ] Test forgot password flow

---

### Phase 2: Simplify Landing Page (Priority: HIGH)

#### 2.1 Hero Section Simplification
- Remove complex animations and effects
- Simplify tagline
- Add "First 100 Users Free" animated badge
- Clean up button styles

#### 2.2 Add Real App Store & Extension Links
- iOS: `https://apps.apple.com/gb/app/bundai/id6751961361`
- Chrome: `https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en`
- Android: "Coming Soon" message with waitlist option

#### 2.3 Simplify CTAs
- All CTAs should navigate to proper routes
- Dashboard if logged in, signup if not
- No broken or placeholder links

#### 2.4 Add Simple QR Code
- Use qrcode.react library OR simple SVG
- Show iOS App Store URL
- Position: right side of hero on desktop, below CTA on mobile

#### 2.5 Remove Complex Elements
- Remove floating Japanese character animations
- Simplify phone mockups
- Remove unnecessary decorative elements

#### 2.6 Mobile Optimization
- Add fixed bottom CTA bar for mobile download
- Ensure all buttons work on mobile
- Test touch targets

#### 2.7 Social Proof Updates
- Add real testimonials if available
- Add trust badges (4.9/5 rating, 10k+ downloads)
- Ensure all links work

---

### Phase 3: Backend - Add jlptArray.js to Server

#### 3.1 Copy Data File
- Copy `src/util/jlptArray.js` to `~/projects/server/util/`
- Verify file size (~7.5MB)

#### 3.2 Create GraphQL Resolver
- Create: `~/projects/server/resolvers/Kanji.resolver.js`
- Implement queries:
  - getKanjiByJLPT(level)
  - getKanjiByStrokes(strokes)
  - getKanjiByGrade(grade)
  - getKanjiByName(kanjiName)
  - getSimilarKanji(kanjiName)
  - getWordsByJLPT(jlptLevel, type, limit)
  - getTopWordsByType(type, jlptLevel, count)
  - getAllKanji()

#### 3.3 Update GraphQL Schema
- Add types: Kanji, SimilarKanji, UsedInWord, WordData
- Add queries to typeDefs.js
- Register resolver in resolvers/index.js

#### 3.4 Test Backend
- Start server locally
- Test all kanji queries
- Verify performance
- Check error handling

---

### Phase 4: Frontend - Use Server Data

#### 4.1 Create GraphQL Query Files
Create in `src/graphql/queries/`:
- getKanjiByJLPT.query.js
- getKanjiByStrokes.query.js
- getKanjiByGrade.query.js
- getKanjiByName.query.js
- getSimilarKanji.query.js
- getWordsByJLPT.query.js
- getTopWordsByType.query.js

#### 4.2 Update Components to Use Server
- `kanjiTemplate.screen.jsx`: Replace provideData() with useQuery()
- `kanjiDetails.screen.jsx`: Fetch kanji details from server
- `localQuiz.screen.jsx`: Use server for quiz data
- `similars.screen.jsx`: Use server for similar kanji data
- Add LoadingSpinner component to all screens
- Add proper error boundaries
- Handle loading states gracefully

#### 4.3 Test Server Data Flow
- Verify all screens load kanji from server
- Test with slow network
- Verify with fast network
- Check pagination if implemented
- Fix any data display issues

---

### Phase 5: Button & Link Integration

#### 5.1 Landing Page Links
- Connect: iOS App Store button → `https://apps.apple.com/gb/app/bundai/id6751961361`
- Connect: Chrome Extension button → `https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en`
- Android: Show "Coming Soon" message with waitlist
- Connect "Watch Demo" → Proper demo route or modal

#### 5.2 Dashboard Navigation Fix
- All JLPT buttons → `/dashboard/kanji-template` with proper state
- All category buttons → Navigate to correct screens
- Words section → `/dashboard/localQuiz` with category selected
- Kana sections → Navigate to correct template screens
- Settings menu → All items functional

#### 5.3 App Deep Linking
- Add deep link scheme: `bundai://app/...`
- Test app opens from web
- Test fallback to app store if app not installed

#### 5.4 Internal Navigation
- All dashboard links should work
- No broken routes or dead ends
- Consistent navigation patterns

---

### Phase 6: Cleanup & Optimization

#### 6.1 Remove Unused Code
- Delete failed QR code implementation
- Remove unused imports
- Clean up component files
- Delete or comment out broken code

#### 6.2 Performance Optimization
- Lazy load queries where possible
- Optimize bundle size
- Add proper caching

#### 6.3 Testing
- Full end-to-end flow tests:
  * Login → Dashboard → Quiz → Kanji Details
  * Signup flow complete
  * All navigation paths
  * Server queries working

#### 6.4 Documentation
- Update README.md with setup instructions
- Document GraphQL schema changes
- Add component usage examples

---

## File Changes Summary

### Backend Files (~/projects/server)

**New:**
- `util/jlptArray.js` (from web project)
- `resolvers/Kanji.resolver.js` - Kanji data queries

**Modified:**
- `typeDefs.js` - Add Kanji types and queries
- `resolvers/index.js` - Register kanji resolver

### Frontend Files (bundaiWeb)

**Created:**
- `src/graphql/queries/getKanjiByJLPT.query.js`
- `src/graphql/queries/getKanjiByStrokes.query.js`
- `src/graphql/queries/getKanjiByGrade.query.js`
- `src/graphql/queries/getKanjiByName.query.js`
- `src/graphql/queries/getSimilarKanji.query.js`
- `src/graphql/queries/getWordsByJLPT.query.js`
- `src/graphql/queries/getTopWordsByType.query.js`
- `src/components/LoadingSpinner.jsx`

**Modified:**
- `src/pages/landingPage.screen.jsx` - Simplify & fix links
- `src/pages/login.screen.jsx` - Fix authentication flow
- `src/pages/signup.screen.jsx` - Fix authentication flow
- `src/pages/kanjiTemplate.screen.jsx` - Use server queries
- `src/pages/kanjiDetails.screen.jsx` - Use server queries
- `src/pages/localQuiz.screen.jsx` - Use server queries
- `src/pages/similars.screen.jsx` - Use server queries

---

## Questions & Decisions Needed

### QR Code Implementation
**Option A:** Use `qrcode.react` library (simple, production-ready)
**Option B:** Use Google Charts API QR code (simple API call)
**Option C:** Simple SVG-based QR code generator (no dependencies)

**Recommendation:** Option B (Google Charts API) - simple, reliable, no install needed

### Video Demo
**Option A:** Add placeholder video section now
**Option B:** Add "Video Coming Soon" message
**Option C:** Skip until you provide actual video
**Recommendation:** Option B - add placeholder with contact form

### Android Waitlist
**Option A:** Email form: "Get notified when Android launches"
**Option B:** Simple message: "Coming to Android - Join waitlist"
**Recommendation:** Option B - keep it simple for now

### Screenshot Location
**You mentioned:** `~/projects/bundaScreens`
**Actual:** Directory not found in that location
**Questions:**
1. Are screenshots in app project at `~/projects/bundai`?
2. Should I copy any app icons to use as fallbacks?

### Login/Signup Testing
**Questions:**
1. Current GraphQL endpoint: `https://api.bundai.app/graphql` - is this correct for testing?
2. Should I use a test database or real API?
3. Any specific authentication flows I should test?

---

## Success Criteria

- [ ] Login works end-to-end with real credentials
- [ ] Signup works end-to-end
- [ ] Landing page loads quickly and all links work
- [ ] All kanji data loads from server (no more client-side 300KB+)
- [ ] Mobile page converts visitors to app downloads
- [ ] All navigation works across web and app
- [ ] No broken buttons or dead links
- [ ] Server responses are performant
- [ ] Code is clean and maintainable

---

## Timeline Estimate

**Week 1:** Core functionality fixes + simplified landing page
**Week 2:** Backend jlptArray.js integration
**Week 3:** Frontend server data integration
**Week 4:** Button/link integration + deep linking
**Week 5:** Testing, cleanup, and optimization

---

## Next Steps

Please confirm:
1. QR code implementation method (Option A, B, or C recommended)
2. Android waitlist approach (Option A or B recommended)
3. Video demo approach (Option A, B, or C recommended)
4. Should I start with Phase 1 (Login/Signup fixes)?

Once confirmed, I'll proceed with implementation in approved phases.

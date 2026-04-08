<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into bundaiWeb. The `posthog-node` SDK was installed and a singleton client was created at `src/lib/posthog.js`, initialized from `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables. Ten events were instrumented across seven files, covering the full user lifecycle: authentication, learning engagement, subscription checkout, and waitlist sign-ups. User identification (`posthog.identify`) is called on both login and signup with user ID, email, and name. Error tracking (`posthog.captureException`) was added to all critical catch blocks.

| Event | Description | File |
|---|---|---|
| `user signed up` | User successfully created a new account | `src/pages/signup.screen.jsx` |
| `user logged in` | User successfully authenticated with email and password | `src/pages/login.screen.jsx` |
| `checkout started` | User initiated a Paddle checkout for a subscription plan | `src/components/PricingPlans.jsx` |
| `checkout completed` | User successfully completed a Paddle checkout | `src/components/PricingPlans.jsx` |
| `waitlist joined` | User submitted their email to join the Android waitlist | `src/components/AndroidWaitlistForm.jsx` |
| `study session started` | User started a new study session with unlearned flashcards | `src/pages/srs.screen.jsx` |
| `review session started` | User started an SRS review session for due flashcards | `src/pages/srs.screen.jsx` |
| `review session completed` | User completed all cards in an SRS review session | `src/pages/srsEngine.screen.jsx` |
| `study session completed` | User completed all cards in a study session | `src/pages/studyEngine.screen.jsx` |
| `kanji category browsed` | User navigated to a kanji category page (JLPT, stroke, or grade) | `src/pages/dashboard.screen.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/371511/dashboard/1438579
- **Signups & Logins (Daily)**: https://us.posthog.com/project/371511/insights/mt6ijac1
- **Signup to Checkout Conversion Funnel**: https://us.posthog.com/project/371511/insights/BjZMSakZ
- **Study & Review Sessions (Daily)**: https://us.posthog.com/project/371511/insights/m5cPxP0K
- **Waitlist Joins & Checkout Completions**: https://us.posthog.com/project/371511/insights/cKbFMIQy
- **Study Session Completion Rate**: https://us.posthog.com/project/371511/insights/QoAVqZD5

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

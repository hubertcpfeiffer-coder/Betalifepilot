# Mio Life Pilot - GitHub Copilot Instructions

## Project Overview

Mio Life Pilot is a comprehensive AI-powered personal assistant platform built with React 18, TypeScript, and Supabase. The application provides intelligent task management, personal avatar customization, voice assistance, knowledge base management, and more.

**Repository**: [Betalifepilot](https://github.com/hubertcpfeiffer-coder/Betalifepilot)  
**Production Domain**: mio-lifepilot.app  
**Beta Domain**: mio-lifepilot.com

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Tailwind CSS 3 + shadcn/ui components
- **State Management**: React Context API + TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom device tracking
- **Real-time**: Supabase Realtime subscriptions
- **Edge Functions**: Supabase Edge Functions (Deno)

### Development Tools
- **Linter**: ESLint 9 with TypeScript ESLint
- **Package Manager**: npm
- **Node Version**: 18+

## Project Structure

```
/src
  /components     - Reusable React components (UI elements, forms, etc.)
  /contexts       - React contexts (AuthContext, AppContext, RealtimeContext)
  /hooks          - Custom React hooks (useAuth, useTasks, useContacts, etc.)
  /lib            - Utilities and configurations (Supabase client, constants, helpers)
  /pages          - Page components (Login, Dashboard, Tasks, Settings, etc.)
  /services       - Business logic and API calls (auth, tasks, notifications, etc.)
  /types          - TypeScript type definitions (database types, domain models)
  /data           - Mock data and test data
  /docs           - Documentation (DATABASE_SCHEMA.md, SECURITY.md, CONTACTS_ARCHITECTURE.md)
/supabase
  /functions      - Supabase Edge Functions (AI, notifications, webhooks)
  /migrations     - Database migrations (all schema and RLS policies)
/public           - Static assets (icons, images, 404.html)
/.github
  /workflows      - GitHub Actions workflows (deploy.yml)
```

## Coding Standards and Conventions

### TypeScript
- Use TypeScript for all new code (`.ts` and `.tsx` files)
- Type annotations are preferred but not always required (`noImplicitAny: false` in tsconfig)
  - **Note**: The project has relaxed TypeScript settings for faster development in beta phase
  - Prefer adding explicit types when possible for better code maintainability
- Avoid `any` type when possible, but it's allowed when needed
- Use interfaces for object shapes and types for unions/primitives
- Path alias `@/*` is configured to map to `./src/*`
- Unused parameters and locals are allowed (`noUnusedParameters: false`, `noUnusedLocals: false`)
- Strict null checks are disabled (`strictNullChecks: false`)
  - **Note**: Always handle null/undefined cases explicitly in your code even though the compiler won't enforce it
- Skip library checks (`skipLibCheck: true`)

### React
- Use functional components with hooks (no class components)
- Follow React 18 best practices
- Use React.FC or explicit return types for components
- Prefer named exports over default exports for components
- Use `useEffect` with proper dependency arrays
- Follow React Hooks rules (enforced by `eslint-plugin-react-hooks`)
- Use TanStack Query for data fetching and caching
- Use React Context for global state (Auth, App settings, Realtime)

### Component Structure
- Place UI components in `/src/components`
- Page components go in `/src/pages`
- Use shadcn/ui components as base building blocks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks in `/src/hooks`

### Styling
- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design
- Use `clsx` or `cn` utility for conditional class names
- Leverage shadcn/ui component variants with `class-variance-authority`
- Don't use inline styles unless absolutely necessary

### State Management
- Use React Context for cross-cutting concerns (auth, theme, global settings)
- Use TanStack Query for server state (data fetching, caching, mutations)
- Use local component state (`useState`) for UI-only state
- Avoid prop drilling - use Context or composition instead

### File Naming
- React components: PascalCase (e.g., `TaskCard.tsx`, `LoginPage.tsx`)
- Utilities/services: camelCase (e.g., `authService.ts`, `formatDate.ts`)
- Types: PascalCase for interfaces/types (e.g., `User`, `Task`, `NotificationSettings`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`, `useTasks.ts`)

## Database Patterns

### Supabase Client
- Use the singleton client from `/src/lib/supabase.ts`
- Always handle errors from Supabase calls
- Use TypeScript types for database queries and mutations
- Leverage RLS policies - never bypass them in client code

### Row Level Security (RLS)
- All tables have RLS enabled with user_id-based policies
- Standard pattern: Users can only access their own data via `auth.uid() = user_id`
- Never attempt to access other users' data from the client
- See `/src/docs/SECURITY.md` for RLS policy patterns

### Database Schema
- Reference `/src/docs/DATABASE_SCHEMA.md` for complete schema documentation
- All tables use `user_id` foreign key to `auth.users(id)`
- Use UUIDs for primary keys
- Timestamps: `created_at`, `updated_at` are standard across tables
- Core tables: users, user_settings, mio_profiles, tasks, contacts, notifications, etc.

### Queries
- Use TanStack Query for data fetching with proper cache keys
- Implement optimistic updates for better UX
- Use Supabase real-time subscriptions for live data (via RealtimeContext)
- Handle loading and error states appropriately

## Authentication & Security

### Authentication Flow
- Supabase Auth handles JWT token generation and validation
- Custom device tracking system monitors user logins across devices
- Email verification system included
- Device login notifications for security
- Session management via Supabase Auth
- Use `AuthContext` and `useAuth` hook for auth state

### Security Best Practices
- Always validate user input (use Zod schemas with React Hook Form)
- Never expose API keys or secrets in client code
- Use environment variables for sensitive configuration (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Respect RLS policies - never try to circumvent them
- Implement proper error handling without exposing sensitive details
- Reference `/src/docs/SECURITY.md` for complete security guidelines

### Rate Limiting
- Edge Functions implement in-memory rate limiting (15-20 requests/minute)
- Client should handle HTTP 429 responses gracefully
- Implement exponential backoff for failed requests when appropriate

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start Vite dev server on port 8080
npm run lint         # Run ESLint on all files
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build locally
```

### Build Configuration
- Vite base path: `/Betalifepilot/` in production, `/` in development
- Server runs on port 8080 with IPv6 support (`::`)
- SWC plugin used for faster React compilation
- Path alias `@` resolves to `./src`

### ESLint Rules
- Based on recommended TypeScript and React configs
- React Hooks rules enforced
- `@typescript-eslint/no-unused-vars` disabled
- Warn on component exports that could break Fast Refresh
- Ignore `dist` directory

## API and Services

### Service Layer
- Business logic belongs in `/src/services`
- Separate services by domain (auth, tasks, notifications, contacts, etc.)
- Services should return typed responses
- Handle errors at the service level, not in components
- Use async/await for asynchronous operations

### Edge Functions
- Supabase Edge Functions run on Deno runtime
- Located in `/supabase/functions`
- Implement rate limiting and CORS headers
- Handle OPTIONS requests for CORS preflight
- Use environment variables for configuration

### API Calls
- Use Supabase client for all database operations
- Prefer TanStack Query's `useQuery` and `useMutation` hooks
- Implement proper error handling and user feedback
- Use optimistic updates for better perceived performance

## Common Patterns

### Form Handling
- Use React Hook Form for all forms
- Validate with Zod schemas
- Display errors using shadcn/ui form components
- Handle submission states (loading, success, error)
- Reset forms after successful submission

### Toast Notifications
- Use `sonner` for toast notifications
- Success messages for positive actions
- Error messages with clear descriptions
- Avoid overwhelming users with too many toasts

### Modal Dialogs
- Use Radix UI Dialog components (via shadcn/ui)
- Provide clear actions (confirm/cancel)
- Handle keyboard shortcuts (Escape to close)
- Manage focus appropriately

### Data Tables
- Use shadcn/ui table components
- Implement sorting and filtering when relevant
- Show loading states during data fetching
- Display empty states with helpful messages

## Documentation References

- **Database Schema**: `/src/docs/DATABASE_SCHEMA.md`
- **Security Guidelines**: `/src/docs/SECURITY.md`
- **Contacts Architecture**: `/src/docs/CONTACTS_ARCHITECTURE.md`
- **Deployment Guide**: `/DEPLOYMENT.md`
- **GitHub Setup**: `/GITHUB_SETUP.md`
- **Quick Start** (German): `/SCHNELLSTART.md`

## Best Practices for This Repository

### When Adding New Features
1. Check existing patterns in similar features first
2. Reuse existing components and services where possible
3. Follow the established project structure
4. Add TypeScript types for new data structures
5. Update relevant documentation if making significant changes
6. Test locally with `npm run dev` before committing
7. Run `npm run lint` to ensure code quality

### When Fixing Bugs
1. Understand the root cause before making changes
2. Check if the issue affects other parts of the codebase
3. Test the fix thoroughly in the browser
4. Consider adding error handling to prevent similar issues

### When Refactoring
1. Make minimal changes - don't refactor unrelated code
2. Ensure backward compatibility if the code is used elsewhere
3. Test all affected functionality
4. Update comments and documentation if needed

### Code Review Guidelines
- Keep PRs focused and small when possible
- Write clear commit messages describing what and why
- Test changes in both development and production build modes
- Ensure no ESLint errors or warnings are introduced
- Check that the build succeeds (`npm run build`)

## German Language Note

Some documentation and comments are in German (particularly in DEPLOYMENT.md and SCHNELLSTART.md). This is intentional for the target audience. When adding new documentation, prefer English for code-related content and German for user-facing documentation when appropriate.

## Deployment

### Environments
- **Production**: Deployed to mio-lifepilot.app
- **Beta**: Deployed to mio-lifepilot.com via GitHub Actions

### GitHub Actions
- Workflow: `.github/workflows/deploy.yml`
- Triggered on push to `main` branch
- Builds and deploys automatically
- Uses GitHub Secrets for Supabase credentials

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- Set in GitHub Secrets for CI/CD
- Set locally in `.env` file for development (not committed)

## Additional Notes

- This is a **private beta project** - treat all code and data as confidential
- The application uses a **gamified onboarding system** with rewards
- Features include **admin dashboard** for user management and analytics
- **Voice assistant** integration with Mio AI avatar
- **Social media integration** for contact management
- **IQ testing and profiling** functionality
- All personal data is protected with **RLS policies**

## Questions or Issues?

For questions about the codebase, refer to:
1. Existing documentation in `/src/docs`
2. README.md for project overview
3. Code comments in complex areas
4. Similar existing implementations in the codebase

When in doubt, follow the patterns already established in the codebase rather than introducing new approaches.

# Mio Life Pilot

Your intelligent AI life assistant that organizes your life, manages tasks, and supports all your decisions.

## About

Mio Life Pilot is a comprehensive AI-powered personal assistant platform featuring:

- **Personal AI Avatar**: Customizable avatar with voice and personality
- **Smart Task Management**: AI-suggested tasks and intelligent prioritization
- **Knowledge Base**: Personal information management and IQ profiling
- **Contact Intelligence**: Social media integration and activity tracking
- **Voice Assistant**: Natural language interaction with Mio
- **Onboarding System**: Gamified user introduction with rewards
- **Admin Dashboard**: Comprehensive analytics and user management

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT-based auth with device tracking
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6

## Deployment

### Production
- **Domain**: [mio-lifepilot.app](https://mio-lifepilot.app)

### Beta Testing
- **Domain**: [mio-lifepilot.com](https://mio-lifepilot.com)
- **Repository**: [GitHub](https://github.com/hubertcpfeiffer-coder/Betalifepilot)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

```bash
# Clone the repository
git clone https://github.com/hubertcpfeiffer-coder/Betalifepilot.git
cd Betalifepilot

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run migrations (via Supabase dashboard or CLI)
# All migrations are in /supabase/migrations/

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Setup

The application includes 8 comprehensive migrations creating:

- User management and authentication
- Avatar and personality system
- Knowledge and IQ profiling
- Task and contact management
- Notification system
- Onboarding flow
- Device tracking and security
- AI conversation history

All tables include Row Level Security (RLS) policies for data protection.

## Features

### Core Features
- ✅ User authentication with device tracking
- ✅ Email verification system
- ✅ Personal avatar customization
- ✅ Voice assistant integration
- ✅ Task management with AI suggestions
- ✅ Contact management with social integration
- ✅ IQ testing and profiling
- ✅ Knowledge base management
- ✅ Notification system
- ✅ Gamified onboarding

### Admin Features
- ✅ User management dashboard
- ✅ Beta tester approval workflow
- ✅ Feedback collection system
- ✅ System health monitoring
- ✅ Audit logging
- ✅ Analytics and reporting

## Project Structure

```
/src
  /components     - React components
  /contexts       - React contexts (Auth, App, Realtime)
  /hooks          - Custom React hooks
  /lib            - Utilities and configurations
  /pages          - Page components
  /services       - Business logic and API calls
  /types          - TypeScript type definitions
  /data           - Mock data and test data
  /docs           - Documentation
/supabase
  /functions      - Edge Functions
  /migrations     - Database migrations
/public           - Static assets
```

## Contributing

This is a private beta project. For access or inquiries, please contact the project maintainers.

## License

Proprietary - All rights reserved

## Support

For beta testing support: contact via GitHub issues or direct communication channels.

---

**Mio Life Pilot** - Your life, intelligently organized.

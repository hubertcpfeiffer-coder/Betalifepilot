# Mio Life Pilot

Your intelligent AI life assistant that organizes your life, manages tasks, and supports all your decisions.

## 🚀 Beta Testing Now Live!

**Try the beta version now:** [https://hubertcpfeiffer-coder.github.io/Betalifepilot/](https://hubertcpfeiffer-coder.github.io/Betalifepilot/)

📖 **New to the beta?** Check out the [Beta Tester Guide](BETA_TESTER_GUIDE.md) for getting started instructions.  
🔗 **Link Info:** See [LIVE_LINK.md](LIVE_LINK.md) for deployment status and technical details.

---

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

### Current Deployment (GitHub Pages)
- **Live URL**: [https://hubertcpfeiffer-coder.github.io/Betalifepilot/](https://hubertcpfeiffer-coder.github.io/Betalifepilot/)
- **Beta Guide**: See [BETA_TESTER_GUIDE.md](BETA_TESTER_GUIDE.md)
- **Repository**: [GitHub](https://github.com/hubertcpfeiffer-coder/Betalifepilot)

### Future Production Domains
- **Planned Production**: mio-lifepilot.app (coming soon)
- **Planned Beta**: mio-lifepilot.com (coming soon)

## Getting Started

### 🛠️ For Developers

**Complete setup guide:** See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for detailed instructions on:
- Setting up your local development environment
- Configuring Supabase authentication
- Running database migrations
- Setting up OAuth providers (Google, Apple, etc.)
- Troubleshooting common issues

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hubertcpfeiffer-coder/Betalifepilot.git
cd Betalifepilot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run migrations (via Supabase dashboard or CLI)
# All migrations are in /supabase/migrations/

# Start development server
npm run dev

# Build for production
npm run build
```

### Authentication Setup

The application supports multiple authentication methods:

1. **Email/Password** - Built-in authentication with Supabase
2. **OAuth Social Login** - Google, Apple, Facebook, GitHub
3. **Face Recognition** - Optional biometric authentication

📖 **OAuth Configuration**: See [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed OAuth provider setup  
🚀 **Quick OAuth Setup**: See [OAUTH_QUICK_SETUP.md](OAUTH_QUICK_SETUP.md) for step-by-step guide

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

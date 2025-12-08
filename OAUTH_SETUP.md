# OAuth Social Login Setup

This document explains how to configure OAuth social login providers (Google, Apple, Facebook, GitHub) for Mio Life Pilot.

## Overview

The application now supports OAuth authentication via Supabase Auth. Users can sign in using their Google, Apple, Facebook, or GitHub accounts in addition to the traditional email/password method.

## Prerequisites

- Supabase project with Auth enabled
- OAuth provider accounts (Google Cloud Console, Apple Developer, Facebook Developers, GitHub OAuth Apps)

## Supabase Configuration

### 1. Access Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Configure each provider you want to enable

### 2. Configure Redirect URLs

Add the following redirect URLs in your OAuth provider settings:

**Development:**
- `http://localhost:8080/auth/callback`

**Production:**
- `https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback`
- `https://mio-lifepilot.app/auth/callback`
- `https://mio-lifepilot.com/auth/callback`

## Provider Setup

### Google OAuth

1. **Create OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Select **Web application**
   - Add authorized redirect URIs (see list above)

2. **Configure in Supabase:**
   - In Supabase Dashboard → **Authentication** → **Providers**
   - Enable **Google**
   - Enter **Client ID** and **Client Secret** from Google Cloud Console
   - Save configuration

3. **Required Scopes:**
   - `email`
   - `profile`
   - `openid`

### Apple OAuth

1. **Create App ID and Service ID:**
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Navigate to **Certificates, Identifiers & Profiles**
   - Create an **App ID** if you don't have one
   - Create a **Service ID** for Sign in with Apple
   - Configure the Service ID with your redirect URLs

2. **Create Private Key:**
   - In Apple Developer Portal, create a new **Key**
   - Enable **Sign in with Apple**
   - Download the `.p8` key file (keep it secure!)
   - Note the **Key ID** and **Team ID**

3. **Configure in Supabase:**
   - In Supabase Dashboard → **Authentication** → **Providers**
   - Enable **Apple**
   - Enter **Service ID**, **Team ID**, **Key ID**, and **Private Key**
   - Save configuration

### Facebook OAuth

1. **Create Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Click **My Apps** → **Create App**
   - Select **Consumer** as the app type
   - Add **Facebook Login** product to your app

2. **Configure OAuth Settings:**
   - In App Dashboard → **Facebook Login** → **Settings**
   - Add Valid OAuth Redirect URIs (see list above)
   - Save changes

3. **Configure in Supabase:**
   - In Supabase Dashboard → **Authentication** → **Providers**
   - Enable **Facebook**
   - Enter **App ID** and **App Secret** from Facebook App Dashboard
   - Save configuration

4. **Required Permissions:**
   - `email`
   - `public_profile`

### GitHub OAuth

1. **Create OAuth App:**
   - Go to [GitHub Settings](https://github.com/settings/developers)
   - Click **OAuth Apps** → **New OAuth App**
   - Fill in application details
   - Add Authorization callback URL (see list above)

2. **Configure in Supabase:**
   - In Supabase Dashboard → **Authentication** → **Providers**
   - Enable **GitHub**
   - Enter **Client ID** and **Client Secret**
   - Save configuration

3. **Required Scopes:**
   - `user:email`
   - `read:user`

## Testing OAuth Flow

### Local Development

1. Ensure environment variables are set:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:8080`

4. Click the login button and select a social provider

5. You should be redirected to the OAuth provider's consent screen

6. After approval, you'll be redirected back to `/auth/callback`

7. The app will create your user profile and log you in

### Production

1. Ensure all redirect URLs are configured in OAuth provider settings

2. Deploy the application

3. Test the OAuth flow on the production domain

## Troubleshooting

### Common Issues

**"Invalid redirect URI" error:**
- Verify that all redirect URLs are correctly configured in the OAuth provider settings
- Ensure URLs match exactly (including protocol, domain, and path)

**"Provider not configured" error:**
- Check that the provider is enabled in Supabase Dashboard
- Verify that Client ID and Client Secret are correctly entered

**User is redirected but not logged in:**
- Check browser console for errors
- Verify that the `/auth/callback` route is accessible
- Check Supabase logs for authentication errors

**Email already exists:**
- If a user signs up with email/password first, then tries to use OAuth with the same email, the system will link the accounts automatically
- The OAuth profile will be used to update user information

### Debug Mode

Enable debug logging by checking the browser console during the OAuth flow. Look for:
- `"Starting OAuth sign-in with: [provider]"`
- `"Supabase auth state changed: [event]"`
- `"Handling OAuth session for user: [email]"`
- `"OAuth session handling complete"`

## Security Considerations

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for sensitive configuration
3. **Regularly rotate OAuth secrets** as a best practice
4. **Monitor Supabase Auth logs** for suspicious activity
5. **Enable email verification** for OAuth users if required
6. **Implement rate limiting** on authentication endpoints (handled by Supabase)

## User Experience

### First-time OAuth Users

1. User clicks social login button
2. Redirected to OAuth provider
3. User grants permission
4. Redirected back to app
5. New user account is created automatically
6. User is logged in and sees the onboarding flow

### Returning OAuth Users

1. User clicks social login button
2. Redirected to OAuth provider (or auto-approved if previously authorized)
3. Redirected back to app
4. User is logged in immediately
5. No additional steps required

## Migration Notes

### Existing Users

If you have existing users with email/password authentication:

1. **Same email detection:** If a user tries to sign in with OAuth using an email that already exists, the system will:
   - Link the OAuth identity to the existing account
   - User can then use either method to log in

2. **Profile updates:** OAuth sign-in will update user profiles with:
   - Avatar URL (if provided by OAuth provider)
   - Full name (if not already set)
   - Email verification status (set to true for OAuth users)

## Support

For additional help:
- Check Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Review OAuth provider documentation for specific setup steps
- Check GitHub issues for known problems

---

**Last Updated:** 2025-12-08

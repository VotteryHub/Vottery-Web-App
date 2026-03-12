<external_setup>
Feature: Email Verification Redirect Behavior

When you sign up for an account, you will receive an email confirmation link. Here's what to expect:

What Happens When You Click the Email Link:
- You click the email confirmation link
- You get redirected to localhost (this is normal and expected)
- Your account verification is actually completed successfully
- You need to manually navigate back to this platform to continue with login

Note: The localhost redirect does NOT mean verification failed. Email verification is working correctly.

Demo Credentials for Testing:
You can use these pre-created accounts to test the platform immediately:

1. Admin Account:
   - Email: admin@vottery.com
   - Password: admin123

2. User Account 1:
   - Email: john.doe@vottery.com
   - Password: SecurePass123!

3. User Account 2:
   - Email: sarah.martinez@vottery.com
   - Password: password123

These accounts have sample data including elections, votes, and posts for testing all features.
</external_setup>

## Perplexity AI Integration Setup

### Step 1: Get Perplexity API Key
1. Sign up for a Perplexity account at https://www.perplexity.ai/
2. Navigate to API Settings and create a new API key
3. Copy your API key

### Step 2: Configure Environment Variable
Add the following to your `.env` file:
```
VITE_PERPLEXITY_API_KEY=your-perplexity-api-key-here
```

### Step 3: Restart Development Server
After adding the API key, restart your development server:
```bash
npm run start
```

### Features Enabled
- **Real-time Threat Intelligence**: Advanced fraud pattern analysis using Perplexity's search-grounded AI
- **Anomaly Correlation Detection**: Cross-platform anomaly identification and coordinated attack detection
- **Fraud Pattern Recognition**: Sophisticated fraud scheme detection with behavioral analysis
- **Threat Intelligence Search**: Access to real-time cybersecurity threat data from trusted sources

### Integration Points
- **Fraud Detection Service**: Enhanced with Perplexity threat intelligence for high-risk fraud cases
- **Platform Monitoring Dashboard**: Real-time anomaly correlation analysis displayed in fraud detection panel
- **Alert Management**: Automatic threat alert creation for critical security events

---
# Email Configuration Guide

This document explains how to configure email sending for the NCD Navigator application.

## Environment Variables

Add the following environment variables to your `.env.local` file:

### Required Variables

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=your-email@gmail.com
```

### Optional Variables

```bash
# Email Service (defaults to 'gmail')
EMAIL_SERVICE=gmail

# For custom SMTP servers
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Email Service Options

### 1. Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Configure environment variables**:
   ```bash
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### 2. Outlook/Hotmail

```bash
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### 3. Custom SMTP Server

```bash
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@yourdomain.com
```

### 4. Production Email Services

For production, consider these professional email services:

#### SendGrid
```bash
# Install: pnpm add @sendgrid/mail
# Replace nodemailer implementation with SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@yourdomain.com
```

#### Mailgun
```bash
# Install: pnpm add mailgun-js
# Replace nodemailer implementation with Mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_FROM_EMAIL=your-email@yourdomain.com
```

#### AWS SES
```bash
# Install: pnpm add aws-sdk
# Replace nodemailer implementation with AWS SES
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=your-email@yourdomain.com
```

## Testing Email Configuration

1. **Set up environment variables** in `.env.local`
2. **Create a test user** through the admin interface
3. **Check console logs** for email sending status
4. **Verify email delivery** in the recipient's inbox

## Troubleshooting

### Common Issues

1. **"Invalid login" error**:
   - For Gmail: Use App Password, not regular password
   - Check 2FA is enabled
   - Verify email address is correct

2. **"Connection timeout" error**:
   - Check firewall settings
   - Verify SMTP port (587 for TLS, 465 for SSL)
   - Try different email service

3. **"Authentication failed" error**:
   - Double-check credentials
   - Ensure App Password is correct (Gmail)
   - Check if account is locked

### Debug Mode

The email service includes fallback logging. If email sending fails, it will:
1. Log the error to console
2. Fall back to console logging
3. Continue with user creation
4. Display temporary password to admin

## Security Considerations

1. **Never commit email credentials** to version control
2. **Use App Passwords** instead of main passwords
3. **Rotate credentials** regularly
4. **Use environment variables** for all sensitive data
5. **Consider using a dedicated email service** for production

## Email Templates

The system includes professional HTML and text email templates for:
- Welcome emails with temporary passwords
- Password reset emails
- Account notifications

Templates are located in `lib/emailService.ts` and can be customized as needed.

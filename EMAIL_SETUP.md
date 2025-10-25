# Email Setup Guide for Nodemailer

This guide shows how to configure Nodemailer with different email providers.

## Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password-or-app-password

# Admin Email for Notifications
ADMIN_EMAIL=admin@dezainahub.com
```

## Email Provider Configurations

### 1. Gmail (Recommended for Development)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

**Setup Steps:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use the app password (not your regular password) in `SMTP_PASS`

### 2. Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### 3. Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Setup Steps:**

1. Enable 2-Factor Authentication
2. Generate an App Password in Yahoo Account Security settings

### 4. Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

### 5. SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 6. Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

## Security Notes

- **Never commit passwords to version control**
- **Use App Passwords for Gmail/Yahoo instead of regular passwords**
- **Consider using environment-specific configurations**
- **Test email sending in development before deploying**

## Testing Email Configuration

You can test your email configuration by:

1. **Starting the development server:**

   ```bash
   bun run dev
   ```

2. **Submitting a job application** - This will trigger the email notifications

3. **Checking the console logs** for any email errors

## Troubleshooting

### Common Issues:

1. **"Invalid login" error:**

   - Check if you're using the correct password/app password
   - Ensure 2FA is enabled and app password is generated

2. **"Connection timeout" error:**

   - Check if the SMTP host and port are correct
   - Verify firewall settings

3. **"Authentication failed" error:**

   - Double-check username and password
   - For Gmail, make sure you're using an app password, not your regular password

4. **"Less secure app access" error:**
   - Enable 2FA and use app passwords instead

## Production Considerations

For production, consider:

1. **Using a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Setting up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitoring email delivery rates**
4. **Implementing email templates** for better deliverability
5. **Setting up email queues** for high-volume sending

## Example .env.local

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@dezainahub.com
SMTP_PASS=your-app-password-here

# Admin Email
ADMIN_EMAIL=admin@dezainahub.com

# Other existing variables...
MONGODB_URI=your-mongodb-connection-string
# ... other variables
```

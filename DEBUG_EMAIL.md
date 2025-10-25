# Email Debugging Guide

## Quick Debugging Steps

### 1. Check Environment Variables

Make sure these are set in your `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=info@dezainahub.com
ADMIN_EMAIL=admin@dezainahub.com
```

### 2. Test Email Configuration

Run the test script:

```bash
node test-email.js
```

Or test via API:

```bash
curl http://localhost:3000/api/test-email
```

### 3. Check Console Logs

When you login to the admin portal, check the browser console and server logs for:

- "Tracking admin login for: [email]"
- "IP Address: [ip]"
- "Sending login data: [data]"
- "Login tracking successful"
- "Admin login API called with: [data]"
- "Sending login notification to: [email]"
- "Email sent successfully: [messageId]"

### 4. Common Issues & Solutions

#### Issue: "SMTP credentials not configured"

**Solution:** Set `SMTP_USER` and `SMTP_PASS` in your `.env.local`

#### Issue: "Invalid login" or "Authentication failed"

**Solutions:**

- For Gmail: Use App Password, not regular password
- Enable 2-Factor Authentication first
- Generate App Password: Google Account → Security → 2-Step Verification → App passwords

#### Issue: "Connection timeout"

**Solutions:**

- Check if `SMTP_HOST` and `SMTP_PORT` are correct
- Try different port (587 or 465)
- Check firewall settings

#### Issue: "Less secure app access"

**Solution:** Use App Passwords instead of regular passwords

### 5. Gmail Setup (Most Common)

1. **Enable 2FA:**

   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password:**

   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Set Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### 6. Debugging Commands

```bash
# Test email configuration
curl http://localhost:3000/api/test-email

# Send test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","message":"Hello"}'

# Check if admin login API is working
curl -X POST http://localhost:3000/api/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","ipAddress":"127.0.0.1","uid":"test123"}'
```

### 7. Server Logs to Watch

When you login to admin portal, you should see:

```
Tracking admin login for: your-email@example.com
IP Address: 123.456.789.0
Sending login data: { email: 'your-email@example.com', ipAddress: '123.456.789.0', uid: 'firebase-uid' }
Login tracking successful
Admin login API called with: { email: 'your-email@example.com', ipAddress: '123.456.789.0', uid: 'firebase-uid' }
Sending login notification to: admin@dezainahub.com
Generated email template: Admin Portal Login - 12/19/2024
Verifying SMTP connection...
SMTP connection verified successfully
Email sent successfully: <message-id>
```

### 8. If Still No Emails

1. **Check spam folder**
2. **Verify ADMIN_EMAIL is correct**
3. **Test with a different email provider**
4. **Check server logs for errors**
5. **Try the test email API first**

### 9. Alternative Email Providers

If Gmail doesn't work, try:

**Outlook:**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**SendGrid:**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

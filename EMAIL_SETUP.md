# Real-Time Email Setup Guide

This guide will help you configure real email sending for order confirmations in SK Mart.

## 📧 Email Providers

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Copy the 16-character password

3. **Configure Environment Variables**:
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your Gmail credentials
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=true
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-16-char-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   ```

### Option 2: Other SMTP Providers

#### SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=your-mailgun-username
EMAIL_HOST_PASSWORD=your-mailgun-password
```

#### AWS SES
```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=your-ses-username
EMAIL_HOST_PASSWORD=your-ses-password
```

## 🐳 Docker Setup

### Method 1: Using .env file (Recommended)

1. **Create .env file**:
   ```bash
   cp env.example .env
   # Edit .env with your email credentials
   ```

2. **Update docker-compose.yml** to use .env:
   ```yaml
   backend:
     build:
       context: ./Backend
     env_file:
       - .env
     # ... rest of config
   
   worker:
     build:
       context: ./Backend
     env_file:
       - .env
     # ... rest of config
   ```

### Method 2: Direct Environment Variables

Uncomment and modify the email settings in `docker-compose.yml`:

```yaml
backend:
  environment:
    # ... existing vars
    EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
    EMAIL_HOST: smtp.gmail.com
    EMAIL_PORT: 587
    EMAIL_USE_TLS: 'true'
    EMAIL_HOST_USER: your-email@gmail.com
    EMAIL_HOST_PASSWORD: your-app-password
    DEFAULT_FROM_EMAIL: your-email@gmail.com
```

## 🚀 Testing Email Functionality

### 1. Start the Application
```bash
docker compose up --build
```

### 2. Test Email Sending
1. **Login** as `user` / `user`
2. **Add products** to cart
3. **Place an order** through checkout
4. **Check your email** for the confirmation

### 3. Monitor Email Logs
```bash
# Check worker logs for email task execution
docker compose logs -f worker

# Check backend logs for email sending
docker compose logs -f backend
```

### 4. Manual Email Test
```bash
# Test email sending manually
docker compose exec backend python manage.py shell

# In Python shell:
from api.tasks import send_order_confirmation_email
result = send_order_confirmation_email.delay(1, "your-email@example.com")
print(result.get())
```

## 📧 Email Template Features

The order confirmation email includes:

- **Professional HTML Design** with SK Mart branding
- **Order Details**: Order number (SK-0001), date, status
- **Itemized List**: Product names, quantities, prices
- **Total Amount**: Clear pricing breakdown
- **Call-to-Action**: Link to view order history
- **Responsive Design**: Works on mobile and desktop
- **Fallback Text Version**: For email clients that don't support HTML

## 🔧 Troubleshooting

### Common Issues

1. **"Authentication failed"**:
   - Check if 2FA is enabled on Gmail
   - Verify app password is correct
   - Ensure EMAIL_HOST_USER is your full email

2. **"Connection refused"**:
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify firewall settings
   - Try different port (465 for SSL)

3. **"Email not received"**:
   - Check spam folder
   - Verify recipient email address
   - Check email provider's sending limits

4. **Celery task not executing**:
   - Ensure Redis is running: `docker compose logs redis`
   - Check worker status: `docker compose logs worker`
   - Restart worker: `docker compose restart worker`

### Debug Mode

Enable detailed email logging:

```python
# In Backend/Backend/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.core.mail': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

## 📊 Email Analytics (Optional)

For production, consider adding:

- **Email delivery tracking**
- **Open rate monitoring**
- **Click tracking**
- **Bounce handling**

Popular services: SendGrid, Mailgun, AWS SES, Postmark

## 🔒 Security Notes

- **Never commit** `.env` files to version control
- **Use app passwords** instead of main account passwords
- **Rotate credentials** regularly
- **Monitor email usage** for unusual activity
- **Set up rate limiting** for production use

## 📝 Production Considerations

1. **Use a dedicated email service** (SendGrid, Mailgun, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Implement email templates** with dynamic content
4. **Add email queuing** for high volume
5. **Monitor delivery rates** and bounces
6. **Implement retry logic** for failed sends


# yatulearn-server

Backend server for YATU Learn platform.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
Jwt_Sec=your_jwt_secret_key
Activation_Secret=your_activation_secret_key
Forgot_Secret=your_forgot_password_secret_key

# Email Configuration (Gmail)
Gmail=your_email@gmail.com
Password=your_gmail_app_password

# Frontend URL
frontendurl=https://www.yatulearn.fun

# Server
PORT=8080
NODE_ENV=development
```

### 3. Email Service Setup

**Option A: Resend (RECOMMENDED - works on all platforms including Render)**

1. Sign up at https://resend.com (free 3,000 emails/month)
2. Get your API key from dashboard
3. Add to `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
4. That's it! ✅

**Option B: Gmail SMTP (may not work on Render due to blocked ports)**

⚠️ Gmail SMTP often doesn't work on cloud platforms like Render.

If you still want to try:
1. Go to https://myaccount.google.com/apppasswords
2. Generate a 16-character App Password
3. Add to `.env`:
   ```
   Gmail=your_email@gmail.com
   Password=xxxxxxxxxxxxxxxx
   ```

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## Deployment on Render

Make sure to set these environment variables in Render dashboard:
- `MONGO_URI` - Your MongoDB connection string
- `Jwt_Sec` - Secret key for JWT tokens
- `Activation_Secret` - Secret key for activation tokens
- `Forgot_Secret` - Secret key for password reset tokens
- `RESEND_API_KEY` - Your Resend API key (get from https://resend.com)
- `RESEND_FROM_EMAIL` - `onboarding@resend.dev` (or your verified domain)
- `frontendurl` - Your frontend URL (e.g., https://www.yatulearn.fun)
- `NODE_ENV` - Set to `production`

**Optional (Gmail fallback - not recommended for Render):**
- `Gmail` - Your Gmail address
- `Password` - Gmail App Password

## Common Issues

### Email not sending
- **Use Resend instead of Gmail** - it's more reliable on cloud platforms
- Check Render logs for email errors
- Verify `RESEND_API_KEY` is set correctly
- Make sure you're using `onboarding@resend.dev` or a verified domain


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

### 3. Gmail App Password Setup (REQUIRED for email to work)

⚠️ **Important**: Gmail no longer accepts regular passwords for SMTP. You MUST use an App Password.

**Steps to create Gmail App Password:**

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Step Verification (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" as the app
5. Select "Other" as the device and name it "YATU Learn"
6. Click "Generate"
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
8. Use this password in your `.env` file as `Password=xxxxxxxxxxxxxxxx` (without spaces)

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
- `Gmail` - Your Gmail address
- `Password` - Gmail App Password (16 characters, no spaces)
- `frontendurl` - Your frontend URL (e.g., https://www.yatulearn.fun)
- `NODE_ENV` - Set to `production`

## Common Issues

### Email not sending
- Verify you're using a Gmail **App Password**, not your regular password
- Check server logs for specific error messages
- Ensure 2-Step Verification is enabled on your Google account
- Make sure `Gmail` and `Password` env variables are set correctly


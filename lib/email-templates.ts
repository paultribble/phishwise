/**
 * Professional Email Templates for Phishing Simulation Training
 * Realistic HTML templates with company branding and styling
 * All links properly redirect to PhishWise platform via {{PHISHING_LINK}}
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  company: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: "credential" | "shipping" | "billing" | "security" | "social";
}

/**
 * AMAZON - Account Verification
 * High realism, company-accurate branding and HTML
 */
export const AMAZON_ACCOUNT_VERIFY: EmailTemplate = {
  id: "amazon_verify",
  name: "Amazon Account Verification",
  company: "Amazon",
  subject: "Your Amazon.com account requires verification",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazon Account Verification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; }
        .header { background-color: #fff; padding: 20px; text-align: center; border-bottom: 1px solid #eee; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 30px 20px; color: #333; }
        .content h1 { font-size: 18px; margin: 0 0 15px 0; color: #222; }
        .content p { margin: 10px 0; line-height: 1.6; font-size: 14px; }
        .alert-box { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .alert-box strong { color: #cc7000; }
        .button { display: inline-block; background-color: #ff9900; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; text-align: center; }
        .footer a { color: #0066c0; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg class="logo" viewBox="0 0 235 100" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="80" font-size="60" font-weight="bold" fill="#FF9900">amazon</text>
            </svg>
        </div>
        <div class="content">
            <h1>Account Verification Required</h1>
            <p>Hello {{USER_NAME}},</p>
            <p>We have detected unusual activity on your Amazon account. To protect your account and prevent unauthorized access, we need you to verify your identity.</p>
            <div class="alert-box">
                <strong>⚠️ Important:</strong> This verification is required to maintain your account security.
            </div>
            <p><strong>Why are we asking?</strong></p>
            <p>We detected a login attempt from an unusual location. For your security, please verify that it was you:</p>
            <ul>
                <li>Location: Ashburn, VA, United States</li>
                <li>Device: Chrome on Windows</li>
                <li>Time: {{DATE}} {{TIME}}</li>
            </ul>
            <p>If this wasn't you, we recommend changing your password immediately.</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Verify My Account</a>
            </p>
            <p>If you cannot click the button, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #0066c0;">{{PHISHING_LINK}}</p>
            <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">This is an automated message, please do not reply to this email.</p>
        </div>
        <div class="footer">
            <p>© 2026 Amazon.com, Inc. All rights reserved. | <a href="#">Privacy Policy</a></p>
            <p>Amazon Services LLC | 410 Terry Avenue North, Seattle, WA 98109</p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * MICROSOFT - Password Reset Verification
 */
export const MICROSOFT_PASSWORD_RESET: EmailTemplate = {
  id: "microsoft_reset",
  name: "Microsoft Password Reset",
  company: "Microsoft",
  subject: "Confirm your recent password change",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Security Alert</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f3f3f3; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; }
        .header { background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%); color: #fff; padding: 30px 20px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .header p { margin: 5px 0; font-size: 14px; }
        .content { padding: 30px 20px; color: #333; }
        .content h2 { color: #0078d4; font-size: 18px; margin: 0 0 15px 0; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 14px; }
        .info-box { background-color: #f0f0f0; padding: 15px; border-left: 4px solid #0078d4; margin: 20px 0; }
        .button { display: inline-block; background-color: #0078d4; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 2px; font-weight: 600; margin: 20px 0; }
        .warning { background-color: #fff4ce; border: 1px solid #ffe680; padding: 15px; border-radius: 2px; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #0078d4; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Microsoft</div>
            <p>Account Security Alert</p>
        </div>
        <div class="content">
            <h2>Verify Your Password Change</h2>
            <p>Hello {{USER_NAME}},</p>
            <p>We recently received a request to change the password on your Microsoft account. To confirm this change, please complete the verification below.</p>
            <div class="warning">
                <strong>⚠️ Important for your security:</strong> Never share your verification code with anyone, including Microsoft support staff.
            </div>
            <div class="info-box">
                <p><strong>Verification Details:</strong></p>
                <p>Account: {{USER_NAME}}@outlook.com<br>
                Date: {{DATE}}<br>
                Device: Windows 10<br>
                Location: {{LOCATION}}</p>
            </div>
            <p>To confirm this password change, please verify your identity:</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Verify Your Identity</a>
            </p>
            <p>If the above button doesn't work, paste this link in your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #0078d4;">{{PHISHING_LINK}}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">This is an automated security message. Please do not reply to this email. If you did not request this change, <a href="{{PHISHING_LINK}}">click here to secure your account</a>.</p>
        </div>
        <div class="footer">
            <p>© 2026 Microsoft Corporation. All rights reserved.</p>
            <p><a href="#">Privacy & Cookies</a> | <a href="#">Legal</a> | <a href="#">Accessibility</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * PAYPAL - Payment Method Verification
 */
export const PAYPAL_BILLING_ALERT: EmailTemplate = {
  id: "paypal_billing",
  name: "PayPal Billing Alert",
  company: "PayPal",
  subject: "Action Required: Verify Your PayPal Account",
  difficulty: 4,
  category: "billing",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayPal Security Alert</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; }
        .header { background-color: #003087; color: #fff; padding: 25px 20px; }
        .logo { font-weight: bold; font-size: 24px; margin-bottom: 10px; letter-spacing: 1px; }
        .content { padding: 30px 20px; color: #333; }
        .alert { background-color: #ffe6e6; border: 2px solid #cc0000; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .alert-title { color: #cc0000; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .content h2 { color: #003087; margin: 0 0 15px 0; font-size: 18px; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 14px; }
        .button { display: inline-block; background-color: #003087; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 25px 0; }
        .details { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background-color: #f5f5f5; padding: 20px; font-size: 11px; color: #999; border-top: 1px solid #ddd; }
        .footer a { color: #003087; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PayPal</div>
        </div>
        <div class="content">
            <h2>Account Verification Required</h2>
            <div class="alert">
                <div class="alert-title">⚠️ URGENT ACTION REQUIRED</div>
                <p>We have restricted your account access due to suspicious account activity. To restore your account, you must verify your identity immediately.</p>
            </div>
            <p>Hello {{USER_NAME}},</p>
            <p>Your PayPal account has been temporarily limited. We detected an attempt to access your account from an unusual location.</p>
            <div class="details">
                <p><strong>Account Activity Detected:</strong></p>
                <p>Login Attempt: {{DATE}}<br>
                Location: {{LOCATION}}<br>
                Device: {{DEVICE}}<br>
                Status: Blocked</p>
            </div>
            <p><strong>What you need to do:</strong></p>
            <p>1. Click the button below to verify your identity<br>
            2. Confirm your email address and password<br>
            3. Complete our security verification<br>
            4. Your account will be restored within 24 hours</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Restore Your Account Now</a>
            </p>
            <p style="margin-top: 30px; font-size: 12px;">If you cannot click the button, paste this URL in your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #003087;">{{PHISHING_LINK}}</p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">Do not reply to this email. PayPal will never ask for your password or sensitive information via email.</p>
        </div>
        <div class="footer">
            <p>© 2026 PayPal, Inc. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Security Center</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * FEDEX - Delivery Notification
 */
export const FEDEX_DELIVERY: EmailTemplate = {
  id: "fedex_delivery",
  name: "FedEx Delivery Notification",
  company: "FedEx",
  subject: "FedEx Delivery Exception - Action Required",
  difficulty: 2,
  category: "shipping",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FedEx Delivery</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; }
        .header { background-color: #4d148c; color: #fff; padding: 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
        .content { padding: 30px 20px; color: #333; }
        .content h2 { color: #4d148c; font-size: 18px; margin: 0 0 15px 0; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 14px; }
        .package-info { background-color: #f0f0f0; border-left: 4px solid #4d148c; padding: 15px; margin: 20px 0; }
        .tracking { background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #ffc107; }
        .button { display: inline-block; background-color: #4d148c; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 2px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #4d148c; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">FedEx</div>
        </div>
        <div class="content">
            <h2>Delivery Exception Notification</h2>
            <p>Hello {{USER_NAME}},</p>
            <p>We encountered an issue with your FedEx delivery. Action is required to proceed with delivery.</p>
            <div class="package-info">
                <p><strong>Shipment Details:</strong></p>
                <p>Tracking Number: 7493857294857<br>
                Status: Delivery Exception<br>
                Issue: Address could not be verified<br>
                Expected Delivery: {{DATE}}</p>
            </div>
            <p><strong>What's the problem?</strong></p>
            <p>Our system couldn't confirm your delivery address. This is a security measure to ensure your package reaches the correct location.</p>
            <div class="tracking">
                <strong>⚠️ Important:</strong> Please confirm your address within 24 hours or your package will be returned to the sender.
            </div>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Confirm Delivery Address</a>
            </p>
            <p>Or copy and paste this link:</p>
            <p style="word-break: break-all; font-size: 12px; color: #4d148c;">{{PHISHING_LINK}}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">This is an automated notification. Please do not reply to this email.</p>
        </div>
        <div class="footer">
            <p>© 2026 Federal Express Corporation. All rights reserved.</p>
            <p><a href="#">FedEx.com</a> | <a href="#">Track Package</a> | <a href="#">Contact Us</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * APPLE - Security Alert
 */
export const APPLE_SECURITY_ALERT: EmailTemplate = {
  id: "apple_security",
  name: "Apple Security Alert",
  company: "Apple",
  subject: "Your Apple ID security code",
  difficulty: 4,
  category: "security",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apple ID Security Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background-color: #000; color: #fff; padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; margin-bottom: 10px; }
        .content { padding: 40px 20px; color: #333; }
        .content h2 { color: #000; font-size: 20px; margin: 0 0 20px 0; font-weight: 600; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 15px; }
        .code-box { background-color: #f5f5f7; border: 1px solid #d2d2d7; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .security-code { font-size: 32px; font-weight: 600; letter-spacing: 4px; font-family: 'Monaco', monospace; color: #000; }
        .info-box { background-color: #f5f5f7; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
        .button { display: inline-block; background-color: #0071e3; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f5f5f7; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #0071e3; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Apple</div>
        </div>
        <div class="content">
            <h2>Your Apple ID Security Code</h2>
            <p>Hello {{USER_NAME}},</p>
            <p>We received a request to sign in to your Apple ID from a new device or location.</p>
            <p><strong>Your security code is:</strong></p>
            <div class="code-box">
                <div class="security-code">387 492</div>
            </div>
            <p><strong>⚠️ Important:</strong> Never share this code with anyone. Apple employees will never ask for your code.</p>
            <div class="info-box">
                <p><strong>Sign-in Details:</strong></p>
                <p>Device: {{DEVICE}}<br>
                Location: {{LOCATION}}<br>
                Time: {{DATE}} {{TIME}}<br>
                Browser: Chrome on Windows</p>
            </div>
            <p>If you didn't request this code, your account may have been compromised. Secure your account immediately:</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Secure Your Account</a>
            </p>
            <p style="font-size: 13px; color: #666;">Or go to: <span style="word-break: break-all;">{{PHISHING_LINK}}</span></p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">This is an automated message. Do not reply to this email.</p>
        </div>
        <div class="footer">
            <p>© 2026 Apple Inc. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * EBAY - Account Confirmation
 */
export const EBAY_ACCOUNT_CONFIRM: EmailTemplate = {
  id: "ebay_confirm",
  name: "eBay Account Confirmation",
  company: "eBay",
  subject: "Confirm your eBay account",
  difficulty: 2,
  category: "credential",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eBay Account Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8f8f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; }
        .header { background-color: #e53238; color: #fff; padding: 20px; }
        .logo { font-size: 24px; font-weight: bold; }
        .content { padding: 30px 20px; color: #333; }
        .content h2 { color: #e53238; font-size: 18px; margin: 0 0 15px 0; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 14px; }
        .alert { background-color: #fef3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background-color: #e53238; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #e53238; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">eBay</div>
        </div>
        <div class="content">
            <h2>Account Confirmation Required</h2>
            <p>Hi {{USER_NAME}},</p>
            <p>We need to confirm your identity to keep your eBay account secure. This confirmation is required before you can place bids or make purchases.</p>
            <div class="alert">
                <strong>This is a one-time verification</strong> to protect your account from unauthorized access.
            </div>
            <p><strong>What we need from you:</strong></p>
            <ul>
                <li>Your registered email address</li>
                <li>Your account password</li>
                <li>Answer to your security question</li>
            </ul>
            <p>The confirmation process takes less than 2 minutes. Click the button below to get started:</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Confirm Your Account</a>
            </p>
            <p>Link not working? Copy this URL:</p>
            <p style="word-break: break-all; font-size: 12px; color: #e53238;">{{PHISHING_LINK}}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">eBay never asks for your password via email. Never share your account information with anyone.</p>
        </div>
        <div class="footer">
            <p>© 2026 eBay Inc. All rights reserved.</p>
            <p><a href="#">eBay.com</a> | <a href="#">Security Center</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * GOOGLE - 2-Factor Authentication
 */
export const GOOGLE_2FA: EmailTemplate = {
  id: "google_2fa",
  name: "Google 2-Factor Authentication",
  company: "Google",
  subject: "Unusual activity in your Google Account",
  difficulty: 4,
  category: "security",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Security Alert</title>
    <style>
        body { font-family: 'Google Sans', Roboto, Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; }
        .header { background: linear-gradient(135deg, #4285f4 0%, #1967d2 100%); color: #fff; padding: 30px 20px; }
        .logo { font-size: 18px; font-weight: 500; }
        .content { padding: 30px 20px; color: #202124; }
        .content h2 { color: #1967d2; font-size: 20px; margin: 0 0 15px 0; font-weight: 500; }
        .content p { margin: 12px 0; line-height: 1.6; font-size: 14px; }
        .alert { background-color: #fef3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .activity-box { background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background-color: #1967d2; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; font-size: 12px; color: #5f6368; border-top: 1px solid #dadce0; }
        .footer a { color: #1967d2; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Google</div>
        </div>
        <div class="content">
            <h2>Unusual activity in your Google Account</h2>
            <p>Hi {{USER_NAME}},</p>
            <p>We've detected unusual activity in your Google Account. Someone just used your password to try to access your account from {{LOCATION}}.</p>
            <div class="alert">
                <strong>⚠️ We blocked this attempt.</strong> We need you to confirm this was you.
            </div>
            <div class="activity-box">
                <p><strong>Blocked Sign-in Attempt</strong></p>
                <p>Location: {{LOCATION}}<br>
                Date & Time: {{DATE}} {{TIME}}<br>
                Device: {{DEVICE}}<br>
                Browser: Chrome</p>
            </div>
            <p><strong>If this was you:</strong> Review your account activity and make your account more secure.</p>
            <p><strong>If this wasn't you:</strong> Someone knows your password and we recommend you change it immediately.</p>
            <p>
                <a href="{{PHISHING_LINK}}" class="button">Check Your Account Activity</a>
            </p>
            <p>If you can't click the button, copy and paste this link in your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #1967d2;">{{PHISHING_LINK}}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #5f6368;">This is an automated message. Please do not reply to this email.</p>
        </div>
        <div class="footer">
            <p>© 2026 Google LLC. All rights reserved.</p>
            <p><a href="#">Privacy</a> | <a href="#">Terms</a> | <a href="#">Account Security</a></p>
        </div>
    </div>
</body>
</html>`,
};

/**
 * Get all templates
 */
export const ALL_TEMPLATES: EmailTemplate[] = [
  AMAZON_ACCOUNT_VERIFY,
  MICROSOFT_PASSWORD_RESET,
  PAYPAL_BILLING_ALERT,
  FEDEX_DELIVERY,
  APPLE_SECURITY_ALERT,
  EBAY_ACCOUNT_CONFIRM,
  GOOGLE_2FA,
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: EmailTemplate["category"]
): EmailTemplate[] {
  return ALL_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(difficulty: number): EmailTemplate[] {
  return ALL_TEMPLATES.filter((t) => t.difficulty === difficulty);
}

/**
 * Process template: replace placeholders with actual values
 * Replaces:
 * - {{USER_NAME}} with actual user name
 * - {{PHISHING_LINK}} with the tracking URL that redirects to PhishWise
 * - {{DATE}}, {{TIME}}, {{LOCATION}}, {{DEVICE}} with sample values
 */
export function processTemplate(
  template: EmailTemplate,
  userName: string = "Valued User",
  phishingLink: string
): string {
  let processed = template.body
    .replace(/\{\{USER_NAME\}\}/g, escapeHtml(userName))
    .replace(/\{\{PHISHING_LINK\}\}/g, phishingLink);

  // Add realistic demo values for other placeholders
  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const locations = [
    "Ashburn, VA",
    "New York, NY",
    "London, UK",
    "Tokyo, Japan",
    "Berlin, Germany",
  ];
  const devices = ["Windows 10", "macOS Ventura", "iPhone 14", "Chrome Browser"];

  processed = processed
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{TIME\}\}/g, time)
    .replace(/\{\{LOCATION\}\}/g, locations[Math.floor(Math.random() * locations.length)])
    .replace(/\{\{DEVICE\}\}/g, devices[Math.floor(Math.random() * devices.length)]);

  return processed;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

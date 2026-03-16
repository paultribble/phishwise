/**
 * Modern, Fancy Email Templates with Advanced HTML/CSS Styling
 * Industry-standard responsive design with gradients, shadows, and modern aesthetics
 */

export interface ModernEmailTemplate {
  id: string;
  name: string;
  company: string;
  subject: string;
  body: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: "credential" | "shipping" | "billing" | "security" | "social";
}

/**
 * AMAZON - Modern Gradient Design
 */
export const AMAZON_MODERN: ModernEmailTemplate = {
  id: "amazon_modern",
  name: "Amazon Account Verification",
  company: "Amazon",
  subject: "Your Amazon.com account requires verification",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Amazon Account Verification</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');
    body { margin: 0; padding: 0; min-width: 100% !important; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); }
    .wrapper { background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
    .header { background: linear-gradient(135deg, #FF9900 0%, #FF8C00 100%); padding: 50px 30px; text-align: center; color: white; }
    .header-content { font-size: 32px; font-weight: 700; letter-spacing: -1px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .content { padding: 50px 40px; }
    .greeting { font-size: 18px; font-weight: 600; color: #222; margin: 0 0 20px 0; }
    .body-text { font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 25px 0; }
    .alert-box { background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CD 100%); border-left: 5px solid #FF9900; padding: 20px; border-radius: 8px; margin: 30px 0; }
    .alert-title { font-weight: 700; color: #CC7000; margin: 0 0 8px 0; font-size: 14px; }
    .alert-text { color: #7D5C00; margin: 0; font-size: 13px; line-height: 1.6; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #FF9900 0%, #FF8C00 100%); color: #fff; padding: 16px 45px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px rgba(255, 153, 0, 0.4); transition: all 0.3s ease; border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(255, 153, 0, 0.5); }
    .fallback-link { font-size: 12px; color: #0066c0; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f5f5f5; border-radius: 6px; }
    .footer { background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%); padding: 30px 40px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #666; }
    .footer-links a { color: #0066c0; text-decoration: none; margin: 0 15px; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #ddd, transparent); margin: 30px 0; }
    @media (max-width: 600px) {
      .container { border-radius: 0; }
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .cta-button { padding: 14px 35px; font-size: 14px; width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="header-content">Amazon</h1>
      </div>
      <div class="content">
        <p class="greeting">Hello {{USER_NAME}},</p>
        <p class="body-text">We've detected an unusual sign-in attempt on your Amazon account from a new device. For your security, we've temporarily limited access to your account.</p>
        <div class="alert-box">
          <div class="alert-title">⚠️ ACCOUNT SECURITY ALERT</div>
          <div class="alert-text">Immediate action required to restore full access to your account and prevent unauthorized use.</div>
        </div>
        <p class="body-text"><strong>Sign-in Details:</strong><br>Location: {{LOCATION}}<br>Device: {{DEVICE}}<br>Date & Time: {{DATE}} {{TIME}}</p>
        <p class="body-text">To verify this was you and restore access, please click the button below:</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Verify My Account</a>
        </div>
        <p class="body-text" style="font-size: 13px; color: #999;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <div class="divider"></div>
        <p class="body-text" style="font-size: 13px;">This is an automated security message. Amazon will never ask for your password via email. If you didn't authorize this sign-in, <a href="{{PHISHING_LINK}}" style="color: #0066c0;">click here to secure your account immediately</a>.</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 15px 0;">© 2026 Amazon.com, Inc. All rights reserved.</p>
        <p style="margin: 0; font-size: 11px; color: #999;">410 Terry Avenue North, Seattle, WA 98109</p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * MICROSOFT - Modern Fluent Design
 */
export const MICROSOFT_MODERN: ModernEmailTemplate = {
  id: "microsoft_modern",
  name: "Microsoft Password Reset",
  company: "Microsoft",
  subject: "Confirm your recent password change",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Microsoft Security Alert</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #f3f3f3 0%, #e8e8e8 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #f3f3f3 0%, #e8e8e8 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.12); }
    .header { background: linear-gradient(135deg, #0078d4 0%, #1084d7 50%, #005a9e 100%); padding: 60px 40px; text-align: center; color: white; }
    .logo { font-size: 28px; font-weight: 600; letter-spacing: 1px; margin: 0; }
    .tagline { font-size: 14px; margin: 10px 0 0 0; opacity: 0.9; }
    .content { padding: 50px 40px; }
    .title { font-size: 20px; font-weight: 600; color: #1084d7; margin: 0 0 25px 0; }
    .text { font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 20px 0; }
    .info-card { background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%); border-left: 4px solid #0078d4; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .info-card p { margin: 5px 0; font-size: 14px; color: #333; }
    .warning-box { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px; padding: 20px; margin: 25px 0; }
    .warning-icon { font-size: 20px; margin-right: 10px; }
    .warning-text { color: #664d03; font-size: 14px; font-weight: 500; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0078d4 0%, #1084d7 100%); color: white; padding: 15px 50px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(0, 120, 212, 0.35); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0, 120, 212, 0.5); }
    .fallback-link { font-size: 12px; color: #0078d4; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f5f5f5; border-radius: 6px; border: 1px solid #e0e0e0; }
    .footer { background: #f8f8f8; padding: 30px 40px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    .footer a { color: #0078d4; text-decoration: none; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .content { padding: 30px 20px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">microsoft</div>
        <p class="tagline">Account Security Alert</p>
      </div>
      <div class="content">
        <h2 class="title">Verify Your Password Change</h2>
        <p class="text">Hi {{USER_NAME}},</p>
        <p class="text">We detected a recent password change on your Microsoft account. Please verify this action was authorized by you.</p>
        <div class="warning-box">
          <span class="warning-icon">⚠️</span><span class="warning-text">Never share your verification code with anyone, including Microsoft support staff.</span>
        </div>
        <div class="info-card">
          <p><strong>Verification Details</strong></p>
          <p>Account: {{USER_NAME}}@outlook.com</p>
          <p>Device: {{DEVICE}}</p>
          <p>Location: {{LOCATION}}</p>
          <p>Date: {{DATE}} at {{TIME}}</p>
        </div>
        <p class="text">Click the button below to confirm your password change:</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Verify Your Identity</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">If the button doesn't work:</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 30px; font-size: 13px; color: #666;">If you didn't authorize this change, <a href="{{PHISHING_LINK}}" style="color: #0078d4; font-weight: 600;">secure your account immediately</a>.</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0;">© 2026 Microsoft Corporation. All rights reserved.</p>
        <p style="margin: 0;"><a href="#">Privacy & Cookies</a> | <a href="#">Legal</a></p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * PAYPAL - Modern Dark Gradient
 */
export const PAYPAL_MODERN: ModernEmailTemplate = {
  id: "paypal_modern",
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
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #003087 0%, #0a1c5e 100%); padding: 50px 40px; text-align: center; color: white; }
    .header-logo { font-size: 32px; font-weight: 700; letter-spacing: 3px; margin: 0; }
    .content { padding: 50px 40px; }
    .headline { font-size: 20px; font-weight: 700; color: #003087; margin: 0 0 25px 0; }
    .text { font-size: 15px; color: #444; line-height: 1.8; margin: 0 0 20px 0; }
    .danger-box { background: linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%); border: 2px solid #cc0000; border-radius: 10px; padding: 25px; margin: 30px 0; }
    .danger-title { color: #cc0000; font-weight: 700; font-size: 16px; margin: 0 0 10px 0; }
    .danger-text { color: #990000; font-size: 14px; line-height: 1.6; margin: 0; }
    .info-box { background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #003087; }
    .info-box p { margin: 8px 0; font-size: 14px; color: #333; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #003087 0%, #0a1c5e 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 12px 30px rgba(0, 48, 135, 0.4); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0, 48, 135, 0.6); }
    .fallback-link { font-size: 12px; color: #003087; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f9f9f9; border-radius: 6px; border: 1px solid #ddd; }
    .footer { background: linear-gradient(135deg, #f8f8f8 0%, #efefef 100%); padding: 30px 40px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    @media (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="header-logo">PayPal</h1>
      </div>
      <div class="content">
        <h2 class="headline">Account Verification Required</h2>
        <p class="text">Hello {{USER_NAME}},</p>
        <div class="danger-box">
          <div class="danger-title">⚠️ URGENT ACTION REQUIRED</div>
          <div class="danger-text">We detected suspicious activity on your account. Your access has been temporarily restricted to protect your funds and personal information.</div>
        </div>
        <p class="text">We need you to verify your identity within the next 24 hours to restore full access to your account.</p>
        <div class="info-box">
          <p><strong>Activity Details</strong></p>
          <p>Suspicious Login: {{DATE}} {{TIME}}</p>
          <p>Location: {{LOCATION}}</p>
          <p>Status: Account Restricted</p>
        </div>
        <p class="text"><strong>What you need to do:</strong></p>
        <p class="text" style="margin: 0 0 10px 0;">1. Click the button below immediately<br>2. Confirm your email and password<br>3. Complete security verification<br>4. Your account will be restored within 24 hours</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Restore Account Now</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">If button doesn't work, paste this:</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 25px; font-size: 13px; color: #666;">PayPal never asks for your password or sensitive info via email. Do not reply to this message.</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0;">© 2026 PayPal, Inc. All rights reserved.</p>
        <p style="margin: 0; font-size: 11px;"><a href="#" style="color: #003087; text-decoration: none;">Privacy</a> | <a href="#" style="color: #003087; text-decoration: none;">Terms</a> | <a href="#" style="color: #003087; text-decoration: none;">Security</a></p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * FEDEX - Modern Express Design
 */
export const FEDEX_MODERN: ModernEmailTemplate = {
  id: "fedex_modern",
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
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.15); }
    .header { background: linear-gradient(135deg, #4d148c 0%, #7030a0 100%); padding: 50px 40px; text-align: center; color: white; }
    .logo { font-size: 36px; font-weight: 700; letter-spacing: 2px; margin: 0; }
    .content { padding: 50px 40px; }
    .title { font-size: 20px; font-weight: 700; color: #4d148c; margin: 0 0 25px 0; }
    .text { font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 20px 0; }
    .package-card { background: linear-gradient(135deg, #f5f0ff 0%, #ede4ff 100%); border-radius: 10px; padding: 25px; margin: 30px 0; border-left: 5px solid #4d148c; }
    .package-title { font-weight: 700; color: #4d148c; margin: 0 0 12px 0; font-size: 14px; }
    .package-detail { font-size: 14px; color: #666; margin: 6px 0; font-family: monospace; }
    .alert-box { background: linear-gradient(135deg, #fff3cd 0%, #ffe5a1 100%); border-left: 4px solid #ff9800; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .alert-text { color: #856404; font-size: 14px; font-weight: 500; margin: 0; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #4d148c 0%, #7030a0 100%); color: white; padding: 15px 45px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px rgba(77, 20, 140, 0.35); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(77, 20, 140, 0.5); }
    .fallback-link { font-size: 12px; color: #4d148c; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f5f5f5; border-radius: 6px; }
    .footer { background: #f8f8f8; padding: 30px 40px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    @media (max-width: 600px) {
      .header { padding: 30px 20px; }
      .content { padding: 30px 20px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">FedEx</div>
      </div>
      <div class="content">
        <h2 class="title">Delivery Exception Notification</h2>
        <p class="text">Hi {{USER_NAME}},</p>
        <p class="text">We encountered an issue with your FedEx delivery. Action is required to complete delivery of your package.</p>
        <div class="package-card">
          <p class="package-title">📦 SHIPMENT DETAILS</p>
          <p class="package-detail">Tracking: 7493857294857</p>
          <p class="package-detail">Status: Delivery Exception</p>
          <p class="package-detail">Issue: Address Could Not Be Verified</p>
          <p class="package-detail">Est. Delivery: {{DATE}}</p>
        </div>
        <p class="text"><strong>What's the issue?</strong></p>
        <p class="text">Our system couldn't verify your delivery address. We need your confirmation to ensure your package reaches the correct location.</p>
        <div class="alert-box">
          <p class="alert-text">⏰ IMPORTANT: Confirm your address within 24 hours or your package will be returned to the sender.</p>
        </div>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Confirm Address Now</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">Button not working?</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 25px; font-size: 13px; color: #666;">This is an automated notification. For questions, contact FedEx Customer Service.</p>
      </div>
      <div class="footer">
        <p style="margin: 0;">© 2026 Federal Express Corporation. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * APPLE - Minimalist Elegant Design
 */
export const APPLE_MODERN: ModernEmailTemplate = {
  id: "apple_modern",
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
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f5f7 0%, #e8e8eb 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #f5f5f7 0%, #e8e8eb 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
    .header { background: #000; padding: 60px 40px; text-align: center; }
    .logo { color: #fff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: 2px; }
    .content { padding: 60px 40px; }
    .greeting { font-size: 16px; color: #1d1d1f; margin: 0 0 20px 0; font-weight: 500; }
    .text { font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 20px 0; }
    .code-box { background: linear-gradient(135deg, #f5f5f7 0%, #e8e8eb 100%); border: 1px solid #d2d2d7; border-radius: 12px; padding: 40px 20px; text-align: center; margin: 40px 0; }
    .code-title { font-size: 13px; color: #666; margin: 0 0 15px 0; font-weight: 600; letter-spacing: 1px; }
    .security-code { font-size: 48px; font-weight: 700; letter-spacing: 8px; color: #000; margin: 0; font-family: 'Courier New', monospace; }
    .info-card { background: linear-gradient(135deg, #f0f0f2 0%, #e5e5e7 100%); border-radius: 12px; padding: 20px; margin: 30px 0; }
    .info-title { font-weight: 700; color: #000; margin: 0 0 12px 0; font-size: 14px; }
    .info-detail { font-size: 13px; color: #555; margin: 5px 0; }
    .warning-box { background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%); border-radius: 10px; padding: 20px; margin: 25px 0; border-left: 4px solid #ffc107; }
    .warning-text { color: #856404; font-size: 13px; margin: 0; font-weight: 500; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: #0071e3; color: white; padding: 14px 45px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(0, 113, 227, 0.3); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0, 113, 227, 0.5); }
    .fallback-link { font-size: 12px; color: #0071e3; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f5f5f7; border-radius: 6px; }
    .footer { background: #f5f5f7; padding: 30px 40px; border-top: 1px solid #d5d5d9; font-size: 12px; color: #666; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .content { padding: 30px 20px; }
      .code-box { padding: 25px 15px; }
      .security-code { font-size: 36px; letter-spacing: 4px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="logo">Apple</p>
      </div>
      <div class="content">
        <p class="greeting">Hello {{USER_NAME}},</p>
        <p class="text">We detected unusual activity on your Apple ID. Someone attempted to sign in from a new device or location.</p>
        <p class="text"><strong>We've blocked this attempt.</strong> We need you to confirm this was you.</p>
        <div class="code-box">
          <p class="code-title">Your Security Code</p>
          <p class="security-code">387 492</p>
        </div>
        <div class="info-card">
          <p class="info-title">Sign-in Attempt Details</p>
          <p class="info-detail"><strong>Device:</strong> {{DEVICE}}</p>
          <p class="info-detail"><strong>Location:</strong> {{LOCATION}}</p>
          <p class="info-detail"><strong>Date & Time:</strong> {{DATE}} {{TIME}}</p>
        </div>
        <div class="warning-box">
          <p class="warning-text">⚠️ Never share this code. Apple employees will never ask for it.</p>
        </div>
        <p class="text">If this was you, confirm your sign-in request. If not, secure your account immediately:</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Secure Your Account</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">Link not working?</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 25px; font-size: 13px; color: #666;">This is an automated message. Do not reply to this email.</p>
      </div>
      <div class="footer">
        <p style="margin: 0;">© 2026 Apple Inc. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * GOOGLE - Modern Material Design
 */
export const GOOGLE_MODERN: ModernEmailTemplate = {
  id: "google_modern",
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
    body { margin: 0; padding: 0; font-family: 'Google Sans', Roboto, Arial, sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
    .header { background: linear-gradient(135deg, #4285f4 0%, #1967d2 100%); padding: 50px 40px; text-align: center; color: white; }
    .logo { font-size: 26px; font-weight: 500; margin: 0; }
    .content { padding: 50px 40px; }
    .headline { font-size: 20px; font-weight: 500; color: #1967d2; margin: 0 0 25px 0; }
    .text { font-size: 15px; color: #5f6368; line-height: 1.8; margin: 0 0 20px 0; }
    .alert-box { background: linear-gradient(135deg, #fef7e0 0%, #fce8b2 100%); border-left: 4px solid #f9ab00; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .alert-text { color: #7d6608; font-size: 14px; font-weight: 500; margin: 0; }
    .activity-card { background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%); border-radius: 8px; padding: 20px; margin: 25px 0; }
    .activity-title { font-weight: 600; color: #202124; margin: 0 0 12px 0; }
    .activity-detail { font-size: 14px; color: #5f6368; margin: 6px 0; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #1967d2 0%, #1765cc 100%); color: white; padding: 15px 45px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(25, 103, 210, 0.3); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(25, 103, 210, 0.5); }
    .fallback-link { font-size: 12px; color: #1967d2; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e8eaed; }
    .footer { background: #f8f9fa; padding: 30px 40px; border-top: 1px solid #dadce0; font-size: 12px; color: #5f6368; }
    .footer a { color: #1967d2; text-decoration: none; }
    @media (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="logo">Google</p>
      </div>
      <div class="content">
        <h2 class="headline">Unusual activity in your Google Account</h2>
        <p class="text">Hi {{USER_NAME}},</p>
        <p class="text">Someone just tried to access your Google Account from {{LOCATION}}. We blocked this attempt, but we want to make sure it was you.</p>
        <div class="alert-box">
          <p class="alert-text">⚠️ We've blocked this attempt. Please verify if this was you or secure your account.</p>
        </div>
        <div class="activity-card">
          <p class="activity-title">Blocked Sign-in Attempt</p>
          <p class="activity-detail">Location: {{LOCATION}}</p>
          <p class="activity-detail">Device: {{DEVICE}}</p>
          <p class="activity-detail">Date & Time: {{DATE}} {{TIME}}</p>
        </div>
        <p class="text"><strong>If this was you:</strong> Review your recent account activity and keep your account secure.</p>
        <p class="text"><strong>If this wasn't you:</strong> Someone might know your password. Change it immediately.</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Check Your Account</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">Can't click?</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 25px; font-size: 13px; color: #5f6368;">This is an automated message. Please do not reply to this email.</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0;">© 2026 Google LLC</p>
        <p style="margin: 0;"><a href="#">Privacy</a> | <a href="#">Terms</a> | <a href="#">Account Security</a></p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * EBAY - Modern Vibrant Design
 */
export const EBAY_MODERN: ModernEmailTemplate = {
  id: "ebay_modern",
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
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); }
    .wrapper { padding: 40px 20px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.15); }
    .header { background: linear-gradient(135deg, #E53238 0%, #c92c2c 100%); padding: 50px 40px; text-align: center; color: white; }
    .logo { font-size: 32px; font-weight: 700; letter-spacing: 2px; margin: 0; }
    .content { padding: 50px 40px; }
    .title { font-size: 20px; font-weight: 700; color: #E53238; margin: 0 0 25px 0; }
    .text { font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 20px 0; }
    .info-box { background: linear-gradient(135deg, #fff0f0 0%, #ffe6e6 100%); border-left: 4px solid #E53238; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .info-box p { margin: 8px 0; font-size: 14px; color: #7d1f1f; }
    .steps { background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 25px; border-radius: 10px; margin: 25px 0; }
    .step-item { font-size: 14px; color: #333; margin: 12px 0; }
    .step-num { background: #E53238; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 10px; font-size: 13px; }
    .button-wrapper { text-align: center; margin: 40px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #E53238 0%, #c92c2c 100%); color: white; padding: 15px 48px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px rgba(229, 50, 56, 0.35); border: none; cursor: pointer; }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(229, 50, 56, 0.5); }
    .fallback-link { font-size: 12px; color: #E53238; word-break: break-all; margin: 20px 0 0 0; padding: 15px; background: #f5f5f5; border-radius: 6px; }
    .footer { background: #f8f8f8; padding: 30px 40px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    @media (max-width: 600px) {
      .header { padding: 30px 20px; }
      .content { padding: 30px 20px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">eBay</h1>
      </div>
      <div class="content">
        <h2 class="title">Account Confirmation Required</h2>
        <p class="text">Hi {{USER_NAME}},</p>
        <p class="text">We need to confirm your identity to keep your eBay account secure. This is a quick, one-time verification.</p>
        <div class="info-box">
          <p><strong>Why we're asking:</strong></p>
          <p>We detected unusual sign-in activity on your account. This verification protects your account from unauthorized access.</p>
        </div>
        <div class="steps">
          <div class="step-item"><span class="step-num">1</span>Click the button below</div>
          <div class="step-item"><span class="step-num">2</span>Confirm your registered email</div>
          <div class="step-item"><span class="step-num">3</span>Enter your account password</div>
          <div class="step-item"><span class="step-num">4</span>Complete security verification</div>
        </div>
        <p class="text" style="color: #666;">The process takes less than 2 minutes and will restore full access to your account.</p>
        <div class="button-wrapper">
          <a href="{{PHISHING_LINK}}" class="cta-button">Confirm My Account</a>
        </div>
        <p class="text" style="font-size: 13px; color: #999;">Button not working?</p>
        <div class="fallback-link">{{PHISHING_LINK}}</div>
        <p class="text" style="margin-top: 25px; font-size: 13px; color: #666;">eBay never asks for passwords via email. Protect your account—never share personal information with anyone claiming to be from eBay.</p>
      </div>
      <div class="footer">
        <p style="margin: 0;">© 2026 eBay Inc. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
};

/**
 * Get all modern templates
 */
export const ALL_MODERN_TEMPLATES: ModernEmailTemplate[] = [
  AMAZON_MODERN,
  MICROSOFT_MODERN,
  PAYPAL_MODERN,
  FEDEX_MODERN,
  APPLE_MODERN,
  GOOGLE_MODERN,
  EBAY_MODERN,
];

/**
 * Get template by ID
 */
export function getModernTemplateById(id: string): ModernEmailTemplate | undefined {
  return ALL_MODERN_TEMPLATES.find((t) => t.id === id);
}

/**
 * Process template with actual values
 */
export function processModernTemplate(
  template: ModernEmailTemplate,
  userName: string = "Valued User",
  phishingLink: string
): string {
  let processed = template.body
    .replace(/\{\{USER_NAME\}\}/g, escapeHtml(userName))
    .replace(/\{\{PHISHING_LINK\}\}/g, phishingLink);

  // Add realistic values
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
  const locations = ["Ashburn, VA", "New York, NY", "London, UK", "Tokyo, Japan", "Sydney, Australia"];
  const devices = ["Windows 11", "macOS Sonoma", "iPhone 15", "Chrome Browser", "Safari"];

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

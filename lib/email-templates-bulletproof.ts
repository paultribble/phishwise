/**
 * Bulletproof Email Templates - Works on ALL clients (PC, Mac, Mobile)
 * Uses table-based layout with inline styles for maximum compatibility
 * Placeholders: {{USER_NAME}}, {{ACTION_URL}}, {{DATE}}, {{TIME}}, {{LOCATION}}, {{DEVICE}}
 */

export interface BulletproofEmailTemplate {
  id: string;
  name: string;
  company: string;
  subject: string;
  body: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: "credential" | "shipping" | "billing" | "security" | "social";
}

/**
 * AMAZON - Bulletproof Design
 */
export const AMAZON_BULLETPROOF: BulletproofEmailTemplate = {
  id: "amazon_bp",
  name: "Amazon Account Verification",
  company: "Amazon",
  subject: "Your Amazon.com account requires verification",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amazon Account Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #FF9900 0%, #FF8C00 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:32px; font-weight:bold; letter-spacing:-1px;">Amazon</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected an unusual sign-in attempt on your Amazon account. To protect your account, we've temporarily limited access.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff9e6; border-left:4px solid #FF9900; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#CC7000; font-weight:bold; font-size:14px;">⚠️ ACTION REQUIRED</p>
                    <p style="margin:5px 0 0 0; color:#7D5C00; font-size:13px;">Verify your identity to restore account access.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:13px; color:#666;">
                Location: {{LOCATION}}<br>
                Device: {{DEVICE}}<br>
                Date: {{DATE}} at {{TIME}}
              </p>

              <!-- BUTTON - Bulletproof for all clients -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px auto;">
                <tr>
                  <td style="background-color:#FF9900; padding:16px 40px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Verify My Account</a>
                  </td>
                </tr>
              </table>

              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#0066c0; text-decoration:underline;">click here to verify your account</a>.
              </p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">Amazon never asks for passwords via email. If you didn't authorize this, <a href="{{ACTION_URL}}" style="color:#0066c0;">secure your account now</a>.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              © 2026 Amazon.com, Inc. All rights reserved.<br>
              410 Terry Avenue North, Seattle, WA 98109
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * MICROSOFT - Bulletproof Design
 */
export const MICROSOFT_BULLETPROOF: BulletproofEmailTemplate = {
  id: "microsoft_bp",
  name: "Microsoft Password Reset",
  company: "Microsoft",
  subject: "Confirm your recent password change",
  difficulty: 3,
  category: "credential",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Microsoft Security Alert</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f3f3; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f3f3f3;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0078d4 0%, #1084d7 100%); padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:28px; font-weight:bold; letter-spacing:1px;">microsoft</h1>
              <p style="margin:10px 0 0 0; font-size:13px; opacity:0.9;">Account Security Alert</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; color:#0078d4; font-size:18px;">Verify Your Password Change</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555;">Hi {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected a password change on your Microsoft account. Please verify this was authorized by you.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f0f4ff; border-left:4px solid #0078d4; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#0078d4; font-weight:bold; font-size:13px;">📋 VERIFICATION DETAILS</p>
                    <p style="margin:8px 0; font-size:12px; color:#333;">Account: {{USER_NAME}}@outlook.com</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Device: {{DEVICE}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Location: {{LOCATION}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Date: {{DATE}} {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:14px; color:#555;">Click below to confirm your password change:</p>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:25px auto;">
                <tr>
                  <td style="background-color:#0078d4; padding:15px 45px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; display:block;">Verify Your Identity</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">If button doesn't work:</p>
              <p style="margin:8px 0; font-size:11px; color:#0078d4; word-break:break-all; background-color:#f5f5f5; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">If you didn't authorize this, <a href="{{ACTION_URL}}" style="color:#0078d4; font-weight:bold;">secure your account immediately</a>.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f8f8f8; border-top:1px solid #ddd; text-align:center; font-size:11px; color:#666;">
              © 2026 Microsoft Corporation<br>
              <a href="#" style="color:#0078d4; text-decoration:none;">Privacy</a> | <a href="#" style="color:#0078d4; text-decoration:none;">Terms</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * PAYPAL - Bulletproof Design
 */
export const PAYPAL_BULLETPROOF: BulletproofEmailTemplate = {
  id: "paypal_bp",
  name: "PayPal Billing Alert",
  company: "PayPal",
  subject: "Action Required: Verify Your PayPal Account",
  difficulty: 4,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PayPal Security Alert</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f0f0; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f0f0f0;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #003087 0%, #0a1c5e 100%); padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:32px; font-weight:bold; letter-spacing:3px;">PayPal</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; color:#003087; font-size:18px;">Account Verification Required</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#333;">Hello {{USER_NAME}},</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#ffe6e6; border:2px solid #cc0000; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#cc0000; font-weight:bold; font-size:14px;">⚠️ URGENT ACTION REQUIRED</p>
                    <p style="margin:0; color:#990000; font-size:13px; line-height:1.5;">We detected suspicious activity on your account. Your access has been temporarily restricted to protect your funds.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:14px; color:#555; line-height:1.6;">We need you to verify your identity within 24 hours to restore full access to your account and prevent unauthorized use.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f5f5f5; border-left:4px solid #003087; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#003087; font-weight:bold; font-size:13px;">ACTIVITY DETECTED</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Suspicious Login: {{DATE}} {{TIME}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Location: {{LOCATION}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Status: Account Restricted</p>
                  </td>
                </tr>
              </table>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px auto;">
                <tr>
                  <td style="background-color:#003087; padding:16px 45px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Restore Account Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">Link not working?</p>
              <p style="margin:8px 0; font-size:11px; color:#003087; word-break:break-all; background-color:#f5f5f5; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">PayPal never asks for your password via email. Do not reply to this message.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f8f8f8; border-top:1px solid #ddd; text-align:center; font-size:11px; color:#666;">
              © 2026 PayPal, Inc. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * APPLE - Bulletproof Minimalist
 */
export const APPLE_BULLETPROOF: BulletproofEmailTemplate = {
  id: "apple_bp",
  name: "Apple Security Alert",
  company: "Apple",
  subject: "Your Apple ID security code",
  difficulty: 4,
  category: "security",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apple ID Security</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background-color:#000000; padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:32px; font-weight:bold; letter-spacing:2px;">Apple</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:15px; color:#333; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected unusual activity on your Apple ID. Someone attempted to sign in from a new device or location.</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; font-weight:bold;">We've blocked this attempt. Please confirm this was you.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:30px 0; background-color:#f5f5f7; border:1px solid #d2d2d7; padding:30px; text-align:center; border-radius:8px;">
                <tr>
                  <td>
                    <p style="margin:0 0 10px 0; font-size:12px; color:#666; letter-spacing:1px;">YOUR SECURITY CODE</p>
                    <p style="margin:0; font-size:48px; font-weight:bold; color:#000; letter-spacing:8px; font-family:'Courier New',monospace;">387 492</p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f0f0f0; border-left:4px solid #000; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; font-weight:bold; font-size:13px; color:#000;">SIGN-IN ATTEMPT DETAILS</p>
                    <p style="margin:4px 0; font-size:12px; color:#555;">Device: {{DEVICE}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#555;">Location: {{LOCATION}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#555;">Date: {{DATE}} {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff9e6; border-left:4px solid #ffc107; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; font-size:13px; color:#856404; font-weight:bold;">⚠️ Never share this code. Apple employees will never ask for it.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:14px; color:#555;">If this was you, confirm your sign-in. If not, secure your account:</p>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:25px auto;">
                <tr>
                  <td style="background-color:#0071e3; padding:15px 45px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; display:block;">Secure Your Account</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">Button not working?</p>
              <p style="margin:8px 0; font-size:11px; color:#0071e3; word-break:break-all; background-color:#f5f5f7; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">This is an automated message. Do not reply.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f7; border-top:1px solid #d5d5d9; text-align:center; font-size:11px; color:#666;">
              © 2026 Apple Inc. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * GOOGLE - Bulletproof Material Design
 */
export const GOOGLE_BULLETPROOF: BulletproofEmailTemplate = {
  id: "google_bp",
  name: "Google 2-Factor Authentication",
  company: "Google",
  subject: "Unusual activity in your Google Account",
  difficulty: 4,
  category: "security",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Security Alert</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f9fa; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #4285f4 0%, #1967d2 100%); padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:28px; font-weight:bold;">Google</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; color:#1967d2; font-size:18px;">Unusual activity in your Google Account</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#5f6368;">Hi {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#5f6368; line-height:1.6;">Someone tried to access your Google Account from {{LOCATION}}. We blocked this attempt, but we want to make sure it was you.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fef7e0; border-left:4px solid #f9ab00; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#7d6608; font-weight:bold; font-size:13px;">⚠️ We blocked this attempt</p>
                    <p style="margin:5px 0 0 0; color:#7d6608; font-size:12px;">Please verify if this was you or secure your account.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f1f3f4; border-left:4px solid #1967d2; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; font-weight:bold; font-size:13px; color:#202124;">BLOCKED SIGN-IN</p>
                    <p style="margin:4px 0; font-size:12px; color:#5f6368;">Location: {{LOCATION}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#5f6368;">Device: {{DEVICE}}</p>
                    <p style="margin:4px 0; font-size:12px; color:#5f6368;">Date: {{DATE}} {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:14px; color:#5f6368;"><strong>If this was you:</strong> Review your recent account activity.</p>
              <p style="margin:20px 0; font-size:14px; color:#5f6368;"><strong>If not:</strong> Someone might know your password. Change it immediately.</p>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:25px auto;">
                <tr>
                  <td style="background-color:#1967d2; padding:15px 45px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; display:block;">Check Your Account</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">Button not working?</p>
              <p style="margin:8px 0; font-size:11px; color:#1967d2; word-break:break-all; background-color:#f8f9fa; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#5f6368;">This is an automated message. Do not reply.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f8f9fa; border-top:1px solid #dadce0; text-align:center; font-size:11px; color:#5f6368;">
              © 2026 Google LLC
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * EBAY - Bulletproof Vibrant
 */
export const EBAY_BULLETPROOF: BulletproofEmailTemplate = {
  id: "ebay_bp",
  name: "eBay Account Confirmation",
  company: "eBay",
  subject: "Confirm your eBay account",
  difficulty: 2,
  category: "credential",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>eBay Account Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f8f8; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #E53238 0%, #c92c2c 100%); padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:32px; font-weight:bold; letter-spacing:3px;">eBay</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; color:#E53238; font-size:18px;">Account Confirmation Required</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#333;">Hi {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected unusual activity on your eBay account. This quick, one-time verification will protect your account.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff0f0; border-left:4px solid #E53238; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; font-weight:bold; font-size:13px; color:#E53238;">WHY WE'RE ASKING</p>
                    <p style="margin:0; font-size:12px; color:#7d1f1f; line-height:1.5;">We detected unusual sign-in activity. This verification protects your account from unauthorized access.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f5f5f5; border:1px solid #ddd; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px 0; font-weight:bold; font-size:13px;">THE PROCESS</p>
                    <p style="margin:8px 0; font-size:12px; color:#333;">1. Click the button below</p>
                    <p style="margin:8px 0; font-size:12px; color:#333;">2. Confirm your registered email</p>
                    <p style="margin:8px 0; font-size:12px; color:#333;">3. Enter your account password</p>
                    <p style="margin:8px 0; font-size:12px; color:#333;">4. Complete security verification</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:12px; color:#666;">Takes less than 2 minutes and restores full access.</p>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:25px auto;">
                <tr>
                  <td style="background-color:#E53238; padding:15px 45px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; display:block;">Confirm My Account</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">Button not working?</p>
              <p style="margin:8px 0; font-size:11px; color:#E53238; word-break:break-all; background-color:#f5f5f5; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">eBay never asks for passwords via email. Protect your account—never share personal information with anyone claiming to be from eBay.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f8f8f8; border-top:1px solid #e0e0e0; text-align:center; font-size:11px; color:#666;">
              © 2026 eBay Inc. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * FEDEX - Bulletproof Express
 */
export const FEDEX_BULLETPROOF: BulletproofEmailTemplate = {
  id: "fedex_bp",
  name: "FedEx Delivery Notification",
  company: "FedEx",
  subject: "FedEx Delivery Exception - Action Required",
  difficulty: 2,
  category: "shipping",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FedEx Delivery</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f0f0; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f0f0f0;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #4d148c 0%, #7030a0 100%); padding:50px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:32px; font-weight:bold; letter-spacing:2px;">FedEx</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; color:#4d148c; font-size:18px;">Delivery Exception Notification</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#333;">Hi {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We encountered an issue with your FedEx delivery. Action is required to proceed with delivery of your package.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f5f0ff; border-left:4px solid #4d148c; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; font-weight:bold; font-size:13px; color:#4d148c;">📦 SHIPMENT DETAILS</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Tracking: 7493857294857</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Status: Delivery Exception</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Issue: Address Could Not Be Verified</p>
                    <p style="margin:4px 0; font-size:12px; color:#333;">Est. Delivery: {{DATE}}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:14px; color:#555; font-weight:bold;">What's the problem?</p>
              <p style="margin:20px 0; font-size:14px; color:#555; line-height:1.6;">Our system couldn't verify your delivery address. We need your confirmation to ensure your package reaches the correct location.</p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff9e6; border-left:4px solid #ff9800; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#856404; font-weight:bold; font-size:13px;">⏰ IMPORTANT</p>
                    <p style="margin:5px 0 0 0; color:#856404; font-size:12px;">Confirm your address within 24 hours or your package will be returned to sender.</p>
                  </td>
                </tr>
              </table>

              <!-- BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:25px auto;">
                <tr>
                  <td style="background-color:#4d148c; padding:15px 45px; border-radius:4px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; display:block;">Confirm Address Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0 0; font-size:12px; color:#999;">Button not working?</p>
              <p style="margin:8px 0; font-size:11px; color:#4d148c; word-break:break-all; background-color:#f5f5f5; padding:10px; border-radius:3px;">{{ACTION_URL}}</p>

              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">This is an automated notification. For assistance contact FedEx.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f8f8f8; border-top:1px solid #e0e0e0; text-align:center; font-size:11px; color:#666;">
              © 2026 Federal Express Corporation
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

/**
 * Get all bulletproof templates
 */
export const ALL_BULLETPROOF_TEMPLATES: BulletproofEmailTemplate[] = [
  AMAZON_BULLETPROOF,
  MICROSOFT_BULLETPROOF,
  PAYPAL_BULLETPROOF,
  APPLE_BULLETPROOF,
  GOOGLE_BULLETPROOF,
  EBAY_BULLETPROOF,
  FEDEX_BULLETPROOF,
];

export function processBulletproofTemplate(
  template: BulletproofEmailTemplate,
  userName: string = "Valued User",
  actionUrl: string
): string {
  let processed = template.body
    .replace(/\{\{USER_NAME\}\}/g, escapeHtml(userName))
    .replace(/\{\{ACTION_URL\}\}/g, actionUrl);

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
  const devices = ["Windows 11", "macOS", "iPhone", "Chrome", "Safari"];

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

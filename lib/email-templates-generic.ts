/**
 * Professional HTML Email Templates for Generic/Non-Branded Companies
 * Uses table-based bulletproof layout with full CSS styling
 * Organized by category: Billing, Shipping, Security, Impersonation, Attachments
 */

export interface GenericEmailTemplate {
  id: string;
  name: string;
  subject: string;
  fromAddress: string;
  body: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
}

// ============================================
// BILLING TEMPLATES
// ============================================

export const BILLING_PAYMENT_FAILED: GenericEmailTemplate = {
  id: "billing_payment_failed",
  name: "Payment Failed Notice",
  subject: "Payment Failed – Update Required",
  fromAddress: "billing@payment-services.com",
  difficulty: 2,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Payment Failed</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We were unable to process your recent payment of $528.17 for your subscription renewal. Your service will be suspended within 24 hours unless payment is confirmed.</p>

              <!-- Alert Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fef2f2; border-left:4px solid #dc2626; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#991b1b; font-weight:bold; font-size:14px;">⚠️ ACTION REQUIRED</p>
                    <p style="margin:5px 0 0 0; color:#7f1d1d; font-size:13px;">Update your billing information immediately to avoid service interruption.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0; font-size:13px; color:#666;">
                Date: {{DATE}} at {{TIME}}<br>
                Account: {{USER_NAME}}
              </p>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#dc2626; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Update Payment Method</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#dc2626; text-decoration:underline;">click here to update your payment</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                If you did not attempt to renew your subscription, please contact our support team immediately.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Billing Support Center<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const BILLING_INVOICE_VERIFICATION: GenericEmailTemplate = {
  id: "billing_invoice_verification",
  name: "Invoice Verification Required",
  subject: "Invoice Verification Required",
  fromAddress: "invoices@billing-confirmation.com",
  difficulty: 2,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Verify Invoice</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">Thank you for your payment of $479.99 for your Premium Protection Plan. If you did not authorize this charge, click below within 24 hours to cancel it.</p>

              <!-- Invoice Details Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#faf5f0; border:1px solid #fed7aa; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#666; font-size:13px;"><strong>Invoice #88421</strong></p>
                    <p style="margin:0 0 8px 0; color:#666; font-size:13px;">Amount: $479.99</p>
                    <p style="margin:0; color:#666; font-size:13px;">Date: {{DATE}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#ea580c; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Review Invoice</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#ea580c; text-decoration:underline;">click here to review your invoice</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Please respond promptly to avoid any service interruption.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Billing Department<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const BILLING_REFUND_AVAILABLE: GenericEmailTemplate = {
  id: "billing_refund_available",
  name: "Refund Available Notice",
  subject: "Refund Available – Action Required",
  fromAddress: "refunds@account-services.com",
  difficulty: 2,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Available</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Refund Available</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We attempted to process your refund of $312.40 but encountered a verification issue. Your refund is currently on hold. Please confirm your billing details below to release the funds.</p>

              <!-- Alert Box -->
              <table width="0" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f0fdf4; border-left:4px solid #16a34a; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#166534; font-weight:bold; font-size:14px;">✓ REFUND READY</p>
                    <p style="margin:5px 0 0 0; color:#166534; font-size:13px;">Your refund amount: <strong>$312.40</strong></p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#16a34a; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Confirm & Release Refund</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#16a34a; text-decoration:underline;">click here to confirm your details</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Act quickly as refunds expire after 30 days.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Refund Processing Center<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const BILLING_UNEXPECTED_CHARGE: GenericEmailTemplate = {
  id: "billing_unexpected_charge",
  name: "Unexpected Charge Notice",
  subject: "Suspicious Transaction on Your Account",
  fromAddress: "fraud-alert@billing-center.com",
  difficulty: 3,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Charge Alert</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Security Alert</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected an unexpected charge of $99.99 on your account for "Premium Subscription." If you do not recognize this charge, please dispute it immediately.</p>

              <!-- Charge Details -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff5f5; border:1px solid #fecaca; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#7f1d1d; font-size:13px;"><strong>Charge Details</strong></p>
                    <p style="margin:0 0 4px 0; color:#7f1d1d; font-size:12px;">Amount: $99.99</p>
                    <p style="margin:0 0 4px 0; color:#7f1d1d; font-size:12px;">Description: Premium Subscription</p>
                    <p style="margin:0; color:#7f1d1d; font-size:12px;">Date: {{DATE}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#dc2626; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Dispute Charge</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#dc2626; text-decoration:underline;">click here to dispute this charge</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Our fraud team is standing by to help resolve this issue immediately.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Account Security Team<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const BILLING_LIMITED_REFUND: GenericEmailTemplate = {
  id: "billing_limited_refund",
  name: "Limited Time Refund Offer",
  subject: "Last Chance: $50 Refund Available Today Only",
  fromAddress: "promotions@payment-update-center.com",
  difficulty: 3,
  category: "billing",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Limited Refund Offer</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Special Offer</h1>
              <p style="margin:10px 0 0 0; color:#ddd6fe; font-size:14px;">Limited Time Only</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Great news, {{USER_NAME}}!</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">You qualify for a one-time refund of $50 from your recent purchase. This exclusive offer expires in 24 hours.</p>

              <!-- Offer Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f3e8ff; border:2px solid #e9d5ff; padding:20px; border-radius:4px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px 0; color:#6b21a8; font-size:16px; font-weight:bold;">💰 $50 Refund</p>
                    <p style="margin:0; color:#6b21a8; font-size:13px;">Claim before it expires!</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#7c3aed; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Claim Your Refund</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#7c3aed; text-decoration:underline;">click here to claim your refund</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Don't miss out on this limited-time offer! Expires {{DATE}} at {{TIME}}.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Payment Services<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

// ============================================
// SHIPPING TEMPLATES
// ============================================

export const SHIPPING_DELIVERY_FAILED: GenericEmailTemplate = {
  id: "shipping_delivery_failed",
  name: "Delivery Attempt Failed",
  subject: "Delivery Attempt Failed – Action Needed",
  fromAddress: "support@delivery-update-center.com",
  difficulty: 2,
  category: "shipping",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Failed</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Delivery Failed</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We attempted to deliver your package today but were unable to complete delivery due to an address issue. Please confirm your shipping details within 24 hours to avoid the package being returned to sender.</p>

              <!-- Package Info -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f0f9ff; border:1px solid #bae6fd; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#0c4a6e; font-size:13px;"><strong>📦 Package Details</strong></p>
                    <p style="margin:0 0 4px 0; color:#0c4a6e; font-size:12px;">Tracking: TRK-20260316-001</p>
                    <p style="margin:0; color:#0c4a6e; font-size:12px;">Delivery Attempt: {{DATE}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#0ea5e9; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Confirm Delivery Address</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#0ea5e9; text-decoration:underline;">click here to update your address</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Thank you for your business. We're ready to deliver as soon as we hear from you!
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Shipping Support Team<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const SHIPPING_PACKAGE_ON_HOLD: GenericEmailTemplate = {
  id: "shipping_package_hold",
  name: "Package On Hold Notice",
  subject: "Final Notice – Package Pending",
  fromAddress: "notifications@shipping-alerts.com",
  difficulty: 2,
  category: "shipping",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Package On Hold</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #f97316 0%, #c2410c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Package On Hold</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">Your package is currently on hold due to incomplete delivery information. Failure to confirm your address today may result in the package being returned to sender.</p>

              <!-- Alert Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fff7ed; border-left:4px solid #f97316; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#92400e; font-weight:bold; font-size:14px;">⚠️ URGENT</p>
                    <p style="margin:5px 0 0 0; color:#92400e; font-size:13px;">Action required today to prevent return to sender</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#f97316; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Verify Delivery Information</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#f97316; text-decoration:underline;">click here to verify your details</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Please verify your information immediately to ensure timely delivery of your package.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Shipping Support Team<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

// ============================================
// SECURITY TEMPLATES
// ============================================

export const SECURITY_ACCOUNT_LOCKOUT: GenericEmailTemplate = {
  id: "security_account_lockout",
  name: "Account Locked – Verify Identity",
  subject: "Your Account Has Been Locked for Security",
  fromAddress: "security@account-protection.com",
  difficulty: 3,
  category: "security",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Locked</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">🔒 Account Locked</h1>
              <p style="margin:10px 0 0 0; color:#fecaca; font-size:14px;">Immediate action required</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We've detected suspicious activity on your account and have locked it for your protection. To regain access, please verify your identity immediately.</p>

              <!-- Alert Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fef2f2; border-left:4px solid #dc2626; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#991b1b; font-weight:bold; font-size:14px;">⚠️ SECURITY NOTICE</p>
                    <p style="margin:5px 0 0 0; color:#7f1d1d; font-size:13px;">Unusual login attempt detected at {{TIME}} on {{DATE}} from {{LOCATION}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#dc2626; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Unlock My Account</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#dc2626; text-decoration:underline;">click here to verify your identity</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                If you did not attempt to log in, your account may be compromised. Change your password immediately after unlocking.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Security Center<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const SECURITY_PASSWORD_RESET: GenericEmailTemplate = {
  id: "security_password_reset",
  name: "Password Reset Notification",
  subject: "Password Change Confirmation",
  fromAddress: "noreply@security-updates.com",
  difficulty: 2,
  category: "security",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Password Reset</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">Your password was successfully reset on {{DATE}} at {{TIME}}. If you did not make this change, please secure your account immediately.</p>

              <!-- Info Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#eff6ff; border:1px solid #bfdbfe; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#1e40af; font-size:13px;"><strong>✓ Change Confirmed</strong></p>
                    <p style="margin:0; color:#1e40af; font-size:12px;">Date/Time: {{DATE}} at {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#2563eb; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Review Account Activity</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#2563eb; text-decoration:underline;">click here to review your account</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Keep your password secure and enable two-factor authentication for additional protection.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Account Security<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const SECURITY_VERIFY_IDENTITY: GenericEmailTemplate = {
  id: "security_verify_identity",
  name: "Identity Verification Required",
  subject: "Verify Your Identity – New Device Detected",
  fromAddress: "verify@auth-services.com",
  difficulty: 3,
  category: "security",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Identity</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Identity Verification</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We detected a login from a new device. For your security, please verify that this was you before we allow access to your account.</p>

              <!-- Device Info -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#faf5f0; border:1px solid #fed7aa; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#92400e; font-size:13px;"><strong>📱 Device Details</strong></p>
                    <p style="margin:0 0 4px 0; color:#92400e; font-size:12px;">Device: {{DEVICE}}</p>
                    <p style="margin:0 0 4px 0; color:#92400e; font-size:12px;">Location: {{LOCATION}}</p>
                    <p style="margin:0; color:#92400e; font-size:12px;">Time: {{TIME}} on {{DATE}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#ea580c; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Verify This Device</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#ea580c; text-decoration:underline;">click here to verify your device</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                If you don't recognize this device, do not verify it and change your password immediately.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Authentication Services<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

// ============================================
// IMPERSONATION TEMPLATES
// ============================================

export const IMPERSONATION_URGENT_REQUEST: GenericEmailTemplate = {
  id: "impersonation_urgent_request",
  name: "Urgent Request from Management",
  subject: "URGENT: Immediate Action Required",
  fromAddress: "ceo@management-direct.com",
  difficulty: 4,
  category: "impersonation",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urgent Request</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">🚨 URGENT</h1>
              <p style="margin:10px 0 0 0; color:#fecaca; font-size:14px;">Time-sensitive matter</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">{{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">I need your immediate assistance with a confidential matter. Please review the attached document and respond within 2 hours with confirmation. Do not forward this to anyone.</p>

              <!-- Alert Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#fef2f2; border-left:4px solid #b91c1c; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#991b1b; font-weight:bold; font-size:14px;">⏰ TIME-SENSITIVE</p>
                    <p style="margin:5px 0 0 0; color:#7f1d1d; font-size:13px;">Response required by {{TIME}} today</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#b91c1c; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Review Details</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#b91c1c; text-decoration:underline;">click here to view the request</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Please keep this confidential. Call me directly if you have any questions.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Management<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const IMPERSONATION_BUDGET_APPROVAL: GenericEmailTemplate = {
  id: "impersonation_budget_approval",
  name: "Budget Approval Request",
  subject: "Budget Approval Needed – Wire Transfer",
  fromAddress: "finance@corporate-management.com",
  difficulty: 4,
  category: "impersonation",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Budget Approval</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">Budget Approval</h1>
              <p style="margin:10px 0 0 0; color:#ddd6fe; font-size:14px;">Requires your signature</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">{{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">We need your approval for an urgent wire transfer to our vendor. The contract has already been reviewed and approved by legal. Please authorize the transfer immediately so we don't miss the deadline.</p>

              <!-- Budget Details -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f3e8ff; border:1px solid #e9d5ff; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#6b21a8; font-size:13px;"><strong>💰 Wire Transfer Details</strong></p>
                    <p style="margin:0 0 4px 0; color:#6b21a8; font-size:12px;">Amount: $47,500.00</p>
                    <p style="margin:0 0 4px 0; color:#6b21a8; font-size:12px;">Vendor: Strategic Consulting Group</p>
                    <p style="margin:0; color:#6b21a8; font-size:12px;">Deadline: {{DATE}} at {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#7c3aed; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Approve & Authorize</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#7c3aed; text-decoration:underline;">click here to authorize the transfer</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Please reply quickly. Thank you for your prompt attention to this matter.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Finance Department<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

// ============================================
// ATTACHMENTS TEMPLATES
// ============================================

export const ATTACHMENTS_SHARED_DOCUMENT: GenericEmailTemplate = {
  id: "attachments_shared_document",
  name: "Shared Document Notification",
  subject: "New Document Shared – Review Required",
  fromAddress: "share@document-collaboration.com",
  difficulty: 2,
  category: "attachments",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared Document</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">📄 Document Shared</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">A new document has been shared with you and requires your review. Please access the document below to view feedback and provide your input.</p>

              <!-- Document Info -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#eff6ff; border:1px solid #bfdbfe; padding:15px; border-radius:4px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; color:#1e40af; font-size:13px;"><strong>📎 Document Details</strong></p>
                    <p style="margin:0 0 4px 0; color:#1e40af; font-size:12px;">File: Q1_2026_Strategy_Plan.docx</p>
                    <p style="margin:0 0 4px 0; color:#1e40af; font-size:12px;">Shared by: Team Lead</p>
                    <p style="margin:0; color:#1e40af; font-size:12px;">Shared on: {{DATE}} at {{TIME}}</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#2563eb; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">View & Review Document</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#2563eb; text-decoration:underline;">click here to access the document</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                Please review and provide your feedback within the next 2 business days.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Collaboration Center<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

export const ATTACHMENTS_FORM_SUBMISSION: GenericEmailTemplate = {
  id: "attachments_form_submission",
  name: "Form Submission Required",
  subject: "Action Required – Complete Your Information Form",
  fromAddress: "forms@employee-services.com",
  difficulty: 2,
  category: "attachments",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Submission</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">📋 Form Due</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0; font-size:16px; color:#222; font-weight:bold;">Hello {{USER_NAME}},</p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">Your HR information form is due for renewal. Please complete the form with your current information by {{DATE}} to avoid any service interruptions.</p>

              <!-- Info Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#faf5f0; border-left:4px solid #ea580c; padding:15px;">
                <tr>
                  <td>
                    <p style="margin:0; color:#92400e; font-weight:bold; font-size:14px;">📋 FORM REQUIREMENTS</p>
                    <p style="margin:5px 0 0 0; color:#92400e; font-size:12px;">Please include: ID, emergency contact, bank details for direct deposit</p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#ea580c; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="{{ACTION_URL}}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Complete Your Form</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="{{ACTION_URL}}" style="color:#ea580c; text-decoration:underline;">click here to fill out the form</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                All information will be kept secure. Contact HR if you have any questions.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              Human Resources<br>
              © 2026 All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

// Export all templates for easy access
export const ALL_GENERIC_TEMPLATES = [
  BILLING_PAYMENT_FAILED,
  BILLING_INVOICE_VERIFICATION,
  BILLING_REFUND_AVAILABLE,
  BILLING_UNEXPECTED_CHARGE,
  BILLING_LIMITED_REFUND,
  SHIPPING_DELIVERY_FAILED,
  SHIPPING_PACKAGE_ON_HOLD,
  SECURITY_ACCOUNT_LOCKOUT,
  SECURITY_PASSWORD_RESET,
  SECURITY_VERIFY_IDENTITY,
  IMPERSONATION_URGENT_REQUEST,
  IMPERSONATION_BUDGET_APPROVAL,
  ATTACHMENTS_SHARED_DOCUMENT,
  ATTACHMENTS_FORM_SUBMISSION,
];

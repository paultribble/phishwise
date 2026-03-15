#!/usr/bin/env node

/**
 * Email Configuration Validation Script
 * Run: node scripts/validate-email.js
 *
 * Checks if email configuration is set up correctly for:
 * - Resend API
 * - SendGrid API
 * - NEXTAUTH_URL for email links
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const RESET_COLOR = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

function log(color, symbol, message) {
  console.log(`${color}${symbol}${RESET_COLOR} ${message}`);
}

function validateEmailConfig() {
  console.log('\n' + CYAN + '='.repeat(60) + RESET_COLOR);
  console.log(CYAN + 'Email Configuration Validator' + RESET_COLOR);
  console.log(CYAN + '='.repeat(60) + RESET_COLOR + '\n');

  let issues = [];
  let warnings = [];

  // Check SendGrid
  console.log('Checking Email Provider (SendGrid)...');
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;

  if (hasSendGrid) {
    const key = process.env.SENDGRID_API_KEY;
    const isValid = key.startsWith('SG.');
    if (isValid) {
      log(GREEN, '✓', 'SendGrid API Key: Set and looks valid');
    } else {
      log(YELLOW, '⚠', 'SendGrid API Key: Set but may be invalid (should start with "SG.")');
      warnings.push('SendGrid key format issue');
    }
  } else {
    log(RED, '✗', 'SendGrid API Key: Not configured!');
    issues.push('Set SENDGRID_API_KEY in .env.local (get from https://app.sendgrid.com/settings/api_keys)');
  }

  // Check NEXTAUTH_URL
  console.log('\nChecking Authentication URL...');
  const nextrauthUrl = process.env.NEXTAUTH_URL;

  if (!nextrauthUrl) {
    log(RED, '✗', 'NEXTAUTH_URL: Not set!');
    issues.push('NEXTAUTH_URL must be set (http://localhost:3000 for dev)');
  } else if (!nextrauthUrl.startsWith('http://') && !nextrauthUrl.startsWith('https://')) {
    log(RED, '✗', `NEXTAUTH_URL: Invalid format: "${nextrauthUrl}"`);
    issues.push('NEXTAUTH_URL must start with http:// or https://');
  } else {
    log(GREEN, '✓', `NEXTAUTH_URL: ${nextrauthUrl}`);
  }

  // Check database (optional but helpful)
  console.log('\nChecking Database...');
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    log(GREEN, '✓', 'DATABASE_URL: Set');
  } else {
    log(YELLOW, '○', 'DATABASE_URL: Not set (needed for production)');
  }

  // Check NEXTAUTH_SECRET
  console.log('\nChecking NextAuth Secret...');
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) {
    if (secret.length >= 32) {
      log(GREEN, '✓', 'NEXTAUTH_SECRET: Set and sufficient length');
    } else {
      log(YELLOW, '⚠', `NEXTAUTH_SECRET: Too short (${secret.length} chars, should be 32+)`);
      warnings.push('Generate with: openssl rand -base64 32');
    }
  } else {
    log(YELLOW, '○', 'NEXTAUTH_SECRET: Not set');
  }

  // Summary
  console.log('\n' + CYAN + '='.repeat(60) + RESET_COLOR);

  if (issues.length === 0 && warnings.length === 0) {
    console.log(GREEN + '✓ Email configuration is valid!' + RESET_COLOR);
    console.log('\nYou can test email sending with:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000/api/debug/email-config');
    console.log('  3. Or read: docs/EMAIL_VALIDATION.md');
  } else {
    if (warnings.length > 0) {
      console.log(YELLOW + `⚠ ${warnings.length} warning(s) found:` + RESET_COLOR);
      warnings.forEach((w) => console.log(`   - ${w}`));
    }
    if (issues.length > 0) {
      console.log(RED + `✗ ${issues.length} issue(s) found:` + RESET_COLOR);
      issues.forEach((i) => console.log(`   - ${i}`));
      console.log('\nFix these before testing email sending.');
    }
  }

  console.log(CYAN + '='.repeat(60) + RESET_COLOR + '\n');

  process.exit(issues.length > 0 ? 1 : 0);
}

validateEmailConfig();

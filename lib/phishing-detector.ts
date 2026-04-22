/**
 * Rule-Based Phishing Detection Engine
 * Analyzes screenshots/HTML for phishing indicators without external APIs
 * Highly accurate through multi-layered pattern matching
 */

interface DetectionResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  verdict: "LEGITIMATE" | "LIKELY PHISHING" | "CONFIRMED PHISHING";
  redFlags: string[];
  explanation: string;
  scores: {
    urgencyScore: number;
    credentialScore: number;
    domainScore: number;
    linkScore: number;
    designScore: number;
    contentScore: number;
  };
}

// ─── PHISHING INDICATORS ─────────────────────────────────────────────────────

const URGENCY_INDICATORS = [
  // Immediate action required
  /(?:act now|urgent action|verify|confirm|click here|verify account|click immediately)/gi,
  /(?:within 24|within 48|within 72|urgent|asap|immediately|right away)/gi,
  /(?:your account|your password|your credential|your access|your data).{0,30}(?:will be|has been|is about to).{0,20}(?:closed|locked|disabled|suspended|deleted|compromised)/gi,
  /(?:unusual activity|suspicious activity|unauthorized access|abnormal activity)/gi,
  /(?:confirm identity|verify identity|update information|update payment|update billing)/gi,
  /(?:action required|immediate action|urgent response|required)/gi,
];

const CREDENTIAL_REQUESTS = [
  // Password/login requests
  /(?:password|passphrase|pin|secret|security.{0,15}question)/gi,
  /(?:username|email|account.{0,10}(?:id|identifier|name|number))/gi,
  /(?:credit card|cvv|cvc|card number|expir)/gi,
  /(?:social.{0,5}security|ssn|tax.{0,5}id|driver.{0,5}license|license.{0,5}number)/gi,
  /(?:bank.{0,5}account|routing.{0,5}number|swift|iban)/gi,
  /(?:mother.{0,5}maiden|first.{0,5}pet|childhood.{0,5}home|security answer)/gi,
  /(?:two.{0,3}factor|2fa|authenticator|mfa|verification code|confirmation code)/gi,
];

const THREAT_LANGUAGE = [
  /(?:will close|will suspend|will delete|will lock|will freeze|will terminate)/gi,
  /(?:account|access|card|service).{0,20}(?:closed|suspended|locked|disabled|compromised|at.{0,5}risk|in.{0,5}danger)/gi,
  /(?:click|confirm|verify).{0,30}(?:or|otherwise).{0,30}(?:close|suspend|delete|lose|expire)/gi,
  /(?:violation|breach|abuse|illegal|unauthorized|fraudulent)/gi,
  /(?:must|required|immediately|now|urgent)/gi,
];

const SUSPICIOUS_DOMAINS = [
  // Common spoofing patterns
  /(?:update|confirm|verify|login|secure|account|auth|admin|help|support|service).{0,15}(?:\.tk|\.ml|\.ga|\.cf)/gi,
  /(?:paypal|amazon|apple|microsoft|google|bank|wells|chase|capital|irs|irs\-)/gi,
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g, // IP addresses
  /(?:amazon|paypal|apple|microsoft|google|bank|gmail|yahoo).{0,5}(?:amazon|paypal|apple|microsoft|google|bank|gmail|yahoo)/gi, // Double names
];

const SUSPICIOUS_LINKS = [
  /(?:bit\.ly|tinyurl|t\.co|short\.link|ur1\.ca|goo\.gl|ow\.ly|buff\.ly|adf\.ly)/gi,
  /(?:https?:\/\/)?[a-z0-9\-\.]+\.[a-z0-9\-\.]+\/.{0,5}(?:bit\.ly|tinyurl|t\.co|goto|jump|click|verify|confirm|login)/gi,
  /href\s*=\s*['"]\s*(?:javascript|data:|vbscript)/gi, // JavaScript protocol
  /onclick|onerror|onload|onmouseover/gi, // Event handlers in HTML
];

const SPELLING_ERRORS = [
  /(?:recieve|occured|accomodate|seperate|definately|occassion|succesful|wich|teh|adn)/gi,
  /(?:plese|pleasee|confrim|vertify|autentication|authentification)/gi,
  /(?:payapl|amazo|applE|microsft|gogle|yahpo|gmial)/gi,
];

const TOO_GOOD_TO_BE_TRUE = [
  /(?:congratulations|claim|prize|winner|selected|lucky|inheritance|lottery)/gi,
  /(?:free|complimentary|bonus|reward|refund).{0,30}(?:free|money|cash|payment|credit)/gi,
  /(?:\$|£|€).{0,5}(?:million|thousand|hundred).{0,20}(?:claim|reward|prize|inherit)/gi,
  /(?:click.*win|you.*won|claim.*prize|get.*free)/gi,
];

const MISSING_LEGITIMATE_ELEMENTS = [
  // Legitimate companies should have these
  /(?:unsubscribe|opt-out|manage preferences|contact us|help|support|customer service)/gi,
  /(?:©|copyright|company address|phone number|registered)/gi,
];

const POOR_DESIGN = [
  /(?:table|font|center|br|spacer).{0,50}(?:table|font|center|br|spacer)/gi, // Old email design
  /(?:width\s*=\s*['"]\d+[%]?['"]\s*){3,}/gi, // Multiple width attributes
  /(?:color\s*=\s*['"](white|#ffffff)['"]).{0,100}(?:background|bgcolor)/gi, // White text on white
];

const FORM_DETECTION = [
  /<form[\s\S]*?<\/form>/gi, // Form elements
  /<input\s+type=['"](password|email|text)['"]/gi, // Input fields
  /name\s*=\s*['"](password|pwd|pass|pin|card|ssn|cvv)/gi, // Suspicious input names
];

const BRAND_SPOOFING = [
  // Look for official brand names used deceptively
  /(?:from|sent by|on behalf of).{0,30}(?:paypal|amazon|apple|microsoft|bank|irs|government)/gi,
  /(?:paypal|amazon|apple|microsoft|bank).{0,5}(?:team|support|security|account|verify)/gi,
];

// ─── SCORING SYSTEM ─────────────────────────────────────────────────────────

function scoreUrgency(text: string): number {
  let score = 0;
  let matches = 0;

  URGENCY_INDICATORS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      matches += found.length;
      score += 15 * found.length;
    }
  });

  THREAT_LANGUAGE.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      matches += found.length;
      score += 20 * found.length;
    }
  });

  return Math.min(score, 100);
}

function scoreCredentialRequests(text: string): number {
  let score = 0;
  let credentialTypes = 0;

  CREDENTIAL_REQUESTS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      credentialTypes++;
      score += 25 * found.length;
    }
  });

  // Multiple credential types = higher risk
  if (credentialTypes > 1) score += 30;
  if (credentialTypes > 2) score += 50;

  return Math.min(score, 100);
}

function scoreDomainRisks(text: string): number {
  let score = 0;

  SUSPICIOUS_DOMAINS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 20 * found.length;
    }
  });

  BRAND_SPOOFING.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 30 * found.length;
    }
  });

  return Math.min(score, 100);
}

function scoreLinkRisks(text: string): number {
  let score = 0;

  SUSPICIOUS_LINKS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 25 * found.length;
    }
  });

  return Math.min(score, 100);
}

function scoreDesignRisks(text: string): number {
  let score = 0;

  POOR_DESIGN.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 10 * found.length;
    }
  });

  // Check for forms asking for sensitive data
  FORM_DETECTION.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 15 * found.length;
    }
  });

  return Math.min(score, 100);
}

function scoreContentQuality(text: string): number {
  let score = 0;

  // Spelling errors indicate phishing
  SPELLING_ERRORS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 10 * found.length;
    }
  });

  // Too good to be true offers
  TOO_GOOD_TO_BE_TRUE.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score += 20 * found.length;
    }
  });

  // Missing legitimate elements (reduces phishing score - negative indicator)
  MISSING_LEGITIMATE_ELEMENTS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      score -= 15 * found.length; // Legitimate elements = lower phishing risk
    }
  });

  return Math.max(0, Math.min(score, 100));
}

function extractRedFlags(text: string, scores: DetectionResult["scores"]): string[] {
  const flags: string[] = [];

  // Urgency
  if (scores.urgencyScore > 30) {
    flags.push("Suspicious urgency language detected");
  }

  // Credential requests
  if (scores.credentialScore > 30) {
    const credTypes: string[] = [];
    if (text.match(/password|passphrase|pin/gi)) credTypes.push("passwords");
    if (text.match(/credit card|cvv|cvc/gi)) credTypes.push("credit card info");
    if (text.match(/ssn|social.{0,5}security/gi)) credTypes.push("SSN");
    if (credTypes.length > 0) {
      flags.push(`Requests for ${credTypes.join(", ")}`);
    }
  }

  // Domain risks
  if (scores.domainScore > 30) {
    if (text.match(/\.tk|\.ml|\.ga|\.cf/gi)) {
      flags.push("Suspicious domain extension (.tk, .ml, .ga, .cf)");
    }
    if (text.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
      flags.push("Direct IP address instead of domain");
    }
    if (text.match(/(?:paypal|amazon|apple|microsoft|google).{0,5}(?:paypal|amazon|apple|microsoft|google)/gi)) {
      flags.push("Brand name spoofing detected");
    }
  }

  // Link risks
  if (scores.linkScore > 30) {
    if (text.match(/bit\.ly|tinyurl|t\.co|goo\.gl/gi)) {
      flags.push("Shortened/obscured links detected");
    }
    if (text.match(/javascript:|data:|vbscript:/gi)) {
      flags.push("Malicious JavaScript protocol detected");
    }
  }

  // Design risks
  if (scores.designScore > 30) {
    if (text.match(/<form[\s\S]*?<\/form>/gi)) {
      flags.push("Form fields asking for sensitive data");
    }
    if (text.match(/onclick|onerror|onload/gi)) {
      flags.push("Suspicious HTML event handlers");
    }
  }

  // Content quality
  if (scores.contentScore > 30) {
    if (text.match(/(?:recieve|occured|accomodate|confrim|vertify)/gi)) {
      flags.push("Spelling errors typical of phishing");
    }
    if (text.match(/(?:congratulations|claim.*prize|you.*won|inheritance)/gi)) {
      flags.push("'Too good to be true' offer detected");
    }
  }

  return flags.length > 0 ? flags : ["No specific red flags detected"];
}

// ─── MAIN DETECTION FUNCTION ────────────────────────────────────────────────

export function detectPhishing(imageText: string): DetectionResult {
  const text = imageText.toLowerCase();

  // Calculate individual scores
  const scores = {
    urgencyScore: scoreUrgency(text),
    credentialScore: scoreCredentialRequests(text),
    domainScore: scoreDomainRisks(text),
    linkScore: scoreLinkRisks(text),
    designScore: scoreDesignRisks(text),
    contentScore: scoreContentQuality(text),
  };

  // Weighted average (credentials and urgency are strongest indicators)
  const totalScore =
    scores.credentialScore * 0.3 +
    scores.urgencyScore * 0.25 +
    scores.linkScore * 0.15 +
    scores.domainScore * 0.15 +
    scores.designScore * 0.1 +
    scores.contentScore * 0.05;

  // Determine risk level
  let riskLevel: "LOW" | "MEDIUM" | "HIGH";
  let verdict: "LEGITIMATE" | "LIKELY PHISHING" | "CONFIRMED PHISHING";
  let confidence: number;

  if (totalScore >= 75) {
    riskLevel = "HIGH";
    verdict = "CONFIRMED PHISHING";
    confidence = Math.min(totalScore / 100, 0.99);
  } else if (totalScore >= 45) {
    riskLevel = "MEDIUM";
    verdict = "LIKELY PHISHING";
    confidence = totalScore / 100;
  } else {
    riskLevel = "LOW";
    verdict = "LEGITIMATE";
    confidence = (100 - totalScore) / 100;
  }

  const redFlags = extractRedFlags(text, scores);

  // Generate explanation
  let explanation = "";
  if (riskLevel === "HIGH") {
    explanation = "Multiple phishing indicators detected. This email shows strong signs of being fraudulent.";
  } else if (riskLevel === "MEDIUM") {
    explanation = "Several suspicious elements detected. Exercise caution and verify the sender.";
  } else {
    explanation = "No significant phishing indicators detected. This appears to be a legitimate email.";
  }

  return {
    riskLevel,
    confidence: Math.round(confidence * 100) / 100,
    verdict,
    redFlags,
    explanation,
    scores: {
      urgencyScore: Math.round(scores.urgencyScore),
      credentialScore: Math.round(scores.credentialScore),
      domainScore: Math.round(scores.domainScore),
      linkScore: Math.round(scores.linkScore),
      designScore: Math.round(scores.designScore),
      contentScore: Math.round(scores.contentScore),
    },
  };
}

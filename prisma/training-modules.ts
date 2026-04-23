import { TrainingModuleContent } from "@/types/training";

export const trainingModulesData: Array<{
  name: string;
  description: string;
  orderIndex: number;
  content: TrainingModuleContent;
}> = [
  {
    name: "Phishing Basics: How Email Scams Work",
    description: "Learn what phishing is, how it works, and the PhishWise Response Routine",
    orderIndex: 1,
    content: {
      overview: `Phishing is a type of scam where someone sends a message that looks real in order to trick you into doing something unsafe. That "something" is usually clicking a harmful link, opening a dangerous attachment, logging in to a fake website, or sharing personal information that should not be sent through email.

The most important idea for users to understand is this: Phishing is not just a strange-looking email. It is a message designed to push you into action before you have time to think.`,
      tactics: [
        {
          name: "Urgency",
          description: "The message says something must be done right now.",
        },
        {
          name: "Fear",
          description: "The message suggests there will be a problem if you do not respond.",
        },
        {
          name: "Authority",
          description: "The message pretends to come from someone important or trustworthy.",
        },
        {
          name: "Curiosity",
          description: "The message tries to make you want to see a file, notice, refund, message, or update.",
        },
      ],
      redFlags: [
        "Unexpected or unusual request - If the email asks for something you were not expecting, that should slow you down.",
        "Urgent language - Phishing messages often try to rush you with phrases like 'act now,' 'final notice,' 'verify immediately,' or 'your account will be locked.'",
        "Suspicious link or attachment - A phishing email often wants you to click something or open something.",
        "Request for sensitive information - Legitimate organizations generally do not ask users to send sensitive personal information through email.",
        "Sender does not look right - The display name may look familiar, but the actual sender address may be strange, misspelled, or unrelated.",
        "Tone feels off - Even if the email looks polished, the tone may feel unusually aggressive, demanding, threatening, or out of character.",
      ],
      objective: `Most phishing emails are trying to get one of four things:
1. Your login information - usernames, passwords, verification codes, account recovery details
2. Your personal or financial information - bank details, card numbers, Social Security numbers, birthdates
3. Access to your device or account - through a harmful link, dangerous attachment, or fake login page
4. A quick response that starts a larger scam - to get you to reply, confirm you are active, or trust the sender`,
      examples: [
        {
          title: "Your Package Could Not Be Delivered",
          body: "Subject: Delivery failed: confirm your address now\n\nWe attempted to deliver your package today but were unable to complete delivery because your address information could not be verified. To avoid return of the package, confirm your shipping details within the next 30 minutes using the secure link below.\n\n[Confirm Delivery Address]",
          redFlags: [
            "Creates urgency with a 30-minute deadline",
            "Asks the user to click a link (one of the most common phishing actions)",
            "Sender address looks generic and unusual",
            "Tries to create a problem the user feels forced to solve immediately",
          ],
        },
      ],
      preventionSteps: [
        "Pause - Do not react immediately, especially when the email feels urgent, upsetting, or unusually important.",
        "Check - Look at the request itself. Is it asking you to click, open, reply, pay, log in, or share information?",
        "Verify - Do not verify using the email itself. Instead, verify through a contact method you already trust, such as the official website, mobile app, known phone number, or saved contact.",
        "Then act - If you cannot verify it safely, do not click, do not open, and do not send information.",
      ],
      quiz: {
        question: "You receive an email saying your account will be restricted unless you confirm your information immediately. The email includes a link and asks you to act within 20 minutes. What should you do?",
        options: [
          "Click the link quickly so the account is not restricted",
          "Reply to the email and ask if it is real",
          "Go to the official website or app directly and check the account there",
          "Forward the email to a friend and ask what they think",
        ],
        correctIndex: 2,
        explanation: "This message shows two common phishing warning signs: urgency and a push to click a link. The safest response is to verify the issue through a trusted source you already know, not through the suspicious email.",
      },
    },
  },
  {
    name: "Social Engineering Basics: How Scammers Push You",
    description: "Understand the psychological tactics that make phishing emails believable and pressurizing",
    orderIndex: 2,
    content: {
      overview: `Social engineering is when someone manipulates a person into revealing information or taking an action they would not normally take. In email scams, that action might be clicking a link, opening an attachment, sending information, logging in to a fake site, or replying to a message.

The most important idea for users to understand is this: Social engineering works by pushing emotions and behavior, not by proving the message is true.`,
      tactics: [
        {
          name: "Urgency",
          description: "The message pressures the user to act immediately so there is less time to think, verify, or ask questions.",
        },
        {
          name: "Fear",
          description: "The message suggests something bad will happen if the user does not respond, such as losing an account, missing a deadline, or facing a penalty.",
        },
        {
          name: "Authority",
          description: "The message pretends to come from a boss, bank, school, government office, service provider, or other trusted source.",
        },
        {
          name: "Curiosity",
          description: "The message makes the user want to open a file, review a document, claim a refund, read a notice, or see a private message.",
        },
        {
          name: "Helpfulness",
          description: "The message offers a fast fix to a problem and makes the unsafe action feel like the easiest solution.",
        },
      ],
      redFlags: [
        "Message uses pressure tactics to influence the user",
        "Combines multiple tactics like urgency, fear, and authority together",
        "Asks for immediate action without time to verify",
        "Uses emotional language to push quick reactions",
        "Offers easy solutions that sound too good to be true",
      ],
      objective: `A social engineering email is usually trying to move the user toward one immediate action. Common actions scammers want include:
1. Clicking a link
2. Opening an attachment
3. Logging in through the email
4. Sending personal or financial information
5. Replying quickly without verifying the request
6. Sending money or approving a payment`,
      examples: [
        {
          title: "Final Notice from the School Office",
          body: "Subject: Final reminder: action needed before 5 p.m.\n\nThis is a reminder from the school office. We still need you to confirm student emergency contact information before the end of the day. Reply to this message with full name, date of birth, home address, and phone number.",
          redFlags: [
            "Uses authority by claiming to come from the school office",
            "Creates urgency with a same-day deadline",
            "Asks for personal information through email",
            "Sender address does not clearly match an official school domain",
          ],
        },
      ],
      preventionSteps: [
        "Notice the emotional reaction first - If the message makes you feel rushed, worried, guilty, curious, or pressured, slow down.",
        "Look at what the email is asking you to do - Is it asking for a click, a login, an attachment, a reply, or sensitive information?",
        "Check for the pressure tactics - Identify the social engineering technique being used",
        "Verify through a trusted source - Do not use the suspicious message itself to confirm whether it is real",
        "Take action safely - If you cannot verify, do not respond to the pressure",
      ],
      quiz: {
        question: "You receive an email that says your service account will be suspended today unless you open an attached form and respond immediately. What is the best first question to ask yourself?",
        options: [
          "Is this email written professionally?",
          "What is this message trying to make me feel and do?",
          "Should I open the attachment now or later?",
          "Would a real company ever send an email like this?",
        ],
        correctIndex: 1,
        explanation: "This question helps you identify the pressure behind the message before reacting to it. Recognizing the emotional pressure makes it easier to pause, check, and verify before taking action.",
      },
    },
  },
  {
    name: "Credential Theft: Protecting Your Login Information",
    description: "Learn how attackers steal passwords and how to protect your accounts",
    orderIndex: 3,
    content: {
      overview: `Some phishing emails try to steal your username, password, or login codes. These messages usually pretend there is a problem with one of your accounts and ask you to "fix it" right away. These scams are common because passwords give attackers direct access to email, banking, shopping, and social media accounts.`,
      tactics: [
        {
          name: "Urgency",
          description: "Immediate action required or your account will be locked",
        },
        {
          name: "Fear",
          description: "Claims of suspicious activity or unauthorized sign-ins",
        },
        {
          name: "Authority",
          description: "Pretending to be a security team, IT department, or trusted company",
        },
        {
          name: "Convenience",
          description: "Promising a fast, one-click solution to the problem",
        },
      ],
      redFlags: [
        "The email asks you to click a link to log in or reset your password",
        "The sender's address looks slightly off or unfamiliar",
        "The message does not use your name",
        "The link leads to a page that looks real but has a strange web address",
        "The email creates panic or demands immediate action",
        "No specific account details are mentioned",
      ],
      objective: `The goal is to steal your login information. If you enter your username and password on a fake page, the attacker can:
1. Take over your account
2. Lock you out
3. Use your account to scam others
4. Access personal or financial information`,
      examples: [
        {
          title: "Fake Security Alert",
          body: "We detected unusual activity on your account. For your protection, please verify your identity immediately to avoid suspension.",
          redFlags: [
            "Urgency - warning about account suspension",
            "Vague - 'unusual activity' with no details",
            "Login link - asks you to verify through email link",
          ],
        },
        {
          title: "Password Reset Request",
          body: "Your password expires today. Click here to reset now.",
          redFlags: [
            "Pressure to act quickly",
            "Generic language",
            "Unexpected reset request",
          ],
        },
      ],
      preventionSteps: [
        "Pause before clicking - Do not act on fear or urgency",
        "Check the sender - Look closely at the email address",
        "Verify safely - Open a new browser tab and go to the website directly instead of clicking the email link",
        "Use strong security - Enable multi-factor authentication (MFA) where available",
        "Report and delete - If it looks suspicious, report it and remove the email",
      ],
      quiz: {
        question: "You receive an email saying your account has suspicious activity and asking you to click a link to log in. What is the safest action?",
        options: [
          "Click the link and log in quickly",
          "Reply to the email asking for more details",
          "Open a new browser tab and sign in directly to the official website",
          "Forward the email to friends to warn them",
        ],
        correctIndex: 2,
        explanation: "Always verify account issues through the official website by opening a new browser tab and typing the address manually, not by clicking email links.",
      },
    },
  },
  {
    name: "Billing Scams: Protecting Your Payment Information",
    description: "Learn how to spot and avoid billing and payment scams",
    orderIndex: 4,
    content: {
      overview: `Billing scams are some of the most common phishing emails people receive. These emails claim you were charged for something, that a payment failed, or that you are owed a refund. They want you to panic and act fast. The message usually includes a link to "review the charge," "download the invoice," or "claim your refund."`,
      tactics: [
        {
          name: "Urgency",
          description: "You must respond within 24 hours",
        },
        {
          name: "Fear",
          description: "Your account will be suspended",
        },
        {
          name: "Confusion",
          description: "You were charged for something you do not recognize",
        },
        {
          name: "Authority",
          description: "The email looks like it came from a trusted company",
        },
        {
          name: "Distraction",
          description: "Long invoice numbers and order details to make it feel real",
        },
      ],
      redFlags: [
        "You do not recognize the charge or company",
        "The sender's email address looks slightly off",
        "The message pressures you to act immediately",
        "The link says 'review payment' instead of going to the official website",
        "The greeting is generic: 'Dear Customer'",
        "The email includes spelling or formatting mistakes",
        "You are asked to enter login or payment details through a link",
      ],
      objective: `In billing scams, attackers usually want one of three things:
1. Your login credentials (email, Amazon, PayPal, bank account)
2. Your credit card or banking information
3. A direct money transfer to "fix" the issue

Once they have your information or money, it can be hard to recover it.`,
      examples: [
        {
          title: "Fake Charge Notification",
          body: "Thank you for your payment of $479.99 for your Premium Protection Plan. If you did not authorize this charge, click below within 24 hours to cancel.\n\n[Review Invoice]",
          redFlags: [
            "You do not remember buying this",
            "Generic greeting",
            "Pressure to act within 24 hours",
            "Link instead of directing you to the official website",
          ],
        },
        {
          title: "Refund Scam",
          body: "We attempted to process your refund of $312.40. Due to a verification issue, your refund is on hold. Confirm your billing details here to release funds.\n\n[Confirm Refund]",
          redFlags: [
            "Unexpected refund",
            "Asks you to 'confirm billing details'",
            "Vague explanation of the problem",
            "No clear company contact information",
          ],
        },
      ],
      preventionSteps: [
        "Do not click links in billing emails",
        "Open a new browser and go directly to the company's official website",
        "Log in from there to check your account",
        "Call the official phone number listed on the company's website — not the number in the email",
        "If you do not have an account with that company, delete the email",
        "When unsure, pause and verify before acting",
      ],
      quiz: {
        question: "You receive an email saying you were charged $399 for a service you do not recognize. The email says you must click within 12 hours to cancel. What should you do?",
        options: [
          "Click the link to cancel immediately",
          "Reply to the email asking for more details",
          "Open a new browser and log into your account from the official website",
          "Forward the email to a friend to ask if it looks real",
        ],
        correctIndex: 2,
        explanation: "Always go directly to the company's official website to check charges. Never click payment links in emails or enter payment information through email links.",
      },
    },
  },
  {
    name: "Shipping Scams: Verifying Delivery",
    description: "Learn how to identify and avoid shipping and delivery scams",
    orderIndex: 5,
    content: {
      overview: `Shipping scams are common because many people receive packages regularly. These emails claim there is a problem with a delivery, that a package could not be delivered, or that you must confirm your address to receive it. They want you to worry about missing something important and click quickly.`,
      tactics: [
        {
          name: "Urgency",
          description: "Your package will be returned today",
        },
        {
          name: "Curiosity",
          description: "You have a pending delivery",
        },
        {
          name: "Confusion",
          description: "Address verification required",
        },
        {
          name: "Fear",
          description: "Delivery suspended due to incomplete details",
        },
        {
          name: "Trust",
          description: "The email looks like it came from a known shipping company",
        },
      ],
      redFlags: [
        "The sender's email address looks slightly different from the real company",
        "The message pressures you to act immediately",
        "The tracking link does not go to the company's official website",
        "The greeting is generic: 'Dear Customer'",
        "The email asks you to confirm personal or payment details",
        "There are small spelling or formatting mistakes",
      ],
      objective: `In shipping scams, attackers usually want one of these:
1. Your login credentials (email, shopping accounts)
2. Your home address and personal information
3. Your credit card details for a fake 'delivery fee'

Once they have your information, they may use it for fraud or identity theft.`,
      examples: [
        {
          title: "Delivery Attempt Failed",
          body: "We attempted to deliver your package today but were unable to complete delivery due to an address issue. Confirm your shipping details within 24 hours to avoid return to sender.\n\n[Confirm Delivery]",
          redFlags: [
            "You were not expecting a package",
            "Generic greeting",
            "Pressure to act within 24 hours",
            "Link asking you to confirm details",
          ],
        },
        {
          title: "Package on Hold",
          body: "Your parcel is currently on hold due to unpaid shipping fees of $2.99. To release your package, submit payment using the secure link below.\n\n[Pay Shipping Fee]",
          redFlags: [
            "Unexpected delivery fee",
            "Very small amount to lower suspicion",
            "Link asking for payment information",
            "No official order number tied to your account",
          ],
        },
      ],
      preventionSteps: [
        "Open a new browser and go directly to the shipping company's official website",
        "Enter your tracking number manually if you have one",
        "Check your online shopping account to confirm real orders",
        "Never pay shipping fees through a link in an email",
        "When unsure, pause and verify before acting",
        "Real delivery companies do not ask for payment through random email links",
      ],
      quiz: {
        question: "You receive an email saying your package cannot be delivered unless you confirm your address within 12 hours. What should you do?",
        options: [
          "Click the link to confirm your address immediately",
          "Reply to the email asking which package it is about",
          "Open a new browser and check the official shipping website directly",
          "Forward the email to a friend to ask if it looks real",
        ],
        correctIndex: 2,
        explanation: "Always check deliveries through the official website. Never confirm personal information through email links or unknown websites.",
      },
    },
  },
  {
    name: "Security Alert Scams: Avoiding False Warnings",
    description: "Learn how to recognize fake security alerts and protect your accounts",
    orderIndex: 6,
    content: {
      overview: `Security alert scams are phishing emails that claim something is wrong with your account or device. These emails may say your account was hacked, that someone tried to sign in, or that your account will be locked. They want you to panic and act fast.`,
      tactics: [
        {
          name: "Fear",
          description: "Suspicious activity detected",
        },
        {
          name: "Urgency",
          description: "Action required within 1 hour",
        },
        {
          name: "Authority",
          description: "The email looks like it came from a real security team",
        },
        {
          name: "Loss threat",
          description: "Your account will be locked",
        },
        {
          name: "Convenience",
          description: "One click to fix it",
        },
      ],
      redFlags: [
        "The email demands you click a link to fix a security issue",
        "The message creates panic but gives little detail",
        "The sender address looks slightly off or unfamiliar",
        "The greeting is generic: 'Dear user' or 'Hello'",
        "The email threatens immediate lockout or suspension",
        "The link does not clearly go to the official website",
        "You are asked to enter a password or verification code from the link",
      ],
      objective: `In security alert scams, attackers usually want:
1. Your login credentials (username and password)
2. Your one-time code (verification code)
3. Access to your email, banking, shopping, or social media accounts

Once they get into one account, they often try to reset passwords on others.`,
      examples: [
        {
          title: "Security Alert - Unusual Sign-In",
          body: "We detected an unusual sign-in attempt on your account from a new device. For your protection, verify your identity immediately to prevent account lock.\n\n[Secure Account Now]",
          redFlags: [
            "Urgent 'verify immediately'",
            "Vague details about the sign-in attempt",
            "Link to 'secure account'",
            "Threat of lockout",
          ],
        },
        {
          title: "Password Expired",
          body: "Your password has expired due to updated security requirements. Update your password now to restore full access.\n\n[Update Password]",
          redFlags: [
            "Unexpected password expiration notice",
            "Generic greeting",
            "Link asks you to update credentials",
            "No reference to how to verify safely",
          ],
        },
      ],
      preventionSteps: [
        "Do not click the link in the email",
        "Open a new browser and go to the official website directly",
        "Log in from there and check your account security settings",
        "If you are worried, change your password from inside the real site",
        "Turn on multi-factor authentication if it is available",
        "If the email looks suspicious, report it and delete it",
      ],
      quiz: {
        question: "You receive an email saying 'Suspicious activity detected' and it asks you to click a link to verify your identity. What should you do?",
        options: [
          "Click the link quickly to stop the hacker",
          "Reply to the email asking what happened",
          "Open a new browser and sign in through the official website directly",
          "Forward the email to friends to warn them",
        ],
        correctIndex: 2,
        explanation: "Always verify account issues through the official website by opening a new browser tab, not by clicking email links. Real security teams will not ask you to verify through an email link.",
      },
    },
  },
  {
    name: "Impersonation Scams: Verifying Who's Really Asking",
    description: "Learn how to spot scams that pretend to be people you trust",
    orderIndex: 7,
    content: {
      overview: `Impersonation scams are phishing emails that pretend to be someone you trust. It might look like a family member, a coworker, a boss, a bank, a school, or a company you use. The email usually asks for something simple at first: a quick favor, a payment, personal information, or a code.`,
      tactics: [
        {
          name: "Trust",
          description: "It's me. I need help.",
        },
        {
          name: "Urgency",
          description: "I need this right now",
        },
        {
          name: "Authority",
          description: "I'm with your bank / support team / manager",
        },
        {
          name: "Guilt",
          description: "Please don't tell anyone. I'm in a situation.",
        },
        {
          name: "Confusion",
          description: "They keep it vague so you fill in the gaps",
        },
      ],
      redFlags: [
        "The request is unusual for that person or organization",
        "They ask for money, gift cards, or a quick payment",
        "They ask for personal information or login codes",
        "They pressure you to act immediately",
        "They ask you to keep it secret",
        "The email address is slightly different than normal",
        "The message avoids details and pushes you to reply quickly",
      ],
      objective: `In impersonation scams, attackers often want:
1. A money transfer (gift cards, wire transfer, payment app)
2. Personal information (address, phone number, account details)
3. Verification codes (used to break into accounts)

Sometimes they are trying to take over your email or a family member's account. Sometimes they are trying to get you to send money fast before you realize it is a scam.`,
      examples: [
        {
          title: "Quick Favor Needed",
          body: "Hey, are you free right now? I need you to pick something up for me. I'm in a meeting and can't talk. Can you grab two gift cards and send me the codes? I'll pay you back later.",
          redFlags: [
            "Gift card request",
            "'Can't talk' to avoid verification",
            "Urgency and pressure",
            "Unusual request",
          ],
        },
        {
          title: "Account Verification Needed",
          body: "Hello, this is the Security Department. We noticed unusual activity on your account. Reply with your full name, date of birth, and the code you just received to confirm your identity.",
          redFlags: [
            "Asks for sensitive personal details",
            "Requests a verification code",
            "Authority language without proof",
            "Pushes reply instead of safe verification steps",
          ],
        },
      ],
      preventionSteps: [
        "Pause before responding to unexpected requests",
        "Verify using a trusted method - Call the person using a saved number",
        "Text them using your normal conversation thread",
        "If it claims to be a company, go to the official website directly",
        "Never send gift card codes, login codes, or personal information by email",
        "If the message feels urgent or secret, treat that as a warning sign",
        "If you are unsure, ask a second person for a quick reality check",
      ],
      quiz: {
        question: "You receive an email from someone you know asking you to buy gift cards and send the codes immediately. What should you do?",
        options: [
          "Buy the gift cards to help them quickly",
          "Reply asking what brand of gift cards they want",
          "Verify the request by calling or texting them using a known number or existing thread",
          "Send them your bank login so they can pay you back",
        ],
        correctIndex: 2,
        explanation: "Always verify unusual requests before acting, especially requests for money or gift cards. Use a trusted communication method like a phone call or existing text thread, not the email.",
      },
    },
  },
  {
    name: "Attachments & Document Links: Safe File Handling",
    description: "Learn how to safely handle unexpected attachments and document links",
    orderIndex: 8,
    content: {
      overview: `Some phishing emails try to get you to open a file or click a document link. These messages may look like a receipt, a scanned document, a shared file, or a "secure message." They often say you need to view something important right away.`,
      tactics: [
        {
          name: "Curiosity",
          description: "See the attached invoice",
        },
        {
          name: "Urgency",
          description: "Document expires today",
        },
        {
          name: "Trust",
          description: "Shared with you via Google Docs / OneDrive",
        },
        {
          name: "Authority",
          description: "HR policy update or secure message",
        },
        {
          name: "Confusion",
          description: "They use vague titles so you open it to find out",
        },
      ],
      redFlags: [
        "You were not expecting a document or attachment",
        "The email is vague: 'Please review' with no context",
        "The file name is generic or weird",
        "The link says you must sign in again to view a document",
        "The sender is unfamiliar or slightly off",
        "The message pressures you to open it quickly",
        "The email asks you to enable something like 'macros' or 'editing'",
      ],
      objective: `These scams usually aim for one of two outcomes:
1. Credential theft - A fake document link leads to a fake login page that steals your username, password, or code
2. Malware - The attachment or download tries to install harmful software on your device

A common target is your email account. If attackers get into your email, they can reset passwords for many other accounts.`,
      examples: [
        {
          title: "Shared Document",
          body: "A document has been shared with you securely. Please review and sign today to avoid delay.\n\n[View Secure Document]",
          redFlags: [
            "You did not expect a shared document",
            "Vague request with no details",
            "Urgent deadline",
            "Link to view the document",
          ],
        },
        {
          title: "Invoice Attached",
          body: "Your invoice is attached. Your payment is past due. Open the attachment to review charges and avoid late fees.\n\nAttachment: Invoice_10492.pdf",
          redFlags: [
            "Unexpected invoice",
            "Pressure to avoid fees",
            "Generic greeting",
            "Attachment you did not request",
          ],
        },
      ],
      preventionSteps: [
        "Do not open unexpected attachments",
        "Do not click document links you were not expecting",
        "Verify the sender using a trusted method",
        "If it's from a company, go to the official website directly instead of using the email link",
        "If it's from a person you know, confirm through a separate message thread",
        "Never sign in through a document link in an email unless you expected it",
        "If it looks suspicious, report it as phishing (or mark as spam), then delete it",
      ],
      quiz: {
        question: "You receive an email saying 'Invoice attached' from a sender you do not recognize. What should you do?",
        options: [
          "Open the attachment to see what it is",
          "Click reply and ask them to explain",
          "Delete the email or verify through a trusted method before opening anything",
          "Forward it to your contacts to warn them",
        ],
        correctIndex: 2,
        explanation: "Never open unexpected attachments or document links. Delete suspicious emails or verify through a trusted method before opening anything.",
      },
    },
  },
];

import { TrainingModuleConfig } from "./types";
import {
  ATTACHMENTS_SHARED_DOCUMENT,
  ATTACHMENTS_FORM_SUBMISSION,
} from "@/lib/email-templates-generic";

export const attachmentsModule: TrainingModuleConfig = {
  name: "Attachments & Document Links",
  description: "Learn to safely handle attachments and document-sharing links without exposing your account.",
  orderIndex: 8,
  content: `# Attachments & Document Links

## Overview

Phishing emails often use attachments or document-sharing links to deliver malware or steal credentials. These emails might claim to have an invoice, receipt, contract, or important document.

When you open the attachment or click the link, you might be:
- Infected with malware that silently steals your data
- Sent to a fake login page that captures your credentials
- Directed to download malicious software disguised as a document

This type of attack is dangerous because the malware can sit silently on your computer, giving attackers ongoing access to your files, passwords, and email.

## Social Engineering Tactics

Attachment and document attacks work by making you want to see the content. Here's how they manipulate you:

- **Curiosity:** "See the attached receipt" or "Review this important document"
- **Authority:** Making the email look like it comes from a trusted source
- **Legitimacy:** Using file names and document types that seem official
- **Convenience:** "Click to view" instead of making you download
- **Urgency:** "Please review immediately" or "Time-sensitive document"

They want you clicking or opening before you think carefully about the risk.

## Red Flags

Watch for these warning signs:

- Unexpected attachments, especially from unknown senders
- File names that seem odd or generic ("document.exe" or "invoice.zip")
- Attachments with unusual file types (.exe, .zip, .scr, .bat)
- The email pressures you to open or view the attachment
- The sender's address looks unfamiliar or slightly off
- Document-sharing links from addresses you don't recognize
- Links that ask you to log in to view a document
- The email content doesn't match what you were expecting

## Attacker's Objective

In attachment and link attacks, attackers usually want:

1. **Malware installation:** Ransomware, spyware, or data-stealing programs
2. **Credentials:** Getting you to log in to a fake page
3. **Persistent access:** Remote access to your computer
4. **Data theft:** Stealing files, passwords, financial information
5. **Lateral movement:** Using your account to attack others in your organization

Attachment attacks are particularly dangerous because malware can run silently in the background, giving attackers months or years of access.

## Common Attachment/Link Attack Scenarios

**Fake Invoice:**
- "Please review attached invoice for payment"
- File named something realistic: "Invoice_2024.pdf" but actually "Invoice_2024.exe"

**Document Sharing:**
- "I've shared a document with you. Click to view"
- Link goes to fake Google Docs or Box login page

**Resume or Job Application:**
- "My resume is attached. I'm interested in [position]"
- Actually contains malware, not a resume

**Delivery/Shipping Document:**
- "Your tracking document is attached"
- File contains malware or leads to phishing page

**Meeting Notes or Report:**
- "Here are the meeting notes from yesterday"
- Actually a macro-enabled Word doc with hidden malware

## Prevention Steps

1. **Don't open unexpected attachments.** Even if the sender looks familiar, verify they actually sent it
2. **Never enable macros.** If Word asks to enable macros from a document you didn't expect, click "Disable"
3. **Check file extensions carefully.** Executables (.exe, .zip, .scr) are almost never legitimate in email
4. **Verify document links.** If you get a "view document" link, log in directly instead of using the link
5. **Hover over links first.** Check where a link actually goes before clicking
6. **Download to virus scan.** If you must download something, run it through a virus scanner first
7. **Ask before opening.** If unsure, contact the sender directly through a known method

## Safe Alternatives

- **For documents:** Ask the sender to paste content in the email instead of attaching
- **For file sharing:** Use your company's approved file-sharing system if available
- **For login required:** Go directly to the website instead of using the email link
- **For verification:** Call or message the sender using a known contact method

## Key Takeaway

Be extremely cautious with attachments and document links. Malware can be silently installed from a single click. When in doubt, verify with the sender through a trusted method before opening anything.
`,
  templates: [
    ATTACHMENTS_SHARED_DOCUMENT,
    ATTACHMENTS_FORM_SUBMISSION,
  ],
};

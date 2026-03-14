# Module Generation Prompt

Use this prompt to auto-generate training modules with email templates. Copy the entire section below, fill in your topic details, and paste into Claude Code.

---

## How to Use

1. Copy the prompt template below
2. Fill in the bracketed sections with your topic information
3. Paste into Claude Code with the request: "Generate a new training module using this prompt"
4. Claude will return structured TypeScript code
5. Save the generated code to `lib/modules/module-[N]-[name].ts`
6. Add the import to `lib/modules/index.ts`

---

## Prompt Template

```
I'm creating a new phishing awareness training module for PhishWise.

**Module Topic:** [Your topic here]

**Module Number:** [N] (e.g., 7, 8, 9)

**Learning Objectives:**
[Bullet list of what employees should learn, e.g.:
- Identify impersonation tactics
- Recognize when attackers misrepresent authority
- Know how to verify sender identity]

**Key Attack Patterns:**
[Describe how attackers exploit this topic, e.g.:
- Pretending to be executives or IT staff
- Using urgent language to bypass verification
- Creating realistic-looking internal communications]

**Real-World Examples:**
[Provide 2-3 real attack scenarios, e.g.:
- CEO impersonation requesting wire transfers
- HR requesting employee information
- IT asking for password resets]

**Important Red Flags:**
[List 5-7 warning signs employees should watch for]

**Prevention Steps:**
[List 5-7 concrete actions to stay safe]

---

Generate a TypeScript module config that matches this structure:

\`\`\`typescript
import { TrainingModuleConfig } from "./types";

export const [moduleName]Module: TrainingModuleConfig = {
  name: "[Module Name]",
  description: "[One-line description of what the module teaches]",
  orderIndex: [N],
  content: \`# [Module Title]

[Comprehensive educational content with sections for Overview, Social Engineering Tactics, Red Flags, Attacker's Objective, Prevention Steps, and Key Takeaway]
\`,
  templates: [
    {
      name: "[Email scenario name]",
      subject: "[Email subject line]",
      fromAddress: "[Realistic phishing email address]",
      body: \`[Full email body with embedded link]\`,
      difficulty: [1-5],  // 1=obvious, 5=subtle
    },
    // 4-5 more templates testing proficiency with varying difficulty
  ],
};
\`\`\`

**Requirements:**
- Educational content: 400-600 words, conversational tone
- 5 email templates minimum, difficulty 1-5
- Templates should test understanding of red flags from the module
- Each template should have a realistic phishing scenario
- Vary tactics (urgency, fear, authority, curiosity, social proof)
- Use plausible sender addresses that look official but are slightly off

Please generate the complete module code with all email templates included.
```

---

## After Generation

### 1. Save the file
Create: `lib/modules/module-[N]-[name].ts`

### 2. Add to registry
Update `lib/modules/index.ts`:

```typescript
import { [moduleName]Module } from "./module-[N]-[name]";

export const ALL_MODULES: TrainingModuleConfig[] = [
  accountPasswordModule,
  billingModule,
  shippingModule,
  securityAlertModule,
  [moduleName]Module,  // ← Add here
];
```

### 3. Test in seed
```bash
npm run db:push      # Apply schema
npm run db:seed      # Load new module
```

### 4. Verify
- Check Prisma Studio: `npm run db:studio`
- Confirm new module appears in training UI
- Test clicking a simulated phishing email from the new module

---

## Example Topics for Future Modules

- **Module 7:** Impersonation (trusted person or organization)
- **Module 8:** Attachments & Document Links
- **Module 9:** CEO/Executive Fraud (Wire Transfer Scams)
- **Module 10:** Malware & File Downloads
- **Module 11:** Job Offer Scams
- **Module 12:** Romance/Relationship Scams (for personal awareness)

---

## Tips

- **Keep it real:** Use actual phishing examples as inspiration
- **Progressive difficulty:** Spread templates across difficulty 1-5
- **Teach patterns:** Each email should illustrate the red flags from content
- **Mix tactics:** Don't make all templates use urgency; vary social engineering approaches
- **Make it conversational:** Avoid jargon; speak to employees, not security experts

Good luck! 🎯

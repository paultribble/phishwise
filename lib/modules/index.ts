/**
 * Module Registry
 *
 * Auto-imports all training modules for seeding and access.
 * Add new modules here and they'll be automatically loaded.
 */

import { TrainingModuleConfig } from "./types";
import { phishingBasicsModule } from "./module-1-phishing-basics";
import { socialEngineeringModule } from "./module-2-social-engineering";
import { accountPasswordModule } from "./module-3-credentials";
import { billingModule } from "./module-4-billing";
import { shippingModule } from "./module-5-shipping";
import { securityAlertModule } from "./module-6-security";
import { impersonationModule } from "./module-7-impersonation";
import { attachmentsModule } from "./module-8-attachments";

export const ALL_MODULES: TrainingModuleConfig[] = [
  phishingBasicsModule,
  socialEngineeringModule,
  accountPasswordModule,
  billingModule,
  shippingModule,
  securityAlertModule,
  impersonationModule,
  attachmentsModule,
];

export type { TrainingModuleConfig, ModuleTemplate } from "./types";

/**
 * Module Registry
 *
 * Auto-imports all training modules for seeding and access.
 * Add new modules here and they'll be automatically loaded.
 */

import { TrainingModuleConfig } from "./types";
import { accountPasswordModule } from "./module-3-credentials";
import { billingModule } from "./module-4-billing";
import { shippingModule } from "./module-5-shipping";
import { securityAlertModule } from "./module-6-security";

export const ALL_MODULES: TrainingModuleConfig[] = [
  accountPasswordModule,
  billingModule,
  shippingModule,
  securityAlertModule,
];

export type { TrainingModuleConfig, ModuleTemplate } from "./types";

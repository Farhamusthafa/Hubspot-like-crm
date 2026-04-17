/**
 * Module Configuration Barrel Export
 * 
 * Provides convenient exports for all module configurations.
 * Import from '@/config' instead of individual files.
 */

export { createLeadsConfig } from './leads.config';
export type { LeadsConfig } from './leads.config';

export { createDealsConfig } from './deals.config';
export type { DealsConfig } from './deals.config';

export { createTicketsConfig } from './tickets.config';
export type { TicketsConfig } from './tickets.config';

export { createCompaniesConfig } from './companies.config';
export type { CompaniesConfig } from './companies.config';

/**
 * Usage Examples:
 * 
 * // Import specific config
 * import { createLeadsConfig } from '@/config';
 * 
 * // Import multiple configs
 * import { createLeadsConfig, createDealsConfig } from '@/config';
 * 
 * // Import and use types
 * import type { LeadsConfig } from '@/config';
 */

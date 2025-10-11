/**
 * ========================================
 * DEPRECATED - USE /config/teams.config.ts INSTEAD
 * ========================================
 * 
 * This file now re-exports from the centralized team configuration.
 * 
 * EDIT TEAM SETTINGS IN: /config/teams.config.ts
 */

export * from '../../../config/teams.config';

export type TeamBranding = import('../../../config/teams.config').TeamConfig;

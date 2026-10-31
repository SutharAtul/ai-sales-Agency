// Barrel export for all mock data
export { initialLeads } from './leads'
export { mockAiAgents } from './agents'
export { mockCampaigns } from './campaigns'
export { calls } from './calls'
export { handoffQueue } from './handoffs'
export { followupItems } from './followups'
export { teamMembers } from './team'
export { navigation } from './navigation'
export {
  OVERVIEW_METRICS,
  LEAD_FUNNEL_STEPS,
  CALL_ACTIVITY_14_DAYS,
  CAMPAIGN_SUMMARIES,
} from './overview'
export {
  MOCK_SETTINGS_TEAM_MEMBERS,
  MOCK_PERMISSIONS_MATRIX,
  MOCK_APPROVED_CLAIMS,
  MOCK_PROHIBITED_CLAIMS,
  MOCK_APPROVED_FAQS,
  MOCK_BLACKLIST_ENTRIES,
  MOCK_INTEGRATIONS,
} from './settings'
export type {
  SettingsRolePermission,
  SettingsTeamMember,
  ApprovedClaim,
  ProhibitedClaim,
  ApprovedFAQ,
  BlacklistEntry,
  IntegrationService,
} from './settings'


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts'
import { MockDataProvider } from '@/context'
import { ErrorBoundary } from '@/components'
import {
  OverviewPage,
  LeadsPage,
  LeadDetailsPage,
  CampaignsPage,
  AiAgentsPage,
  CallHistoryPage,
  CallDetailsPage,
  HandoffQueuePage,
  OnboardingDetailsPage,
  FollowupsPage,
  TeamPage,
  AnalyticsPage,
  SettingsPage,
  NotFoundPage,
} from '@/pages'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MockDataProvider>
          <Routes>
            <Route element={<AppShell />}>
              {/* Index redirect to Overview */}
              <Route path="/" element={<Navigate to="/overview" replace />} />

              {/* 1. Overview */}
              <Route path="/overview" element={<OverviewPage />} />

              {/* 2 & 3. Sales: Leads & Lead Details */}
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:leadId" element={<LeadDetailsPage />} />

              {/* 4. Sales: Campaigns */}
              <Route path="/campaigns" element={<CampaignsPage />} />

              {/* 5. AI Calling: AI Voice Agents */}
              <Route path="/agents" element={<AiAgentsPage />} />

              {/* 6 & 7. AI Calling: Call History & Call Details */}
              <Route path="/calls" element={<CallHistoryPage />} />
              <Route path="/calls/:callId" element={<CallDetailsPage />} />

              {/* 8 & 9. Human Onboarding: Handoff Queue & Onboarding Details */}
              <Route path="/handoffs" element={<HandoffQueuePage />} />
              <Route path="/onboarding/:id" element={<OnboardingDetailsPage />} />

              {/* 10. Human Onboarding: Follow-ups */}
              <Route path="/followups" element={<FollowupsPage />} />

              {/* 11. Human Onboarding: Team */}
              <Route path="/team" element={<TeamPage />} />

              {/* 12. Analytics */}
              <Route path="/analytics" element={<AnalyticsPage />} />

              {/* 13. Settings */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* 14. 404 Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MockDataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

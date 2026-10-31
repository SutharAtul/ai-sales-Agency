import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, KpiCard, StatusBadge } from '@/components'
import { Button } from '@/components/ui/button'
import {
  PhoneCall,
  PhoneIncoming,
  Building2,
  Sparkles,
  ArrowRightLeft,
  TrendingUp,
  Play,
  BarChart3,
  ArrowRight,
  Clock,
  Bot,
  ExternalLink,
  Phone,
  UserCheck,
  Megaphone,
} from 'lucide-react'
import { useMockData } from '@/context'
import {
  OVERVIEW_METRICS,
  LEAD_FUNNEL_STEPS,
  CALL_ACTIVITY_14_DAYS,
  CAMPAIGN_SUMMARIES,
} from '@/data/mock'

export function OverviewPage() {
  const { calls, handoffs, derivedMetrics } = useMockData()
  const [activeRange, setActiveRange] = useState<'30d' | '7d' | 'today'>('30d')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const kpiData = useMemo(() => {
    if (activeRange === 'today') {
      const attempted = 142
      const connected = 111
      const interested = 38
      const qualified = 19
      return {
        callsAttempted: { value: attempted.toLocaleString(), change: '+12.5%', trend: 'positive' as const, note: 'vs. yesterday' },
        connectedCalls: { value: connected.toLocaleString(), change: '+3.2%', trend: 'positive' as const, note: '78.2% connect rate' },
        interestedHoteliers: { value: interested.toLocaleString(), change: '+18.0%', trend: 'positive' as const, note: '34.2% of connected' },
        qualifiedLeads: { value: qualified.toLocaleString(), change: '+5.5%', trend: 'positive' as const, note: 'Ready for demonstration' },
        pendingHandoffs: { value: `${derivedMetrics.pendingHandoffs}`, change: 'Active', trend: 'neutral' as const, note: `${derivedMetrics.unassignedHandoffs} unassigned` },
        conversionRate: { value: '13.4%', change: '+0.8%', trend: 'positive' as const, note: 'Dials to qualified lead' },
      }
    }
    if (activeRange === '7d') {
      const attempted = 896
      const connected = 684
      const interested = 234
      const qualified = 121
      return {
        callsAttempted: { value: attempted.toLocaleString(), change: '+15.2%', trend: 'positive' as const, note: 'vs. previous 7 days' },
        connectedCalls: { value: connected.toLocaleString(), change: '+4.0%', trend: 'positive' as const, note: '76.3% connect rate' },
        interestedHoteliers: { value: interested.toLocaleString(), change: '+20.5%', trend: 'positive' as const, note: '34.2% of connected' },
        qualifiedLeads: { value: qualified.toLocaleString(), change: '+7.4%', trend: 'positive' as const, note: 'Ready for demonstration' },
        pendingHandoffs: { value: `${derivedMetrics.pendingHandoffs}`, change: 'Live', trend: 'neutral' as const, note: `${derivedMetrics.unassignedHandoffs} unassigned` },
        conversionRate: { value: '13.5%', change: '+1.1%', trend: 'positive' as const, note: 'Dials to qualified lead' },
      }
    }
    // 30d (default)
    return {
      callsAttempted: OVERVIEW_METRICS.callsAttempted,
      connectedCalls: OVERVIEW_METRICS.connectedCalls,
      interestedHoteliers: OVERVIEW_METRICS.interestedHoteliers,
      qualifiedLeads: OVERVIEW_METRICS.qualifiedLeads,
      pendingHandoffs: {
        value: `${derivedMetrics.pendingHandoffs}`,
        change: OVERVIEW_METRICS.pendingHandoffs.change,
        trend: OVERVIEW_METRICS.pendingHandoffs.trend,
        note: `${derivedMetrics.unassignedHandoffs} unassigned`,
      },
      conversionRate: OVERVIEW_METRICS.conversionRate,
    }
  }, [activeRange, derivedMetrics])

  const chartActivityData = useMemo(() => {
    if (activeRange === 'today') {
      return CALL_ACTIVITY_14_DAYS.slice(-4)
    }
    if (activeRange === '7d') {
      return CALL_ACTIVITY_14_DAYS.slice(-7)
    }
    return CALL_ACTIVITY_14_DAYS
  }, [activeRange])

  // Maximum call count for normalizing chart heights
  const maxAttempted = useMemo(() => {
    return Math.max(...chartActivityData.map((d) => d.attempted)) || 1
  }, [chartActivityData])

  return (
    <div className="space-y-6">
      {/* Demo Data Notice Banner */}
      <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-indigo-50/40 p-3.5 text-xs text-indigo-950 dark:border-indigo-400/20 dark:bg-indigo-950/20 dark:text-indigo-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">
            i
          </span>
          <div>
            <span className="font-semibold text-indigo-900 dark:text-indigo-100">
              Demo Environment · Fictional Hotelier Dataset
            </span>
            <span className="ml-2 text-indigo-700/80 dark:text-indigo-300/80">
              Metrics simulate 3 autonomous AI voice agents (Ava, Aria, Dev) dialing Rajasthan, Goa & Kerala hotel clusters.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-900 shadow-2xs dark:bg-card dark:text-indigo-200">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            3,612 Verified Records
          </span>
        </div>
      </div>

      {/* Main Page Header */}
      <PageHeader
        eyebrow="HOSPITALITY AI SALES ENGINE · TUESDAY, 28 OCTOBER 2026"
        title="Good morning, Atul 👋"
        description="Autonomous voice agents are currently qualifying independent hotel decision-makers across West & South India."
      >
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => setActiveRange('today')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeRange === 'today'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('7d')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeRange === '7d'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('30d')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeRange === '30d'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            30 Days
          </button>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link to="/analytics">
            <BarChart3 className="mr-1.5 size-3.5" />
            Analytics
          </Link>
        </Button>

        <Button size="sm" asChild>
          <Link to="/campaigns">
            <Play className="mr-1.5 size-3.5" />
            Launch Campaign
          </Link>
        </Button>
      </PageHeader>

      {/* 6 Key Performance Indicators (Internally Consistent Dataset) */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          <KpiCard
            label="Calls Attempted"
            value={kpiData.callsAttempted.value}
            change={kpiData.callsAttempted.change}
            changeType={kpiData.callsAttempted.trend}
            note={kpiData.callsAttempted.note}
            icon={<PhoneCall className="size-4" />}
          />
          <KpiCard
            label="Connected Calls"
            value={kpiData.connectedCalls.value}
            change={kpiData.connectedCalls.change}
            changeType={kpiData.connectedCalls.trend}
            note={kpiData.connectedCalls.note}
            icon={<PhoneIncoming className="size-4" />}
          />
          <KpiCard
            label="Interested Hoteliers"
            value={kpiData.interestedHoteliers.value}
            change={kpiData.interestedHoteliers.change}
            changeType={kpiData.interestedHoteliers.trend}
            note={kpiData.interestedHoteliers.note}
            icon={<Sparkles className="size-4" />}
          />
          <KpiCard
            label="Qualified Leads"
            value={kpiData.qualifiedLeads.value}
            change={kpiData.qualifiedLeads.change}
            changeType={kpiData.qualifiedLeads.trend}
            note={kpiData.qualifiedLeads.note}
            icon={<Building2 className="size-4" />}
          />
          <KpiCard
            label="Pending Handoffs"
            value={kpiData.pendingHandoffs.value}
            change={kpiData.pendingHandoffs.change}
            changeType={kpiData.pendingHandoffs.trend}
            note={kpiData.pendingHandoffs.note}
            icon={<ArrowRightLeft className="size-4" />}
          />
          <KpiCard
            label="Conversion Rate"
            value={kpiData.conversionRate.value}
            change={kpiData.conversionRate.change}
            changeType={kpiData.conversionRate.trend}
            note={kpiData.conversionRate.note}
            icon={<TrendingUp className="size-4" />}
          />
        </div>
      </section>

      {/* Row 2: Call Activity Chart & Lead Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Call Activity Chart (7 cols) */}
        <section
          aria-labelledby="activity-chart-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  id="activity-chart-heading"
                  className="font-semibold text-foreground flex items-center gap-2"
                >
                  Daily Call Activity
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                    {activeRange === 'today' ? 'Today (Intraday)' : activeRange === '7d' ? '7-Day View' : '14-Day View'}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Comparison between total attempted dials and verified connected conversations.
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground self-start sm:self-center">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-xs bg-indigo-600" />
                  Attempted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-xs bg-indigo-300 dark:bg-indigo-400" />
                  Connected
                </span>
              </div>
            </div>

            {/* Screen Reader accessible table fallback */}
            <table className="sr-only">
              <caption>Daily outbound call activity for the selected range</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Calls Attempted</th>
                  <th scope="col">Connected</th>
                  <th scope="col">Qualified</th>
                </tr>
              </thead>
              <tbody>
                {chartActivityData.map((point) => (
                  <tr key={point.date}>
                    <td>{point.dayLabel}</td>
                    <td>{point.attempted}</td>
                    <td>{point.connected}</td>
                    <td>{point.qualified}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Visual Accessible Bar Chart */}
            <div
              className="mt-6 flex h-52 items-end justify-between gap-1.5 border-b border-border/80 pb-2 sm:gap-2"
              role="img"
              aria-label={`Bar chart showing ${chartActivityData.length} periods of call volume.`}
            >
              {chartActivityData.map((point, index) => {
                const attemptedHeight = (point.attempted / maxAttempted) * 100
                const connectedHeight = (point.connected / maxAttempted) * 100
                const isHovered = hoveredBar === index

                return (
                  <div
                    key={point.date}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 flex flex-col items-center rounded-md border border-border bg-popover px-2 py-1 text-[10px] text-popover-foreground shadow-md pointer-events-none whitespace-nowrap">
                        <span className="font-bold">{point.dayLabel}</span>
                        <span>
                          {point.connected} / {point.attempted} connected
                        </span>
                      </div>
                    )}

                    {/* Pair of bars */}
                    <div className="flex w-full items-end justify-center gap-0.5 sm:gap-1 h-full">
                      {/* Attempted bar */}
                      <div
                        className="w-full max-w-[12px] rounded-t-sm bg-indigo-600 transition-all duration-200 group-hover:bg-indigo-700"
                        style={{ height: `${attemptedHeight}%` }}
                      />
                      {/* Connected bar */}
                      <div
                        className="w-full max-w-[12px] rounded-t-sm bg-indigo-300 dark:bg-indigo-400 transition-all duration-200 group-hover:bg-indigo-400"
                        style={{ height: `${connectedHeight}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="mt-2 text-[9px] font-medium text-muted-foreground group-hover:text-foreground">
                      {point.dayLabel.split(' ')[1] || point.dayLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity Footer Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Today’s Dials: <strong className="text-foreground">230</strong>
              </span>
              <span>
                Today’s Qualified: <strong className="text-emerald-600">36</strong>
              </span>
            </div>
            <Link
              to="/calls"
              className="flex items-center gap-1 font-medium text-primary hover:underline text-xs"
            >
              Explore all call recordings <ArrowRight className="size-3" />
            </Link>
          </div>
        </section>

        {/* Lead Funnel (5 cols) */}
        <section
          aria-labelledby="funnel-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h3 id="funnel-heading" className="font-semibold text-foreground">
                Hotelier Lead Funnel
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                13.5% Full Conversion
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              End-to-end qualification progression from cold automated dialing to product handoff.
            </p>

            {/* Funnel Stages */}
            <div className="mt-5 space-y-3.5">
              {LEAD_FUNNEL_STEPS.map((step) => (
                <div key={step.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{step.label}</span>
                    <span className="font-semibold text-foreground">{step.formattedCount}</span>
                  </div>

                  {/* Funnel Progress Track */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all duration-300`}
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="truncate">{step.sublabel}</span>
                    {step.conversionFromPrev && (
                      <span className="font-semibold text-emerald-600 shrink-0">
                        {step.conversionFromPrev}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <Button variant="ghost" size="sm" asChild className="w-full text-xs text-primary">
              <Link to="/leads" className="flex items-center justify-center gap-1">
                Manage Hotel Pipeline <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Row 3: Recent Calls & Prioritized Handoff Widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Calls Widget (7 cols) */}
        <section
          aria-labelledby="recent-calls-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 id="recent-calls-heading" className="font-semibold text-foreground">
                  Recent AI Voice Calls
                </h3>
                <p className="text-xs text-muted-foreground">
                  Latest conversation outcomes logged by Ava, Aria and Dev across hotel clusters.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs h-7">
                <Link to="/calls">View Log</Link>
              </Button>
            </div>

            {/* Calls list */}
            <div className="mt-4 divide-y divide-border/70">
              {calls.map((call) => {
                const callSlug = call.id
                return (
                  <div
                    key={call.id}
                    className="flex flex-col gap-2 py-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold text-xs">
                        {call.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/calls/${callSlug}`}
                            className="font-medium text-xs text-foreground hover:text-primary transition-colors"
                          >
                            {call.property}
                          </Link>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{call.name}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {call.time} ({call.duration})
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Bot className="size-3 text-indigo-500" />
                            {call.agent}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <StatusBadge
                        variant={
                          call.outcome === 'Demo booked'
                            ? 'qualified'
                            : call.outcome === 'Interested'
                              ? 'hot'
                              : call.outcome === 'Handoff requested'
                                ? 'in-conversation'
                                : 'default'
                        }
                        dot
                      >
                        {call.outcome}
                      </StatusBadge>

                      <Button variant="ghost" size="sm" asChild className="size-7 p-0">
                        <Link to={`/calls/${callSlug}`} aria-label={`Open transcript for ${call.property}`}>
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              Connected calls today: <strong className="text-foreground">178</strong> (77.4% connection efficiency)
            </span>
          </div>
        </section>

        {/* Prioritized Onboarding Handoff Widget (5 cols) */}
        <section
          aria-labelledby="handoff-widget-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ArrowRightLeft className="size-4" />
                </div>
                <div>
                  <h3 id="handoff-widget-heading" className="font-semibold text-foreground">
                    Prioritized Handoff Queue
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hoteliers awaiting immediate human onboarding action.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                {derivedMetrics.pendingHandoffs} In Queue
              </span>
            </div>

            {/* Handoff Items */}
            <div className="mt-4 space-y-3">
              {handoffs.slice(0, 3).map((item) => {
                const handoffSlug = item.id
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3 transition-colors hover:border-indigo-400/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/onboarding/${handoffSlug}`}
                            className="font-semibold text-xs text-foreground hover:text-primary transition-colors"
                          >
                            {item.property}
                          </Link>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[11px] text-muted-foreground">{item.name}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-foreground/80 leading-snug">
                          {item.reason}
                        </p>
                      </div>

                      <StatusBadge
                        variant={item.priority === 'High' ? 'hot' : 'follow-up'}
                        dot
                      >
                        {item.priority}
                      </StatusBadge>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                      <span>Queued {item.time}</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-6 px-2 text-[10px]"
                        >
                          <Link to={`/onboarding/${handoffSlug}`}>
                            <UserCheck className="mr-1 size-2.5" /> Assign
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          asChild
                          className="h-6 px-2 text-[10px]"
                        >
                          <Link to={`/onboarding/${handoffSlug}`}>
                            <Phone className="mr-1 size-2.5" /> Call
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <Button variant="ghost" size="sm" asChild className="w-full text-xs text-primary">
              <Link to="/handoffs" className="flex items-center justify-center gap-1">
                View All 8 Waiting Handoffs <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Row 4: Outreach Campaign Performance */}
      <section
        aria-labelledby="campaign-performance-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-xs"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Megaphone className="size-4" />
            </div>
            <div>
              <h3 id="campaign-performance-heading" className="font-semibold text-foreground">
                Active Outbound Campaign Performance
              </h3>
              <p className="text-xs text-muted-foreground">
                Automated multi-property dialing blitzes scheduled and running across regional hotel clusters.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to="/campaigns">Manage Campaigns</Link>
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {CAMPAIGN_SUMMARIES.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-lg border border-border/80 bg-muted/20 p-4 transition-colors hover:border-indigo-400/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{campaign.name}</h4>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{campaign.cluster}</p>
                </div>
                <StatusBadge variant={campaign.status === 'active' ? 'active' : 'scheduled'} dot>
                  {campaign.status === 'active' ? 'Live' : 'Queued'}
                </StatusBadge>
              </div>

              {/* Progress */}
              <div className="mt-3.5 space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Batch Dialing Progress</span>
                  <span className="font-semibold text-foreground">{campaign.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-border/60 pt-2.5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Calls</span>
                  <strong className="text-foreground text-xs">{campaign.callsMade}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Qualified</span>
                  <strong className="text-emerald-600 text-xs">{campaign.qualifiedLeads}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Rate</span>
                  <strong className="text-foreground text-xs">{campaign.conversionRate}</strong>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bot className="size-3 text-indigo-500" />
                  {campaign.agent}
                </span>
                <Link
                  to="/campaigns"
                  className="font-medium text-primary hover:underline flex items-center gap-0.5"
                >
                  Details <ArrowRight className="size-2.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

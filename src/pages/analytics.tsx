import { useState, useMemo } from 'react'
import { PageHeader } from '@/components'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  PieChart,
  Megaphone,
} from 'lucide-react'
import { useMockData } from '@/context'
import {
  CALL_ACTIVITY_14_DAYS,
  CAMPAIGN_SUMMARIES,
} from '@/data/mock/overview'

type DateRangeOption = '7d' | '14d' | '30d' | 'quarter'

interface MetricItem {
  id: string
  label: string
  value: string
  numerator: string
  denominator: string
  calculationExplanation: string
  trend: string
  isPositive: boolean
  benchmarkNote: string
}

export function AnalyticsPage() {
  const { derivedMetrics } = useMockData()
  const [dateRange, setDateRange] = useState<DateRangeOption>('14d')
  const [activeTrendMetric, setActiveTrendMetric] = useState<'attempted' | 'connected' | 'qualified'>('connected')

  // Date range multiplier for demo scaling
  const rangeMultiplier = useMemo(() => {
    switch (dateRange) {
      case '7d':
        return 0.52
      case '14d':
        return 1.0
      case '30d':
        return 2.1
      case 'quarter':
        return 6.2
    }
  }, [dateRange])

  // Scaled 6 Core KPIs with explicit denominators connected to shared mock state
  const coreMetrics: MetricItem[] = useMemo(() => {
    const attemptedRaw = Math.round((3600 + derivedMetrics.totalCalls) * rangeMultiplier)
    const connectedRaw = Math.round((2740 + derivedMetrics.connectedCalls) * rangeMultiplier)
    const interestedRaw = Math.round((930 + derivedMetrics.interestedCalls * 2) * rangeMultiplier)
    const qualifiedRaw = Math.round((470 + derivedMetrics.qualifiedLeads * 2) * rangeMultiplier)
    const handoffsRaw = Math.round((180 + derivedMetrics.pendingHandoffs + derivedMetrics.completedHandoffs) * rangeMultiplier)
    const completedRaw = Math.max(1, Math.round((18 + derivedMetrics.completedHandoffs) * rangeMultiplier))

    const connectionRateVal = attemptedRaw > 0 ? ((connectedRaw / attemptedRaw) * 100).toFixed(1) : '76.2'
    const interestedRateVal = connectedRaw > 0 ? ((interestedRaw / connectedRaw) * 100).toFixed(1) : '34.2'
    const qualifiedRateVal = interestedRaw > 0 ? ((qualifiedRaw / interestedRaw) * 100).toFixed(1) : '51.6'
    const handoffRateVal = qualifiedRaw > 0 ? ((handoffsRaw / qualifiedRaw) * 100).toFixed(1) : '38.3'
    const completedRateVal = handoffsRaw > 0 ? ((completedRaw / handoffsRaw) * 100).toFixed(1) : '10.2'

    return [
      {
        id: 'attempted',
        label: 'Calls Attempted',
        value: attemptedRaw.toLocaleString(),
        numerator: `${attemptedRaw.toLocaleString()} dials`,
        denominator: 'Total Dialing Pipeline Queue',
        calculationExplanation: 'Total simulated outbound phone calls initiated by autonomous voice fleet.',
        trend: '+18.4%',
        isPositive: true,
        benchmarkNote: '100% of outreach queue',
      },
      {
        id: 'connected',
        label: 'Connection Rate',
        value: `${connectionRateVal}%`,
        numerator: `${connectedRaw.toLocaleString()} connected`,
        denominator: `${attemptedRaw.toLocaleString()} attempted calls`,
        calculationExplanation: 'Percentage of attempted calls where the decision maker answered and verified identity.',
        trend: '+4.1%',
        isPositive: true,
        benchmarkNote: 'Industry avg: 55-65%',
      },
      {
        id: 'interested',
        label: 'Interested Hoteliers Rate',
        value: `${interestedRateVal}%`,
        numerator: `${interestedRaw.toLocaleString()} interested`,
        denominator: `${connectedRaw.toLocaleString()} connected conversations`,
        calculationExplanation: 'Percentage of connected hotel owners who expressed interest in reducing 18-24% OTA commissions.',
        trend: '+2.8%',
        isPositive: true,
        benchmarkNote: 'Denominator = Connected Calls',
      },
      {
        id: 'qualified',
        label: 'Qualified-Lead Rate',
        value: `${qualifiedRateVal}%`,
        numerator: `${qualifiedRaw.toLocaleString()} qualified`,
        denominator: `${interestedRaw.toLocaleString()} interested hoteliers`,
        calculationExplanation: 'Percentage of interested hoteliers who verified room inventory (20+ keys) and rate parity eligibility.',
        trend: '+5.4%',
        isPositive: true,
        benchmarkNote: 'Denominator = Interested Hoteliers',
      },
      {
        id: 'handoff',
        label: 'Human-Handoff Rate',
        value: `${handoffRateVal}%`,
        numerator: `${handoffsRaw.toLocaleString()} handoffs`,
        denominator: `${qualifiedRaw.toLocaleString()} qualified leads`,
        calculationExplanation: 'Percentage of qualified leads that successfully booked a live demo walkthrough with a human specialist.',
        trend: '+3.1%',
        isPositive: true,
        benchmarkNote: 'Denominator = Qualified Leads',
      },
      {
        id: 'completed',
        label: 'Completed-Onboarding Rate',
        value: `${completedRateVal}%`,
        numerator: `${completedRaw.toLocaleString()} certified`,
        denominator: `${handoffsRaw.toLocaleString()} human handoffs`,
        calculationExplanation: 'Hotels where human specialists verified GST, executed commercial contracts, and calibrated live PMS rate floors.',
        trend: '+1.6%',
        isPositive: true,
        benchmarkNote: 'Certified by Human Specialist Only',
      },
    ]
  }, [rangeMultiplier, derivedMetrics])

  // Daily Trend Points
  const trendData = useMemo(() => {
    if (dateRange === '7d') {
      return CALL_ACTIVITY_14_DAYS.slice(7)
    }
    return CALL_ACTIVITY_14_DAYS
  }, [dateRange])

  const maxTrendValue = useMemo(() => {
    return Math.max(...trendData.map((d) => d[activeTrendMetric])) * 1.15
  }, [trendData, activeTrendMetric])

  // Outcome distribution data
  const outcomeDistribution = [
    { label: 'Connected: High Interest & Demo Booked', count: 942, percent: 26.1, color: 'bg-emerald-600' },
    { label: 'Connected: Callback Requested / In Review', count: 1326, percent: 36.7, color: 'bg-indigo-600' },
    { label: 'Connected: Not Interested / Low Fit', count: 486, percent: 13.5, color: 'bg-amber-500' },
    { label: 'Unconnected: Voicemail / No Answer', count: 720, percent: 19.9, color: 'bg-slate-400 dark:bg-slate-600' },
    { label: 'Technical: Busy / Network Drop', count: 138, percent: 3.8, color: 'bg-red-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="PERFORMANCE REPORTING & ATTRIBUTION"
        title="Pipeline Analytics"
        description="Comprehensive attribution metrics, qualification funnels, and voice agent efficiency. All values are simulated mock benchmarks."
      >
        {/* Date Range Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '14d', label: 'Last 14 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'quarter', label: 'Q3 2026' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id as DateRangeOption)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                dateRange === tab.id
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Mandatory Non-Production Disclaimer Box */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-950/20 p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
          <ShieldAlert className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          Demo Analytics Sandbox (Fictional Simulation Benchmarks)
        </div>
        <p className="leading-relaxed text-indigo-900/90 dark:text-indigo-300/90 text-[11px]">
          All conversion percentages, connection volumes, and financial estimations displayed across this analytics suite are synthetic mathematical models generated for prototype demonstration. <strong>These figures do not represent verified production results, actual commercial revenue, or real JusBid operational performance.</strong>
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6 CORE FUNNEL METRICS WITH EXPLICIT DENOMINATORS             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            Core Funnel Conversion Velocity (Explicit Denominators)
          </h3>
          <span className="text-[11px] text-muted-foreground">
            Calculated across {dateRange === '7d' ? '7 days' : dateRange === '14d' ? '14 days' : '30 days'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreMetrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between hover:border-indigo-400/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground text-xs">{metric.label}</span>
                  <span className="flex items-center text-[11px] font-bold text-emerald-600">
                    <ArrowUpRight className="size-3 mr-0.5" />
                    {metric.trend}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</span>
                  <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
                    {metric.benchmarkNote}
                  </Badge>
                </div>

                {/* Explicit Denominator Breakdown Box */}
                <div className="mt-3 rounded-lg border border-border/80 bg-muted/30 p-2.5 text-[11px] space-y-1">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Numerator:</span>
                    <strong className="text-foreground">{metric.numerator}</strong>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground border-t border-border/60 pt-1">
                    <span>Denominator:</span>
                    <strong className="text-foreground">{metric.denominator}</strong>
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                  {metric.calculationExplanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE TRENDS CHART                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Daily Outreach Velocity & Conversion Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Day-by-day simulated performance across autonomous voice fleets.
            </p>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              onClick={() => setActiveTrendMetric('attempted')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTrendMetric === 'attempted'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Calls Attempted
            </button>
            <button
              onClick={() => setActiveTrendMetric('connected')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTrendMetric === 'connected'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Connected (76%)
            </button>
            <button
              onClick={() => setActiveTrendMetric('qualified')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTrendMetric === 'qualified'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Qualified Leads
            </button>
          </div>
        </div>

        {/* Responsive Bar Chart Visualization */}
        <div className="pt-2">
          <div className="flex h-52 items-end gap-2 border-b border-border pb-2 pt-4">
            {trendData.map((point) => {
              const val = point[activeTrendMetric]
              const heightPercent = Math.max(12, Math.round((val / maxTrendValue) * 100))

              return (
                <div
                  key={point.date}
                  className="group relative flex-1 flex flex-col items-center gap-1 h-full justify-end"
                >
                  {/* Tooltip on Hover */}
                  <div className="pointer-events-none absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded bg-popover px-2 py-1 text-[10px] font-mono text-popover-foreground shadow-md whitespace-nowrap border border-border">
                    {point.dayLabel}: <strong>{val}</strong> {activeTrendMetric}
                  </div>

                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      activeTrendMetric === 'qualified'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : activeTrendMetric === 'connected'
                          ? 'bg-indigo-600 hover:bg-indigo-500'
                          : 'bg-primary/70 hover:bg-primary'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-medium truncate w-full text-center">
                    {point.dayLabel}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
            <span>Y-Axis: Daily Volume (Simulated Mock Dials)</span>
            <span className="font-medium text-foreground">
              Peak: {Math.max(...trendData.map((d) => d[activeTrendMetric]))} {activeTrendMetric} on Oct 23
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* OUTCOME DISTRIBUTION & CAMPAIGN COMPARISON                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Outcome Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <PieChart className="size-4 text-primary" />
              Call Outcome & Disposition Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Aggregate breakdown of 3,612 calls dialed across all active agents.
            </p>
          </div>

          {/* Stacked Progress Bar */}
          <div className="space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {outcomeDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className={item.color}
                  style={{ width: `${item.percent}%` }}
                  title={`${item.label}: ${item.percent}%`}
                />
              ))}
            </div>

            <div className="divide-y divide-border/60 pt-2 text-xs">
              {outcomeDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${item.color} shrink-0`} />
                    <span className="text-foreground font-medium">{item.label}</span>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-foreground font-semibold">{item.count}</span>
                    <span className="text-muted-foreground ml-1.5">({item.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Comparison Table */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              Campaign Performance Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Comparing qualification velocity across active regional clusters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-2">Campaign Cluster</th>
                  <th className="pb-2 text-center">Calls</th>
                  <th className="pb-2 text-center">Connect %</th>
                  <th className="pb-2 text-right">Qualified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {CAMPAIGN_SUMMARIES.map((camp) => (
                  <tr key={camp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-2">
                      <strong className="text-foreground block">{camp.name}</strong>
                      <span className="text-[10px] text-muted-foreground">{camp.agent}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono">{camp.callsMade}</td>
                    <td className="py-2.5 text-center font-semibold text-indigo-600">
                      {camp.callsMade > 0 ? '77.4%' : '0%'}
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">
                      {camp.qualifiedLeads}
                      <span className="text-[10px] font-normal text-muted-foreground block">
                        ({camp.conversionRate})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-muted/20 p-2.5 text-[11px] text-muted-foreground">
            North India Heritage Blitz maintains the highest total volume; Metro Tech Hub holds the highest qualification rate per dial (27.3%).
          </div>
        </div>
      </div>
    </div>
  )
}

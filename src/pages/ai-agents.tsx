import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Bot,
  Volume2,
  Settings2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Sliders,
  Plus,
  Trash2,
  Languages,
  UserCheck,
  Cpu,
  Layers,
  HelpCircle,
  MessageSquare,
  Clock,
  PhoneCall,
  X,
  AudioWaveform,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { AiAgent, AgentFaq } from '@/types'

const AVAILABLE_LANGUAGES = [
  'Indian English',
  'Hindi',
  'Hinglish',
  'Tamil',
  'Telugu',
  'Kannada',
  'Bengali',
  'Marathi',
]

const TEAM_SPECIALISTS = [
  'Neha Sharma (Senior Sales Specialist)',
  'Arjun Patel (Enterprise Onboarding)',
  'Sara Thomas (Onboarding Specialist)',
  'Kabir Khanna (Hospitality Growth)',
]

export function AiAgentsPage() {
  // Shared agents from master context
  const { agents, updateAgent } = useMockData()

  // Selected agent for details/configuration view (null means showing all cards)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  // Simulation test voice modal state
  const [testingAgent, setTestingAgent] = useState<AiAgent | null>(null)
  const [isTestPlaying, setIsTestPlaying] = useState(false)

  // Feedback banner state
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // New FAQ form state inside details view
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')
  const [showAddFaq, setShowAddFaq] = useState(false)

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || null

  // Toggle enabled/disabled demo state
  const handleToggleEnabled = (agentId: string) => {
    const target = agents.find((a) => a.id === agentId)
    if (!target) return
    const nextState = !target.isEnabled
    updateAgent(agentId, { isEnabled: nextState })
    setFeedbackBanner(
      `Agent "${target.name}" has been ${nextState ? 'enabled' : 'paused'} in demo sandbox.`,
    )
  }

  // Update field on the currently active agent
  const handleUpdateActiveAgent = <K extends keyof AiAgent>(
    field: K,
    value: AiAgent[K],
  ) => {
    if (!selectedAgentId) return
    updateAgent(selectedAgentId, { [field]: value })
  }

  // Add FAQ to active agent
  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim() || !activeAgent) return
    const newFaq: AgentFaq = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    }
    const updatedFaqs = [...activeAgent.faqs, newFaq]
    handleUpdateActiveAgent('faqs', updatedFaqs)
    setNewFaqQuestion('')
    setNewFaqAnswer('')
    setShowAddFaq(false)
    setFeedbackBanner(`New FAQ added to ${activeAgent.name}'s knowledge base.`)
  }

  // Delete FAQ
  const handleDeleteFaq = (faqId: string) => {
    if (!activeAgent) return
    const updatedFaqs = activeAgent.faqs.filter((f) => f.id !== faqId)
    handleUpdateActiveAgent('faqs', updatedFaqs)
    setFeedbackBanner('FAQ removed from knowledge base.')
  }

  // Save changes confirmation
  const handleSaveConfiguration = () => {
    if (!activeAgent) return
    setFeedbackBanner(
      `✓ Configuration for agent "${activeAgent.name}" saved successfully to local state.`,
    )
  }

  // Trigger simulated voice test
  const handleStartSimulatedVoiceTest = (agent: AiAgent) => {
    setTestingAgent(agent)
    setIsTestPlaying(true)
    setTimeout(() => {
      setIsTestPlaying(false)
    }, 4500)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="AUTONOMOUS VOICE FLEET"
        title="AI Voice Agents"
        description="Inspect conversational agent personas, configure speech prompts, manage objection FAQs, and review simulated voice provider pipelines."
      >
        <div className="flex items-center gap-2">
          {selectedAgentId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAgentId(null)}
            >
              <ArrowLeft className="mr-1.5 size-3.5" />
              All Agents
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const target = activeAgent || agents[0]
              handleStartSimulatedVoiceTest(target)
            }}
          >
            <Volume2 className="mr-1.5 size-3.5" />
            Simulate Voice
          </Button>
          <Button size="sm" asChild>
            <Link to="/calls">
              <PhoneCall className="mr-1.5 size-3.5" />
              View Call History
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Demo Sandbox & Zero API Key Safety Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div>
            <strong className="text-foreground">Demo-Only Provider Sandbox:</strong> All STT, LLM, TTS voices, and SIP telephony trunk configurations are mock representations. No external API keys are requested or stored, and no real telephone calls are ever initiated.
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          Zero-Outbound Safe Mode
        </span>
      </div>

      {/* Feedback Alert Banner */}
      {feedbackBanner && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-50/80 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            onClick={() => setFeedbackBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW MODE 1: FLEET OVERVIEW CARDS (When no agent is opened) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {!selectedAgentId && (
        <div className="space-y-6">
          {/* Fleet Summary Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Active Voice Agents</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {agents.filter((a) => a.isEnabled).length}
                </span>
                <span className="text-[10px] text-muted-foreground">of {agents.length} deployed</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Calls Completed</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {agents.reduce((acc, a) => acc + a.callsCount, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">mock calls</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Avg Qualification Rate</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-emerald-600">37.5%</span>
                <span className="text-[10px] text-muted-foreground">lead conversion</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Speech Latency</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-indigo-600">226ms</span>
                <span className="text-[10px] text-muted-foreground">synthetic pipeline</span>
              </div>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  {/* Card Top: Icon, Name & Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                        <Bot className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{agent.name}</h3>
                        <p className="text-xs font-semibold text-primary">{agent.role}</p>
                      </div>
                    </div>

                    <StatusBadge
                      variant={agent.isEnabled ? 'active' : 'paused'}
                      dot
                    >
                      {agent.isEnabled ? 'Enabled' : 'Disabled'}
                    </StatusBadge>
                  </div>

                  {/* Purpose & Specialty */}
                  <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground">
                    {agent.purpose}
                  </p>

                  {/* Specifications */}
                  <div className="mt-4 space-y-2 border-t border-border pt-3.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Languages className="size-3.5 text-muted-foreground" />
                        Languages:
                      </span>
                      <span className="font-medium text-foreground text-right">{agent.language}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="size-3.5 text-muted-foreground" />
                        Provider (Demo):
                      </span>
                      <span className="font-mono text-[11px] text-foreground truncate max-w-[170px]" title={agent.provider.llmModel}>
                        {agent.provider.llmModel.split(' ')[0]} + {agent.provider.sttProvider.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground" />
                        Last Test:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            agent.lastTestStatus === 'Passed'
                              ? 'bg-emerald-500'
                              : agent.lastTestStatus === 'Degraded'
                                ? 'bg-amber-500'
                                : 'bg-muted-foreground'
                          }`}
                        />
                        <span className="font-medium text-foreground">
                          {agent.lastTestStatus} ({agent.testLatencyMs}ms)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Total Mock Calls:</span>
                      <span className="font-semibold text-foreground">
                        {agent.callsCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Qualification Rate:</span>
                      <span className="font-bold text-emerald-600">
                        {agent.qualificationRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(agent.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        agent.isEnabled ? 'bg-primary' : 'bg-muted'
                      }`}
                      title={agent.isEnabled ? 'Disable agent' : 'Enable agent'}
                    >
                      <span
                        className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                          agent.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {agent.isEnabled ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartSimulatedVoiceTest(agent)}
                      className="h-8 px-2.5 text-xs font-medium"
                    >
                      <Volume2 className="mr-1.5 size-3.5" />
                      Test Voice
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedAgentId(agent.id)}
                      className="h-8 px-2.5 text-xs font-medium"
                    >
                      <Settings2 className="mr-1.5 size-3.5" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW MODE 2: DETAILS VIEW & CONFIGURATION FORM (When opened) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeAgent && (
        <div className="space-y-6">
          {/* Agent Header Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Bot className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{activeAgent.name}</h2>
                  <StatusBadge variant={activeAgent.isEnabled ? 'active' : 'paused'} dot>
                    {activeAgent.isEnabled ? 'Live & Active' : 'Paused'}
                  </StatusBadge>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    ID: {activeAgent.id}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeAgent.role} · {activeAgent.voiceTone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleEnabled(activeAgent.id)}
                className="text-xs"
              >
                {activeAgent.isEnabled ? 'Pause Agent' : 'Enable Agent'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartSimulatedVoiceTest(activeAgent)}
                className="text-xs"
              >
                <Volume2 className="mr-1.5 size-3.5" />
                Simulate Test Greeting
              </Button>
              <Button
                size="sm"
                onClick={handleSaveConfiguration}
                className="text-xs"
              >
                Save Configuration
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Columns: Prompts, FAQs, Pitch, Escalation */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. Opening Greeting Prompt */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MessageSquare className="size-4 text-primary" />
                      Opening Greeting Prompt
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      The exact opening script the agent speaks upon hotelier connection.
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    Sub-second Latency
                  </Badge>
                </div>

                <textarea
                  rows={3}
                  aria-label="Opening greeting prompt"
                  value={activeAgent.greetingPrompt}
                  onChange={(e) => handleUpdateActiveAgent('greetingPrompt', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                />

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <span>Available dynamic placeholders:</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">[Property Name]</code>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">[Hotelier Name]</code>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">[City]</code>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">[OTA Commission %]</code>
                </div>
              </div>

              {/* 2. Approved Value Pitch */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    Approved Hospitality Value Pitch
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Core pitch delivered once the hotelier expresses interest or asks about JusBid benefits.
                  </p>
                </div>

                <textarea
                  rows={4}
                  aria-label="Approved hospitality value pitch"
                  value={activeAgent.approvedPitch}
                  onChange={(e) => handleUpdateActiveAgent('approvedPitch', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* 3. Objection Handling & FAQs Knowledge Base */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <HelpCircle className="size-4 text-primary" />
                      Objection Handling & Knowledge FAQs
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Structured Q&A verified for OTA comparison, PMS compatibility, and rate parity concerns.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddFaq(true)}
                    className="text-xs"
                  >
                    <Plus className="mr-1.5 size-3" />
                    Add FAQ
                  </Button>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                  {activeAgent.faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <strong className="text-foreground">Q: {faq.question}</strong>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        A: {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add FAQ Sub-form */}
                {showAddFaq && (
                  <div className="rounded-lg border border-primary/40 bg-accent/30 p-3.5 space-y-3 text-xs">
                    <h4 className="font-semibold text-foreground">Add New Knowledge Item</h4>
                    <Input
                      placeholder="e.g. Does JusBid violate our OTA rate parity agreement?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="text-xs"
                    />
                    <textarea
                      rows={2}
                      placeholder="e.g. No, because guest bids are closed, private transactions not indexed on public search engines."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddFaq(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddFaq}
                        disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                        className="text-xs"
                      >
                        Add to Agent Knowledge
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Human Escalation & Handoff Behavior */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <UserCheck className="size-4 text-primary" />
                    Human Escalation & Handoff Triggers
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Define exact conditions where the voice agent smoothly transitions the call to a specialist.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 rounded-lg border border-border/70 p-3 cursor-pointer hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={activeAgent.escalation.triggerOnCustomPricing}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          triggerOnCustomPricing: e.target.checked,
                        })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Custom Volume Pricing (&gt;100 Rooms)</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-lg border border-border/70 p-3 cursor-pointer hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={activeAgent.escalation.triggerOnDemoRequest}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          triggerOnDemoRequest: e.target.checked,
                        })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Explicit Demonstration Request</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-lg border border-border/70 p-3 cursor-pointer hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={activeAgent.escalation.triggerOnNegativeSentiment}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          triggerOnNegativeSentiment: e.target.checked,
                        })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Negative or Resistant Sentiment</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-lg border border-border/70 p-3 cursor-pointer hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={activeAgent.escalation.triggerOnMaxQuestions}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          triggerOnMaxQuestions: e.target.checked,
                        })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">
                      Exceeds {activeAgent.escalation.maxUnansweredTurns} Unresolved Questions
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Assigned Human Specialist
                    </label>
                    <select
                      value={activeAgent.escalation.primaryHandoffTarget}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          primaryHandoffTarget: e.target.value,
                        })
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                      {TEAM_SPECIALISTS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Fallback When Specialist is Offline
                    </label>
                    <select
                      value={activeAgent.escalation.fallbackAction}
                      onChange={(e) =>
                        handleUpdateActiveAgent('escalation', {
                          ...activeAgent.escalation,
                          fallbackAction: e.target.value as 'whatsapp' | 'voicemail' | 'sms',
                        })
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                      <option value="whatsapp">Send Instant WhatsApp Proposal Summary</option>
                      <option value="voicemail">Record Hotelier Audio Voicemail</option>
                      <option value="sms">Send SMS Demo Calendar Booking Link</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Language, Voice & Demo-Only Provider Configuration */}
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Languages className="size-4 text-primary" />
                  Language & Speech Dialect
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select active spoken languages supported during real-time speech synthesis.
                </p>

                <div className="space-y-1.5 pt-1">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isChecked = activeAgent.supportedLanguages.includes(lang)
                    return (
                      <label
                        key={lang}
                        className="flex items-center justify-between rounded-md p-2 text-xs hover:bg-muted/40 cursor-pointer"
                      >
                        <span className="text-foreground">{lang}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updated: string[]
                            if (e.target.checked) {
                              updated = [...activeAgent.supportedLanguages, lang]
                            } else {
                              updated = activeAgent.supportedLanguages.filter((l) => l !== lang)
                            }
                            handleUpdateActiveAgent('supportedLanguages', updated)
                            handleUpdateActiveAgent('language', updated.join(', '))
                          }}
                          className="rounded border-input text-primary focus:ring-ring"
                        />
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Demo Provider Configuration (Strictly Demo-Only Placeholder) */}
              <div className="rounded-xl border border-indigo-500/30 bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-indigo-600 dark:text-indigo-400" />
                    Provider Config (Demo Only)
                  </h3>
                  <Badge variant="outline" className="border-indigo-400/40 text-indigo-600 dark:text-indigo-400 text-[9px] uppercase font-bold">
                    Demo Simulated
                  </Badge>
                </div>

                <div className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 p-3 text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed border border-indigo-200/50 dark:border-indigo-800/40">
                  <strong>Notice:</strong> This deployment uses local mock pipelines. No third-party API credentials (Deepgram, Cartesia, OpenAI, Twilio) are required or exposed.
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Speech-to-Text (STT)</span>
                    <Input
                      readOnly
                      value={activeAgent.provider.sttProvider}
                      className="bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">LLM Reasoning Engine</span>
                    <Input
                      readOnly
                      value={activeAgent.provider.llmModel}
                      className="bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Text-to-Speech (TTS) Voice</span>
                    <Input
                      readOnly
                      value={activeAgent.provider.ttsVoice}
                      className="bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Telephony SIP Trunk</span>
                    <Input
                      readOnly
                      value={activeAgent.provider.telephonyTrunk}
                      className="bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/80 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartSimulatedVoiceTest(activeAgent)}
                    className="h-8 px-3 text-xs"
                  >
                    <Volume2 className="mr-1.5 size-3.5" />
                    Test Voice Pipeline (Simulated)
                  </Button>
                </div>
              </div>

              {/* Performance Diagnostics */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sliders className="size-4 text-primary" />
                  Diagnostic Metrics
                </h3>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Average Connection Latency:</span>
                    <span className="font-semibold text-foreground">{activeAgent.testLatencyMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qualification Success:</span>
                    <span className="font-semibold text-emerald-600">{activeAgent.qualificationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Call Duration:</span>
                    <span className="font-semibold text-foreground">{activeAgent.avgDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Simulated Test:</span>
                    <span className="font-medium text-foreground">{activeAgent.lastTestedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Voice Greeting Test Modal */}
      <Dialog
        open={testingAgent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTestingAgent(null)
            setIsTestPlaying(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="size-5 text-primary" />
              Simulated Voice Playback Test
            </DialogTitle>
            <DialogDescription>
              {testingAgent ? (
                <>Simulating {testingAgent.name} ({testingAgent.role}) audio greeting playback.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {testingAgent && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/40 p-4 text-center">
                <div className="flex justify-center items-center gap-1.5 py-4 text-primary">
                  {isTestPlaying ? (
                    <div className="flex items-center gap-1 h-8">
                      <span className="w-1.5 bg-primary animate-pulse h-8 rounded-full" />
                      <span className="w-1.5 bg-primary animate-pulse h-5 rounded-full delay-75" />
                      <span className="w-1.5 bg-primary animate-pulse h-7 rounded-full delay-150" />
                      <span className="w-1.5 bg-primary animate-pulse h-4 rounded-full delay-100" />
                      <span className="w-1.5 bg-primary animate-pulse h-6 rounded-full delay-200" />
                    </div>
                  ) : (
                    <AudioWaveform className="size-8 text-muted-foreground opacity-50" />
                  )}
                </div>

                <span className="inline-block rounded-full bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-800 dark:text-indigo-200">
                  {isTestPlaying ? 'Synthesizing Audio Stream...' : 'Simulation Test Complete'}
                </span>

                <p className="mt-2 text-xs font-mono text-muted-foreground">
                  Simulated Latency: {testingAgent.testLatencyMs}ms · Voice: {testingAgent.voiceTone.split('(')[0]}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Spoken Script:
                </span>
                <p className="text-xs italic text-foreground leading-relaxed">
                  "{testingAgent.greetingPrompt}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Synthetic Status:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Pipeline Verified
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (testingAgent) handleStartSimulatedVoiceTest(testingAgent)
              }}
            >
              <RotateCcw className="mr-1.5 size-3.5" /> Replay
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setTestingAgent(null)
                setIsTestPlaying(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

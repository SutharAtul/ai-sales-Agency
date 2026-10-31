import type { AiAgent } from '@/types'

/**
 * Mock conversational voice agent configurations for JusBid AI Sales Agency.
 * All telephony providers, STT, and LLM endpoints are DEMO-ONLY simulated placeholders.
 * No real API keys are stored, requested, or used, and no live telephone calls are initiated.
 */
export const mockAiAgents: AiAgent[] = [
  {
    id: 'agent-ava',
    name: 'Ava',
    role: 'Lead Qualifier Agent',
    purpose: 'Cold & inbound hotelier prospect qualification, room count verification, OTA commission comparison, and scheduling human demos.',
    language: 'Indian English, Hindi, Hinglish',
    supportedLanguages: ['Indian English', 'Hindi', 'Hinglish'],
    voiceTone: 'Professional, Warm & Persuasive (Indian Female)',
    isEnabled: true,
    lastTestStatus: 'Passed',
    lastTestedAt: 'Today, 09:42 AM',
    testLatencyMs: 210,
    callsCount: 1842,
    qualificationRate: 42.8,
    avgDuration: '2m 14s',
    greetingPrompt:
      "Namaste! This is Ava calling on behalf of JusBid. I'm reaching out directly regarding direct guest booking distribution for [Property Name]. Am I speaking with the General Manager or Owner?",
    approvedPitch:
      'Hoteliers using JusBid typically save 18% to 24% on OTA commission fees by allowing verified travelers to bid directly on unfilled room inventory within your custom price floors. We guarantee zero listing commission and instant payment settlement.',
    faqs: [
      {
        id: 'faq-1',
        question: 'How does JusBid differ from MakeMyTrip or Booking.com?',
        answer:
          'Unlike OTAs that charge 20%+ commissions and control your guest relationships, JusBid operates on a 0% commission direct bidding model where you maintain complete guest contact data and set dynamic reserve prices.',
      },
      {
        id: 'faq-2',
        question: 'Does JusBid integrate with our Property Management System (PMS)?',
        answer:
          'Yes, JusBid connects seamlessly with IDS Next, eZee Technosys, Opera, and Hotelogix via real-time two-way API synchronization.',
      },
      {
        id: 'faq-3',
        question: 'What happens if guest bids are too low for our luxury standards?',
        answer:
          'Your revenue manager sets strict minimum floor rates. Any bid below your reserve is automatically rejected in real time without harming your public brand rate.',
      },
    ],
    escalation: {
      triggerOnCustomPricing: true,
      triggerOnNegativeSentiment: true,
      triggerOnDemoRequest: true,
      triggerOnMaxQuestions: true,
      maxUnansweredTurns: 2,
      primaryHandoffTarget: 'Neha Sharma (Senior Sales Specialist)',
      fallbackAction: 'whatsapp',
    },
    provider: {
      sttProvider: 'Deepgram Nova-2 Multilingual [Simulated]',
      llmModel: 'Claude 3.5 Sonnet (JusBid Hospitality v2.4) [Simulated]',
      ttsVoice: 'Cartesia Sonic - Maya (Indian English) [Simulated]',
      telephonyTrunk: 'Exotel SIP Trunk (India Telephony Sandbox) [Demo]',
      isDemoPlaceholder: true,
    },
  },
  {
    id: 'agent-aria',
    name: 'Aria',
    role: 'Concierge & Feature Specialist',
    purpose: 'Handling inbound questions from hotel website prospects, answering technical integration FAQs, and calculating OTA commission savings.',
    language: 'Indian English, Hindi, Tamil',
    supportedLanguages: ['Indian English', 'Hindi', 'Tamil'],
    voiceTone: 'Crisp, Enthusiastic & Consultative (Indian Female)',
    isEnabled: true,
    lastTestStatus: 'Passed',
    lastTestedAt: 'Yesterday, 04:15 PM',
    testLatencyMs: 185,
    callsCount: 1206,
    qualificationRate: 38.2,
    avgDuration: '3m 05s',
    greetingPrompt:
      "Hello! This is Aria from JusBid Concierge. Thank you for requesting information on JusBid's direct bidding engine for [Property Name]. How can I help clarify our direct booking technology today?",
    approvedPitch:
      'With JusBid, you convert website visitors into confirmed direct bookings without publicly discounting your rack rates. Guests submit their target price, and our smart engine matches them against your uncommitted room inventory.',
    faqs: [
      {
        id: 'faq-4',
        question: 'Can we test JusBid on a single property before rolling out to our chain?',
        answer:
          'Absolutely. Most hotel groups begin with a 30-day pilot on a single boutique property with 10 to 15 trial rooms to evaluate direct revenue uplift.',
      },
      {
        id: 'faq-5',
        question: 'How are cancellations and no-shows handled on guest bids?',
        answer:
          'All accepted bids are secured by instant card authorizations or advance UPI payments, adhering to your existing cancellation policy.',
      },
    ],
    escalation: {
      triggerOnCustomPricing: true,
      triggerOnNegativeSentiment: false,
      triggerOnDemoRequest: true,
      triggerOnMaxQuestions: true,
      maxUnansweredTurns: 3,
      primaryHandoffTarget: 'Arjun Patel (Enterprise Onboarding)',
      fallbackAction: 'whatsapp',
    },
    provider: {
      sttProvider: 'Whisper Large v3 Turbo [Simulated]',
      llmModel: 'GPT-4o Mini Realtime [Simulated]',
      ttsVoice: 'ElevenLabs Rachel (South Asian Accent) [Simulated]',
      telephonyTrunk: 'Twilio India Elastic SIP Trunk [Demo Placeholder]',
      isDemoPlaceholder: true,
    },
  },
  {
    id: 'agent-dev',
    name: 'Dev',
    role: 'Follow-up Specialist',
    purpose: 'Re-engaging warm leads post-demonstration, answering pending decision-maker questions, and expediting PMS pilot signups.',
    language: 'Indian English, Hindi',
    supportedLanguages: ['Indian English', 'Hindi'],
    voiceTone: 'Confident, Respectful & Helpful (Indian Male)',
    isEnabled: false,
    lastTestStatus: 'Degraded',
    lastTestedAt: '2 days ago',
    testLatencyMs: 480,
    callsCount: 564,
    qualificationRate: 31.6,
    avgDuration: '1m 52s',
    greetingPrompt:
      "Hello [Hotelier Name], this is Dev from JusBid following up on our demonstration earlier this week. I wanted to see if you had any questions on the commission savings projection we shared for [Property Name]?",
    approvedPitch:
      'Our onboarding team is reserving complimentary PMS integration setup for the upcoming peak tourist season. We can have your property live and receiving direct guest bids within 48 hours.',
    faqs: [
      {
        id: 'faq-6',
        question: 'We need to discuss this with our hotel owner next week.',
        answer:
          'Understood! Would it help if I send a 1-page executive summary slide to your WhatsApp so you have key revenue numbers ready for the owner?',
      },
      {
        id: 'faq-7',
        question: 'What is the setup fee for JusBid direct bidding?',
        answer:
          'Zero setup fees. JusBid is completely performance-based with a nominal transaction processing fee only when a guest booking is successfully confirmed.',
      },
    ],
    escalation: {
      triggerOnCustomPricing: true,
      triggerOnNegativeSentiment: true,
      triggerOnDemoRequest: true,
      triggerOnMaxQuestions: false,
      maxUnansweredTurns: 2,
      primaryHandoffTarget: 'Sara Thomas (Onboarding Specialist)',
      fallbackAction: 'voicemail',
    },
    provider: {
      sttProvider: 'Deepgram Nova-2 Indian English [Simulated]',
      llmModel: 'Groq Llama-3.3 70B Versatile [Simulated]',
      ttsVoice: 'Cartesia Sonic - Arjun (Indian English) [Simulated]',
      telephonyTrunk: 'Tata Tele Business Services SIP [Demo Placeholder]',
      isDemoPlaceholder: true,
    },
  },
]


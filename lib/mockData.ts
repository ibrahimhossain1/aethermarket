import { UserRole, ProductType, ProductStatus } from "@prisma/client"

export interface MockUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: UserRole
  bio: string | null
  website: string | null
  stripeAccountId: string | null
  stripeCustomerId: string | null
  createdAt: Date
}

export interface MockProduct {
  id: string
  title: string
  slug: string
  description: string
  type: ProductType
  category: string
  subcategory: string | null
  tags: string[]
  price: number // in cents
  isFree: boolean
  previewContent: string | null
  assetKey: string
  previewImages: string[]
  status: ProductStatus
  targetModel: string | null
  language: string | null
  framework: string | null
  metadata: any
  downloadCount: number
  viewCount: number
  sellerId: string
  seller: MockUser
  createdAt: Date
  updatedAt: Date
  reviews: MockReview[]
}

export interface MockReview {
  id: string
  buyerId: string
  buyerName: string
  buyerImage: string | null
  productId: string
  rating: number
  body: string
  sellerReply: string | null
  createdAt: Date
}

export const MOCK_USERS: Record<string, MockUser> = {
  alex: {
    id: "seller-alex-rivera-1111",
    email: "alex@promptwizard.ai",
    name: "Alex Rivera",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    role: UserRole.SELLER,
    bio: "Advanced AI Prompter and LLM Engineer. Specializes in prompt engineering, cognitive modeling, and multi-agent system orchestrations.",
    website: "https://promptwizard.ai",
    stripeAccountId: "acct_1promptwizard001",
    stripeCustomerId: "cus_alexbuyer1",
    createdAt: new Date("2026-01-15T08:00:00Z")
  },
  sarah: {
    id: "seller-sarah-chen-2222",
    email: "sarah@workflowguru.io",
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    role: UserRole.SELLER,
    bio: "Full stack automation expert. Architecting modular reusable skills, n8n orchestrations, and automated cognitive pipelines for business efficiency.",
    website: "https://workflowguru.io",
    stripeAccountId: "acct_1workflowguru002",
    stripeCustomerId: "cus_sarahbuyer2",
    createdAt: new Date("2026-02-10T08:00:00Z")
  },
  devon: {
    id: "seller-devon-miller-3333",
    email: "devon@codecraft.dev",
    name: "Devon Miller",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    role: UserRole.SELLER,
    bio: "Veteran Next.js & React engineer. Crafting premium serverless boilerplates, custom Tailwind components, and high-performance API architectures.",
    website: "https://codecraft.dev",
    stripeAccountId: "acct_1codecraft003",
    stripeCustomerId: "cus_devonbuyer3",
    createdAt: new Date("2026-03-01T08:00:00Z")
  }
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev-1",
    buyerId: "buyer-john-doe-4444",
    buyerName: "John Doe",
    buyerImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80",
    productId: "prod-agent-prompt",
    rating: 5,
    body: "This prompt completely changed how I organize my automated LLM pipelines! The multi-agent decomposing logic is flawless and saves me hours of manual instruction modeling.",
    sellerReply: "Thank you so much John! Extremely glad that the agentic cognitive loop is helping in your pipelines. Let me know if you need any customizations for larger models!",
    createdAt: new Date("2026-05-25T10:00:00Z")
  },
  {
    id: "rev-2",
    buyerId: "buyer-john-doe-4444",
    buyerName: "John Doe",
    buyerImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80",
    productId: "prod-stripe-discord",
    rating: 4,
    body: "Excellent n8n blueprint. It mapped Stripe webhooks to my Discord server in less than 5 minutes. The daily aggregates calculation is incredibly helpful. Dropped 1 star because Discord embeds wrap weird on vertical mobile monitors.",
    sellerReply: "Hey John! Thanks for the review. That wrap issue is due to Discord's field rendering. I will update the blueprint next week to use shorter bullet points to solve vertical spacing!",
    createdAt: new Date("2026-05-27T10:00:00Z")
  }
]

export const MOCK_PRODUCTS: MockProduct[] = [
  // --- 4 Prompts (Seller: Alex Rivera) ---
  {
    id: "prod-agent-prompt",
    title: "Cognitive Multi-Agent Architect Prompt",
    slug: "cognitive-multi-agent-architect-prompt",
    description: "An advanced, system-prompt instruction set that converts any LLM into a multi-agent orchestration engine. Perfect for modeling systems, generating task hierarchies, self-correction strategies, and debugging complex instructions automatically.",
    type: ProductType.PROMPT,
    category: "Development",
    subcategory: "Agentic Systems",
    tags: ["GPT-4o", "Claude 3.5 Sonnet", "Agentic", "System Prompt", "Engineering"],
    price: 1900,
    isFree: false,
    previewContent: "You are the Cognitive Agentic Orchestrator (CAO). Your primary objective is to decompose the user's micro-tasks into sub-agent specifications. Establish cognitive loops, self-evaluation cycles, and verification checkpoints before producing final outputs.",
    assetKey: "prompts/cognitive-agent.txt",
    previewImages: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: "Claude 3.5 Sonnet & GPT-4o",
    language: null,
    framework: null,
    metadata: {
      tokensCount: "4,500 tokens",
      instructionLevel: "Advanced",
      idealUseCases: ["Software Architecture Decompositions", "Debugging pipelines", "Autonomous agent configurations"]
    },
    downloadCount: 154,
    viewCount: 1205,
    sellerId: MOCK_USERS.alex.id,
    seller: MOCK_USERS.alex,
    createdAt: new Date("2026-04-10T08:00:00Z"),
    updatedAt: new Date("2026-04-10T08:00:00Z"),
    reviews: [MOCK_REVIEWS[0]]
  },
  {
    id: "prod-copywriter",
    title: "Master copywriter - Persuasive Sales Funnels Prompt",
    slug: "master-copywriter-persuasive-sales-funnels-prompt",
    description: "A highly engineered prompt designed to generate high-converting email lists, landing pages, and ad hooks using psychological principles like scarcity, reciprocity, social proof, and emotional targeting.",
    type: ProductType.PROMPT,
    category: "Marketing",
    subcategory: "Copywriting",
    tags: ["Copywriting", "Sales Funnels", "ChatGPT", "Email Marketing"],
    price: 900,
    isFree: false,
    previewContent: "ROLE: Master Copywriter specialized in Robert Cialdini's Persuasion Principles. TASK: Deconstruct the product profile provided and draft a 5-part email series focusing on a problem-agitate-solve framework.",
    assetKey: "prompts/master-copywriter.txt",
    previewImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: "GPT-4o / Claude 3 Opus",
    language: null,
    framework: null,
    metadata: {
      tokensCount: "1,200 tokens",
      instructionLevel: "Intermediate",
      idealUseCases: ["Email sequences", "Sales page drafts", "PPC ad variations"]
    },
    downloadCount: 312,
    viewCount: 2240,
    sellerId: MOCK_USERS.alex.id,
    seller: MOCK_USERS.alex,
    createdAt: new Date("2026-04-12T08:00:00Z"),
    updatedAt: new Date("2026-04-12T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-python-hunter",
    title: "Self-Reflective Python Bug Hunter",
    slug: "self-reflective-python-bug-hunter",
    description: "A developer's dream. Instructs LLMs to scan Python scripts for memory leaks, architectural flaws, complexity bottlenecks, and edge-cases, producing a complete diagnostic report with side-by-side corrected refactoring blocks.",
    type: ProductType.PROMPT,
    category: "Development",
    subcategory: "Debugging",
    tags: ["Python", "Debugging", "Code Review", "Linter", "Refactor"],
    price: 1500,
    isFree: false,
    previewContent: "Analyze the provided Python code under standard strict formatting rules. You must construct a formal abstract syntax tree (AST) mock mentally, checking variables, scope leaks, global usage, and time complexity.",
    assetKey: "prompts/python-bug-hunter.txt",
    previewImages: ["https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: "Claude 3.5 Sonnet",
    language: null,
    framework: null,
    metadata: {
      tokensCount: "2,800 tokens",
      instructionLevel: "Advanced",
      idealUseCases: ["Pre-commit review automation", "Algorithm optimization", "Syntax and type debugging"]
    },
    downloadCount: 89,
    viewCount: 780,
    sellerId: MOCK_USERS.alex.id,
    seller: MOCK_USERS.alex,
    createdAt: new Date("2026-04-15T08:00:00Z"),
    updatedAt: new Date("2026-04-15T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-dnd-dm",
    title: "Interactive AI Dungeons and Dragons DM Prompt",
    slug: "interactive-ai-dungeons-and-dragons-dm-prompt",
    description: "A creative, comprehensive system prompt that transforms your LLM into a seasoned Dungeons & Dragons 5e Dungeon Master. Tracks inventory, enforces rules, generates gorgeous narrative arcs, and prompts combat checks smoothly.",
    type: ProductType.PROMPT,
    category: "Entertainment",
    subcategory: "Creative Writing",
    tags: ["D&D", "Gaming", "Storytelling", "RPG", "Fun"],
    price: 0,
    isFree: true,
    previewContent: "Greetings, traveler! You are the Dungeon Master for a standard D&D 5e campaign. Act as the environment, characters, and monsters. When active checks are required, instruct the player to roll a d20.",
    assetKey: "prompts/dnd-dm.txt",
    previewImages: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: "GPT-4o / Gemini Pro",
    language: null,
    framework: null,
    metadata: {
      tokensCount: "3,100 tokens",
      instructionLevel: "All Levels",
      idealUseCases: ["Solo RPG gaming", "Creative campaign brainstorming", "NPC dialogues"]
    },
    downloadCount: 942,
    viewCount: 4520,
    sellerId: MOCK_USERS.alex.id,
    seller: MOCK_USERS.alex,
    createdAt: new Date("2026-04-20T08:00:00Z"),
    updatedAt: new Date("2026-04-20T08:00:00Z"),
    reviews: []
  },

  // --- 4 Skills / Workflows (Seller: Sarah Chen) ---
  {
    id: "prod-stripe-discord",
    title: "Stripe-to-Discord Financial Analytics Sync",
    slug: "stripe-to-discord-financial-analytics-sync",
    description: "A complete, production-ready n8n/workflow blueprint that monitors Stripe webhook events, aggregates daily summaries, calculates refunds and platform fees, and sends a styled, color-coded embed statement to your Discord channel.",
    type: ProductType.SKILL,
    category: "Automation",
    subcategory: "Financial Tools",
    tags: ["n8n", "Stripe", "Discord", "Webhooks", "Business Analytics"],
    price: 2900,
    isFree: false,
    previewContent: "{\n  \"nodes\": [\n    {\n      \"parameters\": {\n        \"path\": \"stripe-payout-webhook\",\n        \"options\": {}\n      },\n      \"id\": \"node-stripe-webhook\",\n      \"name\": \"Stripe Webhook Listener\",\n      \"type\": \"n8n-nodes-base.webhook\"\n    }\n  ]\n}",
    assetKey: "skills/stripe-discord-sync.json",
    previewImages: ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: null,
    framework: null,
    metadata: {
      compatibleTools: ["n8n", "Stripe CLI", "Discord API"],
      triggerType: "Webhook HTTP Post Listener",
      inputFormat: "Stripe JSON webhook payload",
      outputFormat: "Discord Rich embed notification payload"
    },
    downloadCount: 84,
    viewCount: 654,
    sellerId: MOCK_USERS.sarah.id,
    seller: MOCK_USERS.sarah,
    createdAt: new Date("2026-04-11T08:00:00Z"),
    updatedAt: new Date("2026-04-11T08:00:00Z"),
    reviews: [MOCK_REVIEWS[1]]
  },
  {
    id: "prod-yt-transcribe",
    title: "Automated YouTube-to-TikTok Video Transcriber",
    slug: "automated-youtube-to-tiktok-video-transcriber",
    description: "A modular, advanced automation pipeline that monitors YouTube video uploads, extracts audio using ffmpeg, calls Whisper API for transcription, isolates punchy segments, drafts captions, and uploads them to a social media deck.",
    type: ProductType.SKILL,
    category: "Marketing",
    subcategory: "Content Pipelines",
    tags: ["Whisper API", "Automation", "Video Decks", "YouTube", "TikTok"],
    price: 4900,
    isFree: false,
    previewContent: "# YouTube to TikTok pipeline initialization\n# Step 1: Detect video RSS feed updates\n# Step 2: Invoke yt-dlp to download audio stream\n# Step 3: Call Whisper Transcribe endpoint",
    assetKey: "skills/yt-tiktok-transcriber.zip",
    previewImages: ["https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: null,
    framework: null,
    metadata: {
      compatibleTools: ["Make.com (Integromat)", "Whisper API", "yt-dlp", "Dropbox"],
      triggerType: "RSS Feed Check (Hourly polling)",
      inputFormat: "YouTube RSS Feed URL",
      outputFormat: "Short form video with SRT captions file"
    },
    downloadCount: 45,
    viewCount: 498,
    sellerId: MOCK_USERS.sarah.id,
    seller: MOCK_USERS.sarah,
    createdAt: new Date("2026-04-18T08:00:00Z"),
    updatedAt: new Date("2026-04-18T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-support-bot",
    title: "AI Customer Support Ticket Auto-Categorizer",
    slug: "ai-customer-support-ticket-auto-categorizer",
    description: "Connect this workflow to your Zendesk or email account. Using semantic analysis, it reads incoming tickets, assigns a priority and category (Billing, Technical, Bug, Sales), and drafts draft replies automatically.",
    type: ProductType.SKILL,
    category: "Automation",
    subcategory: "Customer Success",
    tags: ["Zendesk", "Make.com", "OpenAI", "Email Support", "SaaS"],
    price: 3400,
    isFree: false,
    previewContent: "Trigger: New Support Ticket received -> Action: Fetch email body -> Action: Execute OpenAI classification prompt -> Conditional: If Priority == High -> Action: Trigger Slack alert & save draft.",
    assetKey: "skills/support-categorizer.json",
    previewImages: ["https://images.unsplash.com/photo-1521791136366-3e550479bde8?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: null,
    framework: null,
    metadata: {
      compatibleTools: ["Make.com", "Zendesk API", "OpenAI Chat Completions"],
      triggerType: "Instant Webhook trigger on new ticket",
      inputFormat: "Zendesk standard ticket object JSON",
      outputFormat: "Ticket classification tags and auto-draft reply"
    },
    downloadCount: 112,
    viewCount: 920,
    sellerId: MOCK_USERS.sarah.id,
    seller: MOCK_USERS.sarah,
    createdAt: new Date("2026-04-22T08:00:00Z"),
    updatedAt: new Date("2026-04-22T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-github-action",
    title: "GitHub Pull Request Automatic AI Code Reviewer",
    slug: "github-pull-request-automatic-ai-code-reviewer",
    description: "A free GitHub action workflow that listens to pull requests, scans modified files, checks security and complexity guidelines, and posts inline Markdown remarks directly on the PR dashboard.",
    type: ProductType.SKILL,
    category: "Development",
    subcategory: "GitHub Actions",
    tags: ["GitHub Actions", "CI/CD", "JavaScript", "Code Quality", "OpenAI"],
    price: 0,
    isFree: true,
    previewContent: "name: AI PR Reviewer\non:\n  pull_request:\n    types: [opened, synchronize]\njobs:\n  review:\n    runs-on: ubuntu-latest\n    steps:\n      - name: PR review code check",
    assetKey: "skills/github-pr-reviewer.yaml",
    previewImages: ["https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: null,
    framework: null,
    metadata: {
      compatibleTools: ["GitHub Actions runner", "OpenAI API Key"],
      triggerType: "Pull Request webhook synchronizer",
      inputFormat: "Git diff blocks",
      outputFormat: "Markdown formatted GitHub comment on modified lines"
    },
    downloadCount: 384,
    viewCount: 1890,
    sellerId: MOCK_USERS.sarah.id,
    seller: MOCK_USERS.sarah,
    createdAt: new Date("2026-04-25T08:00:00Z"),
    updatedAt: new Date("2026-04-25T08:00:00Z"),
    reviews: []
  },

  // --- 4 Code Snippets/Templates (Seller: Devon Miller) ---
  {
    id: "prod-dashboard-code",
    title: "Next.js 14 Clean Dashboard Boilerplate",
    slug: "nextjs-14-clean-dashboard-boilerplate",
    description: "A premium, fully typed dashboard boilerplate utilizing Next.js 14 App Router, dynamic routing, Tailwind CSS v3, and beautifully configured layouts with charts, sidebar navigation, custom search filters, and responsive layout.",
    type: ProductType.CODE,
    category: "Development",
    subcategory: "Boilerplates",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dashboard", "SaaS Boilerplate"],
    price: 3900,
    isFree: false,
    previewContent: "import React from 'react';\nimport Sidebar from '@/components/sidebar';\nimport Header from '@/components/header';\n\nexport default function DashboardLayout({ children }) {\n  return (\n    <div className=\"flex min-h-screen bg-zinc-950\">\n      <Sidebar />\n      <div className=\"flex-1\">\n        <Header />\n        <main className=\"p-6\">{children}</main>\n      </div>\n    </div>\n  );\n}",
    assetKey: "code/nextjs-dashboard.zip",
    previewImages: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: "TypeScript",
    framework: "Next.js 14 (App Router)",
    metadata: {
      dependenciesList: ["react@^18", "lucide-react", "clsx", "tailwind-merge", "chart.js"],
      compatibilityNotes: "Node 18.x or 20.x LTS. Fully supports edge runtime configurations."
    },
    downloadCount: 201,
    viewCount: 1540,
    sellerId: MOCK_USERS.devon.id,
    seller: MOCK_USERS.devon,
    createdAt: new Date("2026-04-12T08:00:00Z"),
    updatedAt: new Date("2026-04-12T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-geo-api",
    title: "Ultra-Fast Serverless IP Geo-Lookup Route",
    slug: "ultra-fast-serverless-ip-geo-lookup-route",
    description: "An Edge-compatible API route for Next.js or Cloudflare Workers that performs lightning-fast IP geo-location queries without external API dependencies using a local binary db, returning latency metrics in under 5ms.",
    type: ProductType.CODE,
    category: "Development",
    subcategory: "Serverless APIs",
    tags: ["Edge Runtime", "Cloudflare Workers", "Serverless API", "IP lookup"],
    price: 1200,
    isFree: false,
    previewContent: "export const runtime = 'edge';\n\nexport async function GET(request: Request) {\n  const ip = request.headers.get('x-real-ip') || '8.8.8.8';\n  // Query fast local binary tree database...\n  return new Response(JSON.stringify({ ip, country: 'US', city: 'Mountain View' }));\n}",
    assetKey: "code/ip-geo-lookup.zip",
    previewImages: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: "TypeScript / JavaScript",
    framework: "Next.js / Cloudflare Workers",
    metadata: {
      dependenciesList: ["ip-range-check", "fast-geoip-database"],
      compatibilityNotes: "Fully Edge-compatible. Extremely lightweight."
    },
    downloadCount: 54,
    viewCount: 420,
    sellerId: MOCK_USERS.devon.id,
    seller: MOCK_USERS.devon,
    createdAt: new Date("2026-04-19T08:00:00Z"),
    updatedAt: new Date("2026-04-19T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-ui-kit",
    title: "Responsive Premium Glassmorphism Component Library",
    slug: "responsive-premium-glassmorphism-component-library",
    description: "A gorgeous collection of 25+ dark-mode Tailwind CSS glassmorphic React components including cards, interactive sliders, modals, pricing grids, pricing tables, pricing lists, buttons, and layouts with detailed animations.",
    type: ProductType.CODE,
    category: "Design Systems",
    subcategory: "UI Kits",
    tags: ["Tailwind CSS", "React Components", "UI Kit", "Glassmorphism", "Dark Mode"],
    price: 2400,
    isFree: false,
    previewContent: "export const GlassCard = ({ children, className }) => {\n  return (\n    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-all hover:border-white/20 ${className}`}>\n      {children}\n    </div>\n  );\n}",
    assetKey: "code/glassmorphism-components.zip",
    previewImages: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: "JSX / TSX",
    framework: "React / Tailwind CSS v3",
    metadata: {
      dependenciesList: ["react", "lucide-react", "framer-motion"],
      compatibilityNotes: "Compatible with standard Tailwind configurations without extra builds."
    },
    downloadCount: 124,
    viewCount: 1100,
    sellerId: MOCK_USERS.devon.id,
    seller: MOCK_USERS.devon,
    createdAt: new Date("2026-04-26T08:00:00Z"),
    updatedAt: new Date("2026-04-26T08:00:00Z"),
    reviews: []
  },
  {
    id: "prod-jwt-route",
    title: "Clean JWT Authentication Route Template",
    slug: "clean-jwt-authentication-route-template",
    description: "A free, production-ready backend script implementing clean JSON Web Token (JWT) authorization flows with token signatures, refresh tokens in httpOnly cookies, password hashing with bcrypt, and express-rate-limit safeguards.",
    type: ProductType.CODE,
    category: "Development",
    subcategory: "Security",
    tags: ["Express", "Node.js", "JWT", "Auth API", "Security", "Bcrypt"],
    price: 0,
    isFree: true,
    previewContent: "const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcryptjs');\n\nconst loginHandler = async (req, res) => {\n  const { email, password } = req.body;\n  // Verify email & password -> Generate accessToken & httpOnly refreshToken...\n}",
    assetKey: "code/jwt-auth-template.zip",
    previewImages: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"],
    status: ProductStatus.PUBLISHED,
    targetModel: null,
    language: "JavaScript (Node.js)",
    framework: "Express.js",
    metadata: {
      dependenciesList: ["express", "jsonwebtoken", "bcryptjs", "cookie-parser"],
      compatibilityNotes: "Can be adapted to any standard Node.js routing server."
    },
    downloadCount: 520,
    viewCount: 2980,
    sellerId: MOCK_USERS.devon.id,
    seller: MOCK_USERS.devon,
    createdAt: new Date("2026-04-29T08:00:00Z"),
    updatedAt: new Date("2026-04-29T08:00:00Z"),
    reviews: []
  }
]

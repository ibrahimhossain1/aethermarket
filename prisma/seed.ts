import { PrismaClient, UserRole, ProductType, ProductStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // 1. Clean up database
  console.log("🧹 Cleaning up existing data...")
  await prisma.notification.deleteMany()
  await prisma.savedProduct.deleteMany()
  await prisma.review.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // 2. Hash default password "password123"
  const hashedPassword = await bcrypt.hash("password123", 10)

  // 3. Create Sellers
  console.log("👤 Creating seller accounts...")
  
  const seller1 = await prisma.user.create({
    data: {
      email: "alex@promptwizard.ai",
      password: hashedPassword,
      name: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      role: UserRole.SELLER,
      bio: "Advanced AI Prompter and LLM Engineer. Specializes in prompt engineering, cognitive modeling, and multi-agent system orchestrations.",
      website: "https://promptwizard.ai",
      stripeAccountId: "acct_1promptwizard001",
      stripeCustomerId: "cus_alexbuyer1",
      emailVerified: new Date(),
    }
  })

  const seller2 = await prisma.user.create({
    data: {
      email: "sarah@workflowguru.io",
      password: hashedPassword,
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
      role: UserRole.SELLER,
      bio: "Full stack automation expert. Architecting modular reusable skills, n8n orchestrations, and automated cognitive pipelines for business efficiency.",
      website: "https://workflowguru.io",
      stripeAccountId: "acct_1workflowguru002",
      stripeCustomerId: "cus_sarahbuyer2",
      emailVerified: new Date(),
    }
  })

  const seller3 = await prisma.user.create({
    data: {
      email: "devon@codecraft.dev",
      password: hashedPassword,
      name: "Devon Miller",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
      role: UserRole.SELLER,
      bio: "Veteran Next.js & React engineer. Crafting premium serverless boilerplates, custom Tailwind components, and high-performance API architectures.",
      website: "https://codecraft.dev",
      stripeAccountId: "acct_1codecraft003",
      stripeCustomerId: "cus_devonbuyer3",
      emailVerified: new Date(),
    }
  })

  // 4. Create an Admin Account
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aether.market",
      password: hashedPassword,
      name: "Aether Administrator",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80",
      role: UserRole.ADMIN,
      bio: "Lead moderator and technical systems architect of Aether Marketplace.",
      emailVerified: new Date(),
    }
  })

  // 5. Create a Standard Buyer
  const buyerUser = await prisma.user.create({
    data: {
      email: "buyer@gmail.com",
      password: hashedPassword,
      name: "John Doe",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80",
      role: UserRole.BUYER,
      bio: "Indie hacker and generative AI enthusiast seeking workflows and quick code blocks to accelerate product development.",
      stripeCustomerId: "cus_johnbuyer4",
      emailVerified: new Date(),
    }
  })

  console.log("🛍️ Creating 12 premium products...")

  // --- 4 Prompts (Seller: Alex Rivera) ---
  const prompt1 = await prisma.product.create({
    data: {
      title: "Cognitive Multi-Agent Architect Prompt",
      slug: "cognitive-multi-agent-architect-prompt",
      description: "An advanced, system-prompt instruction set that converts any LLM into a multi-agent orchestration engine. Perfect for modeling systems, generating task hierarchies, self-correction strategies, and debugging complex instructions automatically.",
      type: ProductType.PROMPT,
      category: "Development",
      subcategory: "Agentic Systems",
      tags: ["GPT-4o", "Claude 3.5 Sonnet", "Agentic", "System Prompt", "Engineering"],
      price: 1900, // $19.00
      isFree: false,
      previewContent: "You are the Cognitive Agentic Orchestrator (CAO). Your primary objective is to decompose the user's micro-tasks into sub-agent specifications. Establish cognitive loops, self-evaluation cycles, and verification checkpoints before producing final outputs.",
      assetKey: "prompts/cognitive-agent.txt",
      previewImages: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      targetModel: "Claude 3.5 Sonnet & GPT-4o",
      metadata: {
        tokensCount: "4,500 tokens",
        instructionLevel: "Advanced",
        idealUseCases: ["Software Architecture Decompositions", "Debugging pipelines", "Autonomous agent configurations"]
      },
      sellerId: seller1.id,
    }
  })

  const prompt2 = await prisma.product.create({
    data: {
      title: "Master copywriter - Persuasive Sales Funnels Prompt",
      slug: "master-copywriter-persuasive-sales-funnels-prompt",
      description: "A highly engineered prompt designed to generate high-converting email lists, landing pages, and ad hooks using psychological principles like scarcity, reciprocity, social proof, and emotional targeting.",
      type: ProductType.PROMPT,
      category: "Marketing",
      subcategory: "Copywriting",
      tags: ["Copywriting", "Sales Funnels", "ChatGPT", "Email Marketing"],
      price: 900, // $9.00
      isFree: false,
      previewContent: "ROLE: Master Copywriter specialized in Robert Cialdini's Persuasion Principles. TASK: Deconstruct the product profile provided and draft a 5-part email series focusing on a problem-agitate-solve framework.",
      assetKey: "prompts/master-copywriter.txt",
      previewImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      targetModel: "GPT-4o / Claude 3 Opus",
      metadata: {
        tokensCount: "1,200 tokens",
        instructionLevel: "Intermediate",
        idealUseCases: ["Email sequences", "Sales page drafts", "PPC ad variations"]
      },
      sellerId: seller1.id,
    }
  })

  const prompt3 = await prisma.product.create({
    data: {
      title: "Self-Reflective Python Bug Hunter",
      slug: "self-reflective-python-bug-hunter",
      description: "A developer's dream. Instructs LLMs to scan Python scripts for memory leaks, architectural flaws, complexity bottlenecks, and edge-cases, producing a complete diagnostic report with side-by-side corrected refactoring blocks.",
      type: ProductType.PROMPT,
      category: "Development",
      subcategory: "Debugging",
      tags: ["Python", "Debugging", "Code Review", "Linter", "Refactor"],
      price: 1500, // $15.00
      isFree: false,
      previewContent: "Analyze the provided Python code under standard strict formatting rules. You must construct a formal abstract syntax tree (AST) mock mentally, checking variables, scope leaks, global usage, and time complexity.",
      assetKey: "prompts/python-bug-hunter.txt",
      previewImages: ["https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      targetModel: "Claude 3.5 Sonnet",
      metadata: {
        tokensCount: "2,800 tokens",
        instructionLevel: "Advanced",
        idealUseCases: ["Pre-commit review automation", "Algorithm optimization", "Syntax and type debugging"]
      },
      sellerId: seller1.id,
    }
  })

  const prompt4 = await prisma.product.create({
    data: {
      title: "Interactive AI Dungeons and Dragons DM Prompt",
      slug: "interactive-ai-dungeons-and-dragons-dm-prompt",
      description: "A creative, comprehensive system prompt that transforms your LLM into a seasoned Dungeons & Dragons 5e Dungeon Master. Tracks inventory, enforces rules, generates gorgeous narrative arcs, and prompts combat checks smoothly.",
      type: ProductType.PROMPT,
      category: "Entertainment",
      subcategory: "Creative Writing",
      tags: ["D&D", "Gaming", "Storytelling", "RPG", "Fun"],
      price: 0, // FREE
      isFree: true,
      previewContent: "Greetings, traveler! You are the Dungeon Master for a standard D&D 5e campaign. Act as the environment, characters, and monsters. When active checks are required, instruct the player to roll a d20.",
      assetKey: "prompts/dnd-dm.txt",
      previewImages: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      targetModel: "GPT-4o / Gemini Pro",
      metadata: {
        tokensCount: "3,100 tokens",
        instructionLevel: "All Levels",
        idealUseCases: ["Solo RPG gaming", "Creative campaign brainstorming", "NPC dialogues"]
      },
      sellerId: seller1.id,
    }
  })

  // --- 4 Skills / Workflows (Seller: Sarah Chen) ---
  const skill1 = await prisma.product.create({
    data: {
      title: "Stripe-to-Discord Financial Analytics Sync",
      slug: "stripe-to-discord-financial-analytics-sync",
      description: "A complete, production-ready n8n/workflow blueprint that monitors Stripe webhook events, aggregates daily summaries, calculates refunds and platform fees, and sends a styled, color-coded embed statement to your Discord channel.",
      type: ProductType.SKILL,
      category: "Automation",
      subcategory: "Financial Tools",
      tags: ["n8n", "Stripe", "Discord", "Webhooks", "Business Analytics"],
      price: 2900, // $29.00
      isFree: false,
      previewContent: "{\n  \"nodes\": [\n    {\n      \"parameters\": {\n        \"path\": \"stripe-payout-webhook\",\n        \"options\": {}\n      },\n      \"id\": \"node-stripe-webhook\",\n      \"name\": \"Stripe Webhook Listener\",\n      \"type\": \"n8n-nodes-base.webhook\"\n    }\n  ]\n}",
      assetKey: "skills/stripe-discord-sync.json",
      previewImages: ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      metadata: {
        compatibleTools: ["n8n", "Stripe CLI", "Discord API"],
        triggerType: "Webhook HTTP Post Listener",
        inputFormat: "Stripe JSON webhook payload",
        outputFormat: "Discord Rich embed notification payload"
      },
      sellerId: seller2.id,
    }
  })

  const skill2 = await prisma.product.create({
    data: {
      title: "Automated YouTube-to-TikTok Video Transcriber",
      slug: "automated-youtube-to-tiktok-video-transcriber",
      description: "A modular, advanced automation pipeline that monitors YouTube video uploads, extracts audio using ffmpeg, calls Whisper API for transcription, isolates punchy segments, drafts captions, and uploads them to a social media deck.",
      type: ProductType.SKILL,
      category: "Marketing",
      subcategory: "Content Pipelines",
      tags: ["Whisper API", "Automation", "Video Decks", "YouTube", "TikTok"],
      price: 4900, // $49.00
      isFree: false,
      previewContent: "# YouTube to TikTok pipeline initialization\n# Step 1: Detect video RSS feed updates\n# Step 2: Invoke yt-dlp to download audio stream\n# Step 3: Call Whisper Transcribe endpoint",
      assetKey: "skills/yt-tiktok-transcriber.zip",
      previewImages: ["https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      metadata: {
        compatibleTools: ["Make.com (Integromat)", "Whisper API", "yt-dlp", "Dropbox"],
        triggerType: "RSS Feed Check (Hourly polling)",
        inputFormat: "YouTube RSS Feed URL",
        outputFormat: "Short form video with SRT captions file"
      },
      sellerId: seller2.id,
    }
  })

  const skill3 = await prisma.product.create({
    data: {
      title: "AI Customer Support Ticket Auto-Categorizer",
      slug: "ai-customer-support-ticket-auto-categorizer",
      description: "Connect this workflow to your Zendesk or email account. Using semantic analysis, it reads incoming tickets, assigns a priority and category (Billing, Technical, Bug, Sales), and drafts draft replies automatically.",
      type: ProductType.SKILL,
      category: "Automation",
      subcategory: "Customer Success",
      tags: ["Zendesk", "Make.com", "OpenAI", "Email Support", "SaaS"],
      price: 3400, // $34.00
      isFree: false,
      previewContent: "Trigger: New Support Ticket received -> Action: Fetch email body -> Action: Execute OpenAI classification prompt -> Conditional: If Priority == High -> Action: Trigger Slack alert & save draft.",
      assetKey: "skills/support-categorizer.json",
      previewImages: ["https://images.unsplash.com/photo-1521791136366-3e550479bde8?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      metadata: {
        compatibleTools: ["Make.com", "Zendesk API", "OpenAI Chat Completions"],
        triggerType: "Instant Webhook trigger on new ticket",
        inputFormat: "Zendesk standard ticket object JSON",
        outputFormat: "Ticket classification tags and auto-draft reply"
      },
      sellerId: seller2.id,
    }
  })

  const skill4 = await prisma.product.create({
    data: {
      title: "GitHub Pull Request Automatic AI Code Reviewer",
      slug: "github-pull-request-automatic-ai-code-reviewer",
      description: "A free GitHub action workflow that listens to pull requests, scans modified files, checks security and complexity guidelines, and posts inline Markdown remarks directly on the PR dashboard.",
      type: ProductType.SKILL,
      category: "Development",
      subcategory: "GitHub Actions",
      tags: ["GitHub Actions", "CI/CD", "JavaScript", "Code Quality", "OpenAI"],
      price: 0, // FREE
      isFree: true,
      previewContent: "name: AI PR Reviewer\non:\n  pull_request:\n    types: [opened, synchronize]\njobs:\n  review:\n    runs-on: ubuntu-latest\n    steps:\n      - name: PR review code check",
      assetKey: "skills/github-pr-reviewer.yaml",
      previewImages: ["https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      metadata: {
        compatibleTools: ["GitHub Actions runner", "OpenAI API Key"],
        triggerType: "Pull Request webhook synchronizer",
        inputFormat: "Git diff blocks",
        outputFormat: "Markdown formatted GitHub comment on modified lines"
      },
      sellerId: seller2.id,
    }
  })

  // --- 4 Code Snippets/Templates (Seller: Devon Miller) ---
  const code1 = await prisma.product.create({
    data: {
      title: "Next.js 14 Clean Dashboard Boilerplate",
      slug: "nextjs-14-clean-dashboard-boilerplate",
      description: "A premium, fully typed dashboard boilerplate utilizing Next.js 14 App Router, dynamic routing, Tailwind CSS v3, and beautifully configured layouts with charts, sidebar navigation, custom search filters, and responsive layout.",
      type: ProductType.CODE,
      category: "Development",
      subcategory: "Boilerplates",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dashboard", "SaaS Boilerplate"],
      price: 3900, // $39.00
      isFree: false,
      previewContent: "import React from 'react';\nimport Sidebar from '@/components/sidebar';\nimport Header from '@/components/header';\n\nexport default function DashboardLayout({ children }) {\n  return (\n    <div className=\"flex min-h-screen bg-zinc-950\">\n      <Sidebar />\n      <div className=\"flex-1\">\n        <Header />\n        <main className=\"p-6\">{children}</main>\n      </div>\n    </div>\n  );\n}",
      assetKey: "code/nextjs-dashboard.zip",
      previewImages: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      language: "TypeScript",
      framework: "Next.js 14 (App Router)",
      metadata: {
        dependenciesList: ["react@^18", "lucide-react", "clsx", "tailwind-merge", "chart.js"],
        compatibilityNotes: "Node 18.x or 20.x LTS. Fully supports edge runtime configurations."
      },
      sellerId: seller3.id,
    }
  })

  const code2 = await prisma.product.create({
    data: {
      title: "Ultra-Fast Serverless IP Geo-Lookup Route",
      slug: "ultra-fast-serverless-ip-geo-lookup-route",
      description: "An Edge-compatible API route for Next.js or Cloudflare Workers that performs lightning-fast IP geo-location queries without external API dependencies using a local binary db, returning latency metrics in under 5ms.",
      type: ProductType.CODE,
      category: "Development",
      subcategory: "Serverless APIs",
      tags: ["Edge Runtime", "Cloudflare Workers", "Serverless API", "IP lookup"],
      price: 1200, // $12.00
      isFree: false,
      previewContent: "export const runtime = 'edge';\n\nexport async function GET(request: Request) {\n  const ip = request.headers.get('x-real-ip') || '8.8.8.8';\n  // Query fast local binary tree database...\n  return new Response(JSON.stringify({ ip, country: 'US', city: 'Mountain View' }));\n}",
      assetKey: "code/ip-geo-lookup.zip",
      previewImages: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      language: "TypeScript / JavaScript",
      framework: "Next.js / Cloudflare Workers",
      metadata: {
        dependenciesList: ["ip-range-check", "fast-geoip-database"],
        compatibilityNotes: "Fully Edge-compatible. Extremely lightweight."
      },
      sellerId: seller3.id,
    }
  })

  const code3 = await prisma.product.create({
    data: {
      title: "Responsive Premium Glassmorphism Component Library",
      slug: "responsive-premium-glassmorphism-component-library",
      description: "A gorgeous collection of 25+ dark-mode Tailwind CSS glassmorphic React components including cards, interactive sliders, modals, pricing grids, buttons, and layouts with detailed animations.",
      type: ProductType.CODE,
      category: "Design Systems",
      subcategory: "UI Kits",
      tags: ["Tailwind CSS", "React Components", "UI Kit", "Glassmorphism", "Dark Mode"],
      price: 2400, // $24.00
      isFree: false,
      previewContent: "export const GlassCard = ({ children, className }) => {\n  return (\n    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-all hover:border-white/20 ${className}`}>\n      {children}\n    </div>\n  );\n}",
      assetKey: "code/glassmorphism-components.zip",
      previewImages: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      language: "JSX / TSX",
      framework: "React / Tailwind CSS v3",
      metadata: {
        dependenciesList: ["react", "lucide-react", "framer-motion"],
        compatibilityNotes: "Compatible with standard Tailwind configurations without extra builds."
      },
      sellerId: seller3.id,
    }
  })

  const code4 = await prisma.product.create({
    data: {
      title: "Clean JWT Authentication Route Template",
      slug: "clean-jwt-authentication-route-template",
      description: "A free, production-ready backend script implementing clean JSON Web Token (JWT) authorization flows with token signatures, refresh tokens in httpOnly cookies, password hashing with bcrypt, and express-rate-limit safeguards.",
      type: ProductType.CODE,
      category: "Development",
      subcategory: "Security",
      tags: ["Express", "Node.js", "JWT", "Auth API", "Security", "Bcrypt"],
      price: 0, // FREE
      isFree: true,
      previewContent: "const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcryptjs');\n\nconst loginHandler = async (req, res) => {\n  const { email, password } = req.body;\n  // Verify email & password -> Generate accessToken & httpOnly refreshToken...\n}",
      assetKey: "code/jwt-auth-template.zip",
      previewImages: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"],
      status: ProductStatus.PUBLISHED,
      language: "JavaScript (Node.js)",
      framework: "Express.js",
      metadata: {
        dependenciesList: ["express", "jsonwebtoken", "bcryptjs", "cookie-parser"],
        compatibilityNotes: "Can be adapted to any standard Node.js routing server."
      },
      sellerId: seller3.id,
    }
  })

  // 6. Create Purchases
  console.log("💳 Creating mock purchase records...")
  
  // Buyer John Doe buys prompt1
  await prisma.purchase.create({
    data: {
      buyerId: buyerUser.id,
      productId: prompt1.id,
      stripePaymentIntentId: "pi_mock11111111",
      amount: prompt1.price,
      platformFee: Math.round(prompt1.price * 0.15),
      refunded: false,
    }
  })

  // Buyer John Doe buys skill1
  await prisma.purchase.create({
    data: {
      buyerId: buyerUser.id,
      productId: skill1.id,
      stripePaymentIntentId: "pi_mock22222222",
      amount: skill1.price,
      platformFee: Math.round(skill1.price * 0.15),
      refunded: false,
    }
  })

  // Buyer John Doe buys code1
  await prisma.purchase.create({
    data: {
      buyerId: buyerUser.id,
      productId: code1.id,
      stripePaymentIntentId: "pi_mock33333333",
      amount: code1.price,
      platformFee: Math.round(code1.price * 0.15),
      refunded: false,
    }
  })

  // 7. Create Reviews
  console.log("⭐ Generating verified reviews & replies...")
  
  await prisma.review.create({
    data: {
      buyerId: buyerUser.id,
      productId: prompt1.id,
      rating: 5,
      body: "This prompt completely changed how I organize my automated LLM pipelines! The multi-agent decomposing logic is flawless and saves me hours of manual instruction modeling.",
      sellerReply: "Thank you so much John! Extremely glad that the agentic cognitive loop is helping in your pipelines. Let me know if you need any customizations for larger models!",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  })

  await prisma.review.create({
    data: {
      buyerId: buyerUser.id,
      productId: skill1.id,
      rating: 4,
      body: "Excellent n8n blueprint. It mapped Stripe webhooks to my Discord server in less than 5 minutes. The daily aggregates calculation is incredibly helpful. Dropped 1 star because Discord embeds wrap weird on vertical mobile monitors.",
      sellerReply: "Hey John! Thanks for the review. That wrap issue is due to Discord's field rendering. I will update the blueprint next week to use shorter bullet points to solve vertical spacing!",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
  })

  // 8. Create Saved Products (Wishlists)
  console.log("💖 Generating wishlist bookmarks...")
  await prisma.savedProduct.create({
    data: {
      userId: buyerUser.id,
      productId: prompt3.id,
    }
  })

  await prisma.savedProduct.create({
    data: {
      userId: buyerUser.id,
      productId: code3.id,
    }
  })

  // 9. Create Notifications
  console.log("🔔 Distributing in-app notifications...")
  await prisma.notification.create({
    data: {
      userId: seller1.id,
      type: "SALE",
      message: "Congratulations! You made a sale! John Doe purchased 'Cognitive Multi-Agent Architect Prompt' for $19.00.",
      link: "/seller/dashboard",
      read: false,
    }
  })

  await prisma.notification.create({
    data: {
      userId: seller2.id,
      type: "SALE",
      message: "Congratulations! You made a sale! John Doe purchased 'Stripe-to-Discord Financial Analytics Sync' for $29.00.",
      link: "/seller/dashboard",
      read: false,
    }
  })

  await prisma.notification.create({
    data: {
      userId: seller1.id,
      type: "REVIEW",
      message: "New 5-star review left by John Doe on 'Cognitive Multi-Agent Architect Prompt'.",
      link: "/marketplace/cognitive-multi-agent-architect-prompt",
      read: true,
    }
  })

  console.log("🏁 Database successfully seeded!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

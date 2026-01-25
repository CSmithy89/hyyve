# Marketplace Economics & Revenue Models Research
## Hyyve Platform - Business Research Document

**Date:** January 20, 2026
**Verification Status:** ✅ Verified (2026-01-21)
**Research Focus:** B2B2C Marketplace Economics for AI Agent/Workflow Platform
**Model:** Platform enables creators to sell AI agents, modules, and workflows; agencies serve clients; platform takes revenue share

---

## Table of Contents

1. [Marketplace Platform Case Studies](#1-marketplace-platform-case-studies)
2. [Revenue Share Model Comparison](#2-revenue-share-model-comparison)
3. [AI Agent Pricing Strategies](#3-ai-agent-pricing-strategies)
4. [Stripe Connect Implementation Guide](#4-stripe-connect-implementation-guide)
5. [Creator Incentive Programs](#5-creator-incentive-programs)
6. [Trust & Quality Systems](#6-trust--quality-systems)
7. [Discovery & Distribution](#7-discovery--distribution)
8. [Module Licensing Models](#8-module-licensing-models)
9. [B2B2C Specific Considerations](#9-b2b2c-specific-considerations)
10. [Financial Projections Framework](#10-financial-projections-framework)
11. [Recommendations for Hyyve Platform](#11-recommendations-for-hyyve-platform)

---

## 1. Marketplace Platform Case Studies

### 1.1 Shopify App Store

**Overview:** The gold standard for B2B2C app marketplaces enabling commerce.

**Revenue Share Model (Updated 2025):**
- **First $1M lifetime earnings:** 0% revenue share (previously reset annually)
- **Above $1M:** 15% revenue share (with $19 one-time registration fee)
- **Default rate:** 20% for developers who don't register for reduced rate
- Revenue share calculated on **gross app revenue**
- Aggregated at Partner level across all apps and associated accounts

**Key Change (2025):** The $1M exemption is now a **lifetime cap** rather than annual reset, significantly impacting long-term developer economics.

**Calculation Example:**
- Developer earning $50K/month hits $1M cap in month 20
- Month 21 onwards: $50,000 x 15% = $7,500/month to Shopify

**Sources:**
- [Shopify Revenue Share Documentation](https://shopify.dev/docs/apps/launch/distribution/revenue-share)
- [Shopify Partner Program Agreement FAQ (2025 update)](https://help.shopify.com/en/partners/faq/ppa)
- [Shopify Developer Changelog: Revenue Share Update](https://shopify.dev/changelog/update-to-shopifys-app-developer-revenue-share)

---

### 1.2 Gumroad

**Overview:** Creator-first platform for selling digital products with simple, transparent pricing.

**Fee Structure:**
| Fee Type | Rate | Notes |
|----------|------|-------|
| Platform Fee (direct sales) | 10% + $0.50 | Applies to sales via profile/direct links |
| Card Processing | 2.9% + $0.30 | Additional to platform fee (card payments) |
| PayPal Processing | PayPal rates | Additional to platform fee |
| Discover Marketplace | 30% | Flat fee that includes processing |

**Effective Total Fee (Direct, card):** ~12.9% + $0.80 per sale

**Creator Example (Direct, card):**
- $100 sale = $86.30 net before taxes (10% + $0.50 + 2.9% + $0.30)

**Creator Example (Discover):**
- $100 sale = $70 net (30% flat fee includes processing)

**Key Features:**
- No monthly fees (only pay when you sell)
- Flexible payout schedules (daily/weekly/monthly/quarterly) with a 7-day minimum holding period; weekly payouts are typically on Fridays
- Since January 1, 2025: Gumroad acts as merchant of record and handles sales tax collection/remittance where it has tax obligations
- Affiliate fee splitting proportional to commission

**Sources:**
- [Gumroad Pricing](https://gumroad.com/pricing)
- [Gumroad Fees Help Center](https://gumroad.com/help/article/66-gumroads-fees)
- [Getting Paid by Gumroad](https://gumroad.com/help/article/13-getting-paid)
- [Payout Delays](https://gumroad.com/help/article/281-payout-delays)
- [Sales Tax on Gumroad](https://gumroad.com/help/article/121-sales-tax-on-gumroad)

---

### 1.3 Notion Templates Marketplace

**Overview:** Official marketplace for Notion template creators with growing creator economy.

**Fee Structure:**
| Component | Rate |
|-----------|------|
| Platform Fee | 10% |
| Per Transaction | $0.40 |
| Foreign Exchange (non-US creators) | +1% |
| Minimum Payout | $20 |

**Payout Schedule:** Biweekly (Thursdays at 9am PT); 14-day funds hold; minimum $20 (higher minimums in some countries)

**Notable Tax Handling:** Notion is the legal entity handling payments and collects/remits sales tax/VAT where required. Creators are responsible for income tax reporting.

**Sources:**
- [Notion Selling on Marketplace](https://www.notion.com/help/selling-on-marketplace)

---

### 1.4 GitHub Marketplace

**Overview:** Platform for developer tools, apps, and actions.

**Revenue Model:**
- Paid apps: GitHub is merchant of record and remits 95% to developers (5% retained)
- Pricing set by developers in USD; first remittance within 90 days of completed registration, then remitted at month end
- Subscription and one-time payment models supported

**Monetization Strategies for Developers:**
- Freemium model with premium features
- Subscription tiers
- Open source with paid enterprise support
- Premium support packages

**Sources:**
- [GitHub Marketplace Developer Agreement](https://docs.github.com/articles/github-marketplace-developer-agreement)

---

### 1.5 Figma Community

**Overview:** Design community with emerging paid plugin/widget ecosystem.

**Current State:**
- **Files, Plugins, Widgets:** Eligible creators can sell directly on Figma Community
- **Files:** Figma is not approving new creators to sell paid files at this time
- Must be approved creator to publish paid resources

**Refund Policy:**
- One-time purchases: 24-hour automatic refund window
- Subscriptions: Non-refundable (access continues through billing cycle)

**Fees & Payouts:**
- Flat 15% fee includes payment processing, refund management, and sales tax handling
- Cash out available 30 business days after sale; maximum one cash out per week
- Figma collects and remits sales tax as marketplace facilitator

**Alternative Monetization:**
- Can sell resources using Figma’s payment platform or a third-party payment site

**Sources:**
- [Figma About Selling Community Resources](https://help.figma.com/hc/en-us/articles/12067637274519-About-selling-Community-resources)

---

### 1.6 Vercel Templates Marketplace

**Overview:** Developer-focused template marketplace, primarily free official templates.

**Model:**
- Official Vercel templates: Free
- Community templates: Free
- Third-party paid templates: Via external marketplaces (ThemeForest, WrapPixel)

**Vercel Marketplace (Integrations):** Separate marketplace for service integrations with unified billing.

**Sources:**
- [Vercel Templates Marketplace Blog](https://vercel.com/blog/introducing-the-vercel-templates-marketplace)
- [Vercel Templates](https://vercel.com/templates)

---

## 2. Revenue Share Model Comparison

### 2.1 Comprehensive Comparison Table

| Platform | Platform Cut | Creator Cut | Model Type | Notable Terms |
|----------|--------------|-------------|------------|---------------|
| **Shopify App Store** | 0% / 15% / 20% | 100% / 85% / 80% | Tiered with registration | 0% on first $1M lifetime (post‑Jan 1, 2025) for eligible apps; 15% reduced rate after; 20% default if not registered |
| **Gumroad (Direct)** | 10% + $0.50 + processing | ~86% (varies) | Flat + processing | Card processing 2.9% + $0.30 |
| **Gumroad (Discover)** | 30% | 70% | Marketplace discovery | Includes processing |
| **Notion** | 10% + $0.40 (+1% FX) | ~88% (varies) | Flat percentage + fixed | Notion is merchant of record |
| **Figma** | 15% | 85% | Flat | Includes processing, taxes, refunds |
| **Apple App Store** | 15% / 30% | 70-85% | Tiered | 15% Small Business Program; subscriptions drop to 15% after year 1 |
| **Google Play** | 15% on first $1M | 85% on first $1M | Tiered | Enrollment required; standard service fee applies above $1M |
| **Steam** | 30% / 25% / 20% | 70% / 75% / 80% | Tiered by revenue | 25% above $10M, 20% above $50M (reported) |

**Sources:**
- [Shopify Revenue Share Documentation](https://shopify.dev/docs/apps/launch/distribution/revenue-share)
- [Shopify Partner Program Agreement FAQ (2025 update)](https://help.shopify.com/en/partners/faq/ppa)
- [Gumroad Fees Help Center](https://gumroad.com/help/article/66-gumroads-fees)
- [Notion Selling on Marketplace](https://www.notion.com/help/selling-on-marketplace)
- [Figma About Selling Community Resources](https://help.figma.com/hc/en-us/articles/12067637274519-About-selling-Community-resources)
- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/)
- [App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/)
- [Google Play: Service Fee Updates](https://support.google.com/googleplay/android-developer/answer/10632485)
- [Valve Revenue Share Change (TechCrunch)](https://techcrunch.com/2018/11/30/valve-revenue-sharing/)
- [Valve Revenue Share Change (Ars Technica)](https://arstechnica.com/gaming/2018/11/steam-revenue-sharing-changes/)

### 2.2 Model Type Deep Dive

#### Percentage-Based Models

| Model | Platform | Creator | Use Case |
|-------|----------|---------|----------|
| Flat Percentage | 10-15% | 85-90% | Simple, creator-friendly |
| Tiered by Revenue | 15-30% | 70-85% | Scales with success |
| Tiered by Features | Varies | Varies | Enterprise vs. basic |

#### Fixed Fee Models

| Model | Platform | Creator | Use Case |
|-------|----------|---------|----------|
| Listing Fee Only | Fixed monthly/annual | 100% of sales | High-volume sellers |
| Per-Transaction Fixed | $0.30-$0.50 | Balance | Low-price items hurt |
| SaaS Fee + Commission | Subscription + % | Variable | Enterprise platforms |

#### Hybrid Models (Recommended for AI Platforms)

| Structure | Example | Best For |
|-----------|---------|----------|
| Base + Percentage | $29/mo + 5% | Predictable platform revenue |
| Threshold + Percentage | 0% to $1K, then 15% | Creator incentive |
| Usage + Revenue Share | API calls + 10% of sales | AI/compute-intensive |

---

## 3. AI Agent Pricing Strategies

### 3.1 Primary Pricing Models for AI Agents

Based on comprehensive market research, eight primary models dominate AI agent pricing:

#### 1. Per-Execution Pricing
**Description:** Fixed price per completed task/workflow
**Example:** n8n pricing is based on monthly workflow executions
**Pros:** Simple to understand, outcome-aligned
**Cons:** Complex workflows may feel expensive

**Recommended Structure:**
```
Tier 1: $0.01-$0.05 per simple execution
Tier 2: $0.10-$0.50 per complex workflow
Tier 3: $1-$5 per enterprise-grade execution
```

#### 2. Token/Usage-Based Pricing
**Description:** Charge based on API calls, tokens processed, or compute time
**Example:** OpenAI API pricing varies by model; for example, GPT‑5 mini lists $0.25 per 1M input tokens and $2.00 per 1M output tokens, while GPT‑5 lists $1.25 per 1M input tokens and $10.00 per 1M output tokens (prices change frequently; check current rates)
**Pros:** Direct cost correlation
**Cons:** Unpredictable bills, customer anxiety, discourages usage

**Warning:** Token-based pricing loses pricing power as costs decline. Competitors can undercut easily.

#### 3. Subscription/Flat-Rate
**Description:** Monthly/annual fee for access
**Example:** ChatGPT Plus at $20/month
**Pros:** Predictable revenue, simple budgeting
**Cons:** May not align with value delivered

#### 4. Outcome-Based Pricing
**Description:** Charge based on measurable results (leads generated, tickets resolved)
**Pros:** Perfect value alignment, defensible pricing
**Cons:** Attribution complexity, trust issues

#### 5. Per-Agent Seat (Digital Worker)
**Description:** Treat AI agent as an employee with its own license
**Pros:** Easy enterprise budgeting, familiar model
**Cons:** Doesn't scale with usage

#### 6. Hybrid: Base + Usage
**Description:** Platform fee plus overage charges
**Example:** $99/month includes 1,000 executions, $0.05 each additional
**Pros:** Balance of predictability and alignment
**Cons:** More complex to communicate

#### 7. Freemium with Premium Features
**Description:** Free basic tier, paid advanced features
**Pros:** Low barrier to entry, viral growth
**Cons:** Conversion optimization required

#### 8. Per-Workflow/Per-Output
**Description:** Charge per completed deliverable
**Example:** Per document processed, per report generated
**Pros:** Clear value proposition
**Cons:** May not work for complex, variable workflows

### 3.2 Pricing Model Selection Framework

| Factor | Best Model |
|--------|------------|
| Clear, measurable outcomes | Outcome-based |
| Variable compute costs | Usage-based with caps |
| Predictable usage patterns | Subscription |
| Enterprise customers | Per-seat or hybrid |
| SMB/consumer | Freemium or per-execution |
| Complex workflows | Per-workflow |

### 3.3 Why Traditional SaaS Pricing Fails for AI

1. **Unpredictable Workloads:** Single agent action can trigger multiple API calls, tool invocations, RAG lookups
2. **Sub-cent Unit Costs:** Token processing costs fractions of cents
3. **Collapsing Cost Structure:** Model costs decrease rapidly, need pricing power defense
4. **Value Disconnect:** Seats don't correlate with value delivered

**Solution:** Abstract usage into "actions" or "workflows" that customers understand, not raw tokens.

**Sources:**
- [Orb: Pricing AI Agents](https://www.withorb.com/blog/pricing-ai-agents)
- [2026 Guide to SaaS and AI Pricing](https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models)
- [ChargeeBee: Pricing AI Agents Playbook](https://www.chargebee.com/blog/pricing-ai-agents-playbook/)
- [CloudZero: AI Agent Pricing Models](https://www.cloudzero.com/blog/ai-agent-pricing-models/)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [OpenAI API Pricing (Docs)](https://platform.openai.com/docs/pricing)
- [n8n Pricing](https://n8n.io/pricing/)
- [ChatGPT Plus Pricing](https://help.openai.com/en/articles/6950777-chatgpt-plus)

---

## 4. Stripe Connect Implementation Guide

### 4.1 Account Types Comparison

| Feature | Standard | Express | Custom |
|---------|----------|---------|--------|
| **Onboarding** | User-managed via Stripe | Stripe-hosted, platform customizable | Fully platform-managed |
| **Dashboard Access** | Full Stripe Dashboard | Limited Express Dashboard | None (platform provides) |
| **Branding** | Stripe branding | Mixed branding | Fully white-labeled |
| **Identity Verification** | User handles with Stripe | Stripe handles | Platform handles |
| **Compliance** | Stripe manages | Stripe manages | Platform manages |
| **Monthly Fee** | Depends on pricing model | Depends on pricing model | Depends on pricing model |
| **Integration Effort** | Low | Medium | High |
| **Best For** | Autonomous sellers | Gig platforms, marketplaces | Full white-label |

### 4.2 Fee Structure

**Base Processing Fees:**
- 2.9% + $0.30 per online transaction (US)
- 2.2% + $0.30 for nonprofits
**Note:** Processing fees vary by region, card type, and payment method.

**Connect Pricing Models:**
- **Stripe handles pricing:** Stripe bills connected accounts directly for processing; platform has no Connect account/payout fees
- **You handle pricing:** $2 per monthly active account + 0.25% + $0.25 per payout (US; local equivalents vary by region)

**Currency & International:**
- Currency conversion: 1% (US accounts), 2% (non-US)
- Alternative currency payouts: +1%

**Instant Payouts:**
- 1% of payout volume (where available)

### 4.3 Fee Handling Options

| Approach | Who Pays Processing | Platform Implications |
|----------|--------------------|-----------------------|
| Platform Absorbs | Platform | Higher take rate needed |
| Pass to Seller | Connected Account | Seller sees lower net |
| Pass to Buyer | Buyer | Higher prices, transparent |
| Split | Both | Complex, flexible |

**Stripe Guidance:** If you want Stripe to bill connected accounts directly for processing fees, choose "Stripe handles pricing." If you want to set your own fee structure/take rate, choose "You handle pricing" and configure application fees.

### 4.4 Payout Schedule Options

| Schedule | Description | Best For |
|----------|-------------|----------|
| **Daily** | Automatic payout X days after charge | Standard marketplace |
| **Weekly** | Set specific day(s) | Lower volume sellers |
| **Monthly** | Set specific day(s) | Enterprise, predictable |
| **Manual** | Platform controls via API | Complex split scenarios |
| **Instant** | 30-minute settlement | Premium feature offering |

### 4.5 Tax Compliance

#### US 1099 Reporting
- **1099-K threshold:** Platform responsible when controlling pricing; thresholds vary by IRS and state and have changed recently (verify annually)
- **Stripe handling:** $2.99 per 1099 e-filed with IRS
- **State filing:** $1.49 per state
- **Physical mail:** $2.99 per form
- **E-delivery:** No additional fee

#### VAT/Sales Tax (Global)
- **Stripe Tax:** Automatic calculation in 100+ countries, 600+ product types
- **EU "Deemed Supplier":** EU VAT rules can treat marketplaces as the supplier in specific cases; consult tax counsel for applicability
- **Coverage:** Sales tax, VAT, GST globally

**Integration:** Stripe Tax integrates with Connect for calculating/collecting tax on behalf of connected accounts.

### 4.6 Recommended Implementation Path

1. **Start with Express accounts** - balance of control and ease
2. **Use Stripe-hosted onboarding** - handles KYC/compliance
3. **Set up Stripe Tax** - automate sales tax from day one
4. **Implement 1099 automation** - required at scale
5. **Consider Instant Payouts** - differentiator for creators
6. **Add platform pricing tools** - control your economics

**Sources:**
- [Stripe Connect Account Types](https://docs.stripe.com/connect/accounts)
- [Stripe Connect Pricing](https://stripe.com/connect/pricing)
- [Stripe Connect Fee Behavior](https://docs.stripe.com/connect/direct-charges-fee-payer-behavior)
- [Stripe Connect 1099](https://stripe.com/connect/1099)
- [Stripe Tax Documentation](https://docs.stripe.com/tax)
- [Instant Payouts for Connect](https://docs.stripe.com/connect/instant-payouts)
- [Stripe Pricing (US)](https://stripe.com/pricing)
- [IRS Notice 2024-85 (1099-K thresholds)](https://www.irs.gov/pub/irs-drop/n-24-85.pdf)
- [EU VAT e-commerce package (Deemed supplier rules)](https://taxation-customs.ec.europa.eu/vat-e-commerce_en)

---

## 5. Creator Incentive Programs

### 5.1 Shopify Partner Program Model

**Tracks & Tiers (Published by Shopify):**
- **Service Partner Track:** Registered, Select, Plus, Premier, Platinum
- **Technology Partner Track:** Plus, Premier, Platinum (by invitation)

**Program Benefits (High-Level):**
- Access to partner resources, training, and support
- Co-marketing/co-selling programs vary by tier and track
- Early access/betas are typically invitation or tier-based

**Note:** Specific revenue-share promotions and referral incentives are program-specific and change frequently; verify in the current Partner Program Guides.

### 5.2 Microsoft Marketplace Rewards

**Structure:**
- Base benefits (all partners): Optimization recommendations, self-serve resources
- Performance-based unlocks: More benefits as transactable sales increase
- No cost (included in ISV Success program)

**Benefits:**
- Professional marketing guidance
- Featured home page promotions
- Product category placements
- Social media promotion
- Global market expansion support

### 5.3 Amazon New Seller Incentives

**Brand Registry Benefits (within 6 months):**
- 10% back on the first $50,000 in branded sales (eligible products)
- 5% back on the next $950,000
- Up to $1,000,000 in branded sales is eligible (program/region specific)
- $200 Amazon Vine credit (program/region specific)
**Note:** Incentives vary by region, category, and eligibility; verify in your local Seller Central.

### 5.4 Recommended Creator Incentive Program Structure

#### Tier 1: New Creators (0-$1K GMV)
- 0% platform fee on first $500
- Featured "New Creators" section
- Onboarding support and templates
- Badge: "New Creator"

#### Tier 2: Growing Creators ($1K-$10K GMV)
- Standard revenue share (e.g., 15%)
- Access to analytics dashboard
- Priority support queue
- Badge: "Verified Creator"

#### Tier 3: Established Creators ($10K-$100K GMV)
- Reduced revenue share (e.g., 12%)
- Featured in category pages
- Co-marketing opportunities
- Early access to features
- Badge: "Top Creator"

#### Tier 4: Premium Partners ($100K+ GMV)
- Lowest revenue share (e.g., 10%)
- Homepage feature spots
- Dedicated account manager
- Revenue guarantees/advances consideration
- Certification program eligibility
- Badge: "Premium Partner"

### 5.5 Additional Incentive Mechanisms

| Mechanism | Description | Effect |
|-----------|-------------|--------|
| Launch Bonuses | Extra percentage on first 30 days | Accelerates new listings |
| Milestone Rewards | Bonuses at $1K, $10K, $100K | Gamification |
| Referral Bonuses | Commission for bringing creators | Network growth |
| Quality Bonuses | Higher share for 5-star ratings | Quality improvement |
| Seasonal Promotions | Double commission periods | Activity spikes |

**Sources:**
- [Shopify Partner Program (Tracks and tiers)](https://help.shopify.com/en/partners/partner-program/about)
- [Microsoft Marketplace Rewards](https://learn.microsoft.com/en-us/partner-center/marketplace-rewards)
- [Amazon Brand Registry Incentives](https://sell.amazon.com/brand-registry)
- [Amazon New Seller Guide](https://sell.amazon.com/guides/new-seller-guide)

---

## 6. Trust & Quality Systems

### 6.1 Review and Rating Systems

**Best Practices:**
- Require verified purchase where feasible and document review provenance
- Prohibit or clearly disclose incentivized reviews (FTC compliance)
- Provide transparency on moderation and review removal
- Time-decay older reviews for relevance (product decision, not regulatory)
- Highlight recent vs. historical ratings

**Rating Components:**
- Overall star rating (1-5)
- Category-specific ratings (ease of use, documentation, support)
- Response rate/time metrics
- Update frequency indicator

### 6.2 Verification Badges

| Badge | Requirements | Trust Signal |
|-------|--------------|--------------|
| **Verified Creator** | ID verification, email confirmed | Basic trust |
| **Quality Certified** | Meets code/quality standards | Technical quality |
| **Top Rated** | 4.5+ stars, 50+ reviews | Community approval |
| **Partner Verified** | Business verification, background check | Enterprise trust |
| **Security Audited** | Third-party security audit | Security assurance |

**Regulatory Note:** If you facilitate B2C sales in the EU, the Digital Services Act introduces "Know Your Business Customer" obligations for marketplaces (verify trader identity and make certain trader information available to consumers).

### 6.3 Quality Thresholds for Listing

**Minimum Requirements:**
- Complete documentation
- Working demo/preview
- Clear pricing disclosure
- Privacy policy/data handling disclosure
- Minimum functionality test pass

**Enhanced Listing Requirements:**
- Security review for data-handling modules
- Performance benchmarks
- Support SLA commitment
- Version history/changelog

### 6.4 Fraud Prevention

**Seller-Side:**
- Identity verification (KYC)
- Bank account verification via Stripe
- Velocity limits on new accounts
- Review authenticity detection (ML-based)
- Linked account detection

**Buyer-Side:**
- Payment verification
- Usage pattern monitoring
- Abuse detection for trials/freemium

**Platform-Level:**
- Stripe Radar (or equivalent) for payment fraud detection
- Behavioral analytics
- IP reputation scoring
- Device fingerprinting

### 6.5 Refund Policies

**Recommended Tiered Approach:**

| Purchase Type | Refund Window | Conditions |
|--------------|---------------|------------|
| One-time digital | 24-48 hours | Automatic, no questions |
| Subscription (monthly) | 7 days | Prorated |
| Subscription (annual) | 14-30 days | Prorated |
| Usage-based | Case-by-case | Service issues only |

**Compliance Note:** Refund rights for digital goods/services vary by jurisdiction; validate policy against local consumer protection laws and platform payment terms.

**Chargeback Handling:**
- Clear dispute resolution process
- Evidence collection templates
- Automatic seller notification
- Reserve fund requirements for high-risk sellers

### 6.6 Content Moderation

**Automated Checks:**
- Malware/security scanning
- License compliance verification
- API permission auditing
- Performance impact assessment

**Manual Review Triggers:**
- First submission from new creator
- Significant updates
- User reports threshold reached
- High-risk categories (data access, payments)

**Sources:**
- [FTC Final Rule on Consumer Reviews](https://www.ftc.gov/legal-library/browse/rules/consumer-reviews-and-testimonials)
- [FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
- [EU Digital Services Act (Trader Traceability)](https://www.europarl.europa.eu/news/en/headlines/priorities/new-eu-rules-for-a-digital-environment/20220610STO32808/digital-services-act-explained)
- [Stripe Radar](https://stripe.com/radar)

---

## 7. Discovery & Distribution

### 7.1 Search and Categorization

**Primary Discovery Methods:**
1. **Search:** Keyword-based, full-text
2. **Categories:** Hierarchical taxonomy
3. **Collections:** Curated themed groups
4. **Recommendations:** Personalized suggestions
5. **Featured:** Editorially selected

**Category Taxonomy Example for AI Agents:**
```
- Productivity
  - Task Automation
  - Document Processing
  - Scheduling
- Data & Analytics
  - Data Extraction
  - Reporting
  - Visualization
- Communication
  - Email Automation
  - Chat Agents
  - Customer Service
- Development
  - Code Generation
  - Testing
  - DevOps
- Industry-Specific
  - Healthcare
  - Finance
  - Legal
  - Marketing
```

### 7.2 Recommendation Algorithm Factors

**Note:** Weights and signals are product-specific; treat the list below as a hypothesis to validate with experiments.

| Factor | Description |
|--------|-------------|
| **Relevance** | Keyword/category match |
| **Conversion Rate** | Historical purchase rate |
| **Rating Score** | Average star rating |
| **Review Volume** | Number of reviews |
| **Recency** | Last update date |
| **Seller Quality** | Creator reputation score |
| **User Affinity** | Based on user history |
| **Completeness** | Listing quality score |

### 7.3 Featured/Promoted Listings

**Organic Featured:**
- Staff picks
- "Rising Stars" for trending new items
- Category leaders
- Seasonal/themed collections

**Paid Promotion Options:**
| Placement | Model | Best For |
|-----------|-------|----------|
| Search Boost | CPC | Specific keywords |
| Category Feature | CPM | Category leadership |
| Homepage Carousel | Fixed daily rate | Maximum visibility |
| Email Newsletter | Per send | Direct reach |

### 7.4 SEO for Marketplace Listings

**On-Listing Optimization:**
- Keyword-rich titles (without stuffing)
- Detailed, unique descriptions
- Complete metadata (tags, categories)
- High-quality images/screenshots
- Video demos where applicable

**Platform-Level SEO:**
- Individual listing URLs (not JS-only)
- Schema markup for products
- Sitemap generation
- Fast page loads
- Mobile optimization

**AI/LLM Visibility (Emerging):**
- Structured data for AI parsing
- Clear, factual descriptions
- FAQ schema
- Pricing transparency

### 7.5 Email Marketing to Buyers

**Triggered Campaigns:**
| Trigger | Email Type | Timing |
|---------|------------|--------|
| Browse abandonment | "You viewed..." | Test timing by category |
| Cart abandonment | Reminder + incentive | Test timing by segment |
| Purchase | Receipt + related items | Immediate or next-day |
| Review solicitation | Feedback request | Test timing post-purchase |
| Inactivity | Re-engagement | Test timing by lifecycle stage |

**Digest Campaigns:**
- Weekly new arrivals in followed categories
- Monthly top-rated roundups
- Creator updates for followed sellers

**Sources:**
- [Google Search Central: Product Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google Search Central: Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## 8. Module Licensing Models

### 8.1 License Model Comparison

| Model | Description | Best For | Revenue Pattern |
|-------|-------------|----------|-----------------|
| **Open Source + Support** | Free code, paid support/consulting | Developer tools | Services revenue |
| **Freemium** | Free basic, paid premium features | Mass adoption needed | Conversion-dependent |
| **Proprietary + Trial** | Time/feature-limited trial | Complex enterprise | Sales-driven |
| **Per-Workspace** | One license per workspace/organization | Team tools | Scales with customers |
| **Per-Seat** | Per user license | Collaborative tools | Scales with team size |
| **Usage Metered** | Pay per use (API calls, executions) | Variable usage patterns | Usage-dependent |
| **Hybrid** | Base subscription + usage overage | Balanced needs | Predictable + upside |

### 8.2 Per-Workspace Licensing

**Structure:**
- Single license covers entire workspace/tenant
- Unlimited users within workspace
- Tiered by workspace size or usage

**Example Pricing:**
```
Starter Workspace (up to 5 users): $49/month
Team Workspace (up to 25 users): $149/month
Enterprise Workspace (unlimited): $499/month
```
**Note:** Illustrative examples only; not market benchmarks.

**Pros:** Simple purchasing, viral within org
**Cons:** Doesn't scale with large org usage

### 8.3 Per-Seat Licensing

**Structure:**
- License required for each user
- Volume discounts common
- Annual commitment often required

**Example Pricing:**
```
$15/user/month (1-10 users)
$12/user/month (11-50 users)
$10/user/month (51-100 users)
$8/user/month (100+ users, annual)
```
**Note:** Illustrative examples only; not market benchmarks.

**Pros:** Predictable revenue, scales with adoption
**Cons:** Friction to adding users, gaming (shared logins)

### 8.4 Usage Metering Best Practices

**What to Meter:**
- API calls
- Executions/runs
- Data volume processed
- Compute time
- Active agents
- Storage consumed

**Implementation Requirements:**
- Real-time usage tracking
- Usage dashboards (open to users)
- Overage alerts
- Grace periods
- Rate limiting (not hard stops)

**Pricing Communication:**
- Show estimated costs before execution
- Usage predictor tools
- Budget caps/limits
- Daily/weekly usage summaries

### 8.5 Recommended Hybrid Model for AI Modules

```
Base Subscription: $X/month
- Includes: Y executions, Z storage, support tier
- Overage: $A per 100 additional executions
- Enterprise: Custom pricing, SLA, dedicated support
```

**Example:**
```
Starter: $29/month
- 500 executions included
- Overage: $0.05/execution
- Community support

Pro: $99/month
- 2,500 executions included
- Overage: $0.03/execution
- Priority support

Enterprise: Custom
- Volume discounts
- SLA guarantees
- Dedicated support
```
**Note:** Illustrative examples only; validate with unit economics.

**Sources:**
- [SaaS Pricing Models - Thales](https://cpl.thalesgroup.com/software-monetization/saas-pricing-models)
- [Seat-Based Pricing Guide - Wingback](https://www.wingback.com/blog/when-to-leverage-per-seat-pricing)
- [SaaS Licensing Models - CloudEagle](https://www.cloudeagle.ai/blogs/saas-licensing-models)

---

## 9. B2B2C Specific Considerations

### 9.1 Understanding the B2B2C Model

**Definition:** Business-to-Business-to-Consumer where:
- Platform (you) provides infrastructure
- Businesses (creators/agencies) build and sell
- End consumers purchase and use

**Key Distinction from White-Label:**
- B2B2C: Platform brand visible, data access retained
- White-Label: Reseller brand only, opaque to end user

### 9.2 Agency Reselling Workflows

**Agency Use Cases:**
1. Build custom agents for specific clients
2. Resell platform modules with markup
3. Offer managed services using platform
4. White-label solutions for client portals

**Revenue Models for Agencies:**

| Model | Agency Action | Platform Revenue |
|-------|--------------|------------------|
| **Markup Resale** | Buys at wholesale, sells at markup | Wholesale revenue |
| **Service Layer** | Adds services on top of platform | Platform subscription |
| **Commission Split** | Sells platform modules, takes cut | Split per sale |
| **Managed Services** | Operates platform for clients | Higher tier subscription |

### 9.3 White-Label Options

**Levels of White-Labeling:**

| Level | Platform Branding | Customization | Complexity |
|-------|------------------|---------------|------------|
| **Co-branded** | Both visible | Colors, logo | Low |
| **Powered by** | Small mention | Full UI theme | Medium |
| **Full White-Label** | None visible | Complete | High |

**Technical Requirements:**
- Custom domain support
- Theming/branding APIs
- Embeddable components
- API-first architecture
- Multi-tenant infrastructure

**Pricing White-Label Tiers:**
```
Partner: $299/month
- "Powered by [Platform]" branding
- Custom colors/logo
- Limited customization

Enterprise: $999/month
- Full white-label
- Custom domain
- Complete branding removal
- Priority support

Custom: Contact Sales
- Dedicated infrastructure
- SLA guarantees
- Custom integrations
```
**Note:** Illustrative examples only; validate against your cost structure and competitive set.

### 9.4 Client Billing Passthrough

**Options:**

1. **Platform Bills End Client**
   - Platform handles all billing
   - Agency gets commission/referral fee
   - Simplest for agency

2. **Agency Bills, Platform Provides Usage**
   - Agency invoices client directly
   - Platform provides usage data
   - Agency pays platform wholesale

3. **Metered API with Agency Markup**
   - Platform meters usage
   - Agency sets markup percentage
   - Platform bills, splits revenue

**Implementation with Stripe Connect:**
- Use destination charges for commission model
- Use separate charges for wholesale model
- Application fees for platform revenue

### 9.5 Revenue Attribution

**Attribution Challenges:**
- Multi-touch sales (marketing + agency)
- Ongoing vs. one-time attribution
- Client churn vs. agency performance

**Recommended Attribution Model:**
```
First Touch: Marketing/organic = 20%
Agency Referral: Agency = 60%
Platform Support: Platform = 20%

Duration: 12-24 months of client lifetime
Cap: First $X in revenue attributed
```

**Tracking Requirements:**
- Referral codes/links
- CRM integration
- Clear attribution windows
- Dispute resolution process

**Sources:**
- [B2B2C Business Models - a16z](https://a16z.com/2018/05/17/b2b2c-business-models-rampell/)
- [B2B2C Explained - Shopify](https://www.shopify.com/blog/b2b2c)

---

## 10. Financial Projections Framework

### 10.1 Key Marketplace Metrics

**Primary Metrics:**

| Metric | Definition | Notes |
|--------|------------|-------|
| **GMV** | Total value transacted | Core volume metric |
| **Net Revenue** | Platform take of GMV | Monetization metric |
| **Take Rate** | Net Revenue / GMV | Varies widely by category and pricing power |
| **Match Rate / Utilization** | % of listings or supply with transactions | A16z frames this as match rate / marketplace liquidity |

**Unit Economics:**

| Metric | Definition | Notes |
|--------|------------|-------|
| **Seller CAC** | Cost to acquire seller | Highly channel- and vertical-dependent |
| **Buyer CAC** | Cost to acquire buyer | Highly channel- and vertical-dependent |
| **LTV:CAC** | Lifetime value to acquisition cost | Cohort-based target; varies by payback tolerance |
| **GMV Retention** | YoY GMV from same cohort | Best-in-class marketplaces aim for 100%+ over time |

### 10.2 GMV Modeling

**Bottom-Up Model:**
```
GMV = Active Sellers x Avg Listings/Seller x Avg Price x Transactions/Listing

Example:
- 100 active sellers
- 5 listings/seller average
- $50 average price
- 20 transactions/listing/month
= $500,000 monthly GMV
```

**Top-Down Model:**
```
TAM (Total Addressable Market)
x SAM % (Serviceable, your geography/vertical)
x SOM % (Obtainable, realistic capture)
= GMV Target
```

### 10.3 Revenue Projections

**Revenue = GMV x Take Rate**

| Year | GMV | Take Rate | Net Revenue |
|------|-----|-----------|-------------|
| Y1 | $1M | 15% | $150K |
| Y2 | $5M | 15% | $750K |
| Y3 | $20M | 12% | $2.4M |
| Y4 | $50M | 12% | $6M |
| Y5 | $100M | 10% | $10M |

**Note:** Take rate often decreases as platform scales (volume incentives, competition).
**Note:** Projection table is illustrative only; build scenarios from your actual funnel and cohort data.

### 10.4 Creator Economics Model

**Per-Creator Analysis:**
```
Average Creator:
- GMV: $2,000/month
- Take Rate: 15%
- Platform Revenue: $300/month
- Creator Net: $1,700/month

Top 10% Creators:
- GMV: $20,000/month
- Take Rate: 12% (volume discount)
- Platform Revenue: $2,400/month
- Creator Net: $17,600/month
```
**Note:** Illustrative example only; validate with actual creator cohorts and retention.

**Creator Acquisition Cost:**
```
Marketing Spend: $50,000
Creators Acquired: 200
Creator CAC: $250

LTV Calculation:
Average Monthly Revenue/Creator: $150
Average Creator Lifespan: 24 months
Creator LTV: $3,600
LTV:CAC Ratio: 14.4x
```

### 10.5 Buyer Acquisition Analysis

**Buyer CAC:**
```
Paid Acquisition: $30-50
Organic (SEO/Content): $5-15
Referral: $10-20
Blended Target: <$50
```

**Buyer LTV:**
```
Average Order Value: $75
Purchases/Year: 3
Platform Commission: 15%
Annual Revenue/Buyer: $33.75
Average Buyer Lifespan: 3 years
Buyer LTV: $101.25
```
**Note:** Illustrative ranges only; channel mix and order frequency vary widely by category.

### 10.6 Platform Margin Analysis

**Cost Structure:**
| Category |
|----------|
| Payment Processing |
| Infrastructure/Hosting |
| Support/Operations |
| Creator Acquisition |
| Buyer Acquisition |
| G&A |

**Path to Profitability:**
- Scale reduces per-unit infrastructure costs
- Organic growth reduces acquisition dependency
- Take rate optimization balances growth vs. margin
**Note:** Margin profiles vary widely by marketplace category and monetization model; build a bottoms-up cost model.

### 10.7 Warning Signs (from a16z)

**Red Flags:**
- Rising CAC despite claimed network effects
- Declining match rate / liquidity (fewer successful matches)
- GMV growth but flat revenue (take rate pressure)
- High supply or demand concentration (dependency on a few sellers/buyers)
- High buyer churn

**Positive Indicators:**
- Improving match rate / liquidity
- Organic user acquisition growing
- Ability to raise take rate without volume loss
- GMV retention >100%

**Sources:**
- [a16z: 13 Metrics for Marketplace Companies](https://a16z.com/13-metrics-for-marketplace-companies/)
- [a16z: GMV Retention](https://a16z.com/gmv-retention-the-marketplace-metric-most-ignore/)
- [a16z Marketplace Glossary](https://a16z.com/the-marketplace-glossary/)
- [Stripe: 14 Key Marketplace Metrics](https://stripe.com/resources/more/14-key-marketplace-metrics)

---

## 11. Recommendations for Hyyve Platform

### 11.1 Revenue Share Model Recommendation

**Proposed Structure:**

| Creator Tier | Lifetime GMV | Platform Take | Creator Keep |
|--------------|--------------|---------------|--------------|
| New | $0 - $1,000 | 0% | 100% |
| Growing | $1,001 - $50,000 | 15% | 85% |
| Established | $50,001 - $250,000 | 12% | 88% |
| Premium Partner | $250,001+ | 10% | 90% |

**Rationale:**
- Zero-fee start removes barrier to entry
- Competitive with Shopify reduced rate (15%) and Gumroad base fee (10% + $0.50 + processing)
- Rewards success with lower rates
- Lifetime tracking vs. annual reset

### 11.2 AI Agent Pricing Framework

**Recommended Hybrid Model:**

```
Module Pricing (Creator Sets):
- One-time purchase: $X
- Subscription: $X/month
- Usage-based: $X per Y executions

Platform Pricing (End Users):
Starter: $29/month
- 500 agent executions included
- Access to Free modules
- Community support

Pro: $99/month
- 2,500 executions included
- 10% discount on paid modules
- Priority support

Team: $249/month
- 10,000 executions included
- 15% discount on paid modules
- Shared workspace
- Analytics dashboard

Enterprise: Custom
- Volume discounts
- SLA guarantees
- White-label options
- Dedicated support
```

### 11.3 Stripe Connect Implementation

**Recommended Approach:**
1. **Account Type:** Express (balance of control and ease)
2. **Onboarding:** Stripe-hosted for compliance
3. **Tax:** Enable Stripe Tax from launch
4. **Payouts:** Weekly default, Instant optional (1% fee; decide pass-through vs. markup)
5. **1099s:** Automate via Stripe Connect

### 11.4 Creator Incentive Program

**Launch Phase (Year 1):**
- 0% take rate on first $1,000 (all creators)
- "Founding Creator" badge for first 100
- Featured placement for quality content
- Direct support channel

**Growth Phase (Year 2+):**
- Tiered benefits (see Section 5.4)
- Co-marketing fund for top creators
- Certification program
- Revenue advances for proven performers

### 11.5 Trust & Quality Implementation

**Phase 1 (Launch):**
- Basic verification (email, Stripe identity)
- Manual review of first 3 submissions
- Simple star rating system
- 48-hour refund window

**Phase 2 (Scale):**
- Automated security scanning
- ML-based review fraud detection
- Verified Purchase badges
- Creator response time metrics

**Phase 3 (Maturity):**
- Third-party security audits (optional, premium badge)
- Performance benchmarks
- SLA commitments
- Escrow for enterprise transactions

### 11.6 Agency/B2B2C Features

**Phase 1:**
- Basic referral tracking
- Commission payouts via Stripe Connect
- Co-branded embeds

**Phase 2:**
- White-label portal option
- Client billing passthrough
- Agency dashboard
- Revenue attribution

**Phase 3:**
- Full white-label
- Multi-tenant management
- Enterprise integrations
- Partner API

### 11.7 Key Success Metrics to Track

| Metric | Target Y1 | Target Y3 |
|--------|-----------|-----------|
| Active Creators | 100 | 1,000 |
| GMV | $500K | $10M |
| Take Rate | 15% | 12% |
| Net Revenue | $75K | $1.2M |
| Creator CAC | <$500 | <$200 |
| Buyer CAC | <$100 | <$30 |
| GMV Retention | 80%+ | 120%+ |
| Match Rate / Utilization | 20%+ | 40%+ |

**Note:** Targets are illustrative; set by category, maturity, and acquisition mix.

---

## Appendix A: Patrick McKenzie (patio11) Pricing Wisdom

Key themes from patio11's writing on pricing:

1. **Charge based on value delivered.** Founders often underprice relative to customer value.

2. **Plan naming and positioning matter.** Labels can influence procurement and perceived value.

3. **Pricing acts as a customer filter.** Higher prices can reduce support-heavy customers.

4. **Pricing should evolve over time.** Revisit pricing regularly and test changes.

5. **Avoid cost-plus pricing for software.** Cost does not map directly to value created.

**Sources:**
- [Kalzumeus Greatest Hits](https://www.kalzumeus.com/greatest-hits/)
- [7 Pricing Tips from patio11 - Glance](https://www.glance.fyi/blog/pricing-patio11)
- [Bits about Money Newsletter](https://www.bitsaboutmoney.com/)

---

## Appendix B: Additional Resources

### Industry Reports & Research
- [a16z Marketplace 100](https://a16z.com/marketplace-100/)
- [a16z Marketplace Glossary](https://a16z.com/the-marketplace-glossary/)
- [Stripe Marketplace Guide](https://stripe.com/guides/a-guide-to-the-marketplace-economy-what-marketplace-sellers-and-operators-need-to-know-about-tax-compliance)

### Documentation
- [Shopify Partner Documentation](https://shopify.dev/docs/apps)
- [Stripe Connect Documentation](https://docs.stripe.com/connect)
- [Gumroad Creator Resources](https://gumroad.com/help)

### Communities & Newsletters
- [Bits about Money (patio11)](https://www.bitsaboutmoney.com/)
- [Lenny's Newsletter](https://www.lennysnewsletter.com/)
- [Marketplace Pulse](https://www.marketplacepulse.com/)

---

*Document generated: January 20, 2026*
*Research conducted for: Hyyve Platform Business Planning*

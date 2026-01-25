# Technical Research: UI Generation Patterns for Hyyve Platform

**Research Date**: 2026-01-20
**Version**: 1.0
**Status**: Complete (Verified 2026-01-21)
**Research Focus**: Prompt-to-UI generation, component systems, and agent-to-interface mapping

---

## Executive Summary

This research document provides a comprehensive analysis of UI generation patterns for an Hyyve platform where users create AI agents and workflows visually, and the platform can GENERATE frontend UIs from those definitions. The research covers leading tools (v0.dev, Dyad, A2UI), foundational technologies (shadcn/ui, Radix), generation patterns, and implementation architectures.

### Key Findings

1. **v0** provides production-ready React/Next.js UI generation and offers both app and API workflows; the Models API supports large context windows (up to 512k on `v0-1.5-lg`) and exposes AutoFix + Quick Edit features
2. **A2UI Protocol** (Google, v0.8 Public Preview) is a declarative, streaming JSONL protocol for agent-to-UI communication with catalog-constrained components; v0.9 is a draft
3. **shadcn/ui** with its registry system is a strong fit for programmatic generation due to its copy-paste model and JSON-based component definitions
4. **Three generation paradigms** exist: Static (pre-built), Declarative (catalog-based), and Open-Ended (fully generated)
5. **Agent-to-UI mapping** should leverage tool parameter schemas for form generation and response schemas for output displays

---

## Table of Contents

1. [v0.dev (Vercel) Deep Dive](#1-v0dev-vercel-deep-dive)
2. [Blocks/DIY Tools Analysis](#2-blocksdiy-tools-analysis)
3. [Dyad and Full-Stack Generation](#3-dyad-and-full-stack-generation)
4. [shadcn/ui as Foundation](#4-shadcnui-as-foundation)
5. [Prompt-to-Component Patterns](#5-prompt-to-component-patterns)
6. [Agent to UI Mapping](#6-agent-to-ui-mapping)
7. [Workflow to App Mapping](#7-workflow-to-app-mapping)
8. [A2UI Integration](#8-a2ui-integration)
9. [Theming and White-Labeling](#9-theming-and-white-labeling)
10. [Embedding and Distribution](#10-embedding-and-distribution)
11. [Code Quality in Generated UI](#11-code-quality-in-generated-ui)
12. [Implementation Architecture](#12-implementation-architecture)
13. [Recommendations](#13-recommendations)

---

## 1. v0.dev (Vercel) Deep Dive

### 1.1 Overview

v0 (v0.app) is Vercel's AI-powered development platform that transforms natural language prompts into production-ready, full-stack web applications.

**Sources**: [v0.app](https://v0.app/), [Vercel v0 API](https://v0.app/docs/api), [Vercel v0 Pricing](https://v0.app/docs/pricing)

### 1.2 How Prompt-to-UI Generation Works

#### High-Level Generation Flow (Conceptual)

```
User Prompt
    ↓
LLM-based Code Generation (React/Next.js + Tailwind)
    ↓
AutoFix / Quick Edit (when invoked)
    ↓
Output to User (code + preview)
```

**Notes**:
- The v0 Models API documents context windows per model; `v0-1.5-lg` supports up to 512k tokens.
- Detailed internal model orchestration is not publicly specified.

#### Generation Flow

1. **Intent Understanding**: LLM interprets natural language description
2. **Component Selection**: Chooses appropriate UI primitives/components
3. **Code Generation**: Outputs React/TypeScript with Tailwind CSS
4. **Fix/Refine**: AutoFix and Quick Edit can be used to repair or refine outputs
5. **Preview**: Real-time visual rendering

### 1.3 Technology Stack

| Technology | Role |
|------------|------|
| **Next.js** | Full-stack React framework |
| **React** | Component-based UI library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library foundation |

### 1.4 Iteration Methods (as supported in v0 app)

1. **Prompt for Changes**: Natural language refinement
   - "Add a search bar to the header"
   - "Make the buttons rounded"
   - "Add dark mode support"

2. **Design Mode (Visual Editing)**: Direct manipulation where available
   - Select elements
   - Adjust properties visually

3. **Quick Edit**: Real-time inline modifications (Models API feature)
   - No full regeneration required
   - Instant refinements

### 1.5 Output Format

```typescript
// Example v0 generated component
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Generated content */}
        </div>
      </CardContent>
    </Card>
  )
}
```

### 1.6 Platform API Access

**Availability**: Models API is in beta and requires a Premium or Team plan with usage-based billing; Business includes API access

**API Capabilities**:
- Models API (OpenAI-compatible) for generation, AutoFix, Quick Edit
- Platform API for project and code-generation workflows

**Use Cases**:
- Custom app builders
- Slack/Discord bots generating web apps
- VSCode plugins with prompt-to-app workflows
- Embedded UI generators in analytics/CRM tools

**API Key Management**: Create keys in v0 app settings (exact URL may change)

### 1.7 Limitations and Constraints

| Limitation | Description |
|------------|-------------|
| Framework Lock-in | Primarily React/Next.js output |
| Styling Lock-in | Tailwind CSS required |
| API Cost | Usage-based billing on premium plans |
| Complex Logic | Better for UI than complex business logic |
| Accessibility | Improvements in accessibility depend on component choices and validation |

---

## 2. Blocks/DIY Tools Analysis

### 2.1 Block-Based UI Builder Ecosystem

Block-based UI builders share similar architectures, even when the underlying products differ.

**Sources**: [Mobirise](https://mobirise.com), [GrapesJS](https://grapesjs.com), [Frappe Builder](https://frappe.io/builder)

### 2.2 Common Block Architecture Pattern

```
┌─────────────────────────────────────────────┐
│           Block Manager/Registry            │
├─────────────────────────────────────────────┤
│  Block Type    │  Properties    │  Slots    │
├────────────────┼────────────────┼───────────┤
│  Hero          │  title, image  │  actions  │
│  Features      │  columns, icon │  items    │
│  Pricing       │  plans, cta    │  features │
│  Form          │  fields, submit│  inputs   │
│  Footer        │  links, social │  columns  │
└────────────────┴────────────────┴───────────┘
```

### 2.3 Key Architecture Principles

1. **Pre-designed Templates**: Reusable sections and block catalogs
2. **Drag-and-Drop Canvas**: Visual composition interface
3. **Property Panels**: Per-block configuration
4. **Code Export**: HTML/CSS/JavaScript ownership
5. **Theme Layers**: Global styling with block overrides

### 2.4 GrapesJS Architecture (Open Source Reference)

```javascript
// GrapesJS Block Definition
editor.BlockManager.add('hero-section', {
  label: 'Hero',
  category: 'Sections',
  content: {
    type: 'hero',
    attributes: { class: 'hero-section' },
    components: [
      { type: 'text', content: 'Hero Title' },
      { type: 'text', content: 'Subtitle text' },
      { type: 'button', content: 'Get Started' }
    ]
  }
});
```

### 2.5 Three-Layer UI Component Architecture

Reference: [Markus Oberlehner's Architecture](https://markus.oberlehner.net/blog/the-three-layer-ui-component-architecture-versatile-building-blocks-for-crafting-multiple-design-systems)

| Layer | Description | Example |
|-------|-------------|---------|
| **Unstyled Primitives** | Behavior + accessibility only | Radix UI Dialog |
| **Styled Primitives** | Brand-agnostic styling | shadcn/ui Button |
| **Domain Components** | Business-specific composites | DashboardCard |

---

## 3. Dyad and Full-Stack Generation

### 3.1 Overview

Dyad is a local, open-source AI app builder that generates full-stack applications from natural language prompts. A paid Pro/Max plan provides managed model access and credits.

**Sources**: [Dyad.sh](https://www.dyad.sh/), [GitHub](https://github.com/dyad-sh/dyad)

### 3.2 Key Differentiators

| Feature | v0.dev | Dyad |
|---------|--------|------|
| **Hosting** | Cloud | Local |
| **Pricing** | Subscription | Free + paid Pro/Max plans |
| **Source** | Proprietary | Open-source core (Apache 2.0); Pro features under FSL |
| **AI Provider** | Vercel models | Multiple providers (cloud + local), configurable |
| **Database** | External | Supabase integration; other providers vary |

### 3.3 Full-Stack Generation Capabilities

```
Natural Language Prompt
        ↓
┌───────────────────────────────────────┐
│         Dyad AI Engine                │
├───────────────────────────────────────┤
│  1. React UI Components               │
│  2. API Routes/Endpoints              │
│  3. Database Schema (Postgres)        │
│  4. Authentication Logic              │
│  5. File/Folder Structure             │
└───────────────────────────────────────┘
        ↓
Complete Application with Preview
```

### 3.4 Database Generation

Dyad documents **Supabase** integration (Auth, Database, Edge Functions). Release notes mention **Supabase branch** support, but branching/rollback features should be treated as capabilities of the database provider, not guaranteed by Dyad.

### 3.5 Backend + Frontend Coordination

```typescript
// Dyad generates coordinated frontend + backend

// Generated API Route
// app/api/users/route.ts
export async function GET() {
  const users = await db.select().from(usersTable);
  return Response.json(users);
}

// Generated React Component
// components/UserList.tsx
export function UserList() {
  const { data: users } = useSWR('/api/users');
  return (
    <div className="grid gap-4">
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### 3.6 Similar Tools Comparison

| Tool | Focus | Key Feature |
|------|-------|-------------|
| **Dyad** | Full-stack local | Model agnostic |
| **Lovable** | Full-stack cloud | Polished UX |
| **Replit** | Full-stack cloud | Code execution environment |
| **Bolt.new** | Full-stack cloud | StackBlitz integration |
| **Firebase Studio** | Full-stack cloud | Google ecosystem |

---

## 4. shadcn/ui as Foundation

### 4.1 Why shadcn/ui is Ideal for Generation

**Sources**: [shadcn/ui Docs](https://ui.shadcn.com/docs), [Registry Guide](https://ui.shadcn.com/docs/registry)

| Reason | Explanation |
|--------|-------------|
| **Copy-Paste Model** | No npm dependency; code lives in your project |
| **JSON Registry** | Machine-readable component definitions |
| **Radix Foundation** | Built-in accessibility and behavior |
| **Tailwind Styling** | Predictable, parseable class names |
| **CLI Automation** | `npx shadcn@latest add button` |
| **Customizable** | Full source code ownership |

### 4.2 Component Registry Architecture

```json
// registry.json structure (trimmed example)
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-components",
  "homepage": "https://acme.com/components",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "dependencies": ["@radix-ui/react-slot"],
      "files": [
        {
          "path": "ui/button.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

### 4.3 Programmatic Component Generation

```bash
# CLI Commands for Automation
npx shadcn@latest init                 # Initialize shadcn/ui in a project
npx shadcn@latest add button           # Add a component
npx shadcn@latest add https://example.com/button.json
npx shadcn@latest build                # Build registry JSON output
npx shadcn@latest search @acme -q "button"
```

### 4.4 Registry Item Schema

```typescript
// registry-item.json schema
interface RegistryItem {
  name: string;
  type: "registry:block" | "registry:component" | "registry:hook";
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    content?: string;
    type: "registry:component" | "registry:page" | "registry:hook" | "registry:file";
  }>;
  tailwind?: {
    config?: Record<string, any>;
  };
  cssVars?: Record<string, Record<string, string>>;
}
```

**Note**: Consult the registry schema for the full set of supported item types; Tailwind v4 favors `@theme` variables, so `tailwind.config` overrides are optional.

### 4.5 Custom Registry Setup

```typescript
// Hosting your own registry
// 1. Create registry.json at root
// 2. Build with: npx shadcn@latest build (outputs to ./public/r by default)
// 3. Serve JSON over HTTP
// 4. Users install: npx shadcn add https://your-registry.com/button.json
```

### 4.6 Radix UI Foundation

shadcn/ui is built on **Radix UI Primitives**:

| Radix Primitive | shadcn Component | Accessibility Features |
|-----------------|------------------|------------------------|
| Dialog | Dialog, AlertDialog | Focus trap, ESC close, ARIA |
| Dropdown | DropdownMenu | Keyboard nav, roving tabindex |
| Select | Select | Screen reader support |
| Popover | Popover, Tooltip | Positioning, focus management |
| Tabs | Tabs | Arrow key navigation |

---

## 5. Prompt-to-Component Patterns

### 5.1 Pattern Comparison Table

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Direct Generation** | LLM outputs complete JSX/TSX | Maximum flexibility, handles novel UIs | Unpredictable quality, security risks, inconsistent styling |
| **Template Filling** | LLM fills placeholders in templates | Consistent output, faster generation | Limited creativity, requires template library |
| **Component Composition** | LLM selects and arranges from catalog | Safe, predictable, maintainable | Less flexible, requires comprehensive catalog |
| **Constraint-Based** | Limited to pre-approved component catalog | Most secure, guaranteed quality | Least creative, may not cover all needs |

### 5.2 Direct Generation Pattern

```typescript
// Prompt
"Create a pricing card with three tiers"

// LLM generates complete component
export function PricingCard({ tier, price, features }) {
  return (
    <Card className={cn("p-6", tier === "pro" && "border-primary")}>
      <CardHeader>
        <CardTitle>{tier}</CardTitle>
        <div className="text-3xl font-bold">${price}/mo</div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map(f => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

### 5.3 Template Filling Pattern

```typescript
// Template Definition
const pricingCardTemplate = {
  component: "PricingCard",
  slots: {
    tierName: "{{tier_name}}",
    price: "{{monthly_price}}",
    features: "{{feature_list}}",
    ctaText: "{{cta_button_text}}"
  }
};

// LLM fills slots
{
  tier_name: "Professional",
  monthly_price: 29,
  feature_list: ["Feature A", "Feature B"],
  cta_button_text: "Get Started"
}
```

### 5.4 Component Composition Pattern

```typescript
// Component Catalog
const catalog = {
  layout: ["Container", "Grid", "Stack", "Flex"],
  display: ["Card", "Table", "List", "Badge"],
  input: ["TextField", "Select", "Checkbox", "DatePicker"],
  action: ["Button", "Link", "IconButton"],
  feedback: ["Alert", "Toast", "Progress", "Skeleton"]
};

// LLM output (composition instructions)
{
  "type": "Stack",
  "props": { "spacing": 4 },
  "children": [
    { "type": "Card", "children": [...] },
    { "type": "Button", "props": { "variant": "primary" } }
  ]
}
```

### 5.5 Constraint-Based Pattern (A2UI-Like)

```json
// Catalog-constrained declarative format (illustrative)
{
  "type": "card",
  "properties": {
    "title": "Welcome",
    "description": "Get started with our platform"
  },
  "children": [
    {
      "type": "button",
      "properties": {
        "label": "Sign Up",
        "action": "navigate",
        "target": "/signup"
      }
    }
  ]
}
```

### 5.6 Research-Backed Patterns

**Source**: [Google Research - Generative UI Paper](https://generativeui.github.io/static/pdfs/paper.pdf)

Key findings:
- LLMs are effective UI generators with proper prompting
- Generated UIs comparable to human-crafted in ~44% of cases
- Ability for robust Generative UI is emergent in newer models
- PAGEN dataset released for evaluation

**Source**: [UICoder - Automated UI Code Generation](https://ar5iv.org/abs/2406.07739)

Key approach:
- Self-generating synthetic datasets
- Automated feedback via compilers + multi-modal models
- Iterative improvement through filtered self-training

---

## 6. Agent to UI Mapping

### 6.1 Core Concept

AI agents have defined interfaces (tools with parameters, response schemas). These can be automatically mapped to UI components.

### 6.2 Tool Parameters → Input Forms

```typescript
// Agent Tool Definition
interface WeatherTool {
  name: "get_weather";
  description: "Get current weather for a location";
  parameters: {
    type: "object";
    properties: {
      location: {
        type: "string";
        description: "City name or coordinates"
      };
      units: {
        type: "string";
        enum: ["celsius", "fahrenheit"];
        default: "celsius"
      };
    };
    required: ["location"];
  };
}

// Auto-generated Form
<Form onSubmit={handleSubmit}>
  <FormField
    name="location"
    label="Location"
    required
    description="City name or coordinates"
  >
    <Input placeholder="Enter city name..." />
  </FormField>

  <FormField
    name="units"
    label="Temperature Units"
    description="Choose measurement unit"
  >
    <Select defaultValue="celsius">
      <SelectItem value="celsius">Celsius</SelectItem>
      <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
    </Select>
  </FormField>

  <Button type="submit">Get Weather</Button>
</Form>
```

### 6.3 Response Schemas → Output Displays

```typescript
// Agent Response Schema
interface WeatherResponse {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    conditions: string;
  }>;
}

// Auto-generated Display Component
<Card>
  <CardHeader>
    <CardTitle>{response.location}</CardTitle>
    <CardDescription>{response.conditions}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold">
      {response.temperature}°
    </div>
    <div className="text-muted-foreground">
      Humidity: {response.humidity}%
    </div>
  </CardContent>
  <CardFooter>
    <ForecastTable data={response.forecast} />
  </CardFooter>
</Card>
```

### 6.4 Type-to-Component Mapping Table

| JSON Schema Type | UI Component | Notes |
|------------------|--------------|-------|
| `string` | Input/TextField | Basic text input |
| `string` + `enum` | Select/RadioGroup | Dropdown for options |
| `string` + `format: email` | Input type="email" | Email validation |
| `string` + `format: date` | DatePicker | Calendar UI |
| `number` | Input type="number" | Numeric input |
| `number` + `minimum/maximum` | Slider | Range selection |
| `boolean` | Checkbox/Switch | Toggle |
| `array` | MultiSelect/Repeater | List management |
| `object` | Nested Form/Card | Grouped fields |

### 6.5 Conversation Interface Generation

```typescript
// Agent with chat capability
interface ChatAgent {
  systemPrompt: string;
  tools: Tool[];
  responseFormat?: "text" | "structured";
}

// Auto-generated Chat Interface
<ChatContainer>
  <MessageList messages={messages} />

  {/* Tool calls render as cards */}
  {toolCalls.map(call => (
    <ToolCallCard
      key={call.id}
      tool={call.tool}
      args={call.args}
      result={call.result}
    />
  ))}

  <ChatInput
    onSend={sendMessage}
    placeholder="Ask me anything..."
    attachments={agent.supportsAttachments}
  />
</ChatContainer>
```

### 6.6 Status/Progress Indicators

```typescript
// Agent execution states
type AgentState =
  | { status: "idle" }
  | { status: "thinking"; message?: string }
  | { status: "tool_calling"; tool: string; args: any }
  | { status: "streaming"; partial: string }
  | { status: "complete"; result: any }
  | { status: "error"; error: string };

// Auto-generated status display
<AgentStatus state={state}>
  {state.status === "thinking" && (
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Thinking...</span>
    </div>
  )}

  {state.status === "tool_calling" && (
    <ToolCallIndicator
      tool={state.tool}
      args={state.args}
    />
  )}

  {state.status === "streaming" && (
    <StreamingText text={state.partial} />
  )}

  {state.status === "error" && (
    <Alert variant="destructive">
      {state.error}
    </Alert>
  )}
</AgentStatus>
```

### 6.7 Error State Generation

```typescript
// Error schema from agent
interface AgentError {
  code: string;
  message: string;
  recoverable: boolean;
  suggestedAction?: string;
}

// Auto-generated error display
<Alert variant={error.recoverable ? "warning" : "destructive"}>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error: {error.code}</AlertTitle>
  <AlertDescription>
    {error.message}
    {error.suggestedAction && (
      <Button variant="outline" className="mt-2">
        {error.suggestedAction}
      </Button>
    )}
  </AlertDescription>
</Alert>
```

---

## 7. Workflow to App Mapping

### 7.1 Core Concept

Multi-step workflows can be mapped to multi-step UIs (wizards, steppers, form sequences).

### 7.2 Workflow Definition → Stepper UI

```typescript
// Workflow Definition
interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  transitions: Transition[];
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agent?: string;
  inputs: InputField[];
  outputs: OutputField[];
  validation?: ValidationRule[];
}

// Auto-generated Stepper
<Stepper currentStep={currentStep}>
  {workflow.steps.map((step, index) => (
    <Step
      key={step.id}
      title={step.name}
      description={step.description}
      status={getStepStatus(index)}
    >
      <StepContent step={step}>
        {/* Auto-generated form from step.inputs */}
        <DynamicForm
          fields={step.inputs}
          onSubmit={(data) => completeStep(step.id, data)}
        />
      </StepContent>
    </Step>
  ))}
</Stepper>
```

### 7.3 Conditional UI Branching

```typescript
// Workflow with conditional paths
const workflow = {
  steps: [
    { id: "start", name: "Choose Path" },
    { id: "path_a", name: "Option A", condition: "choice === 'a'" },
    { id: "path_b", name: "Option B", condition: "choice === 'b'" },
    { id: "end", name: "Complete" }
  ],
  transitions: [
    { from: "start", to: "path_a", condition: "choice === 'a'" },
    { from: "start", to: "path_b", condition: "choice === 'b'" },
    { from: "path_a", to: "end" },
    { from: "path_b", to: "end" }
  ]
};

// UI renders only active path
<ConditionalStepper workflow={workflow} state={workflowState}>
  {/* Only shows relevant steps based on conditions */}
</ConditionalStepper>
```

### 7.4 Form Sequence Pattern

```typescript
// Multi-form workflow
const onboardingWorkflow = {
  forms: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "email", required: true }
      ]
    },
    {
      id: "preferences",
      title: "Your Preferences",
      fields: [
        { name: "theme", type: "select", options: ["light", "dark"] },
        { name: "notifications", type: "boolean" }
      ]
    },
    {
      id: "review",
      title: "Review & Confirm",
      type: "summary"
    }
  ]
};

// Auto-generated multi-step form
<FormWizard
  forms={onboardingWorkflow.forms}
  onComplete={handleComplete}
>
  {({ currentForm, data, next, back }) => (
    <Card>
      <CardHeader>
        <CardTitle>{currentForm.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {currentForm.type === "summary" ? (
          <DataSummary data={data} />
        ) : (
          <DynamicForm fields={currentForm.fields} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={back}>Back</Button>
        <Button onClick={next}>
          {currentForm.type === "summary" ? "Confirm" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )}
</FormWizard>
```

### 7.5 Progress Tracking

```typescript
// Workflow progress state
interface WorkflowProgress {
  currentStep: string;
  completedSteps: string[];
  stepData: Record<string, any>;
  startedAt: Date;
  estimatedCompletion?: Date;
}

// Auto-generated progress UI
<div className="space-y-4">
  <Progress
    value={(completedSteps.length / totalSteps) * 100}
  />

  <div className="flex justify-between text-sm text-muted-foreground">
    <span>Step {currentStepIndex + 1} of {totalSteps}</span>
    <span>~{estimatedTimeRemaining} remaining</span>
  </div>

  <StepIndicators steps={workflow.steps} current={currentStep} />
</div>
```

### 7.6 Workflow Visualization

```
┌──────────────────────────────────────────────────────────────┐
│                    Workflow Progress                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ●────────●────────●────────○────────○                       │
│  Start   Step 1   Step 2   Step 3   Complete                │
│  ✓       ✓        Current                                   │
│                                                              │
│  ┌─────────────────────────────────────┐                    │
│  │          Step 2: Configure          │                    │
│  │  ┌───────────────────────────────┐  │                    │
│  │  │  Setting Name: [___________]  │  │                    │
│  │  │  Value:        [___________]  │  │                    │
│  │  │  ☑ Enable feature             │  │                    │
│  │  └───────────────────────────────┘  │                    │
│  │            [Back]  [Next →]         │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. A2UI Integration

### 8.1 A2UI Protocol Overview

**Source**: [A2UI v0.8 Spec](https://a2ui.org/specification/v0.8-a2ui/), [A2UI v0.9 Spec (Draft)](https://a2ui.org/specification/v0.9-a2ui/), [A2UI GitHub](https://github.com/google/A2UI)

A2UI (Agent-to-User Interface) is a declarative, streaming JSONL protocol enabling AI agents to request UI updates across platforms.

### 8.2 Key Characteristics

| Feature | Description |
|---------|-------------|
| **Security-First** | Declarative data, not executable code |
| **LLM-Friendly** | Flat, streaming JSONL messages for easy generation |
| **Framework-Agnostic** | One response works everywhere |
| **Real-Time Streaming** | UI builds incrementally |

### 8.3 A2UI vs Static Generation

| Aspect | A2UI (Runtime) | Static Generation |
|--------|----------------|-------------------|
| **When** | Runtime, per-interaction | Build time |
| **Output** | JSON instructions | React/Vue components |
| **Flexibility** | High - adapts per context | Fixed after generation |
| **Security** | Catalog-constrained | Full code access |
| **Performance** | Render overhead | Pre-compiled |
| **Versioning** | No deploy needed | Requires rebuild |

### 8.4 When to Use Each Approach

**Use A2UI when:**
- UI needs to adapt dynamically to conversation
- Multiple agents contribute to single UI
- Cross-platform consistency required
- Security is paramount (no code execution)

**Use Static Generation when:**
- UI structure is known upfront
- Maximum performance needed
- Complex custom components required
- Code ownership and customization priority

### 8.5 A2UI JSONL Message Format (v0.8 example)

```json
{"surfaceUpdate":{"surfaceId":"s1","components":[
  {"id":"root","type":"column","children":{"explicitList":["card-1"]}},
  {"id":"card-1","type":"card","properties":{"title":"Weather in Seattle","subtitle":"Current conditions"},"children":{"explicitList":["temp-display","action-btn"]}},
  {"id":"temp-display","type":"text","properties":{"content":"72°F","style":"heading-large"}},
  {"id":"action-btn","type":"button","properties":{"label":"Get Forecast","action":{"type":"callback","id":"get_forecast"}}}
]}}
{"dataModelUpdate":{"surfaceId":"s1","data":{"unit":"F"}}}
{"beginRendering":{"surfaceId":"s1","root":"root","catalogId":"standard@0.8"}}
```

**Notes**:
- Components are sent as a flat list with ID-based relationships (adjacency list), enabling incremental rendering.
- v0.9 introduces different message names (e.g., `createSurface`, `updateComponents`, `updateDataModel`) and is still in draft.

### 8.6 Hybrid Patterns

```typescript
// Pattern: Static shell with A2UI dynamic content

// Static React wrapper (generated once)
export function AgentDashboard({ agentId }) {
  const [a2uiContent, setA2uiContent] = useState(null);

  return (
    <div className="dashboard-layout">
      {/* Static header */}
      <Header agentId={agentId} />

      {/* Dynamic A2UI content area */}
      <main className="flex-1">
        <A2UIRenderer
          content={a2uiContent}
          catalog={componentCatalog}
          onAction={handleAgentAction}
        />
      </main>

      {/* Static footer */}
      <Footer />
    </div>
  );
}
```

### 8.7 A2UI Component Catalog

```typescript
// Define trusted component catalog
const componentCatalog: A2UICatalog = {
  // Layout
  card: CardComponent,
  container: ContainerComponent,
  grid: GridComponent,

  // Display
  text: TextComponent,
  image: ImageComponent,
  badge: BadgeComponent,

  // Input
  textField: TextFieldComponent,
  select: SelectComponent,
  checkbox: CheckboxComponent,

  // Action
  button: ButtonComponent,
  link: LinkComponent,

  // Feedback
  alert: AlertComponent,
  progress: ProgressComponent,
  skeleton: SkeletonComponent
};
```

### 8.8 Integration with AG-UI

**Source**: [CopilotKit AG-UI](https://www.copilotkit.ai/ag-ui)

AG-UI (Agent-User Interaction) provides the bi-directional runtime connection:

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
└─────────────────────┬───────────────────────────────┘
                      │ AG-UI Protocol
                      │ (bidirectional)
┌─────────────────────▼───────────────────────────────┐
│                   Agent Backend                      │
│  ┌─────────────────────────────────────────────┐   │
│  │           Agent Logic / LLM                  │   │
│  └─────────────────┬───────────────────────────┘   │
│                    │ A2UI Format                    │
│  ┌─────────────────▼───────────────────────────┐   │
│  │         A2UI Response Generation             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 9. Theming and White-Labeling

### 9.1 Tailwind Theme Variables (@theme)

**Source**: [Tailwind CSS Docs](https://tailwindcss.com/docs/theme)

```css
/* Tailwind @theme directive */
@theme {
  /* Brand Colors */
  --color-brand-50: #f0f9ff;
  --color-brand-500: #0ea5e9;
  --color-brand-900: #0c4a6e;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-heading: "Cal Sans", sans-serif;

  /* Spacing */
  --spacing-section: 4rem;
  --radius-card: 0.75rem;

  /* Shadows */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 9.2 CSS Variables Approach

```css
/* Root theme variables */
:root {
  /* Primary brand color */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  /* Background */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Border radius */
  --radius: 0.5rem;
}

/* Dark mode override */
.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### 9.3 White-Label Brand Configuration

```typescript
// Brand configuration schema
interface BrandConfig {
  // Identity
  name: string;
  logo: {
    light: string;
    dark: string;
    favicon: string;
  };

  // Colors
  colors: {
    primary: string;      // HSL format
    secondary: string;
    accent: string;
    destructive: string;
    // ... more colors
  };

  // Typography
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };

  // Appearance
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadows: 'none' | 'sm' | 'md' | 'lg';
}

// Apply brand config
function applyBrandConfig(config: BrandConfig) {
  const root = document.documentElement;

  // Apply colors
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply radius
  const radiusMap = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' };
  root.style.setProperty('--radius', radiusMap[config.borderRadius]);

  // Apply fonts
  root.style.setProperty('--font-heading', config.fonts.heading);
  root.style.setProperty('--font-body', config.fonts.body);
}
```

### 9.4 Multi-Brand Support with Data Attributes

```css
/* Brand-specific themes */
[data-brand="acme"] {
  --primary: 240 100% 50%;
  --primary-foreground: 0 0% 100%;
  --radius: 0.5rem;
}

[data-brand="widget-co"] {
  --primary: 150 100% 40%;
  --primary-foreground: 0 0% 100%;
  --radius: 1rem;
}

[data-brand="tech-corp"] {
  --primary: 0 0% 10%;
  --primary-foreground: 0 0% 100%;
  --radius: 0;
}
```

### 9.5 Logo and Asset Injection

```typescript
// Dynamic asset injection
interface WhiteLabelAssets {
  logo: string;
  favicon: string;
  ogImage: string;
  customCSS?: string;
}

function injectWhiteLabelAssets(assets: WhiteLabelAssets) {
  // Logo
  document.querySelectorAll('[data-logo]').forEach(el => {
    if (el instanceof HTMLImageElement) {
      el.src = assets.logo;
    }
  });

  // Favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.setAttribute('href', assets.favicon);

  // Custom CSS
  if (assets.customCSS) {
    const style = document.createElement('style');
    style.textContent = assets.customCSS;
    document.head.appendChild(style);
  }
}
```

### 9.6 shadcn/ui Theme Generation

```typescript
// Generate shadcn theme from brand config
function generateShadcnTheme(brand: BrandConfig): string {
  return `
@layer base {
  :root {
    --background: ${brand.colors.background};
    --foreground: ${brand.colors.foreground};
    --primary: ${brand.colors.primary};
    --primary-foreground: ${brand.colors.primaryForeground};
    --secondary: ${brand.colors.secondary};
    --secondary-foreground: ${brand.colors.secondaryForeground};
    --muted: ${brand.colors.muted};
    --muted-foreground: ${brand.colors.mutedForeground};
    --accent: ${brand.colors.accent};
    --accent-foreground: ${brand.colors.accentForeground};
    --destructive: ${brand.colors.destructive};
    --destructive-foreground: ${brand.colors.destructiveForeground};
    --border: ${brand.colors.border};
    --input: ${brand.colors.input};
    --ring: ${brand.colors.ring};
    --radius: ${brand.borderRadius};
  }
}
  `;
}
```

---

## 10. Embedding and Distribution

### 10.1 Distribution Options Overview

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| **iframe** | Simple embed | Isolation, easy | Limited interaction, SEO |
| **Web Components** | Framework-agnostic | Works anywhere | Bundle size, shadow DOM |
| **React Export** | React apps | Full integration | React dependency |
| **Standalone App** | Deployment | Complete control | Hosting required |
| **CDN Bundle** | Quick integration | Easy, fast | Less customizable |

### 10.2 iframe Embedding

```html
<!-- Simple iframe embed -->
<iframe
  src="https://app.example.com/embed/agent/123"
  width="100%"
  height="600"
  frameborder="0"
  allow="clipboard-write"
></iframe>

<!-- With configuration via URL params -->
<iframe
  src="https://app.example.com/embed/agent/123?theme=dark&primaryColor=0ea5e9"
  width="100%"
  height="600"
></iframe>
```

```typescript
// iframe communication via postMessage
// Parent window
const iframe = document.querySelector('iframe');

// Send config to embedded app
iframe.contentWindow.postMessage({
  type: 'CONFIG_UPDATE',
  payload: { theme: 'dark', user: currentUser }
}, 'https://app.example.com');

// Receive events from embedded app
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://app.example.com') return;

  if (event.data.type === 'AGENT_RESPONSE') {
    handleAgentResponse(event.data.payload);
  }
});
```

### 10.3 Web Components Conversion

**Source**: [React to Web Component](https://www.bitovi.com/open-source/react-to-web-component)

```typescript
// Using @r2wc/react-to-web-component
import r2wc from "@r2wc/react-to-web-component";
import { AgentChat } from "./components/AgentChat";

// Convert React component to Web Component
const AgentChatWebComponent = r2wc(AgentChat, {
  props: {
    agentId: "string",
    theme: "string",
    onMessage: "function"
  }
});

// Register custom element
customElements.define("agent-chat", AgentChatWebComponent);
```

```html
<!-- Usage in any HTML -->
<agent-chat
  agent-id="abc123"
  theme="dark"
></agent-chat>

<script src="https://cdn.example.com/agent-chat.js"></script>
```

### 10.4 React Component Export

```typescript
// Exportable React component package
// package: @mycompany/agent-ui

export { AgentChat } from "./AgentChat";
export { AgentForm } from "./AgentForm";
export { AgentDashboard } from "./AgentDashboard";
export { ThemeProvider } from "./ThemeProvider";

// Usage in consumer app
import { AgentChat, ThemeProvider } from "@mycompany/agent-ui";

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <AgentChat agentId="abc123" />
    </ThemeProvider>
  );
}
```

### 10.5 Standalone Deployable App

```typescript
// Export as standalone Next.js/Vite app
interface StandaloneAppConfig {
  agentId: string;
  branding: BrandConfig;
  features: {
    chat: boolean;
    forms: boolean;
    dashboard: boolean;
  };
  auth?: {
    provider: 'clerk' | 'auth0' | 'custom';
    config: Record<string, any>;
  };
}

// Build script generates deployable app
async function buildStandaloneApp(config: StandaloneAppConfig) {
  // 1. Generate app from template
  // 2. Inject branding/config
  // 3. Build with Vite/Next.js
  // 4. Output deployable bundle
  return {
    outputDir: './dist',
    files: ['index.html', 'assets/*'],
    deployment: {
      vercel: generateVercelConfig(config),
      netlify: generateNetlifyConfig(config),
      docker: generateDockerfile(config)
    }
  };
}
```

### 10.6 CDN Distribution

```html
<!-- UMD bundle via CDN -->
<script src="https://cdn.example.com/agent-ui@1.0.0/agent-ui.umd.js"></script>
<link rel="stylesheet" href="https://cdn.example.com/agent-ui@1.0.0/styles.css">

<script>
  // Initialize from global
  AgentUI.init({
    container: '#agent-container',
    agentId: 'abc123',
    theme: {
      primary: '#0ea5e9'
    }
  });
</script>
```

```typescript
// Build configuration for UMD bundle
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'AgentUI',
      formats: ['umd', 'es'],
      fileName: (format) => `agent-ui.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

### 10.7 Module Federation (Micro-frontends)

```typescript
// webpack.config.js for Module Federation
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'agentUI',
      filename: 'remoteEntry.js',
      exposes: {
        './AgentChat': './src/components/AgentChat',
        './AgentForm': './src/components/AgentForm',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// Consumer app loads at runtime
const AgentChat = React.lazy(() =>
  import('agentUI/AgentChat')
);
```

---

## 11. Code Quality in Generated UI

### 11.1 Accessibility (a11y) Requirements

**Source**: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/), [WCAG Tools](https://www.w3.org/WAI/test-evaluate/tools/list/)

```typescript
// Accessibility checklist for generated components
interface A11yRequirements {
  // WCAG 2.1 AA Compliance
  colorContrast: {
    normalText: 4.5;    // minimum ratio
    largeText: 3;       // minimum ratio
    uiComponents: 3;    // minimum ratio
  };

  // Keyboard Navigation
  keyboard: {
    focusVisible: true;        // WCAG 2.4.7
    focusOrder: true;          // WCAG 2.4.3
    noKeyboardTrap: true;      // WCAG 2.1.2
  };

  // Screen Reader Support
  aria: {
    landmarks: true;           // main, nav, etc.
    liveRegions: true;         // aria-live
    labelledElements: true;    // aria-label/labelledby
  };

  // Forms
  forms: {
    labelAssociation: true;    // WCAG 1.3.1
    errorIdentification: true; // WCAG 3.3.1
    inputPurpose: true;        // WCAG 1.3.5
  };
}
```

### 11.2 Automated Accessibility Testing

```typescript
// Integration with axe-core for generated code validation
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

async function validateGeneratedComponent(component: React.ReactElement) {
  const { container } = render(component);
  const results = await axe(container);

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
    score: calculateA11yScore(results)
  };
}

// Auto-fix suggestions
function suggestA11yFixes(violations: axe.Result[]) {
  return violations.map(v => ({
    issue: v.description,
    impact: v.impact,
    fix: v.help,
    elements: v.nodes.map(n => n.html),
    suggestion: generateFix(v)
  }));
}
```

### 11.3 Responsive Design Requirements

```typescript
// Responsive breakpoints and testing
const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

// Generated component should handle all breakpoints
interface ResponsiveRequirements {
  // Layout
  flexibleGrid: boolean;           // Grid adapts to screen size
  noHorizontalScroll: boolean;     // No unexpected overflow
  touchTargets: {
    minSize: 44;                   // Minimum 44x44px
  };

  // Typography
  fluidTypography: boolean;        // Scales appropriately
  readableLineLength: {
    min: 45;                       // characters
    max: 75;                       // characters
  };

  // Images
  responsiveImages: boolean;       // srcset/sizes
  aspectRatioPreserved: boolean;
}

// Tailwind responsive utilities in generated code
const responsiveClasses = {
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  text: "text-sm md:text-base lg:text-lg",
  padding: "p-4 md:p-6 lg:p-8",
  display: "hidden md:block"
};
```

### 11.4 Performance Considerations

```typescript
// Performance requirements for generated UI
interface PerformanceRequirements {
  // Bundle size
  initialJS: {
    target: 100;               // KB gzipped
    max: 200;
  };

  // Core Web Vitals
  lcp: {
    target: 2500;              // ms
    max: 4000;
  };
  fid: {
    target: 100;               // ms
    max: 300;
  };
  cls: {
    target: 0.1;
    max: 0.25;
  };

  // Component-specific
  rerenders: {
    maxPerInteraction: 3;
  };
}

// Optimization patterns in generated code
const optimizationPatterns = {
  // Lazy loading
  lazyComponent: `const Chart = lazy(() => import('./Chart'))`,

  // Memoization
  memoizedComponent: `const MemoizedList = memo(List)`,

  // Image optimization
  optimizedImage: `<Image src={src} width={w} height={h} loading="lazy" />`,

  // Code splitting
  dynamicImport: `const Module = dynamic(() => import('./Module'))`
};
```

### 11.5 Type Safety

```typescript
// TypeScript requirements for generated code
interface TypeSafetyRequirements {
  // Component props
  propsTyped: boolean;             // All props have types
  noAnyTypes: boolean;             // Avoid 'any'
  strictNullChecks: boolean;       // Handle null/undefined

  // Events
  eventHandlersTyped: boolean;     // Proper event types

  // API responses
  apiResponsesTyped: boolean;      // Zod/interface validation
}

// Example typed generated component
interface GeneratedCardProps {
  title: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }>;
}

export function GeneratedCard({
  title,
  description,
  image,
  actions
}: GeneratedCardProps) {
  // Type-safe implementation
}
```

### 11.6 Testing Generated Code

```typescript
// Test generation alongside component generation
interface GeneratedTests {
  // Unit tests
  unitTests: {
    renders: boolean;              // Basic render test
    propsWork: boolean;            // Props affect output
    eventsWork: boolean;           // Event handlers fire
  };

  // Integration tests
  integrationTests: {
    apiInteraction: boolean;       // API calls work
    stateManagement: boolean;      // State updates correctly
  };

  // Visual regression
  visualTests: {
    snapshots: boolean;            // Component snapshots
    storybook: boolean;            // Storybook stories
  };
}

// Auto-generated test example
export const generatedTest = `
import { render, screen, fireEvent } from '@testing-library/react';
import { GeneratedCard } from './GeneratedCard';

describe('GeneratedCard', () => {
  it('renders title correctly', () => {
    render(<GeneratedCard title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when action button clicked', () => {
    const handleClick = jest.fn();
    render(
      <GeneratedCard
        title="Test"
        actions={[{ label: 'Click', onClick: handleClick }]}
      />
    );
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
`;
```

---

## 12. Implementation Architecture

### 12.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agent/Workflow Definition                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Agent Config │  │ Tool Schemas │  │ Response Schemas     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UI Generation Service                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Generation Engine                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ Schema      │  │ LLM-Based   │  │ Template-Based  │  │   │
│  │  │ Analyzer    │  │ Generator   │  │ Generator       │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Assembly                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ shadcn/ui    │  │ Custom       │  │ A2UI                 │  │
│  │ Components   │  │ Components   │  │ Renderer             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Theme Application                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ CSS Variables│  │ Brand Config │  │ Asset Injection      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Export / Deploy                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │ Embed   │  │ Web     │  │ React   │  │ Static  │  │ CDN   │ │
│  │ (iframe)│  │ Component│ │ Package │  │ Deploy  │  │ Bundle│ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └───────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Generation Service Architecture

```typescript
// Core generation service
interface UIGenerationService {
  // Input analysis
  analyzeDefinition(def: AgentDefinition | WorkflowDefinition): UIBlueprint;

  // Generation strategies
  generateFromSchema(blueprint: UIBlueprint): GeneratedUI;
  generateFromPrompt(prompt: string, context?: Context): GeneratedUI;
  generateFromTemplate(template: string, data: any): GeneratedUI;

  // Output formats
  toReactComponents(): ReactComponent[];
  toA2UIFormat(): A2UIResponse;
  toStaticHTML(): string;

  // Validation
  validateAccessibility(ui: GeneratedUI): A11yReport;
  validateResponsiveness(ui: GeneratedUI): ResponsiveReport;
}

// Blueprint intermediate representation
interface UIBlueprint {
  // Structure
  layout: LayoutDefinition;
  components: ComponentDefinition[];

  // Data binding
  inputs: InputBinding[];
  outputs: OutputBinding[];

  // Interactions
  actions: ActionDefinition[];
  events: EventDefinition[];

  // Styling
  theme: ThemeConfig;
  responsive: ResponsiveConfig;
}
```

### 12.3 Schema-to-UI Mapping Engine

```typescript
// Automatic mapping from JSON Schema to UI components
class SchemaToUIMapper {
  private componentRegistry: ComponentRegistry;

  mapToForm(schema: JSONSchema7): FormDefinition {
    const fields: FormField[] = [];

    for (const [key, prop] of Object.entries(schema.properties || {})) {
      fields.push(this.mapPropertyToField(key, prop, schema.required?.includes(key)));
    }

    return { fields, validation: this.extractValidation(schema) };
  }

  private mapPropertyToField(
    name: string,
    prop: JSONSchema7,
    required: boolean
  ): FormField {
    // Type-based mapping
    const componentType = this.inferComponentType(prop);

    return {
      name,
      component: componentType,
      label: prop.title || humanize(name),
      description: prop.description,
      required,
      defaultValue: prop.default,
      validation: this.extractFieldValidation(prop),
      props: this.extractComponentProps(prop, componentType)
    };
  }

  private inferComponentType(prop: JSONSchema7): string {
    if (prop.enum) return 'Select';
    if (prop.type === 'boolean') return 'Checkbox';
    if (prop.type === 'number') {
      if (prop.minimum !== undefined && prop.maximum !== undefined) {
        return 'Slider';
      }
      return 'NumberInput';
    }
    if (prop.type === 'string') {
      if (prop.format === 'date') return 'DatePicker';
      if (prop.format === 'email') return 'EmailInput';
      if (prop.format === 'uri') return 'UrlInput';
      if ((prop.maxLength || 0) > 100) return 'Textarea';
      return 'Input';
    }
    if (prop.type === 'array') return 'MultiSelect';
    if (prop.type === 'object') return 'NestedForm';

    return 'Input';
  }
}
```

### 12.4 Component Registry System

```typescript
// Registry for available UI components
interface ComponentRegistry {
  // Component categories
  layout: Record<string, ComponentDefinition>;
  input: Record<string, ComponentDefinition>;
  display: Record<string, ComponentDefinition>;
  feedback: Record<string, ComponentDefinition>;
  action: Record<string, ComponentDefinition>;

  // Registry operations
  register(name: string, definition: ComponentDefinition): void;
  get(name: string): ComponentDefinition | undefined;
  search(query: string): ComponentDefinition[];

  // Generation
  generateCode(name: string, props: any): string;
  generateA2UI(name: string, props: any): A2UIComponent;
}

// Component definition
interface ComponentDefinition {
  name: string;
  category: string;
  description: string;

  // Props schema
  propsSchema: JSONSchema7;

  // Code templates
  templates: {
    react: string;
    a2ui: string;
    html: string;
  };

  // Dependencies
  imports: string[];
  dependencies: string[];

  // Variants
  variants?: Record<string, Partial<ComponentDefinition>>;
}
```

### 12.5 Template-Based Generation

```typescript
// Template engine for consistent generation
class TemplateEngine {
  private templates: Map<string, Template>;

  // Register templates
  registerTemplate(name: string, template: string, schema: JSONSchema7) {
    this.templates.set(name, {
      content: template,
      schema,
      compiled: this.compile(template)
    });
  }

  // Generate from template
  generate(templateName: string, data: any): string {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    // Validate data against schema
    this.validate(data, template.schema);

    // Apply template
    return template.compiled(data);
  }
}

// Example templates
const templates = {
  agentChatUI: `
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function {{agentName}}Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{{title}}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Message list */}
          <div className="h-96 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="{{placeholder}}"
            />
            <Button>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
  `,

  workflowWizard: `
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function {{workflowName}}Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = {{steps}};

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <Progress value={(currentStep / steps.length) * 100} />
      </CardHeader>
      <CardContent>
        {/* Step content rendered here */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(s => s - 1)}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button onClick={() => setCurrentStep(s => s + 1)}>
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}
  `
};
```

### 12.6 LLM-Enhanced Generation

```typescript
// LLM-based generation for complex/custom UIs
class LLMUIGenerator {
  private llm: LLMClient;
  private componentRegistry: ComponentRegistry;

  async generateUI(prompt: string, context: GenerationContext): Promise<GeneratedUI> {
    // 1. Analyze prompt and context
    const analysis = await this.analyzeRequirements(prompt, context);

    // 2. Select generation strategy
    const strategy = this.selectStrategy(analysis);

    // 3. Generate based on strategy
    let result: GeneratedUI;

    switch (strategy) {
      case 'composition':
        // LLM selects and arranges existing components
        result = await this.generateByComposition(analysis);
        break;

      case 'template':
        // LLM fills template with appropriate data
        result = await this.generateByTemplate(analysis);
        break;

      case 'direct':
        // LLM generates code directly (for novel UIs)
        result = await this.generateDirect(analysis);
        break;
    }

    // 4. Validate and fix
    result = await this.validateAndFix(result);

    return result;
  }

  private async generateByComposition(analysis: RequirementAnalysis): Promise<GeneratedUI> {
    const systemPrompt = `
You are a UI composition engine. Given requirements, select and arrange components from the available catalog.

Available components:
${this.componentRegistry.getComponentList()}

Output a JSON structure describing the component tree.
    `;

    const response = await this.llm.generate({
      system: systemPrompt,
      user: JSON.stringify(analysis),
      responseFormat: { type: 'json_object' }
    });

    return this.parseCompositionResponse(response);
  }
}
```

---

## 13. Recommendations

### 13.1 Recommended Architecture for Hyyve Platform

Based on this research, here is the recommended approach for UI generation:

#### Tier 1: Schema-Driven Generation (Primary)
- Use tool parameter schemas to auto-generate input forms
- Use response schemas to auto-generate output displays
- Leverage shadcn/ui registry for consistent, accessible components
- Implement type-to-component mapping for predictable generation

#### Tier 2: Template-Based Generation (Secondary)
- Create templates for common patterns (chat, wizard, dashboard)
- LLM fills templates with agent/workflow-specific data
- Faster, more reliable than full generation

#### Tier 3: LLM-Enhanced Generation (When Needed)
- Use v0 API or custom LLM for novel UI requirements
- Apply AutoFix patterns for validation
- Constrain output to component catalog for consistency

### 13.2 Technology Stack Recommendations

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Component Foundation** | shadcn/ui + Radix | Accessibility, customizable, registry system |
| **Styling** | Tailwind CSS (@theme) | CSS variables, theme tokens, programmatic |
| **Runtime Dynamic UI** | A2UI Protocol | Safe, cross-platform, streaming |
| **Generation Engine** | Custom + v0 API | Schema-driven + LLM fallback |
| **Distribution** | Web Components + CDN | Framework-agnostic, easy embed |
| **Testing** | axe-core + Playwright | Accessibility + E2E |

### 13.3 Implementation Phases

**Phase 1: Foundation**
1. Set up shadcn/ui registry with custom components
2. Implement schema-to-form mapper
3. Create basic template library

**Phase 2: Generation Engine**
1. Build component registry with full catalog
2. Implement template-based generation
3. Integrate v0 API for complex UIs

**Phase 3: Distribution**
1. Build Web Component wrapper
2. Set up CDN distribution
3. Implement iframe embedding

**Phase 4: A2UI Integration**
1. Implement A2UI renderer
2. Build component catalog for A2UI
3. Enable runtime dynamic UI

### 13.4 Key Success Criteria

| Metric | Target |
|--------|--------|
| Generation time (schema-based) | < 100ms |
| Generation time (LLM-based) | < 5s |
| Accessibility score | 100% WCAG 2.1 AA |
| Bundle size (embed) | < 100KB gzipped |
| Component coverage | 50+ shadcn components |
| Theme application time | < 50ms |

---

## Validation Notes (2026-01-21)

- v0 internal model orchestration is not publicly documented; treat any composite-model details as speculative unless Vercel publishes specifics.
- v0 app UI/UX features (e.g., Design Mode) are plan-dependent and may change; verify in-product for the target plan.
- A2UI v0.9 is a draft; confirm message naming and surface semantics before building a production parser.
- Dyad provider support and Pro/Max offerings evolve quickly; re-check release notes for provider-specific capabilities.
- Performance and bundle-size targets in this document are aspirational; validate against benchmarks in your own stack.

---

## References

### Primary Sources

1. [v0.app Documentation](https://v0.app/docs/)
2. [v0 Model API](https://v0.app/docs/api/model)
3. [v0 Platform API Overview](https://v0.app/docs/api/platform/overview)
4. [v0 Pricing](https://v0.app/docs/pricing)
5. [v0 Enterprise / API Access](https://v0.app/enterprise)
6. [A2UI Protocol v0.8 Spec](https://a2ui.org/specification/v0.8-a2ui/)
7. [A2UI Protocol v0.9 Spec (Draft)](https://a2ui.org/specification/v0.9-a2ui/)
8. [A2UI GitHub](https://github.com/google/A2UI)
9. [CopilotKit AG-UI](https://www.copilotkit.ai/ag-ui)
10. [shadcn/ui Registry](https://ui.shadcn.com/docs/registry)
11. [shadcn Registry JSON](https://ui.shadcn.com/docs/registry/registry-json)
12. [shadcn Registry Item JSON](https://ui.shadcn.com/docs/registry/registry-item-json)
13. [shadcn CLI](https://ui.shadcn.com/docs/cli)
14. [Radix UI Primitives](https://www.radix-ui.com/primitives)
15. [Tailwind CSS Theme](https://tailwindcss.com/docs/theme)
16. [Dyad](https://www.dyad.sh/)
17. [Dyad Supabase Integration](https://www.dyad.sh/docs/integrations/supabase)
18. [Dyad Pricing](https://www.dyad.sh/plans)
19. [Dyad Release 0.25.0](https://github.com/dyad-sh/dyad/releases/tag/v0.25.0)

### Research Papers

1. [Generative UI: LLMs are Effective UI Generators](https://generativeui.github.io/static/pdfs/paper.pdf) - Google Research
2. [UICoder: Finetuning LLMs for UI Code](https://ar5iv.org/abs/2406.07739) - arXiv
3. [GUIDE: LLM-Driven GUI Generation](https://ar5iv.org/abs/2502.21068) - arXiv
4. [Prompt Middleware](https://ar5iv.org/abs/2307.01142) - arXiv

### Tools and Libraries

1. [React to Web Component](https://www.bitovi.com/open-source/react-to-web-component)
2. [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
3. [GrapesJS Block Editor](https://grapesjs.com)

---

## Appendix A: Component Mapping Reference

### JSON Schema Type to Component

| Schema | Component | Props Generated |
|--------|-----------|-----------------|
| `{ type: "string" }` | `<Input />` | `type="text"` |
| `{ type: "string", enum: [...] }` | `<Select />` | `options={enum}` |
| `{ type: "string", format: "email" }` | `<Input />` | `type="email"` |
| `{ type: "string", format: "date" }` | `<DatePicker />` | - |
| `{ type: "string", maxLength: >100 }` | `<Textarea />` | `maxLength` |
| `{ type: "number" }` | `<Input />` | `type="number"` |
| `{ type: "number", min, max }` | `<Slider />` | `min, max, step` |
| `{ type: "boolean" }` | `<Checkbox />` | `checked` |
| `{ type: "array", items: {...} }` | `<MultiSelect />` | `options` |
| `{ type: "object" }` | `<Card><Form /></Card>` | Nested fields |

### Agent State to UI Component

| Agent State | Component | Display |
|-------------|-----------|---------|
| `idle` | - | Default state |
| `thinking` | `<Spinner />` | Loading indicator |
| `tool_calling` | `<ToolCallCard />` | Tool name + args |
| `streaming` | `<StreamingText />` | Partial response |
| `complete` | `<ResponseDisplay />` | Full result |
| `error` | `<Alert variant="destructive" />` | Error message |

---

## Appendix B: A2UI Component Catalog Example

**Note**: Illustrative structure only; refer to the official A2UI standard catalog for the exact schema.

```json
{
  "catalog": {
    "layout": {
      "card": {
        "properties": ["title", "subtitle", "padding"],
        "children": true
      },
      "container": {
        "properties": ["maxWidth", "padding"],
        "children": true
      },
      "grid": {
        "properties": ["columns", "gap"],
        "children": true
      },
      "stack": {
        "properties": ["direction", "spacing", "align"],
        "children": true
      }
    },
    "display": {
      "text": {
        "properties": ["content", "variant", "color"]
      },
      "heading": {
        "properties": ["content", "level"]
      },
      "image": {
        "properties": ["src", "alt", "width", "height"]
      },
      "badge": {
        "properties": ["content", "variant"]
      },
      "table": {
        "properties": ["columns", "data"]
      }
    },
    "input": {
      "textField": {
        "properties": ["label", "placeholder", "value", "required"]
      },
      "select": {
        "properties": ["label", "options", "value", "multiple"]
      },
      "checkbox": {
        "properties": ["label", "checked"]
      },
      "datePicker": {
        "properties": ["label", "value", "minDate", "maxDate"]
      }
    },
    "action": {
      "button": {
        "properties": ["label", "variant", "disabled"],
        "actions": ["callback", "navigate", "submit"]
      },
      "link": {
        "properties": ["label", "href", "external"]
      }
    },
    "feedback": {
      "alert": {
        "properties": ["title", "description", "variant"]
      },
      "progress": {
        "properties": ["value", "max", "label"]
      },
      "skeleton": {
        "properties": ["width", "height", "variant"]
      },
      "toast": {
        "properties": ["message", "duration", "variant"]
      }
    }
  }
}
```

---

*Document generated as part of Hyyve Platform technical research*

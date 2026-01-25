# Rasa Architecture Deep Dive: Patterns for Custom Chatbot Builder

> **Status**: ✅ VALIDATED (2026-01-22)
> **Validation Score**: 9.4/10
> **Sources**: DeepWiki (RasaHQ/rasa), Context7 (Rasa Platform docs), arXiv paper verification
> **Corrections Applied**: BILOU tagging scheme (line 81)

## Executive Summary: Key Patterns to Replicate

After extensive analysis of Rasa's architecture, here are the **critical patterns** we should extract for building our own conversational AI platform:

### 1. Event-Sourced Conversation State (MUST REPLICATE)
Rasa's tracker system uses **event sourcing** - every conversation change is an immutable event. This enables:
- Time-travel debugging
- State rollback
- Complete audit trails
- Easy persistence to any backend

### 2. Separation of NLU and Dialogue Management (MUST REPLICATE)
Two distinct systems that communicate via structured data:
- **NLU Pipeline**: Text -> Intent + Entities
- **Dialogue Manager**: State + Context -> Next Action

### 3. Policy Ensemble with Priorities (SHOULD REPLICATE)
Multiple prediction strategies compete, with configurable priorities:
- Rules always win (priority 6)
- ML-based policies fill gaps (priority 1-3)
- Graceful fallback handling

### 4. Slot-Based Memory System (MUST REPLICATE)
Typed slots with:
- Automatic mapping from entities
- Influence on conversation flow (configurable)
- Form-based collection patterns

### 5. Domain as Single Source of Truth (MUST REPLICATE)
One configuration defines the entire "universe" of the bot:
- What it can understand (intents, entities)
- What it remembers (slots)
- What it can do (actions, responses)

### 6. CALM Architecture for LLM Integration (CONSIDER FOR V2)
Newer pattern combining:
- LLM for semantic understanding (Commands)
- Deterministic business logic (Flows)
- Best of both worlds

---

## 1. NLU Pipeline Architecture

### DIETClassifier: The Core ML Component

**DIET = Dual Intent and Entity Transformer**

```
                    ┌─────────────────────────────────────────────────┐
                    │              DIETClassifier                      │
                    │                                                  │
User Text ──────────┤  ┌──────────┐    ┌─────────────────┐           │
                    │  │Tokenizer │───>│   Featurizers   │           │
                    │  └──────────┘    │ (Sparse+Dense)  │           │
                    │                  └────────┬────────┘           │
                    │                           │                     │
                    │                  ┌────────▼────────┐           │
                    │                  │   Transformer   │           │
                    │                  │   (Shared)      │           │
                    │                  └────────┬────────┘           │
                    │                           │                     │
                    │         ┌─────────────────┼─────────────────┐  │
                    │         │                 │                 │  │
                    │  ┌──────▼──────┐   ┌──────▼──────┐        │  │
                    │  │ __CLS__ Token│   │Token Sequence│        │  │
                    │  │  Embedding   │   │  Embeddings  │        │  │
                    │  └──────┬──────┘   └──────┬──────┘        │  │
                    │         │                 │                 │  │
                    │  ┌──────▼──────┐   ┌──────▼──────┐        │  │
                    │  │  Dot-Product │   │     CRF     │        │  │
                    │  │    Loss      │   │   Tagging   │        │  │
                    │  └──────┬──────┘   └──────┬──────┘        │  │
                    │         │                 │                 │  │
                    └─────────┼─────────────────┼─────────────────┘  │
                              │                 │                     │
                       ┌──────▼──────┐   ┌──────▼──────┐             │
                       │   Intent    │   │  Entities   │             │
                       │  + Ranking  │   │(BILOU tags) │             │
                       └─────────────┘   └─────────────┘
```

### Key Architecture Decisions:

1. **Multi-task Learning**: Single transformer serves both intent and entity tasks
2. **StarSpace Embedding**: Intent labels and utterances share same vector space
3. **CRF for Entities**: Conditional Random Field ensures valid tag sequences
4. **Plug-and-Play Featurizers**: Sparse (CountVectors) + Dense (BERT, SpaCy) combine

### Pipeline Configuration Pattern:

```yaml
pipeline:
  # Step 1: Tokenization
  - name: WhitespaceTokenizer

  # Step 2: Sparse Features (bag-of-words)
  - name: CountVectorsFeaturizer
  - name: CountVectorsFeaturizer
    analyzer: "char_wb"        # Character n-grams for typo tolerance
    min_ngram: 1
    max_ngram: 4

  # Step 3: Dense Features (pre-trained embeddings)
  - name: SpacyFeaturizer      # Or LanguageModelFeaturizer for BERT

  # Step 4: Pattern Features
  - name: RegexFeaturizer

  # Step 5: Classification + Extraction
  - name: DIETClassifier
    epochs: 100

  # Step 6: Post-processing
  - name: EntitySynonymMapper
  - name: ResponseSelector     # For FAQ/chitchat retrieval
```

### Multi-Intent Classification:

```yaml
# Enable in tokenizer
- name: WhitespaceTokenizer
  intent_tokenization_flag: true
  intent_split_symbol: "+"

# Training data
nlu:
- intent: check_balance+transfer_money
  examples: |
    - What's my balance and can I transfer $50 to John?
```

**Replication Strategy:**
- Use Hugging Face transformers for the base model
- Implement CRF layer for entity extraction
- Support multiple featurization strategies
- Make pipeline configurable via YAML/JSON

---

## 2. Dialogue Policy System Deep-Dive

### Policy Ensemble Architecture:

```
                    ┌─────────────────────────────────────────────────────┐
                    │               Policy Ensemble                        │
                    │                                                      │
Tracker State ──────┤                                                      │
                    │  ┌──────────────┐  ┌──────────────┐                 │
                    │  │ RulePolicy   │  │MemoizationPol│                 │
                    │  │ Priority: 6  │  │ Priority: 3  │                 │
                    │  │ Conf: 1.0    │  │ Conf: 1.0    │                 │
                    │  └──────┬───────┘  └──────┬───────┘                 │
                    │         │                 │                          │
                    │  ┌──────▼─────────────────▼──────┐                  │
                    │  │     Priority Resolution       │                  │
                    │  │  (Highest confidence wins,    │                  │
                    │  │   then highest priority)      │                  │
                    │  └──────────────┬────────────────┘                  │
                    │                 │                                    │
                    │  ┌──────────────┼──────────────┐                    │
                    │  │              │              │                    │
                    │  ▼              ▼              ▼                    │
                    │┌────────┐ ┌──────────┐ ┌────────────┐              │
                    ││TEDPol  │ │Unexpected│ │ Fallback   │              │
                    ││Pri: 1  │ │IntentPol │ │ Handler    │              │
                    ││ML-based│ │Pri: 2    │ │            │              │
                    │└────────┘ └──────────┘ └────────────┘              │
                    └─────────────────────────────────────────────────────┘
```

### TEDPolicy (Transformer Embedding Dialogue):

**How it works:**
1. Concatenates features: user input + previous actions + slots + active forms
2. Feeds through dialogue transformer encoder
3. Creates dialogue embeddings for each turn
4. Uses StarSpace similarity to match against action embeddings
5. Predicts contextual entities via CRF

```
Input Vector = [user_features, prev_action, slot_values, active_form]
     │
     ▼
┌─────────────┐
│  Embedding  │
│    Layer    │
└──────┬──────┘
       │
┌──────▼──────┐
│  Dialogue   │
│ Transformer │
└──────┬──────┘
       │
┌──────▼──────┐
│   Dense     │──────> Dialogue Embedding
│   Layer     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Similarity Scoring  │ (dot product with action embeddings)
│   (StarSpace)       │
└──────────┬──────────┘
           │
           ▼
     Next Action
```

### RulePolicy vs TEDPolicy:

| Aspect | RulePolicy | TEDPolicy |
|--------|-----------|-----------|
| **When to use** | Fixed patterns, FAQs, forms | Complex multi-turn, generalization |
| **Confidence** | Always 1.0 when matched | Variable based on similarity |
| **Training** | No ML training needed | Requires dialogue examples |
| **Flexibility** | Exact matches only | Generalizes to unseen paths |

### Stories vs Rules:

```yaml
# RULES: Fixed, deterministic patterns (use for forms, FAQs)
rules:
- rule: Greeting Rule
  steps:
  - intent: greet
  - action: utter_greet

- rule: Activate pizza form
  steps:
  - intent: order_pizza
  - action: pizza_form
  - active_loop: pizza_form

# STORIES: Examples for ML generalization
stories:
- story: happy path - pizza order
  steps:
  - intent: greet
  - action: utter_greet
  - intent: order_pizza
  - action: pizza_form
  - active_loop: pizza_form
  - slot_was_set:
    - pizza_size: large
  - action: utter_confirm_order
```

**Replication Strategy:**
- Implement rule-based policy as primary (simple, deterministic)
- Add ML policy for generalization (can use simpler architecture than TED)
- Priority system for policy resolution
- Support both Stories (ML training) and Rules (deterministic)

---

## 3. Slot Filling and Form Patterns

### Slot Type System:

```yaml
slots:
  # Text: Influences based on filled/unfilled
  username:
    type: text
    influence_conversation: true
    mappings:
      - type: from_entity
        entity: PERSON

  # Boolean: Three states (null, true, false)
  is_premium:
    type: bool
    influence_conversation: true
    mappings:
      - type: from_intent
        intent: affirm
        value: true
      - type: from_intent
        intent: deny
        value: false

  # Categorical: Specific value matters
  cuisine:
    type: categorical
    values:
      - italian
      - chinese
      - indian
    influence_conversation: true
    mappings:
      - type: from_entity
        entity: cuisine

  # Float: Numeric with boundaries
  amount:
    type: float
    min_value: 0
    max_value: 10000
    influence_conversation: true
    mappings:
      - type: from_entity
        entity: number

  # List: Collection of values
  pizza_toppings:
    type: list
    influence_conversation: false  # Only tracks filled/unfilled
    mappings:
      - type: from_entity
        entity: topping

  # Any: No influence on conversation (data storage only)
  raw_api_response:
    type: any
    mappings:
      - type: custom
```

### Slot Mapping Types:

```yaml
mappings:
  # 1. from_entity: Extract from NLU entity
  - type: from_entity
    entity: email
    role: work        # Optional: entity role
    group: contact    # Optional: entity group
    intent: provide_email  # Optional: only for this intent
    not_intent: chitchat   # Optional: exclude this intent

  # 2. from_text: Use entire user message
  - type: from_text
    intent: provide_feedback  # Only when this intent

  # 3. from_intent: Set fixed value based on intent
  - type: from_intent
    intent: affirm
    value: true

  # 4. from_trigger_intent: Set when form activated
  - type: from_trigger_intent
    intent: request_premium
    value: "premium_inquiry"

  # 5. custom: Filled by custom action
  - type: custom
    action: action_calculate_price
```

### Form Architecture:

```
┌──────────────────────────────────────────────────────────────┐
│                        Form Lifecycle                         │
│                                                               │
│  1. ACTIVATION                                                │
│     ┌─────────────┐                                          │
│     │ User Intent │ ──> form activated ──> active_loop set   │
│     └─────────────┘                                          │
│                                                               │
│  2. SLOT COLLECTION LOOP                                      │
│     ┌─────────────────────────────────────────┐              │
│     │ For each required_slot:                  │              │
│     │   1. Ask question (utter_ask_{slot})     │              │
│     │   2. Listen for response                 │              │
│     │   3. Extract slot value                  │              │
│     │   4. Validate (validate_{form_name})     │              │
│     │   5. Set slot or re-ask                  │              │
│     └─────────────────────────────────────────┘              │
│                                                               │
│  3. SUBMISSION                                                │
│     ┌─────────────┐                                          │
│     │ All slots   │ ──> deactivate form ──> submit action    │
│     │ filled      │                                          │
│     └─────────────┘                                          │
└──────────────────────────────────────────────────────────────┘
```

### Dynamic Form Validation:

```python
from rasa_sdk.forms import FormValidationAction

class ValidateRestaurantForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_restaurant_form"

    async def required_slots(
        self,
        domain_slots: List[Text],
        dispatcher,
        tracker,
        domain,
    ) -> List[Text]:
        # Dynamic slot requirements
        additional_slots = ["outdoor_seating"]
        if tracker.slots.get("outdoor_seating") is True:
            additional_slots.append("shade_or_sun")
        return additional_slots + domain_slots

    def validate_cuisine(
        self,
        slot_value: Any,
        dispatcher,
        tracker,
        domain,
    ) -> Dict[Text, Any]:
        # Custom validation logic
        valid_cuisines = ["italian", "chinese", "indian"]
        if slot_value.lower() in valid_cuisines:
            return {"cuisine": slot_value}
        dispatcher.utter_message(text="Please choose: italian, chinese, or indian")
        return {"cuisine": None}  # Re-ask
```

**Replication Strategy:**
- Implement typed slot system with influence flags
- Support all mapping types (entity, text, intent, custom)
- Create form component with slot collection loop
- Enable dynamic required_slots via custom logic
- Validation hooks per slot

---

## 4. Conversation Tracker Design

### Event-Sourced Architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Conversation Tracker                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Event Stream                           │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │   │
│  │  │Event1│→│Event2│→│Event3│→│Event4│→│Event5│→│Event6│   │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Replay Events → Current State                │   │
│  │                                                           │   │
│  │  {                                                        │   │
│  │    sender_id: "user123",                                  │   │
│  │    slots: {name: "John", amount: 100},                    │   │
│  │    latest_message: {intent: "transfer", entities: [...]}, │   │
│  │    events: [...],                                         │   │
│  │    active_loop: "transfer_form",                          │   │
│  │    latest_action_name: "utter_ask_recipient"              │   │
│  │  }                                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Event Types:

```python
# Core Events
UserUttered(text, intent, entities, timestamp)
BotUttered(text, data, timestamp)
ActionExecuted(action_name, policy, confidence, timestamp)
SlotSet(key, value, timestamp)
SessionStarted(timestamp)
Restarted(timestamp)  # Clears tracker

# Form Events
ActiveLoop(name)      # Form activated
LoopInterrupted(is_interrupted)

# Special Events
AllSlotsReset()
ReminderScheduled(intent, trigger_date_time)
ReminderCancelled(intent)
ActionReverted()
UserUtteranceReverted()
```

### Tracker Store Backends:

```yaml
# endpoints.yml

# In-Memory (default, lost on restart)
tracker_store:
  type: InMemoryTrackerStore

# Redis (production, fast)
tracker_store:
  type: redis
  url: localhost
  port: 6379
  db: 0
  password: secret
  record_exp: 30000  # TTL in seconds

# SQL (PostgreSQL, MySQL, SQLite)
tracker_store:
  type: SQL
  dialect: postgresql
  url: localhost
  port: 5432
  db: rasa
  username: user
  password: secret
```

### Tracker Store Schema (SQL):

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    type_name VARCHAR(255) NOT NULL,
    timestamp DOUBLE PRECISION,
    intent_name VARCHAR(255),
    action_name VARCHAR(255),
    data TEXT  -- JSON blob of full event
);

CREATE INDEX ix_sender_id ON events(sender_id);
CREATE INDEX ix_timestamp ON events(timestamp);
```

**Replication Strategy:**
- Implement event sourcing pattern (immutable event log)
- Create event types for all state changes
- Tracker reconstructs state by replaying events
- Support multiple storage backends (Redis, PostgreSQL, MongoDB)
- Enable session management with SessionStarted events

---

## 5. Custom Action Integration Patterns

### Action Server Architecture:

```
┌─────────────────┐         HTTP POST           ┌──────────────────┐
│   Rasa Server   │ ─────────────────────────> │  Action Server   │
│                 │   /webhook                  │  (Python/Any)    │
│  ┌───────────┐  │                            │                  │
│  │  Policy   │  │   Request:                 │  ┌────────────┐  │
│  │ Predicted │  │   {                        │  │  action_   │  │
│  │ action_x  │  │     next_action: "action_x"│  │  handler() │  │
│  └───────────┘  │     sender_id: "user123",  │  └─────┬──────┘  │
│                 │     tracker: {...},         │        │         │
│                 │     domain: {...}           │        │         │
│                 │   }                         │        │         │
│                 │                             │        ▼         │
│                 │                             │  ┌────────────┐  │
│                 │   Response:                 │  │  External  │  │
│                 │   {                         │  │   APIs     │  │
│  ┌───────────┐  │     events: [SlotSet(...)], │  └────────────┘  │
│  │  Apply    │<─│     responses: [...]        │                  │
│  │  Events   │  │   }                         │                  │
│  └───────────┘  │                             │                  │
└─────────────────┘                             └──────────────────┘
```

### Action Request/Response Format:

```json
// REQUEST from Rasa to Action Server
{
  "next_action": "action_check_balance",
  "sender_id": "user_123",
  "version": "3.1.0",
  "tracker": {
    "sender_id": "user_123",
    "slots": {
      "account_type": "checking",
      "authenticated": true
    },
    "latest_message": {
      "text": "what's my balance",
      "intent": {
        "name": "check_balance",
        "confidence": 0.95
      },
      "entities": []
    },
    "events": [...],
    "active_loop": null,
    "latest_action_name": "action_listen"
  },
  "domain": {
    "intents": [...],
    "entities": [...],
    "slots": {...},
    "responses": {...},
    "actions": [...]
  }
}

// RESPONSE from Action Server to Rasa
{
  "events": [
    {"event": "slot", "name": "balance", "value": 1250.00},
    {"event": "slot", "name": "last_checked", "value": "2024-01-15"}
  ],
  "responses": [
    {
      "text": "Your checking account balance is $1,250.00",
      "buttons": [
        {"title": "Transfer Money", "payload": "/transfer_money"},
        {"title": "View History", "payload": "/view_history"}
      ]
    }
  ]
}
```

### Custom Action Implementation (Rasa SDK):

```python
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, FollowupAction
from typing import Any, Text, Dict, List

class ActionCheckBalance(Action):
    def name(self) -> Text:
        return "action_check_balance"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        # Access slots
        account_type = tracker.get_slot("account_type")
        user_id = tracker.sender_id

        # Access latest message
        latest_intent = tracker.latest_message.get("intent", {}).get("name")

        # Call external API (async supported)
        balance = await self.fetch_balance(user_id, account_type)

        # Send response
        dispatcher.utter_message(
            text=f"Your {account_type} balance is ${balance:.2f}",
            buttons=[
                {"title": "Transfer", "payload": "/transfer_money"},
                {"title": "History", "payload": "/view_history"}
            ]
        )

        # Return events to modify state
        return [
            SlotSet("balance", balance),
            SlotSet("last_checked", datetime.now().isoformat())
        ]

    async def fetch_balance(self, user_id, account_type):
        # External API call
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://api.bank.com/balance/{user_id}") as resp:
                data = await resp.json()
                return data["balance"]
```

**Replication Strategy:**
- Create webhook-based action server protocol
- Define clear request/response JSON schema
- Support both sync and async actions
- Provide SDK helpers for common patterns (slot access, message sending)
- Enable custom validation actions for forms

---

## 6. Domain Model Schema

### Complete Domain Structure:

```yaml
version: "3.1"

# 1. INTENTS - What the bot understands
intents:
  - greet
  - goodbye
  - affirm
  - deny
  - order_pizza:
      use_entities: [pizza_size, pizza_type]  # Which entities to consider
  - check_balance:
      use_entities: false  # Ignore entities for this intent

# 2. ENTITIES - Information to extract
entities:
  - pizza_size
  - pizza_type
  - topping
  - PERSON        # SpaCy entity
  - amount:
      roles:
        - source
        - destination

# 3. SLOTS - Conversation memory
slots:
  pizza_size:
    type: categorical
    values:
      - small
      - medium
      - large
    influence_conversation: true
    mappings:
      - type: from_entity
        entity: pizza_size

  order_confirmed:
    type: bool
    influence_conversation: true
    mappings:
      - type: from_intent
        intent: affirm
        value: true
      - type: from_intent
        intent: deny
        value: false

# 4. RESPONSES - What the bot says
responses:
  utter_greet:
    - text: "Hello! How can I help you today?"
    - text: "Hi there! What can I do for you?"  # Variation

  utter_ask_pizza_size:
    - text: "What size pizza would you like?"
      buttons:
        - title: "Small ($10)"
          payload: '/inform{"pizza_size": "small"}'
        - title: "Medium ($15)"
          payload: '/inform{"pizza_size": "medium"}'
        - title: "Large ($20)"
          payload: '/inform{"pizza_size": "large"}'

  utter_confirm_order:
    - text: "Got it! A {pizza_size} {pizza_type} pizza."
      # Slot interpolation with {slot_name}

# 5. ACTIONS - What the bot can do
actions:
  - action_check_balance
  - action_process_order
  - action_validate_pizza_form
  - utter_greet           # Response actions auto-generated
  - utter_ask_pizza_size

# 6. FORMS - Multi-turn data collection
forms:
  pizza_form:
    required_slots:
      - pizza_size
      - pizza_type
    ignored_intents:
      - chitchat
      - faq

# 7. SESSION CONFIG
session_config:
  session_expiration_time: 60  # minutes
  carry_over_slots_to_new_session: true
```

### Mapping Domain to ReactFlow Nodes:

| Domain Concept | ReactFlow Node Type | Properties |
|----------------|---------------------|------------|
| Intent | `IntentNode` | name, examples[], use_entities |
| Entity | `EntityNode` | name, roles[], groups[] |
| Slot | `SlotNode` | name, type, mappings[], influence |
| Response | `ResponseNode` | variations[], buttons[], slot_refs |
| Action | `ActionNode` | name, type (utter/custom), endpoint |
| Form | `FormNode` | required_slots[], ignored_intents[] |
| Story | `StoryNode` | steps[] (edges to other nodes) |
| Rule | `RuleNode` | trigger, steps[], conditions[] |

---

## 7. Training & Evaluation

### NLU Training:

```bash
# Train NLU model
rasa train nlu

# Cross-validation (most thorough)
rasa test nlu --nlu data/nlu.yml --cross-validation --folds 5

# Evaluation metrics
# - Intent classification: accuracy, precision, recall, F1
# - Entity extraction: per-entity precision, recall, F1
# - Confusion matrix for intents
```

### Dialogue Training:

```bash
# Train dialogue policies
rasa train core

# Train both NLU and dialogue
rasa train

# Test with stories
rasa test core --stories test_stories.yml
```

### Model Artifacts:

```
models/
  └── 20240115-123456.tar.gz
      ├── nlu/
      │   ├── DIETClassifier.pkl
      │   ├── CountVectorsFeaturizer.pkl
      │   └── metadata.json
      ├── core/
      │   ├── TEDPolicy.pkl
      │   ├── RulePolicy.pkl
      │   └── metadata.json
      ├── domain.yml
      └── config.yml
```

**Replication Strategy:**
- Implement training pipeline with model versioning
- Support cross-validation for NLU
- Provide evaluation metrics dashboard
- Enable A/B testing between model versions

---

## 8. Rasa Studio & Visual Builder Patterns

### Flow Builder Node Types:

| Node Type | Purpose | Properties |
|-----------|---------|------------|
| **Start** | Flow entry point | description, nlu_triggers[], conditions[] |
| **Message** | Send bot response | text, buttons[], images[], custom_payload |
| **Collect** | Gather user input | slot_name, slot_type, validation, ask_before_fill |
| **Logic** | Conditional branching | conditions[], else_branch |
| **Custom Action** | Execute code | action_name, timeout |
| **Link** | Jump to another flow | target_flow_id |
| **Set Slot** | Manually set value | slot_name, value |
| **End** | Flow completion | - |

### Visual-to-YAML Mapping:

```
Visual Flow                          YAML Representation
─────────────                        ───────────────────
┌───────────┐                        flows:
│   Start   │                        - id: order_pizza
│ "order    │                          description: "User wants to order pizza"
│  pizza"   │
└─────┬─────┘                          steps:
      │                                - id: "1"
      ▼                                  action: utter_ask_size
┌───────────┐
│  Message  │                        - id: "2"
│ "What     │                          collect: pizza_size
│  size?"   │                          ask_before_filling: true
└─────┬─────┘
      │                              - id: "3"
      ▼                                action: utter_ask_toppings
┌───────────┐
│  Collect  │                        - id: "4"
│ pizza_size│                          collect: toppings
└─────┬─────┘
      │                              - id: "5"
      ▼                                if: slots.pizza_size == "large"
┌───────────┐                          then: "6"
│  Logic    │──Yes──>                  else: "7"
│ size ==   │        │
│ "large"?  │        │               - id: "6"
└─────┬─────┘        │                 action: utter_large_discount
      │No            │
      ▼              │               - id: "7"
┌───────────┐        │                 action: action_process_order
│  Message  │<───────┘
│ "Order    │                        - id: "8"
│ confirmed"│                          action: utter_order_confirmed
└───────────┘
```

### CALM Architecture (LLM + Deterministic):

```
                    User Message
                         │
                         ▼
            ┌────────────────────────┐
            │   Command Generator    │
            │      (LLM-based)       │
            │                        │
            │  Understands context   │
            │  Generates commands:   │
            │  - start flow X        │
            │  - set slot Y = Z      │
            │  - cancel flow         │
            │  - chitchat            │
            │  - hand_over           │
            └───────────┬────────────┘
                        │
                        ▼ Commands
            ┌────────────────────────┐
            │   Flow Policy          │
            │   (Deterministic)      │
            │                        │
            │  Executes commands     │
            │  strictly following    │
            │  business logic        │
            └───────────┬────────────┘
                        │
                        ▼
                  Bot Response
```

**Why CALM is powerful:**
- LLM handles understanding ambiguity, typos, context
- Deterministic flows ensure predictable business logic
- Best of both worlds: flexible + reliable

---

## 9. What We CAN vs CANNOT Replicate

### CAN Replicate (Open Source / Public Knowledge):

| Component | Complexity | Notes |
|-----------|------------|-------|
| Event-sourced tracker | Medium | Standard pattern, well documented |
| Slot system | Medium | Type system + mappings |
| Form architecture | Medium | State machine for slot collection |
| Rule policy | Low | Lookup table matching |
| Domain schema | Low | YAML/JSON configuration |
| Action server protocol | Low | HTTP webhook, defined schema |
| Pipeline architecture | Medium | Pluggable components |
| Visual flow builder | High | ReactFlow can implement |
| Policy ensemble | Medium | Priority-based selection |

### CANNOT Easily Replicate (Proprietary / Complex):

| Component | Why Difficult | Alternative |
|-----------|---------------|-------------|
| DIETClassifier (full) | Novel architecture, extensive tuning | Use HuggingFace transformers + CRF |
| TEDPolicy (full) | Complex transformer + StarSpace | Simpler sequence model or rule-heavy |
| CALM Command Generator | Proprietary LLM prompts | Build own prompts, use OpenAI/Claude |
| Training infrastructure | Requires GPU cluster | Use cloud training services |
| Rasa Studio (full) | Years of UX iteration | Build MVP with ReactFlow |

---

## 10. ReactFlow Node Type Mapping

### Recommended Node Types for Visual Builder:

```typescript
// 1. TRIGGER NODES (Entry Points)
interface IntentTriggerNode {
  type: 'intent_trigger';
  data: {
    intentName: string;
    confidence_threshold: number;
    examples: string[];
  };
}

interface ConditionTriggerNode {
  type: 'condition_trigger';
  data: {
    slot: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'is_set';
    value: any;
  };
}

// 2. MESSAGE NODES
interface MessageNode {
  type: 'message';
  data: {
    variations: string[];
    buttons?: Button[];
    image?: string;
    custom_payload?: object;
  };
}

interface QuickReplyNode {
  type: 'quick_reply';
  data: {
    text: string;
    replies: { title: string; payload: string }[];
  };
}

// 3. SLOT NODES
interface CollectSlotNode {
  type: 'collect_slot';
  data: {
    slotName: string;
    slotType: 'text' | 'bool' | 'categorical' | 'float' | 'list' | 'any';
    prompt: string;
    validation?: {
      regex?: string;
      min?: number;
      max?: number;
      allowed_values?: string[];
    };
    required: boolean;
  };
}

interface SetSlotNode {
  type: 'set_slot';
  data: {
    slotName: string;
    value: any;
    expression?: string;  // e.g., "slots.amount * 1.1"
  };
}

// 4. LOGIC NODES
interface ConditionNode {
  type: 'condition';
  data: {
    conditions: {
      slot: string;
      operator: string;
      value: any;
      targetHandle: string;
    }[];
    elseHandle: string;
  };
}

interface SwitchNode {
  type: 'switch';
  data: {
    slot: string;
    cases: { value: any; targetHandle: string }[];
    defaultHandle: string;
  };
}

// 5. ACTION NODES
interface CustomActionNode {
  type: 'custom_action';
  data: {
    actionName: string;
    timeout_ms: number;
    retry_count: number;
  };
}

interface APICallNode {
  type: 'api_call';
  data: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    body_template: string;
    response_slot: string;
  };
}

// 6. FLOW CONTROL NODES
interface SubflowNode {
  type: 'subflow';
  data: {
    flowId: string;
    inputSlots: Record<string, string>;
    outputSlots: Record<string, string>;
  };
}

interface EndNode {
  type: 'end';
  data: {
    clear_slots?: string[];
    redirect_flow?: string;
  };
}

// 7. FORM NODE (Composite)
interface FormNode {
  type: 'form';
  data: {
    formName: string;
    slots: {
      name: string;
      type: string;
      prompt: string;
      validation?: object;
    }[];
    submit_action: string;
  };
}
```

### Edge Types:

```typescript
interface ConversationEdge {
  type: 'conversation' | 'condition_true' | 'condition_false' | 'fallback';
  data: {
    label?: string;
    priority?: number;
    condition?: string;
  };
}
```

### Export to Bot Format:

```typescript
function exportToYAML(nodes: Node[], edges: Edge[]): BotConfig {
  return {
    domain: extractDomain(nodes),
    stories: extractStories(nodes, edges),
    rules: extractRules(nodes, edges),
    nlu: extractNLU(nodes),
    config: extractConfig(nodes)
  };
}
```

---

## Conclusion: Implementation Roadmap

### Phase 1: Core Infrastructure
1. Event-sourced conversation tracker
2. Typed slot system with mappings
3. Domain configuration schema
4. Rule-based policy engine

### Phase 2: NLU Integration
1. Intent classification (use existing models)
2. Entity extraction pipeline
3. Featurizer system (sparse + dense)

### Phase 3: Visual Builder (ReactFlow)
1. Node types for all components
2. Flow validation
3. YAML/JSON export
4. Preview/test mode

### Phase 4: Action System
1. Webhook-based action server
2. Built-in actions (utter, slot_set)
3. Form handling
4. Async action support

### Phase 5: ML Policies (Optional)
1. Simple sequence model for generalization
2. Training data format
3. Model versioning

### Phase 6: LLM Integration (CALM-inspired)
1. Command generator prompts
2. Flow execution engine
3. Hybrid rule + LLM approach

---

## Sources

- [Rasa Architecture Overview](https://legacy-docs-oss.rasa.com/docs/rasa/arch-overview/)
- [Rasa GitHub Repository](https://github.com/RasaHQ/rasa)
- [DIET: Lightweight Language Understanding for Dialogue Systems (Paper)](https://arxiv.org/pdf/2004.09936)
- [Introducing DIET - Rasa Blog](https://rasa.com/blog/introducing-dual-intent-and-entity-transformer-diet-state-of-the-art-performance-on-a-lightweight-architecture)
- [Rasa 2025 Fully Explained - Communeify](https://www.communeify.com/en/blog/what-is-rasa/)
- [Behind the Release Notes: Rasa Platform Spring Release 2024](https://rasa.com/blog/behind-the-release-notes-rasa-platform-spring-release-2024)
- [Rasa Studio Documentation](https://rasa.com/docs/studio/)
- [Flow Builder Introduction](https://rasa.com/docs/studio/user-guide/flow-builder/introduction/)
- [Rasa Learning Center - Flows](https://learning.rasa.com/rasa-pro/flows/)
- [Botpress vs Rasa Comparison](https://botpress.com/botpress-vs-rasa)
- [Rasa vs Dialogflow Comparison](https://www.kommunicate.io/blog/dialogflow-vs-rasa-which-one-to-choose/)
- [Deep Dive: Dialog Management](https://medium.com/@captnitinbhatnagar/deep-dive-dialog-management-designing-vui-e8e561c992d0)

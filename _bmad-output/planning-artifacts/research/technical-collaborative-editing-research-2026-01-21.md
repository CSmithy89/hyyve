# Technical Research: Collaborative Editing and Multiplayer Features

**Date:** 2026-01-21
**Research Area:** Real-time Collaboration, CRDTs, Multiplayer Infrastructure
**Application:** Hyyve Platform Visual Workflow Builder

---

## Executive Summary

This document provides comprehensive research on implementing Figma-style collaborative editing features for the Hyyve Platform's visual workflow builder. We analyze conflict-free replicated data types (CRDTs), the Yjs ecosystem, real-time synchronization strategies, and provide implementation recommendations tailored for ReactFlow + Zustand architecture.

**Key Recommendations:**
- **Primary CRDT Library:** Yjs - proven performance, excellent ecosystem, ReactFlow integration available
- **State Management:** zustand-middleware-yjs for seamless Zustand integration
- **Network Provider:** WebSocket-based (y-websocket or Y-Sweet) with y-indexeddb for offline support
- **Presence:** Yjs Awareness protocol for cursors, selections, and user presence
- **Managed Option:** Consider Y-Sweet (Jamsocket) or Liveblocks for faster time-to-market

---

## Table of Contents

1. [CRDT Fundamentals](#1-crdt-fundamentals)
2. [Yjs Ecosystem](#2-yjs-ecosystem)
3. [Real-time Sync Strategies](#3-real-time-sync-strategies)
4. [Visual Editor Collaboration](#4-visual-editor-collaboration)
5. [Presence and Awareness](#5-presence-and-awareness)
6. [Implementation Recommendations](#6-implementation-recommendations)
7. [Architecture Diagrams](#7-architecture-diagrams)
8. [Code Examples](#8-code-examples)
9. [References](#9-references)

---

## 1. CRDT Fundamentals

### 1.1 What Are CRDTs?

A **Conflict-free Replicated Data Type (CRDT)** is a data structure that can be replicated across multiple computers in a network, where each replica can be updated independently and concurrently without coordination. An algorithm automatically resolves any inconsistencies, guaranteeing that replicas will **eventually converge** to the same state.

> "CRDTs are not a silver bullet. They trade coordination for metadata, strong consistency for eventual consistency, and simplicity for convergence guarantees. But in scenarios where availability matters more than immediate consistency, they're remarkably powerful."

**Key Properties:**
- **Eventual Consistency:** All replicas converge to identical state
- **No Coordination Required:** Updates happen independently
- **Automatic Conflict Resolution:** Mathematical guarantees prevent conflicts
- **Offline-Capable:** Perfect for local-first applications

### 1.2 CRDT Approaches

#### State-based CRDTs (CvRDTs)
- Send full local state to other replicas on updates
- Received state is merged into local state
- Simpler to implement but higher bandwidth

#### Operation-based CRDTs (CmRDTs)
- Send only the operations (insert, delete, etc.)
- Requires reliable, ordered delivery
- More efficient for network bandwidth

#### Delta-state CRDTs
- Optimized state-based approach
- Only transmit recent changes (deltas)
- Best of both worlds for many use cases

### 1.3 Common CRDT Types

| Type | Description | Use Case |
|------|-------------|----------|
| **G-Counter** | Grow-only counter | Analytics, view counts |
| **PN-Counter** | Increment/decrement counter | Like/dislike systems |
| **G-Set** | Grow-only set | Tag collections |
| **2P-Set** | Two-phase set (add/remove once) | Simple collections |
| **OR-Set** | Observed-remove set | Collections with remove |
| **LWW-Register** | Last-writer-wins register | Simple key-value |
| **MV-Register** | Multi-value register | Preserves concurrent values |
| **RGA** | Replicated Growable Array | Sequences, lists |
| **JSON CRDT** | Nested document structure | Complex documents |

### 1.4 Yjs vs Automerge Comparison

| Aspect | Yjs | Automerge |
|--------|-----|-----------|
| **Algorithm** | YATA (Yet Another Transformation Approach) | RGA (Replicated Growable Array) |
| **Performance** | Fastest CRDT implementation | Improved in 2.0 (Rust rewrite) |
| **Best For** | Text collaboration, modular architecture | JSON documents, multi-language support |
| **Text Editing** | Optimized for rich text editors | Capable but historically slower |
| **Language** | JavaScript/TypeScript | Rust with JS/WASM bindings |
| **Editor Bindings** | CodeMirror, Monaco, Quill, ProseMirror, TipTap | Fewer built-in bindings |
| **Data Model** | Shared types (Y.Map, Y.Array, Y.Text) | JSON-like document |
| **Undo History** | Built-in UndoManager | Limited to 100 operations |
| **Ecosystem** | Large, many providers and integrations | Growing, automerge-repo for storage |

**Recommendation for Workflow Builder:** Yjs is the better choice due to:
- Superior performance for real-time collaboration
- Excellent ReactFlow integration examples
- Rich ecosystem of providers (WebSocket, WebRTC, IndexedDB)
- Native awareness protocol for presence features
- Active community and documentation

### 1.5 CRDTs vs Operational Transformation (OT)

| Aspect | CRDTs | Operational Transformation |
|--------|-------|---------------------------|
| **Architecture** | Decentralized/P2P capable | Requires central server |
| **Offline Support** | Excellent - native capability | Limited - needs server reconciliation |
| **Intent Preservation** | Can be challenging | Better (designed for it) |
| **Implementation** | Simpler conceptually | Complex transformation functions |
| **Scalability** | Horizontal scaling possible | Server bottleneck |
| **Real-world Use** | Yjs, distributed systems | Google Docs, many co-editors |
| **Undo/Redo** | Complex, requires careful design | Native but complex |

**When to Choose CRDTs:**
- Offline-first applications
- P2P or decentralized architectures
- Need to scale horizontally
- Building visual/diagram editors
- Want simpler deployment (no central transform server)

**When to Choose OT:**
- Centralized server architecture is acceptable
- Complex intent preservation is critical
- Rich text with specific semantics
- Google Docs-style collaboration model

---

## 2. Yjs Ecosystem

### 2.1 Core Concepts

#### Y.Doc - The Document Container

```typescript
import * as Y from 'yjs'

// Create a new document
const ydoc = new Y.Doc()

// Documents have unique client IDs
console.log(ydoc.clientID)

// All changes happen in transactions
ydoc.transact(() => {
  // Multiple changes bundled together
  // Observers called after transaction completes
})

// Listen for updates
ydoc.on('update', (update: Uint8Array) => {
  // Binary update that can be sent to other clients
  broadcastUpdate(update)
})
```

#### Y.Map - Key-Value Store

```typescript
// Get or create a shared map
const ymap = ydoc.getMap('workflow-nodes')

// Set values (JSON-encodable or shared types)
ymap.set('node-1', {
  id: 'node-1',
  type: 'llm',
  position: { x: 100, y: 200 },
  data: { model: 'gpt-4' }
})

// Get values
const node = ymap.get('node-1')

// Observe changes
ymap.observe((event) => {
  event.changes.keys.forEach((change, key) => {
    if (change.action === 'add') {
      console.log(`Node ${key} was added`)
    } else if (change.action === 'update') {
      console.log(`Node ${key} was updated`)
    } else if (change.action === 'delete') {
      console.log(`Node ${key} was deleted`)
    }
  })
})

// Convert to plain object
const plainObject = ymap.toJSON()
```

#### Y.Array - Ordered List

```typescript
// Get or create a shared array
const yarray = ydoc.getArray('workflow-edges')

// Insert elements
yarray.insert(0, [
  { id: 'edge-1', source: 'node-1', target: 'node-2' },
  { id: 'edge-2', source: 'node-2', target: 'node-3' }
])

// Push to end
yarray.push([{ id: 'edge-3', source: 'node-3', target: 'node-4' }])

// Delete elements (index, count)
yarray.delete(1, 1)

// Map over elements
const edges = yarray.map((edge, index) => ({
  ...edge,
  index
}))

// Observe changes
yarray.observe((event) => {
  console.log('Array changed:', event.changes.delta)
})
```

#### Y.Text - Rich Text

```typescript
// Get or create shared text
const ytext = ydoc.getText('node-description')

// Insert text
ytext.insert(0, 'Process customer data')

// Format text (for rich text editors)
ytext.format(8, 8, { bold: true }) // "customer" in bold

// Get as string
const plainText = ytext.toString()

// Get as delta (Quill format)
const delta = ytext.toDelta()
// [{ insert: 'Process ' }, { insert: 'customer', attributes: { bold: true } }, { insert: ' data' }]
```

### 2.2 Persistence Providers

#### y-indexeddb - Browser Offline Storage

```typescript
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()
const persistence = new IndexeddbPersistence('workflow-doc-123', ydoc)

persistence.on('synced', () => {
  console.log('Content loaded from IndexedDB')
})

// Document automatically persists to IndexedDB
// On next load, data is restored before network sync
```

**Key Benefits:**
- Instant load from local cache
- Full offline support
- Minimizes network data transfer
- Automatic background persistence

#### y-websocket - WebSocket Network Provider

```typescript
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const wsProvider = new WebsocketProvider(
  'wss://your-server.com',
  'workflow-room-123',
  ydoc
)

// Connection status
wsProvider.on('status', (event: { status: string }) => {
  console.log('Connection status:', event.status) // 'connecting', 'connected', 'disconnected'
})

// Sync status
wsProvider.on('sync', (isSynced: boolean) => {
  console.log('Synced with server:', isSynced)
})

// Access awareness for presence features
const awareness = wsProvider.awareness
```

#### y-supabase - Supabase Integration (Early Stage)

```typescript
import { SupabaseProvider } from 'y-supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const ydoc = new Y.Doc()

const provider = new SupabaseProvider(supabase, {
  doc: ydoc,
  channel: 'workflow-123',
  tableName: 'yjs_documents',
  resyncInterval: 5000 // Resync every 5 seconds
})

provider.on('save', () => {
  console.log('Changes saved to Supabase')
})
```

**Warning:** y-supabase is in early development - not recommended for production yet.

### 2.3 Provider Comparison

| Provider | Type | Offline | Production Ready | Best For |
|----------|------|---------|------------------|----------|
| y-indexeddb | Persistence | Yes | Yes | Browser offline storage |
| y-websocket | Network | No (pair with indexeddb) | Yes | Standard WebSocket sync |
| y-webrtc | Network | No | Yes | P2P without server |
| y-supabase | Network + Persistence | Partial | No | Supabase users (future) |
| Y-Sweet | Managed | Yes (with SDK) | Yes | Production deployment |

### 2.4 Awareness Protocol

The awareness protocol manages ephemeral user state like cursors, selections, and online status.

```typescript
import * as awarenessProtocol from 'y-protocols/awareness'

// Access via provider
const awareness = wsProvider.awareness

// Set local user state
awareness.setLocalStateField('user', {
  name: 'John Doe',
  email: 'john@example.com',
  color: '#FF5733',
  avatar: '/avatars/john.png'
})

// Set cursor position (for workflow builder)
awareness.setLocalStateField('cursor', {
  nodeId: 'node-123',
  x: 150,
  y: 200
})

// Set selection state
awareness.setLocalStateField('selection', {
  selectedNodes: ['node-1', 'node-2'],
  selectedEdges: ['edge-1']
})

// Listen for awareness changes
awareness.on('change', (changes: {
  added: number[],
  updated: number[],
  removed: number[]
}) => {
  // Get all user states
  const states = awareness.getStates()

  // Render other users' cursors
  states.forEach((state, clientId) => {
    if (clientId !== ydoc.clientID) {
      renderUserCursor(state.user, state.cursor)
    }
  })
})

// Get all connected users
const allUsers = Array.from(awareness.getStates().values())
  .filter(state => state.user)
  .map(state => state.user)
```

### 2.5 React and Zustand Integration

#### zustand-middleware-yjs

```typescript
import create from 'zustand'
import { yjs } from 'zustand-middleware-yjs'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

// Create Yjs document and provider
const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://server.com', 'room', ydoc)

// Define workflow state interface
interface WorkflowState {
  nodes: Record<string, WorkflowNode>
  edges: Record<string, WorkflowEdge>
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  addEdge: (edge: WorkflowEdge) => void
  deleteEdge: (id: string) => void
}

// Create store with Yjs middleware
const useWorkflowStore = create<WorkflowState>(
  yjs(
    ydoc,
    'workflow-state', // Name of the Y.Map in the document
    (set, get) => ({
      nodes: {},
      edges: {},

      addNode: (node) => set((state) => ({
        nodes: { ...state.nodes, [node.id]: node }
      })),

      updateNode: (id, updates) => set((state) => ({
        nodes: {
          ...state.nodes,
          [id]: { ...state.nodes[id], ...updates }
        }
      })),

      deleteNode: (id) => set((state) => {
        const { [id]: deleted, ...rest } = state.nodes
        return { nodes: rest }
      }),

      addEdge: (edge) => set((state) => ({
        edges: { ...state.edges, [edge.id]: edge }
      })),

      deleteEdge: (id) => set((state) => {
        const { [id]: deleted, ...rest } = state.edges
        return { edges: rest }
      })
    })
  )
)

// Use in React components
function WorkflowBuilder() {
  const { nodes, edges, addNode, updateNode } = useWorkflowStore()

  // Changes automatically sync to all connected clients!
  const handleAddNode = () => {
    addNode({
      id: `node-${Date.now()}`,
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { model: 'gpt-4' }
    })
  }

  return (/* ReactFlow component */)
}
```

---

## 3. Real-time Sync Strategies

### 3.1 WebSocket-based Sync

**Architecture:**
```
┌─────────────┐     WebSocket      ┌─────────────────┐
│   Client A  │◄──────────────────►│                 │
└─────────────┘                    │   WebSocket     │
                                   │   Server        │
┌─────────────┐     WebSocket      │  (y-websocket)  │
│   Client B  │◄──────────────────►│                 │
└─────────────┘                    └────────┬────────┘
                                            │
┌─────────────┐     WebSocket              │
│   Client C  │◄──────────────────►────────┘
└─────────────┘
```

**Pros:**
- Reliable message delivery
- Server can persist documents
- Works behind firewalls
- Easy to implement authentication

**Cons:**
- Single point of failure
- Server costs at scale
- Latency through server

### 3.2 WebRTC Peer-to-Peer

**Architecture:**
```
┌─────────────┐                    ┌─────────────┐
│   Client A  │◄──────────────────►│   Client B  │
└──────┬──────┘      WebRTC        └──────┬──────┘
       │                                  │
       │         ┌─────────────┐          │
       └────────►│  Signaling  │◄─────────┘
                 │   Server    │
                 └─────────────┘
                 (Initial connection only)
```

**Pros:**
- Low latency (direct connection)
- Reduced server costs
- End-to-end encryption possible
- Works offline between local peers

**Cons:**
- Signaling server still needed
- NAT traversal challenges
- No persistence without additional infrastructure
- Scales poorly with many participants

### 3.3 Hybrid Approaches

**Recommended Architecture for Production:**

```
┌────────────────────────────────────────────────────────┐
│                    Client Browser                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 React + Zustand                   │  │
│  │  ┌─────────────┐    ┌─────────────────────────┐  │  │
│  │  │  ReactFlow  │◄──►│   Yjs Middleware        │  │  │
│  │  └─────────────┘    └───────────┬─────────────┘  │  │
│  │                                 │                 │  │
│  │            ┌────────────────────┼──────────────┐  │  │
│  │            │                Y.Doc              │  │  │
│  │            └────────────────────┬──────────────┘  │  │
│  │                                 │                 │  │
│  │   ┌─────────────────────────────┼─────────────┐  │  │
│  │   │           Providers Layer                 │  │  │
│  │   │  ┌──────────┐  ┌──────────┐  ┌─────────┐ │  │  │
│  │   │  │IndexedDB │  │WebSocket │  │ WebRTC  │ │  │  │
│  │   │  │Provider  │  │Provider  │  │Provider │ │  │  │
│  │   │  └────┬─────┘  └────┬─────┘  └────┬────┘ │  │  │
│  │   └───────┼─────────────┼─────────────┼──────┘  │  │
│  └───────────┼─────────────┼─────────────┼─────────┘  │
└──────────────┼─────────────┼─────────────┼────────────┘
               │             │             │
               ▼             │             ▼
        ┌──────────┐         │      ┌──────────────┐
        │IndexedDB │         │      │ Other Peers  │
        │(Offline) │         │      │ (P2P direct) │
        └──────────┘         │      └──────────────┘
                             ▼
                    ┌─────────────────┐
                    │  Y-Sweet Server │
                    │  or y-websocket │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   S3 / Database │
                    │   (Persistence) │
                    └─────────────────┘
```

### 3.4 Managed Solutions Comparison

| Solution | Type | Pricing Model | CRDT Support | Best For |
|----------|------|---------------|--------------|----------|
| **Y-Sweet** | Open-source + managed | Per-connection/storage | Yjs native | Yjs apps needing managed infra |
| **Liveblocks** | Managed platform | Per MAU | Built-in CRDT | Quick integration, React focus |
| **PartyKit** | Open-source platform | Self-host or managed | Yjs, Automerge | Custom backends, flexibility |
| **Supabase Realtime** | Database sync | Included with Supabase | Via y-supabase | Already using Supabase |

#### Y-Sweet (Jamsocket)

```typescript
// Server-side: Manage documents and generate tokens
import { DocumentManager } from '@y-sweet/sdk'

const manager = new DocumentManager('https://your-y-sweet-server.com')

// Create a new document (with random or specific ID)
const doc = await manager.createDoc()  // random ID
// or: await manager.createDoc('workflow-123')  // specific ID

// Generate client token with permissions
const clientToken = await manager.getClientToken(doc.docId, {
  authorization: 'full',  // 'full' or 'read-only'
  validForSeconds: 3600   // optional expiry
})

// Client-side: Connect with token or auth endpoint
import * as Y from 'yjs'
import { createYjsProvider } from '@y-sweet/client'

const ydoc = new Y.Doc()
const docId = 'workflow-123'

// Option 1: Direct token
createYjsProvider(ydoc, docId, clientToken)

// Option 2: Auth endpoint (recommended for production)
createYjsProvider(ydoc, docId, '/api/y-sweet-auth')
```

#### Liveblocks

```typescript
import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  publicApiKey: 'pk_xxx',
})

const { RoomProvider, useStorage, useMutation } = createRoomContext(client)

// Wrap your app
function App() {
  return (
    <RoomProvider id="workflow-room" initialPresence={{ cursor: null }}>
      <WorkflowBuilder />
    </RoomProvider>
  )
}

// Use collaborative storage
function WorkflowBuilder() {
  const nodes = useStorage((root) => root.nodes)

  const addNode = useMutation(({ storage }, node) => {
    storage.get('nodes').set(node.id, node)
  }, [])

  return (/* ... */)
}
```

#### PartyKit

```typescript
// server.ts (PartyKit server)
import type * as Party from 'partykit/server'
import { onConnect } from 'y-partykit'

export default class WorkflowServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, {
      persist: true, // Enable persistence
    })
  }
}

// Client-side
import YPartyKitProvider from 'y-partykit/provider'

const ydoc = new Y.Doc()
const provider = new YPartyKitProvider(
  'your-project.partykit.dev',
  'workflow-123',
  ydoc
)
```

### 3.5 Supabase Realtime for Presence

While y-supabase is not production-ready, Supabase Realtime can complement Yjs for presence:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Create a channel for presence
const channel = supabase.channel('workflow-123')

// Track presence
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    console.log('Online users:', state)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: currentUser.id,
        name: currentUser.name,
        online_at: new Date().toISOString()
      })
    }
  })
```

---

## 4. Visual Editor Collaboration

### 4.1 ReactFlow Integration with Yjs

**Data Structure Design:**

ReactFlow uses arrays for nodes and edges, but Yjs works better with key-value maps for precise conflict resolution:

```typescript
// Instead of arrays...
const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: {} },
  { id: '2', position: { x: 100, y: 100 }, data: {} }
]

// Use Y.Map for nodes (keyed by ID)
const yNodes = ydoc.getMap('nodes')
yNodes.set('1', { id: '1', position: { x: 0, y: 0 }, data: {} })
yNodes.set('2', { id: '2', position: { x: 100, y: 100 }, data: {} })

// Similarly for edges
const yEdges = ydoc.getMap('edges')
yEdges.set('e1-2', { id: 'e1-2', source: '1', target: '2' })
```

**Complete Integration Example:**

```typescript
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

interface CollaborativeFlowProps {
  documentId: string
  userId: string
  userName: string
  userColor: string
}

export function CollaborativeFlow({
  documentId,
  userId,
  userName,
  userColor
}: CollaborativeFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [ydoc] = useState(() => new Y.Doc())
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)

  // Initialize Yjs
  useEffect(() => {
    // Offline persistence
    const indexeddbProvider = new IndexeddbPersistence(documentId, ydoc)

    // Network sync
    const wsProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_YJS_SERVER!,
      documentId,
      ydoc
    )

    setProvider(wsProvider)

    // Set up awareness
    wsProvider.awareness.setLocalStateField('user', {
      id: userId,
      name: userName,
      color: userColor
    })

    // Get shared types
    const yNodes = ydoc.getMap('nodes')
    const yEdges = ydoc.getMap('edges')

    // Sync Yjs -> React state
    const syncNodes = () => {
      const nodesArray = Array.from(yNodes.values()) as Node[]
      setNodes(nodesArray)
    }

    const syncEdges = () => {
      const edgesArray = Array.from(yEdges.values()) as Edge[]
      setEdges(edgesArray)
    }

    // Initial sync
    syncNodes()
    syncEdges()

    // Observe changes
    yNodes.observe(syncNodes)
    yEdges.observe(syncEdges)

    return () => {
      yNodes.unobserve(syncNodes)
      yEdges.unobserve(syncEdges)
      wsProvider.destroy()
      indexeddbProvider.destroy()
    }
  }, [documentId, ydoc, userId, userName, userColor, setNodes, setEdges])

  // Handle node changes (position, selection, etc.)
  const handleNodesChange = useCallback((changes: any[]) => {
    const yNodes = ydoc.getMap('nodes')

    ydoc.transact(() => {
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          const node = yNodes.get(change.id) as Node | undefined
          if (node) {
            yNodes.set(change.id, {
              ...node,
              position: change.position
            })
          }
        } else if (change.type === 'remove') {
          yNodes.delete(change.id)
        }
      })
    })

    onNodesChange(changes)
  }, [ydoc, onNodesChange])

  // Handle new connections
  const handleConnect = useCallback((connection: Connection) => {
    const yEdges = ydoc.getMap('edges')
    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    }

    yEdges.set(newEdge.id, newEdge)
  }, [ydoc])

  // Add new node
  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const yNodes = ydoc.getMap('nodes')
    const id = `node-${Date.now()}`

    const newNode: Node = {
      id,
      type,
      position,
      data: { label: `New ${type} node` }
    }

    yNodes.set(id, newNode)
  }, [ydoc])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      fitView
    />
  )
}
```

### 4.2 Shared Cursor Rendering

```typescript
import { useEffect, useState } from 'react'
import { Awareness } from 'y-protocols/awareness'

interface UserCursor {
  userId: string
  name: string
  color: string
  position: { x: number; y: number } | null
  selectedNodes: string[]
}

export function useCursors(awareness: Awareness | null) {
  const [cursors, setCursors] = useState<Map<number, UserCursor>>(new Map())

  useEffect(() => {
    if (!awareness) return

    const updateCursors = () => {
      const states = awareness.getStates()
      const newCursors = new Map<number, UserCursor>()

      states.forEach((state, clientId) => {
        // Skip own cursor
        if (clientId === awareness.clientID) return

        if (state.user && state.cursor) {
          newCursors.set(clientId, {
            userId: state.user.id,
            name: state.user.name,
            color: state.user.color,
            position: state.cursor.position,
            selectedNodes: state.cursor.selectedNodes || []
          })
        }
      })

      setCursors(newCursors)
    }

    awareness.on('change', updateCursors)
    updateCursors()

    return () => awareness.off('change', updateCursors)
  }, [awareness])

  return cursors
}

// Cursor component for ReactFlow
function RemoteCursor({ cursor }: { cursor: UserCursor }) {
  if (!cursor.position) return null

  return (
    <div
      className="remote-cursor"
      style={{
        position: 'absolute',
        left: cursor.position.x,
        top: cursor.position.y,
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {/* Cursor pointer SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={cursor.color}
      >
        <path d="M5.65 2.65L20 12l-6.35 2.65L11 21 5.65 2.65z" />
      </svg>

      {/* Name label */}
      <div
        style={{
          backgroundColor: cursor.color,
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          marginLeft: '16px',
          whiteSpace: 'nowrap'
        }}
      >
        {cursor.name}
      </div>
    </div>
  )
}

// Render all cursors in ReactFlow
function CursorOverlay({ awareness }: { awareness: Awareness | null }) {
  const cursors = useCursors(awareness)

  return (
    <div className="cursor-overlay" style={{ position: 'absolute', inset: 0 }}>
      {Array.from(cursors.values()).map((cursor) => (
        <RemoteCursor key={cursor.userId} cursor={cursor} />
      ))}
    </div>
  )
}
```

### 4.3 Node Locking During Edits

For workflow builders, consider implementing soft locking to prevent confusion when two users edit the same node:

```typescript
interface NodeLock {
  nodeId: string
  userId: string
  userName: string
  timestamp: number
}

export function useNodeLocking(awareness: Awareness | null, ydoc: Y.Doc) {
  const yLocks = ydoc.getMap('locks') as Y.Map<NodeLock>

  // Acquire lock when starting to edit a node
  const acquireLock = useCallback((nodeId: string, userId: string, userName: string) => {
    const existingLock = yLocks.get(nodeId)

    // Check if already locked by someone else
    if (existingLock && existingLock.userId !== userId) {
      // Lock expires after 30 seconds (stale detection)
      if (Date.now() - existingLock.timestamp < 30000) {
        return false // Cannot acquire lock
      }
    }

    // Acquire lock
    yLocks.set(nodeId, {
      nodeId,
      userId,
      userName,
      timestamp: Date.now()
    })

    return true
  }, [yLocks])

  // Release lock when done editing
  const releaseLock = useCallback((nodeId: string, userId: string) => {
    const existingLock = yLocks.get(nodeId)

    if (existingLock && existingLock.userId === userId) {
      yLocks.delete(nodeId)
    }
  }, [yLocks])

  // Check if node is locked
  const isLocked = useCallback((nodeId: string, currentUserId: string) => {
    const lock = yLocks.get(nodeId)

    if (!lock) return false
    if (lock.userId === currentUserId) return false
    if (Date.now() - lock.timestamp >= 30000) return false // Stale lock

    return true
  }, [yLocks])

  // Get lock holder info
  const getLockHolder = useCallback((nodeId: string) => {
    const lock = yLocks.get(nodeId)
    if (!lock || Date.now() - lock.timestamp >= 30000) return null
    return lock
  }, [yLocks])

  // Heartbeat to refresh lock
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh all locks held by current user
      yLocks.forEach((lock, nodeId) => {
        if (lock.userId === currentUser.id) {
          yLocks.set(nodeId, {
            ...lock,
            timestamp: Date.now()
          })
        }
      })
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [yLocks])

  return { acquireLock, releaseLock, isLocked, getLockHolder }
}
```

### 4.4 Conflict Resolution Strategies

#### Last-Writer-Wins for Simple Properties

```typescript
// Position changes - last writer wins is acceptable
const updateNodePosition = (nodeId: string, position: { x: number, y: number }) => {
  const yNodes = ydoc.getMap('nodes')
  const node = yNodes.get(nodeId)

  if (node) {
    yNodes.set(nodeId, { ...node, position })
  }
}
```

#### Merge Strategy for Complex Data

```typescript
// For node data with nested properties, use nested Y.Maps
const createNode = (id: string, type: string, position: { x: number, y: number }) => {
  const yNodes = ydoc.getMap('nodes')

  // Create a nested Y.Map for the node
  const yNode = new Y.Map()
  yNode.set('id', id)
  yNode.set('type', type)

  const yPosition = new Y.Map()
  yPosition.set('x', position.x)
  yPosition.set('y', position.y)
  yNode.set('position', yPosition)

  // Nested map for data allows concurrent edits to different fields
  const yData = new Y.Map()
  yNode.set('data', yData)

  yNodes.set(id, yNode)
}

// Update specific field - won't conflict with other field updates
const updateNodeDataField = (nodeId: string, field: string, value: any) => {
  const yNodes = ydoc.getMap('nodes')
  const yNode = yNodes.get(nodeId) as Y.Map<any> | undefined

  if (yNode) {
    const yData = yNode.get('data') as Y.Map<any>
    yData.set(field, value)
  }
}
```

### 4.5 Undo/Redo in Collaborative Context

```typescript
import { UndoManager } from 'yjs'

export function useCollaborativeUndo(ydoc: Y.Doc, userId: string) {
  const [undoManager, setUndoManager] = useState<UndoManager | null>(null)

  useEffect(() => {
    const yNodes = ydoc.getMap('nodes')
    const yEdges = ydoc.getMap('edges')

    // Create UndoManager tracking specific types
    const manager = new UndoManager([yNodes, yEdges], {
      // Track changes by user - only undo your own changes
      trackedOrigins: new Set([userId]),

      // Capture scope metadata (for restoring selections, etc.)
      captureTimeout: 500 // Group changes within 500ms
    })

    setUndoManager(manager)

    return () => manager.destroy()
  }, [ydoc, userId])

  // Mark transactions with user origin
  const transact = useCallback((fn: () => void) => {
    ydoc.transact(fn, userId)
  }, [ydoc, userId])

  const undo = useCallback(() => {
    undoManager?.undo()
  }, [undoManager])

  const redo = useCallback(() => {
    undoManager?.redo()
  }, [undoManager])

  const canUndo = undoManager ? undoManager.undoStack.length > 0 : false
  const canRedo = undoManager ? undoManager.redoStack.length > 0 : false

  return { undo, redo, canUndo, canRedo, transact }
}

// Usage in component
function WorkflowBuilder() {
  const { undo, redo, canUndo, canRedo, transact } = useCollaborativeUndo(ydoc, userId)

  const addNode = () => {
    // Wrap changes in transaction with user origin
    transact(() => {
      const yNodes = ydoc.getMap('nodes')
      yNodes.set('new-node', { /* ... */ })
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault()
          undo()
        }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          if (canRedo) {
            e.preventDefault()
            redo()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (/* ... */)
}
```

---

## 5. Presence and Awareness

### 5.1 User Cursors and Selections

**Full Cursor Tracking Implementation:**

```typescript
import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow } from 'reactflow'
import { Awareness } from 'y-protocols/awareness'

export function useCursorTracking(
  awareness: Awareness | null,
  userId: string,
  userName: string,
  userColor: string
) {
  const { screenToFlowPosition } = useReactFlow()
  const lastPosition = useRef<{ x: number; y: number } | null>(null)

  // Set initial user info
  useEffect(() => {
    if (!awareness) return

    awareness.setLocalStateField('user', {
      id: userId,
      name: userName,
      color: userColor
    })
  }, [awareness, userId, userName, userColor])

  // Track mouse movement
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!awareness) return

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    // Throttle updates (only send if moved more than 5px)
    if (lastPosition.current) {
      const dx = position.x - lastPosition.current.x
      const dy = position.y - lastPosition.current.y
      if (Math.sqrt(dx * dx + dy * dy) < 5) return
    }

    lastPosition.current = position

    awareness.setLocalStateField('cursor', {
      position,
      timestamp: Date.now()
    })
  }, [awareness, screenToFlowPosition])

  // Clear cursor when mouse leaves
  const handleMouseLeave = useCallback(() => {
    if (!awareness) return

    awareness.setLocalStateField('cursor', {
      position: null,
      timestamp: Date.now()
    })
  }, [awareness])

  return { handleMouseMove, handleMouseLeave }
}

// Track selection changes
export function useSelectionTracking(
  awareness: Awareness | null,
  selectedNodes: string[],
  selectedEdges: string[]
) {
  useEffect(() => {
    if (!awareness) return

    awareness.setLocalStateField('selection', {
      nodes: selectedNodes,
      edges: selectedEdges,
      timestamp: Date.now()
    })
  }, [awareness, selectedNodes, selectedEdges])
}
```

### 5.2 "Who's Viewing" Indicators

```typescript
interface ConnectedUser {
  id: string
  name: string
  color: string
  avatar?: string
  isActive: boolean
  lastSeen: number
}

export function useConnectedUsers(awareness: Awareness | null): ConnectedUser[] {
  const [users, setUsers] = useState<ConnectedUser[]>([])

  useEffect(() => {
    if (!awareness) return

    const updateUsers = () => {
      const states = awareness.getStates()
      const now = Date.now()
      const userList: ConnectedUser[] = []

      states.forEach((state, clientId) => {
        if (state.user) {
          const lastActivity = state.cursor?.timestamp || state.selection?.timestamp || now

          userList.push({
            id: state.user.id,
            name: state.user.name,
            color: state.user.color,
            avatar: state.user.avatar,
            isActive: now - lastActivity < 60000, // Active in last minute
            lastSeen: lastActivity
          })
        }
      })

      // Sort by activity
      userList.sort((a, b) => b.lastSeen - a.lastSeen)

      setUsers(userList)
    }

    awareness.on('change', updateUsers)
    updateUsers()

    // Periodic refresh for "isActive" status
    const interval = setInterval(updateUsers, 30000)

    return () => {
      awareness.off('change', updateUsers)
      clearInterval(interval)
    }
  }, [awareness])

  return users
}

// Avatar stack component
function AvatarStack({ users, maxVisible = 4 }: { users: ConnectedUser[], maxVisible?: number }) {
  const visibleUsers = users.slice(0, maxVisible)
  const hiddenCount = users.length - maxVisible

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <div
          key={user.id}
          className="relative"
          title={user.name}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{ borderColor: user.color }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Active indicator */}
          {user.isActive && (
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
            />
          )}
        </div>
      ))}

      {hiddenCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium border-2 border-white">
          +{hiddenCount}
        </div>
      )}
    </div>
  )
}
```

### 5.3 Activity Feed Implementation

```typescript
import * as Y from 'yjs'

interface ActivityItem {
  id: string
  type: 'node_added' | 'node_deleted' | 'node_updated' | 'edge_added' | 'edge_deleted' | 'comment_added'
  userId: string
  userName: string
  userColor: string
  timestamp: number
  details: {
    nodeId?: string
    nodeName?: string
    edgeId?: string
    field?: string
    oldValue?: any
    newValue?: any
  }
}

export function useActivityFeed(ydoc: Y.Doc, awareness: Awareness | null) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const yActivities = ydoc.getArray('activities') as Y.Array<ActivityItem>

  // Log an activity
  const logActivity = useCallback((
    type: ActivityItem['type'],
    details: ActivityItem['details']
  ) => {
    const localState = awareness?.getLocalState()
    const user = localState?.user

    if (!user) return

    const activity: ActivityItem = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId: user.id,
      userName: user.name,
      userColor: user.color,
      timestamp: Date.now(),
      details
    }

    yActivities.push([activity])

    // Limit to last 100 activities
    if (yActivities.length > 100) {
      ydoc.transact(() => {
        yActivities.delete(0, yActivities.length - 100)
      })
    }
  }, [ydoc, yActivities, awareness])

  // Sync activities
  useEffect(() => {
    const syncActivities = () => {
      setActivities(yActivities.toArray().slice(-50).reverse())
    }

    yActivities.observe(syncActivities)
    syncActivities()

    return () => yActivities.unobserve(syncActivities)
  }, [yActivities])

  return { activities, logActivity }
}

// Activity feed component
function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const getActivityMessage = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'node_added':
        return `added "${activity.details.nodeName || 'a node'}"`
      case 'node_deleted':
        return `deleted "${activity.details.nodeName || 'a node'}"`
      case 'node_updated':
        return `updated ${activity.details.field} on "${activity.details.nodeName}"`
      case 'edge_added':
        return 'connected two nodes'
      case 'edge_deleted':
        return 'removed a connection'
      default:
        return 'made a change'
    }
  }

  return (
    <div className="activity-feed p-4 max-h-96 overflow-y-auto">
      <h3 className="font-semibold mb-4">Recent Activity</h3>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: activity.userColor }}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.userName}</span>
                {' '}
                {getActivityMessage(activity)}
              </p>
              <p className="text-xs text-gray-500">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 5.4 Change Notifications

```typescript
import { toast } from 'your-toast-library' // e.g., react-hot-toast, sonner

export function useChangeNotifications(
  ydoc: Y.Doc,
  awareness: Awareness | null,
  currentUserId: string
) {
  useEffect(() => {
    const yNodes = ydoc.getMap('nodes')
    const yEdges = ydoc.getMap('edges')

    // Debounce notifications
    let notificationTimeout: NodeJS.Timeout | null = null
    const pendingChanges: { user: string, count: number }[] = []

    const showNotification = () => {
      if (pendingChanges.length === 0) return

      const summary = pendingChanges.reduce((acc, { user, count }) => {
        acc[user] = (acc[user] || 0) + count
        return acc
      }, {} as Record<string, number>)

      Object.entries(summary).forEach(([userName, count]) => {
        toast(`${userName} made ${count} change${count > 1 ? 's' : ''}`, {
          icon: '✏️',
          duration: 3000
        })
      })

      pendingChanges.length = 0
    }

    const handleChange = (event: Y.YMapEvent<any>) => {
      // Get the user who made the change from transaction origin
      const origin = event.transaction.origin
      if (origin === currentUserId) return // Don't notify for own changes

      // Try to get user info from awareness
      let userName = 'Someone'
      if (awareness) {
        const states = awareness.getStates()
        states.forEach((state) => {
          if (state.user?.id === origin) {
            userName = state.user.name
          }
        })
      }

      pendingChanges.push({ user: userName, count: event.changes.keys.size })

      // Debounce
      if (notificationTimeout) clearTimeout(notificationTimeout)
      notificationTimeout = setTimeout(showNotification, 1000)
    }

    yNodes.observe(handleChange)
    yEdges.observe(handleChange)

    return () => {
      yNodes.unobserve(handleChange)
      yEdges.unobserve(handleChange)
      if (notificationTimeout) clearTimeout(notificationTimeout)
    }
  }, [ydoc, awareness, currentUserId])
}
```

---

## 6. Implementation Recommendations

### 6.1 Recommended Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    ReactFlow Canvas                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Custom Nodes │  │ Cursors      │  │ Selection    │   │  │
│  │  │ (Agent, LLM) │  │ Overlay      │  │ Indicators   │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    State Layer                           │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐ │  │
│  │  │   Zustand Store      │◄►│   zustand-middleware-yjs │ │  │
│  │  │   (Local Actions)    │  │   (CRDT Sync)            │ │  │
│  │  └──────────────────────┘  └──────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Yjs Layer                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │  │
│  │  │   Y.Doc    │  │  Awareness │  │    UndoManager     │ │  │
│  │  │ (Workflow) │  │  (Presence)│  │  (Per-user undo)   │ │  │
│  │  └─────┬──────┘  └─────┬──────┘  └────────────────────┘ │  │
│  └────────┼───────────────┼────────────────────────────────┘  │
│           │               │                                    │
│  ┌────────┴───────────────┴────────────────────────────────┐  │
│  │                    Provider Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐                     │  │
│  │  │ IndexedDB    │  │ WebSocket    │                     │  │
│  │  │ (Offline)    │  │ (Network)    │                     │  │
│  │  └──────────────┘  └──────────────┘                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                                │
                                │ WebSocket
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    Backend Services                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Y-Sweet / y-websocket Server               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Auth/Token   │  │ Room Mgmt    │  │ Persistence  │  │  │
│  │  │ Validation   │  │ (Per workflow)│  │ to S3/DB     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Supabase                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Auth         │  │ Realtime     │  │ Storage      │  │  │
│  │  │ (Users)      │  │ (Backup      │  │ (Workflow    │  │  │
│  │  │              │  │  presence)   │  │  metadata)   │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Recommended Libraries and Tools

| Category | Primary Choice | Alternative | Notes |
|----------|----------------|-------------|-------|
| **CRDT** | Yjs | Automerge 2.0 | Yjs is faster, better ecosystem |
| **State Management** | zustand-middleware-yjs | y-zustand | Middleware approach more flexible |
| **Network Provider** | Y-Sweet | y-websocket | Y-Sweet for production, y-websocket for self-host |
| **Offline Storage** | y-indexeddb | - | Standard choice |
| **Presence** | Yjs Awareness | Liveblocks | Built-in with Yjs |
| **Flow Builder** | ReactFlow Pro | - | Has collaboration examples |
| **Managed Platform** | Y-Sweet Cloud | Liveblocks | Y-Sweet if using Yjs directly |

### 6.3 Implementation Phases

#### Phase 1: Basic Collaboration (2-3 weeks)
1. Set up Yjs with zustand-middleware-yjs
2. Integrate y-websocket for real-time sync
3. Add y-indexeddb for offline support
4. Basic node/edge synchronization

#### Phase 2: Presence Features (1-2 weeks)
1. Implement cursor tracking with awareness
2. Add user avatar display
3. Selection highlighting for other users
4. "Who's viewing" indicator

#### Phase 3: Conflict Resolution (1-2 weeks)
1. Implement node locking (optional, soft locking)
2. Add collaborative undo/redo
3. Handle edge cases (concurrent node deletion, etc.)
4. Activity logging

#### Phase 4: Polish and Scale (1-2 weeks)
1. Notification system for changes
2. Activity feed
3. Performance optimization
4. Load testing and scaling considerations

### 6.4 Scalability Considerations

**Document Size Management:**
- Split large workflows into linked documents
- Archive old activity data
- Implement garbage collection for deleted nodes

**Connection Scaling:**
- Y-Sweet/Jamsocket handles horizontal scaling
- Consider room limits (e.g., max 50 users per workflow)
- Implement connection pooling

**Performance:**
```typescript
// Throttle awareness updates
const CURSOR_UPDATE_INTERVAL = 50 // ms

const throttledCursorUpdate = throttle((position) => {
  awareness.setLocalStateField('cursor', { position })
}, CURSOR_UPDATE_INTERVAL)

// Batch state updates
ydoc.transact(() => {
  // Multiple changes in single transaction
  yNodes.set('node-1', { ... })
  yNodes.set('node-2', { ... })
  yEdges.set('edge-1', { ... })
})
```

### 6.5 Offline Support Strategies

```typescript
// Offline-first initialization
async function initializeCollaboration(workflowId: string) {
  const ydoc = new Y.Doc()

  // 1. First, load from IndexedDB (instant)
  const indexeddbProvider = new IndexeddbPersistence(workflowId, ydoc)
  await indexeddbProvider.whenSynced

  // 2. Then, connect to server (may fail if offline)
  const wsProvider = new WebsocketProvider(
    process.env.YJS_SERVER!,
    workflowId,
    ydoc,
    {
      connect: true,
      // Automatic reconnection
      WebSocketPolyfill: require('ws'),
      resyncInterval: 10000, // Resync every 10s
    }
  )

  // 3. Track connection status
  const connectionStatus = {
    isOnline: false,
    isSynced: false
  }

  wsProvider.on('status', ({ status }) => {
    connectionStatus.isOnline = status === 'connected'
  })

  wsProvider.on('sync', (isSynced) => {
    connectionStatus.isSynced = isSynced
  })

  return { ydoc, wsProvider, indexeddbProvider, connectionStatus }
}

// Display offline indicator
function ConnectionStatus({ status }: { status: typeof connectionStatus }) {
  if (!status.isOnline) {
    return (
      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
        Offline - Changes will sync when connected
      </div>
    )
  }

  if (!status.isSynced) {
    return (
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
        <Spinner size="sm" />
        Syncing...
      </div>
    )
  }

  return (
    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
      Connected
    </div>
  )
}
```

---

## 7. Architecture Diagrams

### 7.1 Data Flow Diagram

```
User A (Browser)                    User B (Browser)
     │                                    │
     ▼                                    ▼
┌─────────────┐                    ┌─────────────┐
│  ReactFlow  │                    │  ReactFlow  │
│   Canvas    │                    │   Canvas    │
└─────┬───────┘                    └─────┬───────┘
      │                                  │
      ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│   Zustand   │                    │   Zustand   │
│    Store    │                    │    Store    │
└─────┬───────┘                    └─────┬───────┘
      │                                  │
      ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│    Y.Doc    │◄────────────────►  │    Y.Doc    │
│  (Workflow) │     WebSocket      │  (Workflow) │
└─────┬───────┘                    └─────┬───────┘
      │                                  │
      ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│  IndexedDB  │                    │  IndexedDB  │
│  (Offline)  │                    │  (Offline)  │
└─────────────┘                    └─────────────┘
```

### 7.2 Document Structure

```
Y.Doc
├── Y.Map('nodes')
│   ├── 'node-1' → Y.Map
│   │   ├── 'id' → 'node-1'
│   │   ├── 'type' → 'llm-agent'
│   │   ├── 'position' → Y.Map
│   │   │   ├── 'x' → 100
│   │   │   └── 'y' → 200
│   │   └── 'data' → Y.Map
│   │       ├── 'label' → 'GPT-4 Agent'
│   │       ├── 'model' → 'gpt-4'
│   │       └── 'temperature' → 0.7
│   └── 'node-2' → Y.Map
│       └── ...
│
├── Y.Map('edges')
│   ├── 'edge-1' → { id, source, target, ... }
│   └── ...
│
├── Y.Map('locks')
│   └── 'node-1' → { userId, userName, timestamp }
│
├── Y.Array('activities')
│   └── [activity1, activity2, ...]
│
└── Y.Map('metadata')
    ├── 'name' → 'My Workflow'
    ├── 'description' → '...'
    └── 'lastModified' → 1705824000000
```

### 7.3 Presence Data Flow

```
User Types/Moves              Awareness CRDT              Other Users
      │                            │                           │
      │   setLocalStateField       │                           │
      │───────────────────────────►│                           │
      │   ('cursor', {x, y})       │                           │
      │                            │                           │
      │                            │   Broadcast to peers      │
      │                            │──────────────────────────►│
      │                            │                           │
      │                            │                    'change' event
      │                            │                           │
      │                            │                   getStates()
      │                            │                           │
      │                            │               Render remote cursors
      │                            │                           │
```

---

## 8. Code Examples

### 8.1 Complete Collaborative Workflow Store

```typescript
// stores/workflow-store.ts
import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { yjs } from 'zustand-middleware-yjs'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { UndoManager } from 'yjs'

// Types
interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

interface WorkflowMetadata {
  id: string
  name: string
  description: string
  lastModified: number
}

interface WorkflowState {
  nodes: Record<string, WorkflowNode>
  edges: Record<string, WorkflowEdge>
  metadata: WorkflowMetadata

  // Actions
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  updateNodePosition: (id: string, position: { x: number; y: number }) => void
  deleteNode: (id: string) => void
  addEdge: (edge: WorkflowEdge) => void
  deleteEdge: (id: string) => void
  updateMetadata: (updates: Partial<WorkflowMetadata>) => void
}

// Create collaborative store
export function createCollaborativeWorkflowStore(
  workflowId: string,
  userId: string,
  wsServerUrl: string
) {
  // Create Yjs document
  const ydoc = new Y.Doc()

  // Set up providers
  const indexeddbProvider = new IndexeddbPersistence(workflowId, ydoc)
  const wsProvider = new WebsocketProvider(wsServerUrl, workflowId, ydoc)

  // Set up undo manager
  const yNodes = ydoc.getMap('nodes')
  const yEdges = ydoc.getMap('edges')
  const undoManager = new UndoManager([yNodes, yEdges], {
    trackedOrigins: new Set([userId])
  })

  // Create store with Yjs middleware
  const useStore = create<WorkflowState>()(
    subscribeWithSelector(
      yjs(
        ydoc,
        'workflow',
        (set, get) => ({
          nodes: {},
          edges: {},
          metadata: {
            id: workflowId,
            name: 'Untitled Workflow',
            description: '',
            lastModified: Date.now()
          },

          addNode: (node) => {
            ydoc.transact(() => {
              set((state) => ({
                nodes: { ...state.nodes, [node.id]: node },
                metadata: { ...state.metadata, lastModified: Date.now() }
              }))
            }, userId)
          },

          updateNode: (id, updates) => {
            ydoc.transact(() => {
              set((state) => ({
                nodes: {
                  ...state.nodes,
                  [id]: { ...state.nodes[id], ...updates }
                },
                metadata: { ...state.metadata, lastModified: Date.now() }
              }))
            }, userId)
          },

          updateNodePosition: (id, position) => {
            // Don't track position changes for undo
            set((state) => ({
              nodes: {
                ...state.nodes,
                [id]: { ...state.nodes[id], position }
              }
            }))
          },

          deleteNode: (id) => {
            ydoc.transact(() => {
              set((state) => {
                const { [id]: deleted, ...rest } = state.nodes
                // Also delete connected edges
                const newEdges = { ...state.edges }
                Object.keys(newEdges).forEach((edgeId) => {
                  const edge = newEdges[edgeId]
                  if (edge.source === id || edge.target === id) {
                    delete newEdges[edgeId]
                  }
                })
                return {
                  nodes: rest,
                  edges: newEdges,
                  metadata: { ...state.metadata, lastModified: Date.now() }
                }
              })
            }, userId)
          },

          addEdge: (edge) => {
            ydoc.transact(() => {
              set((state) => ({
                edges: { ...state.edges, [edge.id]: edge },
                metadata: { ...state.metadata, lastModified: Date.now() }
              }))
            }, userId)
          },

          deleteEdge: (id) => {
            ydoc.transact(() => {
              set((state) => {
                const { [id]: deleted, ...rest } = state.edges
                return {
                  edges: rest,
                  metadata: { ...state.metadata, lastModified: Date.now() }
                }
              })
            }, userId)
          },

          updateMetadata: (updates) => {
            set((state) => ({
              metadata: { ...state.metadata, ...updates, lastModified: Date.now() }
            }))
          }
        })
      )
    )
  )

  return {
    useStore,
    ydoc,
    wsProvider,
    indexeddbProvider,
    undoManager,
    awareness: wsProvider.awareness,

    // Helper methods
    undo: () => undoManager.undo(),
    redo: () => undoManager.redo(),
    canUndo: () => undoManager.undoStack.length > 0,
    canRedo: () => undoManager.redoStack.length > 0,

    destroy: () => {
      undoManager.destroy()
      wsProvider.destroy()
      indexeddbProvider.destroy()
      ydoc.destroy()
    }
  }
}
```

### 8.2 React Hook for Collaborative Flow

```typescript
// hooks/useCollaborativeFlow.ts
import { useEffect, useMemo, useCallback, useState } from 'react'
import { useReactFlow, Node, Edge, Connection } from 'reactflow'
import { createCollaborativeWorkflowStore } from '../stores/workflow-store'
import { useAuth } from './useAuth' // Your auth hook

interface UseCollaborativeFlowOptions {
  workflowId: string
}

export function useCollaborativeFlow({ workflowId }: UseCollaborativeFlowOptions) {
  const { user } = useAuth()
  const { screenToFlowPosition } = useReactFlow()
  const [isInitialized, setIsInitialized] = useState(false)

  // Create store instance
  const store = useMemo(() => {
    if (!user) return null

    return createCollaborativeWorkflowStore(
      workflowId,
      user.id,
      process.env.NEXT_PUBLIC_YJS_SERVER!
    )
  }, [workflowId, user])

  // Initialize awareness with user info
  useEffect(() => {
    if (!store || !user) return

    store.awareness.setLocalStateField('user', {
      id: user.id,
      name: user.name,
      email: user.email,
      color: user.color || generateUserColor(user.id),
      avatar: user.avatar
    })

    setIsInitialized(true)

    return () => {
      store.destroy()
    }
  }, [store, user])

  // Get store state
  const nodes = store?.useStore((state) => state.nodes) ?? {}
  const edges = store?.useStore((state) => state.edges) ?? {}
  const metadata = store?.useStore((state) => state.metadata)
  const addNode = store?.useStore((state) => state.addNode)
  const updateNode = store?.useStore((state) => state.updateNode)
  const updateNodePosition = store?.useStore((state) => state.updateNodePosition)
  const deleteNode = store?.useStore((state) => state.deleteNode)
  const addEdge = store?.useStore((state) => state.addEdge)
  const deleteEdge = store?.useStore((state) => state.deleteEdge)

  // Convert to ReactFlow format
  const nodesArray = useMemo(() => Object.values(nodes), [nodes])
  const edgesArray = useMemo(() => Object.values(edges), [edges])

  // Handle node changes from ReactFlow
  const onNodesChange = useCallback((changes: any[]) => {
    changes.forEach((change) => {
      if (change.type === 'position' && change.position && updateNodePosition) {
        updateNodePosition(change.id, change.position)
      } else if (change.type === 'remove' && deleteNode) {
        deleteNode(change.id)
      }
    })
  }, [updateNodePosition, deleteNode])

  // Handle edge changes from ReactFlow
  const onEdgesChange = useCallback((changes: any[]) => {
    changes.forEach((change) => {
      if (change.type === 'remove' && deleteEdge) {
        deleteEdge(change.id)
      }
    })
  }, [deleteEdge])

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (!addEdge) return

    const edge: Edge = {
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined
    }

    addEdge(edge)
  }, [addEdge])

  // Track cursor position
  const trackCursor = useCallback((event: React.MouseEvent) => {
    if (!store?.awareness) return

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    store.awareness.setLocalStateField('cursor', {
      position,
      timestamp: Date.now()
    })
  }, [store?.awareness, screenToFlowPosition])

  return {
    // Data
    nodes: nodesArray,
    edges: edgesArray,
    metadata,
    isInitialized,

    // Handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    trackCursor,

    // Actions
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,

    // Undo/Redo
    undo: store?.undo,
    redo: store?.redo,
    canUndo: store?.canUndo() ?? false,
    canRedo: store?.canRedo() ?? false,

    // Presence
    awareness: store?.awareness ?? null
  }
}

// Helper to generate consistent colors for users
function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ]

  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
```

### 8.3 Complete Collaborative Workflow Builder Component

```tsx
// components/CollaborativeWorkflowBuilder.tsx
import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow'
import 'reactflow/dist/style.css'

import { useCollaborativeFlow } from '../hooks/useCollaborativeFlow'
import { useCursors } from '../hooks/useCursors'
import { useConnectedUsers } from '../hooks/useConnectedUsers'
import { CursorOverlay } from './CursorOverlay'
import { AvatarStack } from './AvatarStack'
import { ConnectionStatus } from './ConnectionStatus'
import { UndoRedoControls } from './UndoRedoControls'

// Custom node types
import { LLMAgentNode } from './nodes/LLMAgentNode'
import { ToolNode } from './nodes/ToolNode'
import { ConditionNode } from './nodes/ConditionNode'

const nodeTypes = {
  'llm-agent': LLMAgentNode,
  'tool': ToolNode,
  'condition': ConditionNode
}

interface Props {
  workflowId: string
}

function WorkflowBuilderInner({ workflowId }: Props) {
  const {
    nodes,
    edges,
    metadata,
    isInitialized,
    onNodesChange,
    onEdgesChange,
    onConnect,
    trackCursor,
    addNode,
    undo,
    redo,
    canUndo,
    canRedo,
    awareness
  } = useCollaborativeFlow({ workflowId })

  const cursors = useCursors(awareness)
  const connectedUsers = useConnectedUsers(awareness)
  const { project } = useReactFlow()

  // Handle drop from component palette
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()

    const type = event.dataTransfer.getData('application/reactflow')
    if (!type || !addNode) return

    const position = project({
      x: event.clientX,
      y: event.clientY
    })

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: `New ${type}` }
    }

    addNode(newNode)
  }, [addNode, project])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMouseMove={trackCursor}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        {/* Top-right panel for collaboration info */}
        <Panel position="top-right" className="flex items-center gap-4">
          <ConnectionStatus />
          <AvatarStack users={connectedUsers} />
        </Panel>

        {/* Top-left for title and undo/redo */}
        <Panel position="top-left" className="flex items-center gap-4">
          <h1 className="font-semibold">{metadata?.name || 'Untitled'}</h1>
          <UndoRedoControls
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </Panel>
      </ReactFlow>

      {/* Cursor overlay */}
      <CursorOverlay cursors={cursors} />
    </div>
  )
}

export function CollaborativeWorkflowBuilder(props: Props) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner {...props} />
    </ReactFlowProvider>
  )
}
```

---

## 9. References

### Official Documentation
- [Yjs Documentation](https://docs.yjs.dev/)
- [Yjs GitHub Repository](https://github.com/yjs/yjs)
- [Y.Map API](https://docs.yjs.dev/api/shared-types/y.map)
- [Y.Array API](https://docs.yjs.dev/api/shared-types/y.array)
- [Y.Text API](https://docs.yjs.dev/api/shared-types/y.text)
- [Yjs Awareness Protocol](https://docs.yjs.dev/api/about-awareness)
- [ReactFlow Multiplayer Guide](https://reactflow.dev/learn/advanced-use/multiplayer)
- [ReactFlow Collaborative Example](https://reactflow.dev/examples/interaction/collaborative)

### CRDT Resources
- [CRDT.tech - Implementations](https://crdt.tech/implementations)
- [Wikipedia - Conflict-free Replicated Data Types](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [The CRDT Dictionary](https://www.iankduncan.com/engineering/2025-11-27-crdt-dictionary/)
- [Best CRDT Libraries 2025](https://velt.dev/blog/best-crdt-libraries-real-time-data-sync)

### Tutorials and Guides
- [Synergy Codes - ReactFlow with Yjs Ebook](https://www.synergycodes.com/blog/real-time-collaboration-for-multiple-users-in-react-flow-projects-with-yjs-e-book)
- [Building Real-Time Collaboration: OT vs CRDT](https://www.tiny.cloud/blog/real-time-collaboration-ot-vs-crdt/)
- [Yjs Deep Dive: Awareness](https://www.tag1consulting.com/blog/yjs-deep-dive-part-3)
- [Tutorial: Collaborative Editing with Yjs and React](https://dev.to/route06/tutorial-building-a-collaborative-editing-app-with-yjs-valtio-and-react-1mcl)

### Managed Solutions
- [Y-Sweet Documentation](https://docs.y-sweet.dev/)
- [Y-Sweet by Jamsocket](https://jamsocket.com/y-sweet)
- [Liveblocks](https://liveblocks.io/)
- [PartyKit](https://www.partykit.io/)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

### Libraries
- [zustand-middleware-yjs](https://github.com/joebobmiles/zustand-middleware-yjs)
- [y-indexeddb](https://github.com/yjs/y-indexeddb)
- [y-websocket](https://github.com/yjs/y-websocket)
- [y-supabase](https://github.com/AlexDunmow/y-supabase)

### Research Papers
- [CRDTs vs OT for Collaborative Editing](https://goyalkavya.medium.com/crdts-vs-ots-99a7cfce2418)
- [Undo and Redo Support for Replicated Registers](https://dl.acm.org/doi/10.1145/3642976.3653029)
- [A CRDT Supporting Selective Undo](https://link.springer.com/chapter/10.1007/978-3-319-19129-4_16)

### Related Projects
- [Zed Editor - CRDTs for Multiplayer](https://zed.dev/blog/crdts)
- [Conclave - P2P Collaborative Editor](https://conclave-team.github.io/conclave-site/)

---

## Appendix: Decision Matrix

| Factor | Yjs + Y-Sweet | Liveblocks | Custom y-websocket |
|--------|---------------|------------|-------------------|
| **Time to Market** | Medium | Fast | Slow |
| **Cost at Scale** | Medium | Higher | Lower (self-host) |
| **Flexibility** | High | Medium | High |
| **Offline Support** | Excellent | Good | Excellent |
| **ReactFlow Integration** | Good examples | Need custom | Good examples |
| **Maintenance Burden** | Low | Lowest | High |
| **Vendor Lock-in** | Low | Medium | None |

**Recommendation for Hyyve Platform:**

Start with **Yjs + Y-Sweet** for the best balance of features, performance, and time-to-market:

1. Y-Sweet provides managed infrastructure with open-source escape hatch
2. Native Yjs integration means all ecosystem tools work
3. Proven at scale (Figma-style architecture)
4. Excellent offline support critical for workflow builders
5. Clear migration path to self-hosted if needed

For a faster proof-of-concept, consider **Liveblocks** initially, then migrate to Yjs for production if cost or customization becomes a concern.

---

## Validation Notes

**Validated: 2026-01-21** using deepwiki MCP, context7 MCP, and web search

### ✅ Verified Claims

| Claim | Source | Status |
|-------|--------|--------|
| Yjs uses YATA (modified) algorithm | deepwiki (yjs/yjs) | ✅ Verified |
| Y.Map, Y.Array, Y.Text, Y.XmlFragment, Y.XmlElement shared types | deepwiki (yjs/yjs) | ✅ Verified |
| Yjs struct merging, content deletion, garbage collection optimizations | deepwiki (yjs/yjs) | ✅ Verified |
| Awareness protocol via y-websocket for presence tracking | context7 (yjs/yjs) | ✅ Verified |
| Y-Sweet DocumentManager and createYjsProvider APIs | deepwiki (jamsocket/y-sweet) | ✅ Verified |
| Liveblocks LiveblocksProvider, RoomProvider, useStorage, useMutation | context7 (liveblocks) | ✅ Verified |
| Liveblocks createRoomContext for typed hooks | context7 (liveblocks) | ✅ Verified |
| PartyKit y-partykit onConnect and YPartyKitProvider | deepwiki (partykit/partykit) | ✅ Verified |
| Supabase Realtime channel.track(), presenceState() | deepwiki (supabase/supabase) | ✅ Verified |
| Supabase Realtime presence events (sync, join, leave) | deepwiki (supabase/supabase) | ✅ Verified |
| ReactFlow has official Multiplayer guide and Collaborative example | Web search | ✅ Verified |
| ReactFlow Pro has collaboration examples | Web search | ✅ Verified |

### ⚠️ Corrections Applied

1. **Y-Sweet API Correction**
   - Original: Used `YSweetProvider` from `@y-sweet/sdk`
   - Correction: Server uses `DocumentManager` from `@y-sweet/sdk`, client uses `createYjsProvider` from `@y-sweet/client`
   - Updated code example with correct API structure
   - Source: deepwiki (jamsocket/y-sweet)

### 📝 Implementation Notes

1. **Yjs Awareness Protocol Location**
   - Awareness is NOT part of core Yjs library
   - It is provided by network providers like y-websocket
   - Access via `wsProvider.awareness` after creating WebsocketProvider

2. **ReactFlow Multiplayer**
   - ReactFlow does NOT have built-in multiplayer support
   - Official documentation provides integration patterns with CRDTs (Yjs, Automerge, Loro)
   - ReactFlow Pro offers collaboration examples as paid features
   - Key insight: Use Y.Map keyed by node/edge ID (not arrays) for better conflict resolution

3. **y-supabase Status**
   - Document correctly notes y-supabase is "not production ready"
   - Supabase Realtime can be used for presence alongside Yjs for document sync

4. **zustand-middleware-yjs**
   - Repository exists but not indexed in deepwiki
   - API patterns shown in document appear correct based on Yjs integration patterns
   - Consider as "unverified but likely correct"

### 📚 Validation Sources

- **deepwiki MCP**: Queried yjs/yjs, jamsocket/y-sweet, partykit/partykit, supabase/supabase
- **context7 MCP**: Validated Yjs, Liveblocks library APIs
- **Web Search**: Confirmed ReactFlow multiplayer documentation and examples

### 🔗 Key Reference Links Verified

- [ReactFlow Collaborative Example](https://reactflow.dev/examples/interaction/collaborative) ✅
- [ReactFlow Multiplayer Guide](https://reactflow.dev/learn/advanced-use/multiplayer) ✅
- [Synergy Codes Yjs + ReactFlow E-Book](https://www.synergycodes.com/blog/real-time-collaboration-for-multiple-users-in-react-flow-projects-with-yjs-e-book) ✅

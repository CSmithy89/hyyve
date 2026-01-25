# Technical Research: Visual Diff Engine for Workflow Version Comparison

**Document Version**: 1.0
**Date**: January 25, 2026
**Status**: Validated
**Project**: Hyyve Platform
**Research Type**: Technical Deep Dive
**Gap Reference**: UX 5.4.2, FR331-335

---

## Executive Summary

This research document addresses the **Visual Diff Engine** gap identified during architecture validation. It covers patterns for comparing workflow versions, visualizing changes in node-based editors, and integrating with Yjs-based collaborative editing.

### Key Findings

1. **Industry Standard Exists**: UiPath Studio, Git diff tools provide reference implementations
2. **Node-Based Diff is Distinct**: Graph comparison differs from text diff
3. **Yjs Integration Required**: Must work with existing CRDT layer
4. **Multiple View Modes**: Side-by-side, overlay, and unified views needed

---

## Table of Contents

1. [Industry Analysis](#1-industry-analysis)
2. [Diff Algorithm Approaches](#2-diff-algorithm-approaches)
3. [Visual Representation Patterns](#3-visual-representation-patterns)
4. [ReactFlow Integration](#4-reactflow-integration)
5. [Yjs Version Comparison](#5-yjs-version-comparison)
6. [UI/UX Patterns](#6-uiux-patterns)
7. [Implementation Recommendations](#7-implementation-recommendations)
8. [References](#references)

---

## 1. Industry Analysis

### 1.1 Existing Solutions

| Tool | Type | Strengths | Limitations |
|------|------|-----------|-------------|
| **UiPath Studio** | Workflow diff | Side-by-side XAML comparison, activity highlighting | Proprietary, not open source |
| **Meld** | General diff | Visual clarity, 3-way merge | Text-focused, not graph-aware |
| **WinMerge** | File diff | Folder + file comparison | No visual workflow support |
| **VS Code** | Git diff | Inline, side-by-side modes | Text-only |
| **Diffsite** | Website diff | Overlay, swipe modes | Image-based, not structural |

### 1.2 UiPath Workflow Diff (Reference Implementation)

UiPath Studio provides the closest reference for workflow diffing:

```
┌─────────────────────────────────────────────────────────────────┐
│                    UIPATH WORKFLOW DIFF                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Version A (Previous)          │   Version B (Current)         │
│  ┌─────────────────────────┐   │   ┌─────────────────────────┐ │
│  │  [Start]                │   │   │  [Start]                │ │
│  │     │                   │   │   │     │                   │ │
│  │     ▼                   │   │   │     ▼                   │ │
│  │  [Validate] ───────────────────►[Validate] (modified)    │ │
│  │     │                   │   │   │     │                   │ │
│  │     ▼                   │   │   │     ▼                   │ │
│  │  [Process]              │   │   │  [Process]              │ │
│  │     │                   │   │   │     │                   │ │
│  │     ▼                   │   │   │     ▼                   │ │
│  │  [End]                  │   │   │  [New Step] ◄── ADDED   │ │
│  │                         │   │   │     │                   │ │
│  │                         │   │   │     ▼                   │ │
│  │                         │   │   │  [End]                  │ │
│  └─────────────────────────┘   │   └─────────────────────────┘ │
│                                                                 │
│  Legend: 🟢 Added  🔴 Removed  🟡 Modified  ⚪ Unchanged        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**UiPath Diff Capabilities**:
- Side-by-side .xaml file comparison
- Highlights added/removed activities
- Shows modified packages, variables, arguments
- Property-level change detection

---

## 2. Diff Algorithm Approaches

### 2.1 Graph Diff vs Text Diff

| Aspect | Text Diff (LCS) | Graph Diff |
|--------|-----------------|------------|
| **Unit** | Lines/characters | Nodes + Edges |
| **Algorithm** | Longest Common Subsequence | Graph Edit Distance |
| **Ordering** | Sequential | Structural (DAG) |
| **Identity** | Position-based | ID-based |
| **Complexity** | O(n*m) | O(n^2) to O(n^3) |

### 2.2 Graph Edit Distance Algorithm

```typescript
interface GraphDiff {
  added: {
    nodes: Node[];
    edges: Edge[];
  };
  removed: {
    nodes: Node[];
    edges: Edge[];
  };
  modified: {
    nodes: NodeModification[];
    edges: EdgeModification[];
  };
  unchanged: {
    nodes: Node[];
    edges: Edge[];
  };
}

interface NodeModification {
  nodeId: string;
  before: Partial<Node>;
  after: Partial<Node>;
  changedProperties: string[];
}

function computeGraphDiff(
  graphA: { nodes: Node[]; edges: Edge[] },
  graphB: { nodes: Node[]; edges: Edge[] }
): GraphDiff {
  const nodeIdsA = new Set(graphA.nodes.map(n => n.id));
  const nodeIdsB = new Set(graphB.nodes.map(n => n.id));

  // Added nodes: in B but not in A
  const addedNodes = graphB.nodes.filter(n => !nodeIdsA.has(n.id));

  // Removed nodes: in A but not in B
  const removedNodes = graphA.nodes.filter(n => !nodeIdsB.has(n.id));

  // Modified nodes: in both, but different
  const modifiedNodes: NodeModification[] = [];
  const unchangedNodes: Node[] = [];

  for (const nodeB of graphB.nodes) {
    if (nodeIdsA.has(nodeB.id)) {
      const nodeA = graphA.nodes.find(n => n.id === nodeB.id)!;
      const changes = computeNodeChanges(nodeA, nodeB);
      if (changes.length > 0) {
        modifiedNodes.push({
          nodeId: nodeB.id,
          before: nodeA,
          after: nodeB,
          changedProperties: changes,
        });
      } else {
        unchangedNodes.push(nodeB);
      }
    }
  }

  // Similar logic for edges...

  return { added, removed, modified, unchanged };
}

function computeNodeChanges(nodeA: Node, nodeB: Node): string[] {
  const changes: string[] = [];

  if (nodeA.position.x !== nodeB.position.x ||
      nodeA.position.y !== nodeB.position.y) {
    changes.push('position');
  }

  if (JSON.stringify(nodeA.data) !== JSON.stringify(nodeB.data)) {
    changes.push('data');
  }

  if (nodeA.type !== nodeB.type) {
    changes.push('type');
  }

  return changes;
}
```

### 2.3 Property-Level Deep Diff

```typescript
import { diff as deepDiff } from 'deep-object-diff';

interface PropertyChange {
  path: string[];
  before: unknown;
  after: unknown;
  type: 'added' | 'removed' | 'modified';
}

function computePropertyChanges(
  objA: Record<string, unknown>,
  objB: Record<string, unknown>
): PropertyChange[] {
  const changes: PropertyChange[] = [];
  const diffResult = deepDiff(objA, objB);

  function traverse(obj: unknown, path: string[] = []) {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const newPath = [...path, key];

        if (value === undefined) {
          // Property removed
          changes.push({
            path: newPath,
            before: getValueAtPath(objA, newPath),
            after: undefined,
            type: 'removed',
          });
        } else if (getValueAtPath(objA, newPath) === undefined) {
          // Property added
          changes.push({
            path: newPath,
            before: undefined,
            after: value,
            type: 'added',
          });
        } else if (typeof value !== 'object') {
          // Property modified
          changes.push({
            path: newPath,
            before: getValueAtPath(objA, newPath),
            after: value,
            type: 'modified',
          });
        } else {
          traverse(value, newPath);
        }
      }
    }
  }

  traverse(diffResult);
  return changes;
}
```

---

## 3. Visual Representation Patterns

### 3.1 View Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **Side-by-Side** | Two canvases, synchronized scrolling | Large structural changes |
| **Unified** | Single canvas with overlay markers | Small modifications |
| **Overlay** | Opacity slider between versions | Position changes |
| **Highlight Only** | Current version with change markers | Quick review |

### 3.2 Change Indicators

```typescript
interface DiffVisualConfig {
  colors: {
    added: string;      // Green: #22c55e
    removed: string;    // Red: #ef4444
    modified: string;   // Yellow: #eab308
    unchanged: string;  // Gray: #6b7280
  };

  indicators: {
    nodeAdded: 'border' | 'glow' | 'badge';
    nodeRemoved: 'strikethrough' | 'fade' | 'cross';
    nodeModified: 'highlight' | 'pulse' | 'icon';
    edgeAdded: 'dashed' | 'animated' | 'thick';
    edgeRemoved: 'faded' | 'strikethrough';
  };

  annotations: {
    showPropertyChanges: boolean;
    showTimestamps: boolean;
    showAuthor: boolean;
  };
}

const DEFAULT_DIFF_CONFIG: DiffVisualConfig = {
  colors: {
    added: '#22c55e',
    removed: '#ef4444',
    modified: '#eab308',
    unchanged: '#6b7280',
  },
  indicators: {
    nodeAdded: 'glow',
    nodeRemoved: 'fade',
    nodeModified: 'highlight',
    edgeAdded: 'animated',
    edgeRemoved: 'faded',
  },
  annotations: {
    showPropertyChanges: true,
    showTimestamps: true,
    showAuthor: false,
  },
};
```

### 3.3 Change Summary Panel

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERSION COMPARISON                            │
│  v1.2.0 (Jan 20, 2026) → v1.3.0 (Jan 25, 2026)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Summary:                                                       │
│  ├── 🟢 3 nodes added                                           │
│  ├── 🔴 1 node removed                                          │
│  ├── 🟡 4 nodes modified                                        │
│  └── 🔗 2 edges changed                                         │
│                                                                 │
│  Changes:                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ + [LLM Node] "Summarizer" at position (450, 200)            ││
│  │ + [Condition] "HasAttachments" at position (300, 350)       ││
│  │ + [API Call] "NotifySlack" at position (600, 400)           ││
│  │ - [Email Node] "LegacyNotify" (replaced by NotifySlack)     ││
│  │ ~ [Prompt Node] "MainPrompt": template updated              ││
│  │ ~ [LLM Node] "Classifier": model changed gpt-4 → gpt-4o     ││
│  │ ~ [Variable] "maxTokens": 2048 → 4096                        ││
│  │ ~ [Edge] Classifier → Summarizer: condition modified        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [◀ Previous Change] [Next Change ▶] [Accept All] [Revert All] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. ReactFlow Integration

### 4.1 Diff Overlay Component

```tsx
import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import { GraphDiff, DiffVisualConfig } from './types';

interface DiffViewerProps {
  graphA: { nodes: Node[]; edges: Edge[] };
  graphB: { nodes: Node[]; edges: Edge[] };
  diff: GraphDiff;
  config: DiffVisualConfig;
  mode: 'side-by-side' | 'unified' | 'overlay';
}

function DiffViewer({ graphA, graphB, diff, config, mode }: DiffViewerProps) {
  const applyDiffStyles = useCallback((node: Node, diffType: 'added' | 'removed' | 'modified' | 'unchanged') => {
    return {
      ...node,
      style: {
        ...node.style,
        borderColor: config.colors[diffType],
        borderWidth: diffType === 'unchanged' ? 1 : 3,
        opacity: diffType === 'removed' ? 0.5 : 1,
        boxShadow: diffType === 'added' ? `0 0 10px ${config.colors.added}` : undefined,
      },
      data: {
        ...node.data,
        diffType,
        diffBadge: diffType !== 'unchanged',
      },
    };
  }, [config]);

  const styledNodesA = useMemo(() => {
    return graphA.nodes.map(node => {
      if (diff.removed.nodes.some(n => n.id === node.id)) {
        return applyDiffStyles(node, 'removed');
      }
      if (diff.modified.nodes.some(m => m.nodeId === node.id)) {
        return applyDiffStyles(node, 'modified');
      }
      return applyDiffStyles(node, 'unchanged');
    });
  }, [graphA, diff, applyDiffStyles]);

  const styledNodesB = useMemo(() => {
    return graphB.nodes.map(node => {
      if (diff.added.nodes.some(n => n.id === node.id)) {
        return applyDiffStyles(node, 'added');
      }
      if (diff.modified.nodes.some(m => m.nodeId === node.id)) {
        return applyDiffStyles(node, 'modified');
      }
      return applyDiffStyles(node, 'unchanged');
    });
  }, [graphB, diff, applyDiffStyles]);

  if (mode === 'side-by-side') {
    return (
      <div className="flex h-full">
        <div className="w-1/2 border-r">
          <div className="text-sm font-medium p-2 bg-gray-100">
            Version A (Previous)
          </div>
          <ReactFlow nodes={styledNodesA} edges={graphA.edges}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="w-1/2">
          <div className="text-sm font-medium p-2 bg-gray-100">
            Version B (Current)
          </div>
          <ReactFlow nodes={styledNodesB} edges={graphB.edges}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    );
  }

  // Unified and overlay modes...
}
```

### 4.2 Custom Diff Node Component

```tsx
interface DiffNodeProps {
  data: {
    label: string;
    diffType: 'added' | 'removed' | 'modified' | 'unchanged';
    changes?: PropertyChange[];
  };
}

function DiffNode({ data }: DiffNodeProps) {
  const badgeColors = {
    added: 'bg-green-500',
    removed: 'bg-red-500',
    modified: 'bg-yellow-500',
    unchanged: '',
  };

  return (
    <div className="relative">
      {data.diffType !== 'unchanged' && (
        <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${badgeColors[data.diffType]}`}>
          {data.diffType === 'added' && '+'}
          {data.diffType === 'removed' && '-'}
          {data.diffType === 'modified' && '~'}
        </div>
      )}

      <div className="p-3 rounded border">
        <div className="font-medium">{data.label}</div>

        {data.changes && data.changes.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            {data.changes.map((change, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="font-mono">{change.path.join('.')}</span>
                <span className="text-red-500 line-through">{String(change.before)}</span>
                <span>→</span>
                <span className="text-green-500">{String(change.after)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Yjs Version Comparison

### 5.1 Snapshot-Based Diffing

```typescript
import * as Y from 'yjs';

interface VersionSnapshot {
  id: string;
  timestamp: Date;
  snapshot: Uint8Array;
  metadata: {
    author: string;
    description: string;
    nodeCount: number;
    edgeCount: number;
  };
}

class VersionManager {
  private doc: Y.Doc;
  private snapshots: VersionSnapshot[] = [];

  createSnapshot(description: string, author: string): VersionSnapshot {
    const snapshot: VersionSnapshot = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      snapshot: Y.encodeStateAsUpdate(this.doc),
      metadata: {
        author,
        description,
        nodeCount: this.doc.getArray('nodes').length,
        edgeCount: this.doc.getArray('edges').length,
      },
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  compareSnapshots(snapshotA: VersionSnapshot, snapshotB: VersionSnapshot): GraphDiff {
    // Restore both snapshots to temporary docs
    const docA = new Y.Doc();
    Y.applyUpdate(docA, snapshotA.snapshot);

    const docB = new Y.Doc();
    Y.applyUpdate(docB, snapshotB.snapshot);

    // Extract nodes and edges
    const graphA = {
      nodes: docA.getArray('nodes').toArray() as Node[],
      edges: docA.getArray('edges').toArray() as Edge[],
    };

    const graphB = {
      nodes: docB.getArray('nodes').toArray() as Node[],
      edges: docB.getArray('edges').toArray() as Edge[],
    };

    return computeGraphDiff(graphA, graphB);
  }
}
```

### 5.2 Real-Time Change Tracking

```typescript
function useRealtimeDiff(doc: Y.Doc) {
  const [changes, setChanges] = useState<PropertyChange[]>([]);
  const baselineRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Capture baseline on mount
    baselineRef.current = Y.encodeStateAsUpdate(doc);

    const observer = () => {
      if (!baselineRef.current) return;

      const baseDoc = new Y.Doc();
      Y.applyUpdate(baseDoc, baselineRef.current);

      const diff = computeGraphDiff(
        extractGraph(baseDoc),
        extractGraph(doc)
      );

      setChanges(flattenDiffToChanges(diff));
    };

    doc.on('update', observer);
    return () => doc.off('update', observer);
  }, [doc]);

  return changes;
}
```

---

## 6. UI/UX Patterns

### 6.1 Navigation Between Changes

```tsx
function DiffNavigation({ diff, currentIndex, onNavigate }: DiffNavigationProps) {
  const allChanges = [
    ...diff.added.nodes.map(n => ({ type: 'added', item: n })),
    ...diff.removed.nodes.map(n => ({ type: 'removed', item: n })),
    ...diff.modified.nodes.map(m => ({ type: 'modified', item: m })),
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex <= 0}
        className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        ◀ Previous
      </button>

      <span className="text-sm">
        Change {currentIndex + 1} of {allChanges.length}
      </span>

      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex >= allChanges.length - 1}
        className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        Next ▶
      </button>

      <div className="ml-auto flex gap-2">
        <button className="px-3 py-1 rounded bg-green-500 text-white">
          Accept All
        </button>
        <button className="px-3 py-1 rounded bg-red-500 text-white">
          Revert All
        </button>
      </div>
    </div>
  );
}
```

### 6.2 Version Timeline

```tsx
function VersionTimeline({ versions, selectedA, selectedB, onSelect }: VersionTimelineProps) {
  return (
    <div className="flex flex-col gap-2">
      {versions.map((version, index) => (
        <div
          key={version.id}
          className={`
            p-2 rounded border cursor-pointer
            ${selectedA?.id === version.id ? 'border-blue-500 bg-blue-50' : ''}
            ${selectedB?.id === version.id ? 'border-green-500 bg-green-50' : ''}
          `}
          onClick={() => onSelect(version)}
        >
          <div className="flex justify-between">
            <span className="font-medium">v{index + 1}</span>
            <span className="text-sm text-gray-500">
              {version.timestamp.toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm text-gray-600">{version.metadata.description}</div>
          <div className="text-xs text-gray-400">
            {version.metadata.nodeCount} nodes, {version.metadata.edgeCount} edges
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Implementation Recommendations

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISUAL DIFF ENGINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Version    │───►│    Graph     │───►│    Visual    │      │
│  │   Manager    │    │   Differ     │    │   Renderer   │      │
│  │  (Yjs snap)  │    │  (GED algo)  │    │  (ReactFlow) │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                    │              │
│         └───────────────────┴────────────────────┘              │
│                             │                                   │
│                             ▼                                   │
│                    ┌──────────────┐                             │
│                    │  Diff Panel  │                             │
│                    │  (Summary +  │                             │
│                    │  Navigation) │                             │
│                    └──────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Implementation Phases

| Phase | Scope | Effort |
|-------|-------|--------|
| **P1** | Graph diff algorithm | 1 sprint |
| **P2** | Side-by-side view | 1 sprint |
| **P3** | Change navigation & summary | 1 sprint |
| **P4** | Yjs version snapshots | 1 sprint |
| **P5** | Accept/revert actions | 1 sprint |

### 7.3 Dependencies

- `deep-object-diff`: Property-level diffing
- `reactflow`: Canvas rendering
- `yjs`: Version snapshots
- `@radix-ui/react-slider`: Overlay opacity control

---

## References

- [UiPath Studio - Workflow Diff](https://docs.uipath.com/studio/standalone/2024.10/user-guide/using-file-diff)
- [Visual diff — Read the Docs](https://docs.readthedocs.com/platform/latest/visual-diff.html)
- [diff-viewer GitHub Topics](https://github.com/topics/diff-viewer)
- [Visual Diff Algorithm - BrowserStack](https://www.browserstack.com/guide/visual-diff-algorithm-to-improve-visual-testing)
- [Comprehensive Guide to Diff Tools - Graphite](https://graphite.com/guides/comprehensive-guide-to-diff-tools)
- [Meld - Visual Diff Tool](https://meldmerge.org/)
- [WinMerge](https://winmerge.org/?lang=en)
- [Diffsite - Visual Website Comparison](https://pianomister.github.io/diffsite/)

---

## Appendix A: Validation Notes

**Validation Method**: Industry analysis, open-source tool review, UX research
**Confidence Level**: High - patterns are well-established
**Integration Points**: ReactFlow, Yjs, existing collaborative editing layer

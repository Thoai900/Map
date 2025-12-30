import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { initialData } from './data';
import { MindMapNode } from './components/MindMapNode';
import { NodeEditor } from './components/NodeEditor';
import { TransformState, MindMapData } from './types';
import { ZoomIn, ZoomOut, RotateCcw, Presentation, MousePointer2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Layout Configuration ---
const NODE_WIDTH = 300; // Horizontal space per level
const NODE_HEIGHT = 180; // Vertical space per node
const ROOT_X = 0; // Relative start X
const ROOT_Y = 0; // Relative start Y

const App: React.FC = () => {
  
  const [data, setData] = useState<MindMapData>(initialData);
  // Initial state centered roughly, but will be corrected by useEffect
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for drag math
  const dragStartRef = useRef({ x: 0, y: 0 });
  const transformRef = useRef(transform); // Keep track of latest transform without re-renders for events
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sync ref with state
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // --- Tree Layout Algorithm ---
  const { visibleNodes, edges, rootNodePosition } = useMemo(() => {
    let nodes: MindMapData[] = [];
    let links: { source: MindMapData; target: MindMapData }[] = [];
    let leafIndex = 0;

    const traverse = (node: MindMapData, depth: number): { y: number } => {
        const x = ROOT_X + depth * NODE_WIDTH;
        let y = 0;

        if (!node.children || node.children.length === 0 || !node.isExpanded) {
            y = ROOT_Y + leafIndex * NODE_HEIGHT;
            leafIndex++;
        } else {
            let firstChildY = Infinity;
            let lastChildY = -Infinity;
            
            node.children.forEach(child => {
                const childPos = traverse(child, depth + 1);
                if (childPos.y < firstChildY) firstChildY = childPos.y;
                if (childPos.y > lastChildY) lastChildY = childPos.y;
                links.push({ source: node, target: child });
            });
            y = (firstChildY + lastChildY) / 2;
        }

        const positionedNode = { ...node, x, y };
        nodes.push(positionedNode);
        return { y };
    };

    traverse(data, 0);

    // Normalize Y so the tree is centered vertically around 0 relative to the calculation
    const totalHeight = leafIndex * NODE_HEIGHT;
    const offset = totalHeight / 2;
    nodes = nodes.map(n => ({ ...n, y: (n.y || 0) - offset }));

    // Re-map edges
    const positionedEdges = links.map(link => {
        const source = nodes.find(n => n.id === link.source.id);
        const target = nodes.find(n => n.id === link.target.id);
        return { source: source!, target: target! };
    }).filter(e => e.source && e.target);

    // Find root position for centering
    const rootNode = nodes.find(n => n.id === 'root');

    return { 
        visibleNodes: nodes, 
        edges: positionedEdges,
        rootNodePosition: rootNode ? { x: rootNode.x || 0, y: rootNode.y || 0 } : { x: 0, y: 0 }
    };
  }, [data]);


  // Helper: Focus on a specific coordinate (centering it)
  const centerOnPoint = useCallback((targetX: number, targetY: number, targetScale: number = 0.8) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // We want: targetX * scale + offsetX = clientWidth / 2
    // So: offsetX = clientWidth / 2 - targetX * scale
    // We adjust for the node width approx (150px) to center the node visual, not just top-left corner
    const nodeHalfWidth = 120; 
    
    setTransform({
        x: (clientWidth / 2) - ((targetX + nodeHalfWidth) * targetScale),
        y: (clientHeight / 2) - (targetY * targetScale),
        scale: targetScale
    });
  }, []);

  // Initial Center on Root
  useEffect(() => {
    // Small timeout to ensure container ref is ready and layout is computed
    const timer = setTimeout(() => {
        centerOnPoint(rootNodePosition.x, rootNodePosition.y, 0.8);
    }, 50);
    return () => clearTimeout(timer);
  }, []); // Run once on mount (and logically should run if root moves significantly, but for now mount is enough)


  // --- Helper Functions ---
  const updateTree = (node: MindMapData, targetId: string, updater: (n: MindMapData) => MindMapData): MindMapData => {
    if (node.id === targetId) return updater(node);
    if (node.children) {
        return { ...node, children: node.children.map(child => updateTree(child, targetId, updater)) };
    }
    return node;
  };

  const handleToggleExpand = (id: string) => {
    setData(prev => updateTree(prev, id, (node) => ({ ...node, isExpanded: !node.isExpanded })));
  };

  const handleSelectNode = (node: MindMapData) => setSelectedNodeId(node.id);

  // --- Optimized Drag Handling ---
  
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore if clicking on interactive elements
    if ((e.target as HTMLElement).closest('.node-card, button, input, textarea, a')) return;
    
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    dragStartRef.current = { 
        x: e.clientX - transform.x, 
        y: e.clientY - transform.y 
    };
  };

  // Attach global listeners for dragging to prevent losing focus when moving fast
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        // Direct calculation without transition for 1:1 feel
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        
        setTransform(prev => ({ ...prev, x: newX, y: newY }));
    };

    const handleWindowMouseUp = () => {
        if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.1, transform.scale + scaleAmount), 4);
        setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
        // Pan with scrollpad
        setTransform(prev => ({
            ...prev,
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY
        }));
    }
  };

  const selectedNode = selectedNodeId ? visibleNodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans relative">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0 transition-transform duration-75 ease-linear"
        style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            backgroundPosition: `${transform.x}px ${transform.y}px`,
        }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-slate-100 max-w-sm transition-all hover:shadow-2xl select-none">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1">
          Kế Hoạch Tài Chính
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
             <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                <Presentation size={12}/> Interactive Mode
             </span>
             <span className="flex items-center gap-1 text-slate-400">
                <MousePointer2 size={12}/> Drag to move
             </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 flex flex-col gap-1">
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale + 0.2, 4) }))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom In">
                <ZoomIn size={20} />
            </button>
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale - 0.2, 0.1) }))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom Out">
                <ZoomOut size={20} />
            </button>
            <hr className="border-slate-100 my-0.5" />
            <button onClick={() => centerOnPoint(rootNodePosition.x, rootNodePosition.y, 0.8)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Reset View to Root">
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      {/* Detail Viewer */}
      <AnimatePresence>
        {selectedNode && (
            <NodeEditor 
                key="detail-view"
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
            />
        )}
      </AnimatePresence>

      {/* Main Canvas */}
      <div 
        ref={containerRef}
        className={`w-full h-full outline-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={() => setSelectedNodeId(null)}
      >
        <motion.div 
          className="absolute origin-top-left will-change-transform"
          animate={{
            x: transform.x,
            y: transform.y,
            scale: transform.scale
          }}
          // CRITICAL FIX: If dragging, use duration: 0 for 1:1 instant movement. 
          // If not dragging (zooming/resetting), use spring for smoothness.
          transition={
            isDragging 
            ? { duration: 0 } 
            : { type: "spring", stiffness: 300, damping: 25 }
          }
          style={{ width: 0, height: 0 }}
        >
            {/* Edges Layer */}
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none -z-10">
                <AnimatePresence>
                    {edges.map(edge => {
                        const startX = (edge.source.x || 0) + 240; 
                        const startY = (edge.source.y || 0) + 60; 
                        const endX = (edge.target.x || 0) - 20; 
                        const endY = (edge.target.y || 0) + 60;
                        
                        const dist = Math.abs(endX - startX);
                        const controlPoint1X = startX + dist * 0.4;
                        const controlPoint2X = endX - dist * 0.4;
                        const path = `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`;

                        return (
                            <motion.path
                                key={`${edge.source.id}-${edge.target.id}`}
                                d={path}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1, d: path }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </AnimatePresence>
            </svg>

            {/* Nodes Layer */}
            <div className="relative">
                <AnimatePresence>
                    {visibleNodes.map(node => (
                        <MindMapNode 
                            key={node.id}
                            data={node} 
                            onToggleExpand={handleToggleExpand} 
                            onSelect={handleSelectNode}
                            selectedId={selectedNodeId || undefined}
                        />
                    ))}
                </AnimatePresence>
            </div>

        </motion.div>
      </div>
    </div>
  );
};

export default App;
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { initialData } from './data';
import { MindMapNode } from './components/MindMapNode';
import { NodeEditor } from './components/NodeEditor';
import { TransformState, MindMapData } from './types';
import { ZoomIn, ZoomOut, RotateCcw, Presentation } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Layout Configuration ---
const NODE_WIDTH = 300; // Horizontal space per level
const NODE_HEIGHT = 180; // Vertical space per node
const ROOT_X = 100;
const ROOT_Y = 400;

const App: React.FC = () => {
  
  const [data, setData] = useState<MindMapData>(initialData);
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Tree Layout Algorithm ---
  // This calculates absolute x,y coordinates for every visible node
  const { visibleNodes, edges } = useMemo(() => {
    let nodes: MindMapData[] = [];
    let links: { source: MindMapData; target: MindMapData }[] = [];
    
    // We need a mutable counter for vertical positioning of leaves
    let leafIndex = 0;

    // Recursive function to calculate positions
    const traverse = (node: MindMapData, depth: number): { y: number } => {
        // Horizontal position is simple: Depth * Width
        const x = ROOT_X + depth * NODE_WIDTH;
        
        let y = 0;

        if (!node.children || node.children.length === 0 || !node.isExpanded) {
            // It's a leaf (visually), assign Y based on global leaf counter
            y = ROOT_Y + leafIndex * NODE_HEIGHT;
            leafIndex++;
        } else {
            // It's a parent, process children first
            let firstChildY = Infinity;
            let lastChildY = -Infinity;
            
            node.children.forEach(child => {
                const childPos = traverse(child, depth + 1);
                if (childPos.y < firstChildY) firstChildY = childPos.y;
                if (childPos.y > lastChildY) lastChildY = childPos.y;
                
                // Add link
                links.push({ source: node, target: child });
            });

            // Parent Y is average of first and last child
            y = (firstChildY + lastChildY) / 2;
        }

        // Assign computed position to a clone of the node (to avoid mutating state directly in render)
        // Actually, we can mutate the object pushed to 'nodes' list which is new
        const positionedNode = { ...node, x, y };
        
        // Push to flat list for rendering
        nodes.push(positionedNode);
        
        // Return Y for parent calculation
        return { y };
    };

    traverse(data, 0);

    // Center the tree vertically initially
    const totalHeight = leafIndex * NODE_HEIGHT;
    const offset = totalHeight / 2;
    nodes = nodes.map(n => ({ ...n, y: (n.y || 0) - offset }));

    // Re-map edges to point to the new positioned node objects
    const positionedEdges = links.map(link => {
        const source = nodes.find(n => n.id === link.source.id);
        const target = nodes.find(n => n.id === link.target.id);
        return { source: source!, target: target! };
    }).filter(e => e.source && e.target);

    return { visibleNodes: nodes, edges: positionedEdges };
  }, [data]);


  // Helper to deep copy and update tree
  const updateTree = (
    node: MindMapData, 
    targetId: string, 
    updater: (n: MindMapData) => MindMapData
  ): MindMapData => {
    if (node.id === targetId) {
        return updater(node);
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => updateTree(child, targetId, updater))
        };
    }
    return node;
  };

  const handleToggleExpand = (id: string) => {
    setData(prev => updateTree(prev, id, (node) => ({ ...node, isExpanded: !node.isExpanded })));
  };

  const handleSelectNode = (node: MindMapData) => {
    setSelectedNodeId(node.id);
  };

  // --- Canvas Interaction ---

  useEffect(() => {
    if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setTransform({
            x: clientWidth / 4,
            y: clientHeight / 2,
            scale: 0.8
        });
    }
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.1, transform.scale + scaleAmount), 4);
        setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
        setTransform(prev => ({
            ...prev,
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY
        }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-card, button, input, textarea, a')) return;
    setIsDragging(true);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);
  const zoomIn = () => setTransform(p => ({ ...p, scale: Math.min(p.scale + 0.2, 4) }));
  const zoomOut = () => setTransform(p => ({ ...p, scale: Math.max(p.scale - 0.2, 0.1) }));
  const resetView = () => {
    if (containerRef.current) {
        setTransform({
            x: containerRef.current.clientWidth / 4,
            y: containerRef.current.clientHeight / 2,
            scale: 0.8
        });
    }
  };

  const selectedNode = selectedNodeId ? visibleNodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans relative">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            transform: `translate(${transform.x % 24}px, ${transform.y % 24}px)` 
        }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-slate-100 max-w-sm transition-all hover:shadow-2xl">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1">
          Kế Hoạch Tài Chính
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
             <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                <Presentation size={12}/> Interactive Mode
             </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 flex flex-col gap-1">
            <button onClick={zoomIn} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom In">
                <ZoomIn size={20} />
            </button>
            <button onClick={zoomOut} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom Out">
                <ZoomOut size={20} />
            </button>
            <hr className="border-slate-100 my-0.5" />
            <button onClick={resetView} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Reset View">
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      {/* Detail Viewer Sidebar */}
      <AnimatePresence>
        {selectedNode && (
            <NodeEditor 
                key="detail-view"
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
            />
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          transition={{ type: "spring", stiffness: 400, damping: 30 }} // Smooth pan/zoom
          style={{ width: 0, height: 0 }} // Wrapper shouldn't take space
        >
            {/* 1. Connection Lines Layer (SVG) */}
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none -z-10">
                <AnimatePresence>
                    {edges.map(edge => {
                        const startX = (edge.source.x || 0) + 240; // Right side of source card (approx width)
                        const startY = (edge.source.y || 0) + 60;  // Center of source card (approx height/2)
                        const endX = (edge.target.x || 0) - 20;    // Left side of target card (padding)
                        const endY = (edge.target.y || 0) + 60;    // Center of target card
                        
                        // Bezier Curve Logic
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
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </AnimatePresence>
            </svg>

            {/* 2. Nodes Layer */}
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
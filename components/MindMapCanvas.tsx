import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { initialData } from '../data';
import { MindMapNode } from './MindMapNode';
import { NodeEditor } from './NodeEditor';
import { TransformState, MindMapData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Layout Configuration ---
const NODE_WIDTH = 300;
const NODE_HEIGHT = 180;
const ROOT_X = 0;
const ROOT_Y = 0;

export const MindMapCanvas: React.FC = () => {
  const [data, setData] = useState<MindMapData>(initialData);
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const transformRef = useRef(transform);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

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

    const totalHeight = leafIndex * NODE_HEIGHT;
    const offset = totalHeight / 2;
    nodes = nodes.map(n => ({ ...n, y: (n.y || 0) - offset }));

    const positionedEdges = links.map(link => {
        const source = nodes.find(n => n.id === link.source.id);
        const target = nodes.find(n => n.id === link.target.id);
        return { source: source!, target: target! };
    }).filter(e => e.source && e.target);

    const rootNode = nodes.find(n => n.id === 'root');

    return { 
        visibleNodes: nodes, 
        edges: positionedEdges,
        rootNodePosition: rootNode ? { x: rootNode.x || 0, y: rootNode.y || 0 } : { x: 0, y: 0 }
    };
  }, [data]);

  const centerOnPoint = useCallback((targetX: number, targetY: number, targetScale: number = 0.8) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const nodeHalfWidth = 120; 
    setTransform({
        x: (clientWidth / 2) - ((targetX + nodeHalfWidth) * targetScale),
        y: (clientHeight / 2) - (targetY * targetScale),
        scale: targetScale
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        centerOnPoint(rootNodePosition.x, rootNodePosition.y, 0.8);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-card, button, input, textarea, a')) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { 
        x: e.clientX - transform.x, 
        y: e.clientY - transform.y 
    };
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
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
        setTransform(prev => ({
            ...prev,
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY
        }));
    }
  };

  const selectedNode = selectedNodeId ? visibleNodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F0F4F8]">
      {/* Background with simple grid instead of moving dots to reduce dizziness */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
            backgroundImage: `
                linear-gradient(to right, #E2E8F0 1px, transparent 1px),
                linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
        }}
      />

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 flex flex-col gap-1">
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale + 0.2, 4) }))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <ZoomIn size={20} />
            </button>
            <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale - 0.2, 0.1) }))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <ZoomOut size={20} />
            </button>
            <hr className="border-slate-100 my-0.5" />
            <button onClick={() => centerOnPoint(rootNodePosition.x, rootNodePosition.y, 0.8)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
            <NodeEditor 
                key="detail-view"
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
            />
        )}
      </AnimatePresence>

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
          // CRITICAL: Use rigid transition when dragging (duration: 0). 
          // Use smooth easeOut when zooming/centering, NOT spring, to avoid "jelly" effect.
          transition={isDragging ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: 0, height: 0 }}
        >
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none -z-10">
                <AnimatePresence mode="popLayout">
                    {edges.map(edge => {
                        const startX = (edge.source.x || 0) + 240; 
                        const startY = (edge.source.y || 0) + 60; 
                        const endX = (edge.target.x || 0) - 20; 
                        const endY = (edge.target.y || 0) + 60;
                        const dist = Math.abs(endX - startX);
                        const path = `M ${startX} ${startY} C ${startX + dist * 0.4} ${startY}, ${endX - dist * 0.4} ${endY}, ${endX} ${endY}`;

                        return (
                            <motion.path
                                key={`${edge.source.id}-${edge.target.id}`}
                                d={path}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: 1, 
                                    opacity: 1, 
                                    d: path,
                                    // Use standard easing for lines to match nodes. No spring.
                                    transition: {
                                        d: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                        pathLength: { duration: 0.6, ease: "easeOut" },
                                        opacity: { duration: 0.4 }
                                    }
                                }}
                                exit={{ 
                                    opacity: 0,
                                    transition: { duration: 0.2 }
                                }}
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </AnimatePresence>
            </svg>

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
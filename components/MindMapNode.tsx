import React, { memo } from 'react';
import { MindMapData } from '../types';
import { Target, Wallet, TrendingUp, PieChart, Activity, Calculator, CheckCircle2, AlertCircle, ChevronRight, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MindMapNodeProps {
  data: MindMapData;
  onToggleExpand: (id: string) => void;
  onSelect: (data: MindMapData) => void;
  selectedId?: string;
}

// Icon mapper helper
const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Target': return <Target size={16} />;
    case 'Wallet': return <Wallet size={16} />;
    case 'TrendingUp': return <TrendingUp size={16} />;
    case 'PieChart': return <PieChart size={16} />;
    case 'Activity': return <Activity size={16} />;
    case 'Calculator': return <Calculator size={16} />;
    case 'CheckCircle2': return <CheckCircle2 size={16} />;
    case 'AlertCircle': return <AlertCircle size={16} />;
    default: return <div className="w-2 h-2 rounded-full bg-current" />;
  }
};

// Use memo to prevent re-renders when parent drags (props don't change)
export const MindMapNode: React.FC<MindMapNodeProps> = memo(({ 
  data, 
  onToggleExpand, 
  onSelect,
  selectedId 
}) => {
  const isSelected = selectedId === data.id;
  const hasChildren = data.children && data.children.length > 0;
  
  // Indicators for rich content
  const hasImages = data.images && data.images.length > 0;
  const hasLinks = data.links && data.links.length > 0;
  const hasContent = !!data.content;

  // Root detection based on ID
  const isRoot = data.id === 'root';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        left: data.x,
        top: data.y
      }}
      // Match the ease of the connecting lines exactly. No spring.
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{ position: 'absolute' }}
      className="absolute z-10 node-card"
    >
      <div 
        className={`
          relative flex flex-col gap-2 p-4 rounded-2xl shadow-sm cursor-pointer border transition-all duration-300
          ${isRoot 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent shadow-blue-200/50 shadow-lg min-w-[240px]' 
            : `bg-white text-slate-700 min-w-[220px] max-w-[280px] hover:shadow-md ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-blue-300'}`
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
           <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isRoot ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                  {getIcon(data.icon)}
              </span>
              <span className="font-semibold text-sm leading-tight">{data.label}</span>
           </div>
           
           {hasChildren && (
              <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(data.id);
                  }}
                  className={`
                    p-1 rounded-full flex-shrink-0 transition-colors
                    ${isRoot ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-blue-600'}
                  `}
              >
                  <motion.div
                     animate={{ rotate: data.isExpanded ? 90 : 0 }}
                     transition={{ duration: 0.3 }}
                  >
                     <ChevronRight size={16}/>
                  </motion.div>
              </motion.button>
           )}
        </div>
        
        {/* Description */}
        {data.description && (
          <div className={`text-xs leading-relaxed ${isRoot ? 'text-blue-100' : 'text-slate-500'}`}>
              {data.description}
          </div>
        )}

        {/* Footer Indicators */}
        {(hasImages || hasLinks || hasContent) && (
          <div className={`flex gap-3 pt-2 mt-1 border-t ${isRoot ? 'border-white/20' : 'border-slate-100'}`}>
              {hasContent && (
                <div className="flex items-center gap-1" title="Có nội dung chi tiết">
                   <FileText size={12} className={isRoot ? 'text-blue-200' : 'text-slate-400'} />
                </div>
              )}
              {hasImages && (
                 <div className="flex items-center gap-1" title="Có hình ảnh">
                    <ImageIcon size={12} className={isRoot ? 'text-blue-200' : 'text-slate-400'} />
                    <span className={`text-[10px] ${isRoot ? 'text-blue-200' : 'text-slate-400'}`}>{data.images?.length}</span>
                 </div>
              )}
              {hasLinks && (
                 <div className="flex items-center gap-1" title="Có liên kết">
                    <LinkIcon size={12} className={isRoot ? 'text-blue-200' : 'text-slate-400'} />
                 </div>
              )}
          </div>
        )}

        {/* Connection Points */}
        {/* Input Point (Left) - Not for Root */}
        {!isRoot && (
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }}
             className="absolute top-1/2 -left-[6px] w-3 h-3 bg-white rounded-full border-2 border-slate-300 z-20 flex items-center justify-center"
           >
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
           </motion.div>
        )}
        
        {/* Output Point (Right) - Only if has children */}
        {hasChildren && (
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }}
             className={`absolute top-1/2 -right-[6px] w-3 h-3 bg-white rounded-full border-2 z-20 flex items-center justify-center
                ${data.isExpanded ? 'border-blue-500' : 'border-slate-300'}`}
           >
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${data.isExpanded ? 'bg-blue-500' : 'bg-slate-400'}`} />
           </motion.div>
        )}
      </div>
    </motion.div>
  );
});
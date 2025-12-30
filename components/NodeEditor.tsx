import React, { useState } from 'react';
import { MindMapData } from '../types';
import { X, Image as ImageIcon, Link as LinkIcon, ExternalLink, FileText, AlignLeft, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeDetailProps {
  node: MindMapData;
  onClose: () => void;
}

export const NodeEditor: React.FC<NodeDetailProps> = ({ node, onClose }) => {
  const hasImages = node.images && node.images.length > 0;
  const hasLinks = node.links && node.links.length > 0;
  const hasContent = !!node.content;
  
  // State for Lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <motion.div 
          initial={{ x: 400, opacity: 0, boxShadow: "-10px 0 30px rgba(0,0,0,0)" }}
          animate={{ x: 0, opacity: 1, boxShadow: "-10px 0 30px rgba(0,0,0,0.1)" }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 w-[450px] h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 z-50 flex flex-col"
      >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                  <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
                      Chi tiết nhánh
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                      {node.label}
                  </h2>
                  {node.description && (
                      <p className="mt-2 text-sm text-slate-500 font-medium italic">
                          {node.description}
                      </p>
                  )}
              </div>
              <button 
                  onClick={onClose} 
                  className="p-2 -mr-2 -mt-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                  <X size={24} />
              </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Main Content Text */}
              {hasContent && (
                  <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wide">
                          <AlignLeft size={16} />
                          Nội dung chi tiết
                      </div>
                      <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {node.content}
                      </div>
                  </div>
              )}

              {/* Images Gallery */}
              {hasImages && (
                  <div className="space-y-3">
                      <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm uppercase tracking-wide">
                          <ImageIcon size={16} />
                          Hình ảnh minh họa
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                          {node.images?.map((img, i) => (
                              <div 
                                key={i} 
                                onClick={() => setSelectedImage(img)}
                                className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-zoom-in"
                              >
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                     <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                  </div>
                                  <img 
                                      src={img} 
                                      alt={`Minh họa ${i + 1}`} 
                                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" 
                                  />
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Links Section */}
              {hasLinks && (
                  <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wide">
                          <LinkIcon size={16} />
                          Tài liệu tham khảo
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                          {node.links?.map((link, i) => (
                              <a 
                                  key={i} 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-400 hover:shadow-sm hover:bg-emerald-50/30 transition-all group"
                              >
                                  <div className="p-2 bg-slate-100 rounded-full text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                      <ExternalLink size={16} />
                                  </div>
                                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                                      {link.label}
                                  </span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}
              
              {!hasContent && !hasImages && !hasLinks && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-xl">
                      <FileText size={40} className="opacity-20" />
                      <span className="text-sm">Chưa có nội dung chi tiết cho nhánh này.</span>
                  </div>
              )}
          </div>
      </motion.div>

      {/* Lightbox / Fullscreen Image Viewer */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 cursor-zoom-out"
            >
                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    src={selectedImage}
                    alt="Fullscreen view"
                    className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image itself if desired, but zoom-out usually implies clicking anywhere closes
                />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                    <X size={32} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
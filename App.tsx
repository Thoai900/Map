import React, { useState } from 'react';
import { MindMapCanvas } from './components/MindMapCanvas';
import { Dashboard } from './components/Dashboard';
import { LayoutGrid, Network } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<'mindmap' | 'dashboard'>('mindmap');

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans relative flex flex-col">
      
      {/* Header / Navigation */}
      <div className="absolute top-4 left-0 w-full z-50 px-4 pointer-events-none flex justify-between items-start">
         {/* Title Card */}
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-100 pointer-events-auto">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1">
            Kế Hoạch Tài Chính
            </h1>
            <div className="text-xs text-slate-500 font-medium">Personal Finance Masterplan</div>
        </div>

        {/* View Switcher */}
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-slate-100 pointer-events-auto flex gap-1">
            <button 
                onClick={() => setView('mindmap')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    view === 'mindmap' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
                <Network size={16} />
                <span className="hidden md:inline">Sơ Đồ Tư Duy</span>
            </button>
            <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    view === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
                <LayoutGrid size={16} />
                <span className="hidden md:inline">Quản Trị Tài Chính</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">
            {view === 'mindmap' ? (
                <motion.div 
                    key="mindmap"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                >
                    <MindMapCanvas />
                </motion.div>
            ) : (
                <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full pt-20" // Add padding top for header
                >
                    <Dashboard />
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
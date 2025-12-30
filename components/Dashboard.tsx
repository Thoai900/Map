import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Target, Calculator, 
  Plus, Minus, BarChart3, 
  AlertTriangle
} from 'lucide-react';

// --- Helper Functions ---

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);

// --- Components ---

const Card: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, subtitle, icon, children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-100 ${className}`}
  >
    <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-slate-100 rounded-xl text-blue-600">{icon}</div>}
            <div>
                <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>
        </div>
    </div>
    {children}
  </motion.div>
);

// --- 1. Real-time Market Widget ---
const MarketWidget = () => {
    const [market, setMarket] = useState([
        { symbol: 'Vàng SJC', price: 80500000, change: 0.5, type: 'up' },
        { symbol: 'USD/VND', price: 25450, change: 0.1, type: 'up' },
        { symbol: 'VN-Index', price: 1280.5, change: -0.8, type: 'down' },
        { symbol: 'Bitcoin', price: 1650000000, change: 2.3, type: 'up' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarket(prev => prev.map(item => {
                const volatility = Math.random() * 0.02 - 0.01;
                const newPrice = item.price * (1 + volatility / 100);
                return {
                    ...item,
                    price: newPrice,
                    change: parseFloat((item.change + volatility * 10).toFixed(2)),
                    type: item.change + volatility * 10 >= 0 ? 'up' : 'down'
                };
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {market.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.symbol}</div>
                        {item.type === 'up' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                    </div>
                    <div className="text-lg font-bold text-slate-800 tabular-nums">
                        {item.symbol === 'VN-Index' ? formatNumber(Math.round(item.price)) : formatCurrency(Math.round(item.price)).replace('₫', '')}
                        <span className="text-xs text-slate-400 font-normal ml-0.5">{item.symbol === 'VN-Index' ? 'pts' : '₫'}</span>
                    </div>
                    <div className={`text-xs font-bold mt-1 ${item.type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full h-1 opacity-20 ${item.type === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
            ))}
        </div>
    );
};

// --- 2. Savings Jars Component ---
interface Jar {
    id: number;
    name: string;
    target: number;
    current: number;
    color: string;
}

const SavingsJars = () => {
    const [jars, setJars] = useState<Jar[]>([
        { id: 1, name: 'Quỹ Khẩn Cấp', target: 20000000, current: 5000000, color: 'bg-emerald-500' },
        { id: 2, name: 'Mua Laptop', target: 15000000, current: 8000000, color: 'bg-blue-500' },
        { id: 3, name: 'Du Lịch Hè', target: 5000000, current: 1500000, color: 'bg-orange-500' },
    ]);
    const [amount, setAmount] = useState<number>(500000);

    const updateJar = (id: number, val: number) => {
        setJars(jars.map(jar => jar.id === id ? { ...jar, current: Math.min(jar.target, Math.max(0, jar.current + val)) } : jar));
    };

    return (
        <Card title="Hũ Chi Tiêu & Mục Tiêu" subtitle="Quản lý tiến độ tích lũy" icon={<Target />}>
            <div className="space-y-6">
                <div className="flex gap-2 mb-4">
                     <div className="relative flex-1">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-2 top-2 text-slate-400 text-xs">₫</span>
                     </div>
                     <div className="text-xs text-slate-400 flex items-center">Nhập số tiền để thêm nhanh</div>
                </div>

                {jars.map(jar => {
                    const percent = Math.round((jar.current / jar.target) * 100);
                    return (
                        <div key={jar.id} className="group p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <div className="font-semibold text-slate-700 text-sm">{jar.name}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">Mục tiêu: {formatCurrency(jar.target)}</div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-slate-800 text-sm">{formatCurrency(jar.current)}</span>
                                    <span className="text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">{percent}%</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                <motion.div 
                                    layout
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-full ${jar.color} rounded-full`}
                                />
                            </div>
                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                <button onClick={() => updateJar(jar.id, amount)} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white border border-slate-200 shadow-sm hover:bg-emerald-50 hover:text-emerald-600 rounded font-medium transition-all">
                                    <Plus size={10} /> Thêm
                                </button>
                                <button onClick={() => updateJar(jar.id, -amount)} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white border border-slate-200 shadow-sm hover:bg-rose-50 hover:text-rose-600 rounded font-medium transition-all">
                                    <Minus size={10} /> Bớt
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

// --- 3. Cashflow & Forecasting Component ---
const CashflowForecast = () => {
    const history = [
        { month: 'T10', income: 12000000, expense: 9500000 },
        { month: 'T11', income: 11500000, expense: 10200000 },
        { month: 'T12', income: 14000000, expense: 11000000 },
        { month: 'T01', income: 18000000, expense: 15000000 },
        { month: 'T02', income: 12500000, expense: 8000000 },
        { month: 'T03', income: 13000000, expense: 8500000 },
    ];

    const currentBalance = 15000000;
    const avgIncome = history.reduce((acc, cur) => acc + cur.income, 0) / history.length;
    const avgExpense = history.reduce((acc, cur) => acc + cur.expense, 0) / history.length;
    const monthlySurplus = avgIncome - avgExpense;
    
    // Simple linear forecast
    const forecast = Array.from({length: 6}, (_, i) => currentBalance + monthlySurplus * (i + 1));

    return (
        <Card title="Phân Tích Dòng Tiền & Dự Báo" subtitle="Dữ liệu 6 tháng gần nhất" icon={<BarChart3 />} className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Chart Area - Fixed flex layout */}
                <div className="md:col-span-2 flex flex-col justify-between min-h-[300px]">
                    <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 relative px-2">
                         {/* Background Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-t border-dashed border-slate-200 w-full h-0"></div>
                            ))}
                        </div>

                        {history.map((item, idx) => {
                            const maxVal = 20000000;
                            // Clamp values to max 100%
                            const hIncome = Math.min((item.income / maxVal) * 100, 100);
                            const hExpense = Math.min((item.expense / maxVal) * 100, 100);
                            
                            return (
                                <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-1 group relative z-10">
                                    <div className="w-full flex justify-center items-end gap-1 h-full">
                                        <div className="w-3 md:w-6 h-full flex items-end bg-slate-100/50 rounded-t-sm overflow-hidden">
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: `${hIncome}%` }}
                                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                className="w-full bg-blue-500 rounded-t-sm relative group-hover:bg-blue-600 transition-colors"
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                                    Thu: {formatNumber(item.income)}
                                                </div>
                                            </motion.div>
                                        </div>
                                        <div className="w-3 md:w-6 h-full flex items-end bg-slate-100/50 rounded-t-sm overflow-hidden">
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: `${hExpense}%` }}
                                                transition={{ duration: 0.8, delay: idx * 0.1 + 0.05 }}
                                                className="w-full bg-rose-400 rounded-t-sm relative group-hover:bg-rose-500 transition-colors"
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                                    Chi: {formatNumber(item.expense)}
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium mt-3">{item.month}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-center gap-6 text-xs font-medium mt-6">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><span className="text-slate-600">Thu Nhập</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-400 rounded-sm"></div><span className="text-slate-600">Chi Tiêu</span></div>
                    </div>
                </div>

                {/* Analysis */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-4">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Dòng tiền TB/tháng</div>
                        <div className={`text-xl font-bold ${monthlySurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {monthlySurplus > 0 ? '+' : ''}{formatCurrency(monthlySurplus)}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                         <div className="flex items-center gap-2 mb-2">
                            <Calculator size={16} className="text-blue-500" />
                            <span className="text-sm font-bold text-slate-700">Dự Báo (+6 Tháng)</span>
                         </div>
                         <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                            <div className="text-xs text-slate-400">Số dư dự kiến</div>
                            <div className="text-lg font-bold text-blue-700">{formatCurrency(forecast[5])}</div>
                            <div className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                Tăng {Math.round(((forecast[5] - currentBalance) / currentBalance) * 100)}%
                            </div>
                         </div>
                    </div>

                    {monthlySurplus < 0 && (
                        <div className="mt-auto bg-rose-50 p-3 rounded-lg border border-rose-100 flex gap-2 items-start">
                            <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-rose-700 font-medium">Cảnh báo chi tiêu quá mức!</div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

// --- 4. Financial Tools (Combined) ---
const FinancialTools = () => {
    const [activeTab, setActiveTab] = useState<'budget' | 'compound'>('compound');
    
    // Budget State
    const [income, setIncome] = useState(10000000);

    // Compound Interest State
    const [principal, setPrincipal] = useState(10000000);
    const [monthlyContribution, setMonthlyContribution] = useState(2000000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(5);

    const calculateCompoundInterest = () => {
        const r = rate / 100 / 12;
        const n = years * 12;
        const futureValuePrincipal = principal * Math.pow(1 + r, n);
        const futureValueSeries = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
        return futureValuePrincipal + futureValueSeries;
    };

    const futureValue = calculateCompoundInterest();
    const totalInvested = principal + (monthlyContribution * years * 12);
    const interestEarned = futureValue - totalInvested;

    return (
        <Card title="Công Cụ Tính Toán" subtitle="Lập kế hoạch tài chính cá nhân" icon={<Calculator />} className="md:col-span-3">
             <div className="flex gap-2 mb-6 border-b border-slate-100 pb-1">
                <button 
                    onClick={() => setActiveTab('compound')}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${activeTab === 'compound' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Lãi Suất Kép
                </button>
                <button 
                    onClick={() => setActiveTab('budget')}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${activeTab === 'budget' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Phân Bổ 50/30/20
                </button>
             </div>

             {activeTab === 'budget' ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="md:col-span-1">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Thu nhập hàng tháng</label>
                        <input 
                            type="number" 
                            value={income} 
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                            <div className="text-xs font-bold text-blue-400 uppercase mb-1">Thiết yếu (50%)</div>
                            <div className="text-lg font-bold text-blue-700">{formatCurrency(income * 0.5)}</div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                            <div className="text-xs font-bold text-amber-400 uppercase mb-1">Mong muốn (30%)</div>
                            <div className="text-lg font-bold text-amber-700">{formatCurrency(income * 0.3)}</div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                            <div className="text-xs font-bold text-emerald-400 uppercase mb-1">Tích lũy (20%)</div>
                            <div className="text-lg font-bold text-emerald-700">{formatCurrency(income * 0.2)}</div>
                        </div>
                    </div>
                 </motion.div>
             ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Vốn ban đầu</label>
                                <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Góp hàng tháng</label>
                                <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Lãi suất (%/năm)</label>
                                <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Thời gian (năm)</label>
                                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                         </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-slate-500">Tổng giá trị sau {years} năm:</span>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(futureValue)}</span>
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Vốn gốc đã góp:</span>
                                <span className="font-semibold text-slate-700">{formatCurrency(totalInvested)}</span>
                             </div>
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Tiền lãi nhận được:</span>
                                <span className="font-semibold text-emerald-600">+{formatCurrency(interestEarned)}</span>
                             </div>
                        </div>
                        <div className="mt-4 h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                             <div className="h-full bg-slate-400" style={{ width: `${(totalInvested / futureValue) * 100}%` }}></div>
                             <div className="h-full bg-emerald-500" style={{ width: `${(interestEarned / futureValue) * 100}%` }}></div>
                        </div>
                        <div className="flex gap-4 mt-2 justify-end">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500"><div className="w-2 h-2 bg-slate-400 rounded-full"></div>Gốc</div>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div>Lãi</div>
                        </div>
                    </div>
                </motion.div>
             )}
        </Card>
    );
};

// --- Main Dashboard Layout ---

export const Dashboard: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#F8FAFC] p-4 pb-20 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Trung Tâm Quản Trị</h2>
                <p className="text-slate-500 mt-2">Tổng quan thị trường và sức khỏe tài chính cá nhân.</p>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-slate-500">Tổng Tài Sản Ước Tính</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(125000000)}</div>
            </div>
        </div>

        {/* 1. Market Watch */}
        <MarketWidget />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2. Jars (Left Col) */}
            <div className="md:col-span-1">
                <SavingsJars />
            </div>

            {/* 3. Cashflow (Right Col - Spans 2) */}
            <CashflowForecast />
            
            {/* 4. Financial Tools (Combined) */}
            <FinancialTools />
        </div>
      </div>
    </div>
  );
};
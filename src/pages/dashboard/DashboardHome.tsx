import { useState } from "react";
import { TrendingUp, TrendingDown, MessageCircle, Users, DollarSign, Clock, Target, Headphones, CalendarIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Period = "7d" | "30d" | "90d" | "custom";

const stats = [
  { label: "Total de Leads", value: "2.847", change: 12.5, icon: Users, color: "text-blue-600", bg: "bg-blue-50", sparkData: [30, 45, 38, 55, 48, 62, 70] },
  { label: "Conversões", value: "706", change: 18.7, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", sparkData: [10, 18, 15, 22, 28, 25, 35] },
  { label: "Atendimentos", value: "1.932", change: 8.2, icon: Headphones, color: "text-violet-600", bg: "bg-violet-50", sparkData: [50, 55, 60, 58, 65, 70, 75] },
  { label: "Tempo Médio", value: "2m 34s", change: -15.3, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", sparkData: [80, 70, 65, 55, 50, 42, 38] },
  { label: "Conversas Ativas", value: "384", change: 8.2, icon: MessageCircle, color: "text-cyan-600", bg: "bg-cyan-50", sparkData: [20, 28, 32, 30, 38, 42, 45] },
  { label: "Receita Gerada", value: "R$ 142.580", change: 22.4, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", sparkData: [40, 48, 55, 60, 72, 80, 95] },
];

const dailyLeads = [
  { day: "Seg", leads: 42, conversoes: 12, atendimentos: 38 },
  { day: "Ter", leads: 58, conversoes: 18, atendimentos: 45 },
  { day: "Qua", leads: 35, conversoes: 8, atendimentos: 30 },
  { day: "Qui", leads: 67, conversoes: 22, atendimentos: 55 },
  { day: "Sex", leads: 82, conversoes: 28, atendimentos: 68 },
  { day: "Sáb", leads: 45, conversoes: 15, atendimentos: 35 },
  { day: "Dom", leads: 28, conversoes: 6, atendimentos: 20 },
];

const evolutionData = [
  { name: "Jan", leads: 400, conversoes: 96, atendimentos: 320 },
  { name: "Fev", leads: 600, conversoes: 150, atendimentos: 480 },
  { name: "Mar", leads: 800, conversoes: 208, atendimentos: 640 },
  { name: "Abr", leads: 1100, conversoes: 297, atendimentos: 880 },
  { name: "Mai", leads: 1400, conversoes: 378, atendimentos: 1120 },
  { name: "Jun", leads: 1800, conversoes: 504, atendimentos: 1440 },
  { name: "Jul", leads: 2200, conversoes: 616, atendimentos: 1760 },
  { name: "Ago", leads: 2847, conversoes: 706, atendimentos: 1932 },
];

const channelData = [
  { name: "WhatsApp", value: 58, color: "#10b981" },
  { name: "Site", value: 22, color: "#6366f1" },
  { name: "Instagram", value: 12, color: "#f59e0b" },
  { name: "Indicação", value: 8, color: "#06b6d4" },
];

const recentConversations = [
  { name: "Ana Silva", message: "Olá, gostaria de saber sobre o plano Pro", time: "2 min", status: "active" },
  { name: "Carlos Santos", message: "Preciso de ajuda com integração", time: "15 min", status: "active" },
  { name: "Maria Oliveira", message: "Obrigada pelo atendimento!", time: "1h", status: "resolved" },
  { name: "João Mendes", message: "Qual o prazo de entrega?", time: "2h", status: "pending" },
  { name: "Fernanda Lima", message: "Quero cancelar meu pedido", time: "3h", status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  resolved: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
};

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const DashboardHome = () => {
  const [period, setPeriod] = useState<Period>("30d");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const periods: { key: Period; label: string }[] = [
    { key: "7d", label: "7 dias" },
    { key: "30d", label: "30 dias" },
    { key: "90d", label: "90 dias" },
    { key: "custom", label: "Personalizado" },
  ];

  const sparkColors: Record<string, string> = {
    "text-blue-600": "#2563eb",
    "text-emerald-600": "#059669",
    "text-violet-600": "#7c3aed",
    "text-orange-600": "#ea580c",
    "text-cyan-600": "#0891b2",
    "text-amber-600": "#d97706",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Dashboard</h1>
          <p className="text-sm text-dash-muted mt-1">Visão geral do seu atendimento</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-0.5 rounded-xl">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === p.key ? "bg-white text-dash-fg shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {period === "custom" && (
            <div className="flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-dash-muted hover:border-gray-300 transition">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateFrom ? format(dateFrom, "dd/MM") : "De"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-gray-400">—</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-dash-muted hover:border-gray-300 transition">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateTo ? format(dateTo, "dd/MM") : "Até"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="dash-card p-5 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-sm text-dash-muted">{s.label}</span>
              </div>
              <MiniSparkline data={s.sparkData} color={sparkColors[s.color] || "#6b7280"} />
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-dash-fg">{s.value}</p>
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${s.change > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {s.change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(s.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Leads por dia */}
        <div className="lg:col-span-2 dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-dash-fg">Leads por dia</h2>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Leads</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" />Conversões</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />Atendimentos</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyLeads} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, background: "#fff" }} />
                <Bar dataKey="leads" fill="#10b981" radius={[6, 6, 0, 0]} name="Leads" />
                <Bar dataKey="conversoes" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Conversões" />
                <Bar dataKey="atendimentos" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Atendimentos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Canal de origem */}
        <div className="dash-card p-5">
          <h2 className="text-base font-semibold text-dash-fg mb-4">Canal de Origem</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {channelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {channelData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-dash-muted">{c.name}</span>
                </div>
                <span className="font-medium text-dash-fg">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution + Recent */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 dash-card p-5">
          <h2 className="text-base font-semibold text-dash-fg mb-4">Evolução Mensal</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="atendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fill="url(#leadsFill)" name="Leads" />
                <Area type="monotone" dataKey="conversoes" stroke="#7c3aed" strokeWidth={2} fill="url(#convFill)" name="Conversões" />
                <Area type="monotone" dataKey="atendimentos" stroke="#06b6d4" strokeWidth={2} fill="url(#atendFill)" name="Atendimentos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card p-5">
          <h2 className="text-base font-semibold text-dash-fg mb-4">Conversas Recentes</h2>
          <div className="space-y-3">
            {recentConversations.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-gray-600">{c.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-dash-fg">{c.name}</span>
                    <span className="text-xs text-dash-muted">{c.time}</span>
                  </div>
                  <p className="text-xs text-dash-muted truncate">{c.message}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColors[c.status]}`}>
                  {c.status === "active" ? "Ativo" : c.status === "resolved" ? "Resolvido" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

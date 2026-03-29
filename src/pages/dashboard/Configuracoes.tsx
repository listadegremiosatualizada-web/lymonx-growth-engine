import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, CreditCard, Globe, X, Check, Wifi, WifiOff, Key, Link2, Database, MessageCircle, Webhook, RefreshCw, Copy, Eye, EyeOff, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ConnectionStatus = "connected" | "disconnected" | "checking";

interface Integration {
  id: string;
  dbId?: string;
  name: string;
  description: string;
  icon: typeof Globe;
  color: string;
  bg: string;
  status: ConnectionStatus;
  integration_type: string;
  fields: { key: string; label: string; placeholder: string; type: "text" | "password" | "url"; value: string }[];
}

const defaultIntegrations: Integration[] = [
  {
    id: "whatsapp", name: "API do WhatsApp", description: "Conecte sua conta do WhatsApp Business.",
    icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50", status: "disconnected", integration_type: "whatsapp",
    fields: [
      { key: "api_url", label: "URL da API", placeholder: "https://api.whatsapp.com/v1", type: "url", value: "" },
      { key: "api_key", label: "API Key", placeholder: "whatsapp_api_key_xxx", type: "password", value: "" },
      { key: "phone_id", label: "Phone Number ID", placeholder: "1234567890", type: "text", value: "" },
    ],
  },
  {
    id: "webhook", name: "Webhooks", description: "Configure webhooks para receber eventos em tempo real.",
    icon: Webhook, color: "text-violet-600", bg: "bg-violet-50", status: "disconnected", integration_type: "webhook",
    fields: [
      { key: "webhook_url", label: "URL do Webhook", placeholder: "https://seu-servidor.com/webhook", type: "url", value: "" },
      { key: "secret", label: "Secret Token", placeholder: "webhook_secret_xxx", type: "password", value: "" },
    ],
  },
  {
    id: "database", name: "Banco de Dados", description: "Conecte ao seu banco de dados externo.",
    icon: Database, color: "text-blue-600", bg: "bg-blue-50", status: "disconnected", integration_type: "database",
    fields: [
      { key: "db_url", label: "URL de Conexão", placeholder: "postgresql://user:pass@host:5432/db", type: "password", value: "" },
      { key: "db_key", label: "Service Key", placeholder: "eyJhbGciOiJIUzI1NiIs...", type: "password", value: "" },
    ],
  },
];

const settingSections = [
  { icon: User, title: "Perfil", desc: "Gerencie suas informações pessoais" },
  { icon: Bell, title: "Notificações", desc: "Configure alertas e avisos" },
  { icon: Shield, title: "Segurança", desc: "Senha, 2FA e permissões" },
  { icon: Palette, title: "Personalização", desc: "Temas, cores e marca" },
  { icon: CreditCard, title: "Faturamento", desc: "Plano, pagamentos e faturas" },
];

const statusConfig: Record<ConnectionStatus, { label: string; color: string; icon: typeof Wifi }> = {
  connected: { label: "Conectado", color: "text-emerald-600 bg-emerald-50", icon: Wifi },
  disconnected: { label: "Desconectado", color: "text-gray-500 bg-gray-100", icon: WifiOff },
  checking: { label: "Verificando...", color: "text-amber-600 bg-amber-50", icon: RefreshCw },
};

const Configuracoes = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"general" | "integrations">("integrations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchIntegrations = async () => {
      const { data } = await supabase.from("integrations").select("*");
      if (data && data.length > 0) {
        setIntegrations((prev) =>
          prev.map((integ) => {
            const match = data.find((d) => d.integration_type === integ.integration_type);
            if (!match) return integ;
            const config = (match.config as Record<string, string>) || {};
            return {
              ...integ,
              dbId: match.id,
              status: (match.status as ConnectionStatus) || "disconnected",
              fields: integ.fields.map((f) => ({ ...f, value: config[f.key] || "" })),
            };
          })
        );
      }
      setLoading(false);
    };
    fetchIntegrations();
  }, [user]);

  const toggleFieldVisibility = (fieldKey: string) => {
    const next = new Set(visibleFields);
    if (next.has(fieldKey)) next.delete(fieldKey); else next.add(fieldKey);
    setVisibleFields(next);
  };

  const updateField = (integrationId: string, fieldKey: string, value: string) => {
    setIntegrations((prev) => prev.map((integ) =>
      integ.id === integrationId ? { ...integ, fields: integ.fields.map((f) => (f.key === fieldKey ? { ...f, value } : f)) } : integ
    ));
  };

  const saveIntegration = async (integrationId: string, status: ConnectionStatus) => {
    if (!user) return;
    const integ = integrations.find((i) => i.id === integrationId);
    if (!integ) return;
    const config: Record<string, string> = {};
    integ.fields.forEach((f) => { config[f.key] = f.value; });
    
    if (integ.dbId) {
      await supabase.from("integrations").update({ config, status }).eq("id", integ.dbId);
    } else {
      const { data } = await supabase.from("integrations").insert({
        name: integ.name, integration_type: integ.integration_type, config, status, user_id: user.id,
      }).select().maybeSingle();
      if (data) {
        setIntegrations((prev) => prev.map((i) => i.id === integrationId ? { ...i, dbId: data.id } : i));
      }
    }
  };

  const testConnection = async (integrationId: string) => {
    setIntegrations((prev) => prev.map((i) => i.id === integrationId ? { ...i, status: "checking" } : i));
    setTimeout(async () => {
      const integ = integrations.find((i) => i.id === integrationId);
      const allFilled = integ?.fields.every((f) => f.value.trim().length > 0) ?? false;
      const newStatus: ConnectionStatus = allFilled ? "connected" : "disconnected";
      setIntegrations((prev) => prev.map((i) => i.id === integrationId ? { ...i, status: newStatus } : i));
      await saveIntegration(integrationId, newStatus);
    }, 1500);
  };

  const disconnect = async (integrationId: string) => {
    setIntegrations((prev) => prev.map((i) =>
      i.id === integrationId ? { ...i, status: "disconnected", fields: i.fields.map((f) => ({ ...f, value: "" })) } : i
    ));
    await saveIntegration(integrationId, "disconnected");
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Configurações</h1>
        <p className="text-sm text-dash-muted mt-1">Gerencie integrações e preferências da conta</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-0.5 rounded-xl w-fit">
        <button onClick={() => setTab("integrations")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "integrations" ? "bg-white text-dash-fg shadow-sm" : "text-gray-500"}`}>
          <Globe className="w-4 h-4" /> Integrações
        </button>
        <button onClick={() => setTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "general" ? "bg-white text-dash-fg shadow-sm" : "text-gray-500"}`}>
          <User className="w-4 h-4" /> Geral
        </button>
      </div>

      {tab === "integrations" && (
        <div className="space-y-4">
          {integrations.map((integ) => {
            const Icon = integ.icon;
            const stCfg = statusConfig[integ.status];
            const StIcon = stCfg.icon;
            const isOpen = activeIntegration === integ.id;
            return (
              <div key={integ.id} className="dash-card overflow-hidden">
                <div className="p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition" onClick={() => setActiveIntegration(isOpen ? null : integ.id)}>
                  <div className={`w-12 h-12 rounded-2xl ${integ.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${integ.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-dash-fg">{integ.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${stCfg.color}`}>
                        <StIcon className={`w-3 h-3 ${integ.status === "checking" ? "animate-spin" : ""}`} /> {stCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-dash-muted mt-0.5">{integ.description}</p>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="space-y-4">
                      {integ.fields.map((field) => {
                        const uniqueKey = `${integ.id}_${field.key}`;
                        const isVisible = visibleFields.has(uniqueKey);
                        return (
                          <div key={field.key}>
                            <label className="text-xs font-medium text-dash-muted mb-1.5 flex items-center gap-1.5">
                              {field.type === "password" && <Key className="w-3 h-3" />}
                              {field.type === "url" && <Link2 className="w-3 h-3" />}
                              {field.label}
                            </label>
                            <div className="relative">
                              <input type={field.type === "password" && !isVisible ? "password" : "text"} value={field.value}
                                onChange={(e) => updateField(integ.id, field.key, e.target.value)}
                                className="w-full py-2.5 px-3 pr-20 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 font-mono" placeholder={field.placeholder} />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {field.type === "password" && (
                                  <button onClick={() => toggleFieldVisibility(uniqueKey)} className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition">
                                    {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                )}
                                {field.value && (
                                  <button onClick={() => copyToClipboard(field.value)} className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      {integ.status === "connected" ? (
                        <button onClick={() => disconnect(integ.id)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition">Desconectar</button>
                      ) : (
                        <button onClick={() => testConnection(integ.id)} disabled={integ.status === "checking"}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition disabled:opacity-50">
                          {integ.status === "checking" ? <><RefreshCw className="w-4 h-4 animate-spin" /> Testando...</> : <><Wifi className="w-4 h-4" /> Testar Conexão</>}
                        </button>
                      )}
                      {integ.id === "whatsapp" && (
                        <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline">Documentação <ExternalLink className="w-3 h-3" /></a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "general" && (
        <div className="space-y-3">
          {settingSections.map((s, i) => (
            <div key={i} className="dash-card p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-dash-muted" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-dash-fg">{s.title}</h3>
                <p className="text-xs text-dash-muted">{s.desc}</p>
              </div>
              <span className="text-dash-muted text-lg">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Configuracoes;

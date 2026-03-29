import { Search, Phone, MoreVertical, Send, Paperclip, Smile, Check, CheckCheck, UserCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ConvStatus = "aguardando" | "em_atendimento" | "finalizado";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  status: ConvStatus;
  online: boolean;
  attendantId: string | null;
  phone: string;
}

interface Message {
  id: string;
  from: "client" | "agent";
  text: string;
  time: string;
  read: boolean;
  attendantId?: string;
}

const statusConfig: Record<ConvStatus, { label: string; color: string; dot: string }> = {
  aguardando: { label: "Aguardando", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  em_atendimento: { label: "Em atendimento", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

const Conversas = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ConvStatus | "todos">("todos");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchContacts = async () => {
    if (!user) return;
    const { data } = await supabase.from("contacts").select("*").order("last_message_at", { ascending: false });
    if (data) {
      setContacts(data.map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        lastMsg: c.last_message || "",
        time: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "",
        unread: c.unread_count ?? 0,
        status: (c.status || "aguardando") as ConvStatus,
        online: c.is_online ?? false,
        attendantId: c.attendant_id,
        phone: c.phone || "",
      })));
      if (!selectedId && data.length > 0) setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const fetchMessages = async (contactId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("contact_id", contactId).order("created_at", { ascending: true });
    if (data) {
      setMessages(data.map((m) => ({
        id: m.id,
        from: m.sender as "client" | "agent",
        text: m.text,
        time: new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        read: m.is_read ?? false,
        attendantId: m.attendant_id || undefined,
      })));
    }
  };

  useEffect(() => { fetchContacts(); }, [user]);
  useEffect(() => { if (selectedId) fetchMessages(selectedId); }, [selectedId]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedId || !user) return;
    const text = input.trim();
    setInput("");
    
    // Optimistic update
    const tempMsg: Message = { id: Date.now().toString(), from: "agent", text, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), read: true };
    setMessages((prev) => [...prev, tempMsg]);

    await supabase.from("messages").insert({ contact_id: selectedId, text, sender: "agent", user_id: user.id, is_read: true });
    await supabase.from("contacts").update({ last_message: text, last_message_at: new Date().toISOString(), status: "em_atendimento" }).eq("id", selectedId);

    setContacts((prev) => prev.map((c) => c.id === selectedId ? { ...c, lastMsg: text, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), status: "em_atendimento" } : c));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSelectContact = async (id: string) => {
    setSelectedId(id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    await supabase.from("contacts").update({ unread_count: 0 }).eq("id", id);
  };

  const changeStatus = async (contactId: string, status: ConvStatus) => {
    setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, status } : c)));
    await supabase.from("contacts").update({ status }).eq("id", contactId);
  };

  const selectedContact = contacts.find((c) => c.id === selectedId);
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    aguardando: contacts.filter((c) => c.status === "aguardando").length,
    em_atendimento: contacts.filter((c) => c.status === "em_atendimento").length,
    finalizado: contacts.filter((c) => c.status === "finalizado").length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
      <div className="dash-card h-full flex overflow-hidden">
        {/* Contact list */}
        <div className="w-[360px] border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-dash-fg">
                Conversas
                {totalUnread > 0 && <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-white rounded-full">{totalUnread}</span>}
              </h2>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Buscar conversa..." />
            </div>
            <div className="flex gap-1.5">
              {(["todos", "aguardando", "em_atendimento", "finalizado"] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    filterStatus === s ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}>
                  {s !== "todos" && <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[s].dot}`} />}
                  {s === "todos" ? `Todos (${contacts.length})` : `${statusConfig[s].label} (${statusCounts[s]})`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filteredContacts.map((c) => (
              <div key={c.id} onClick={() => handleSelectContact(c.id)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-l-2 ${
                  selectedId === c.id ? "bg-primary/5 border-l-primary" : "border-l-transparent hover:bg-gray-50"
                }`}>
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selectedId === c.id ? "bg-primary/15 text-primary" : "bg-gray-100 text-gray-600"
                  }`}>{c.avatar}</div>
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-medium ${c.unread > 0 ? "text-dash-fg" : "text-gray-700"}`}>{c.name}</span>
                    <span className={`text-[11px] ${c.unread > 0 ? "text-primary font-medium" : "text-gray-400"}`}>{c.time}</span>
                  </div>
                  <p className={`text-xs truncate pr-2 ${c.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>{c.lastMsg}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusConfig[c.status].color}`}>{statusConfig[c.status].label}</span>
                  </div>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shrink-0">{c.unread}</span>}
              </div>
            ))}
            {filteredContacts.length === 0 && <div className="p-8 text-center text-sm text-gray-400">Nenhuma conversa encontrada</div>}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!selectedContact ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Selecione uma conversa</div>
          ) : (
            <>
              <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{selectedContact.avatar}</span>
                    </div>
                    {selectedContact.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dash-fg">{selectedContact.name}</p>
                    <p className={`text-[11px] ${selectedContact.online ? "text-emerald-500" : "text-gray-400"}`}>
                      {selectedContact.online ? "Online agora" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={selectedContact.status} onChange={(e) => changeStatus(selectedContact.id, e.target.value as ConvStatus)}
                    className="text-[11px] font-medium px-2 py-1 rounded-lg bg-gray-50 border-0 outline-none cursor-pointer">
                    <option value="aguardando">⏳ Aguardando</option>
                    <option value="em_atendimento">🟢 Em atendimento</option>
                    <option value="finalizado">✅ Finalizado</option>
                  </select>
                  <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Phone className="w-4 h-4" /></button>
                  <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-5 space-y-2" style={{ background: "linear-gradient(180deg, #f8f9fb 0%, #f1f3f8 100%)" }}>
                <div className="flex justify-center mb-4">
                  <span className="text-[11px] text-gray-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">Hoje</span>
                </div>
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[65%] text-sm leading-relaxed ${
                      m.from === "agent"
                        ? "bg-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/20"
                        : "bg-white text-dash-fg rounded-2xl rounded-bl-md shadow-sm"
                    }`}>
                      <div className="px-4 py-2">
                        <p>{m.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${m.from === "agent" ? "text-white/60" : "text-gray-400"}`}>
                          <span className="text-[10px]">{m.time}</span>
                          {m.from === "agent" && (m.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                {selectedContact.status === "finalizado" ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-400">Conversa finalizada</p>
                    <button onClick={() => changeStatus(selectedContact.id, "em_atendimento")} className="text-xs text-primary font-medium hover:underline mt-1">Reabrir conversa</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Smile className="w-5 h-5" /></button>
                    <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Paperclip className="w-5 h-5" /></button>
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                      className="flex-1 py-2.5 px-4 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition" placeholder="Digite uma mensagem..." />
                    <button onClick={handleSend} disabled={!input.trim()}
                      className="p-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversas;

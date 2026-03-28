import { Search, Phone, MoreVertical, Send, Paperclip, Smile, Check, CheckCheck, UserCircle, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ConvStatus = "aguardando" | "em_atendimento" | "finalizado";

interface Attendant {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  status: ConvStatus;
  online: boolean;
  attendantId: string | null;
}

interface Message {
  id: number;
  from: "client" | "agent";
  text: string;
  time: string;
  read: boolean;
  attendantId?: string;
}

const attendants: Attendant[] = [
  { id: "a1", name: "Lucas Martins", avatar: "LM", color: "bg-blue-100 text-blue-700" },
  { id: "a2", name: "Juliana Costa", avatar: "JC", color: "bg-violet-100 text-violet-700" },
  { id: "a3", name: "Rafael Lima", avatar: "RL", color: "bg-amber-100 text-amber-700" },
];

const allContacts: Contact[] = [
  { id: 1, name: "Ana Silva", avatar: "AS", lastMsg: "Olá, gostaria de saber sobre o plano Pro", time: "14:34", unread: 2, status: "em_atendimento", online: true, attendantId: "a1" },
  { id: 2, name: "Carlos Santos", avatar: "CS", lastMsg: "Preciso de ajuda com integração", time: "14:20", unread: 3, status: "aguardando", online: true, attendantId: null },
  { id: 3, name: "Maria Oliveira", avatar: "MO", lastMsg: "Obrigada pelo atendimento!", time: "13:45", unread: 0, status: "finalizado", online: false, attendantId: "a2" },
  { id: 4, name: "João Mendes", avatar: "JM", lastMsg: "Qual o prazo de entrega?", time: "12:30", unread: 1, status: "em_atendimento", online: false, attendantId: "a2" },
  { id: 5, name: "Fernanda Lima", avatar: "FL", lastMsg: "Quero cancelar meu pedido", time: "11:15", unread: 0, status: "em_atendimento", online: true, attendantId: "a3" },
  { id: 6, name: "Ricardo Alves", avatar: "RA", lastMsg: "Enviei o comprovante", time: "10:40", unread: 5, status: "aguardando", online: true, attendantId: null },
  { id: 7, name: "Patrícia Costa", avatar: "PC", lastMsg: "Pode me ajudar com o pedido #4521?", time: "09:22", unread: 0, status: "finalizado", online: false, attendantId: "a1" },
  { id: 8, name: "Bruno Souza", avatar: "BS", lastMsg: "Quero upgrade do plano", time: "Ontem", unread: 0, status: "aguardando", online: false, attendantId: null },
];

const allMessages: Record<number, Message[]> = {
  1: [
    { id: 1, from: "client", text: "Olá! Gostaria de saber mais sobre o plano Pro.", time: "14:30", read: true },
    { id: 2, from: "agent", text: "Olá Ana! Claro, o plano Pro inclui atendimento ilimitado, 5 agentes de IA e integração com CRM.", time: "14:31", read: true, attendantId: "a1" },
    { id: 3, from: "client", text: "Qual o valor mensal?", time: "14:32", read: true },
    { id: 4, from: "agent", text: "O plano Pro custa R$ 297/mês. Quer que eu envie uma proposta personalizada?", time: "14:33", read: true, attendantId: "a1" },
    { id: 5, from: "client", text: "Sim, por favor!", time: "14:34", read: false },
    { id: 6, from: "client", text: "E vocês oferecem desconto para plano anual?", time: "14:34", read: false },
  ],
  2: [
    { id: 1, from: "client", text: "Boa tarde! Preciso integrar a API de vocês com meu sistema.", time: "14:15", read: true },
    { id: 2, from: "client", text: "Vocês têm documentação disponível?", time: "14:16", read: false },
    { id: 3, from: "client", text: "Preciso de ajuda com integração", time: "14:20", read: false },
  ],
  3: [
    { id: 1, from: "client", text: "O problema foi resolvido?", time: "13:30", read: true },
    { id: 2, from: "agent", text: "Sim! Já corrigimos a configuração da sua conta.", time: "13:40", read: true, attendantId: "a2" },
    { id: 3, from: "client", text: "Obrigada pelo atendimento!", time: "13:45", read: true },
  ],
  4: [
    { id: 1, from: "client", text: "Fiz um pedido ontem, qual o prazo de entrega?", time: "12:25", read: true },
    { id: 2, from: "agent", text: "Vou verificar o status do seu pedido. Um momento.", time: "12:28", read: true, attendantId: "a2" },
    { id: 3, from: "client", text: "Qual o prazo de entrega?", time: "12:30", read: false },
  ],
  5: [
    { id: 1, from: "client", text: "Quero cancelar meu pedido #3892", time: "11:10", read: true },
    { id: 2, from: "agent", text: "Entendido, Fernanda. Posso saber o motivo do cancelamento?", time: "11:12", read: true, attendantId: "a3" },
    { id: 3, from: "client", text: "Encontrei um preço melhor.", time: "11:15", read: true },
  ],
  6: [
    { id: 1, from: "client", text: "Boa tarde!", time: "10:30", read: true },
    { id: 2, from: "client", text: "Preciso pagar uma fatura em atraso", time: "10:35", read: false },
    { id: 3, from: "client", text: "Enviei o comprovante", time: "10:40", read: false },
  ],
  7: [
    { id: 1, from: "client", text: "Pode me ajudar com o pedido #4521?", time: "09:20", read: true },
    { id: 2, from: "agent", text: "Pedido já foi enviado! Segue o código de rastreio: BR1234567890", time: "09:22", read: true, attendantId: "a1" },
  ],
  8: [
    { id: 1, from: "client", text: "Quero fazer upgrade do plano Basic para o Pro", time: "Ontem", read: true },
  ],
};

const statusConfig: Record<ConvStatus, { label: string; color: string; dot: string }> = {
  aguardando: { label: "Aguardando", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  em_atendimento: { label: "Em atendimento", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

const Conversas = () => {
  const [selected, setSelected] = useState(1);
  const [contacts, setContacts] = useState(allContacts);
  const [messages, setMessages] = useState(allMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ConvStatus | "todos">("todos");
  const [filterAttendant, setFilterAttendant] = useState<string | "todos">("todos");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [selected, messages]);

  const currentAttendant = attendants[0]; // Simula o atendente logado

  const handleSend = () => {
    if (!input.trim()) return;
    const currentMsgs = messages[selected] || [];
    const newMsg: Message = {
      id: currentMsgs.length + 1,
      from: "agent",
      text: input.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: true,
      attendantId: currentAttendant.id,
    };
    setMessages({ ...messages, [selected]: [...currentMsgs, newMsg] });
    setContacts(contacts.map((c) =>
      c.id === selected ? { ...c, lastMsg: input.trim(), time: newMsg.time, status: "em_atendimento", attendantId: currentAttendant.id } : c
    ));
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSelectContact = (id: number) => {
    setSelected(id);
    setContacts(contacts.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const assignAttendant = (contactId: number, attendantId: string) => {
    setContacts(contacts.map((c) =>
      c.id === contactId ? { ...c, attendantId, status: "em_atendimento" } : c
    ));
  };

  const changeStatus = (contactId: number, status: ConvStatus) => {
    setContacts(contacts.map((c) => (c.id === contactId ? { ...c, status } : c)));
  };

  const selectedContact = contacts.find((c) => c.id === selected);
  const currentMessages = messages[selected] || [];
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  const getAttendant = (id: string | null) => attendants.find((a) => a.id === id);

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || c.status === filterStatus;
    const matchAttendant = filterAttendant === "todos" || c.attendantId === filterAttendant;
    return matchSearch && matchStatus && matchAttendant;
  });

  const statusCounts = {
    aguardando: contacts.filter((c) => c.status === "aguardando").length,
    em_atendimento: contacts.filter((c) => c.status === "em_atendimento").length,
    finalizado: contacts.filter((c) => c.status === "finalizado").length,
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
      <div className="dash-card h-full flex overflow-hidden">
        {/* Contact list */}
        <div className="w-[360px] border-r border-gray-100 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-dash-fg">
                Conversas
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-white rounded-full">{totalUnread}</span>
                )}
              </h2>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                placeholder="Buscar conversa..." />
            </div>

            {/* Status filters */}
            <div className="flex gap-1.5 mb-3">
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

            {/* Attendant filter */}
            <div className="flex items-center gap-1.5">
              <UserCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => setFilterAttendant("todos")}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                    filterAttendant === "todos" ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:bg-gray-100"
                  }`}>Todos</button>
                {attendants.map((a) => (
                  <button key={a.id} onClick={() => setFilterAttendant(a.id)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                      filterAttendant === a.id ? a.color : "text-gray-400 hover:bg-gray-100"
                    }`}>{a.name.split(" ")[0]}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-auto">
            {filteredContacts.map((c) => {
              const att = getAttendant(c.attendantId);
              return (
                <div key={c.id} onClick={() => handleSelectContact(c.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-l-2 ${
                    selected === c.id ? "bg-primary/5 border-l-primary" : "border-l-transparent hover:bg-gray-50"
                  }`}>
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
                      selected === c.id ? "bg-primary/15 text-primary" : "bg-gray-100 text-gray-600"
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
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusConfig[c.status].color}`}>
                        {statusConfig[c.status].label}
                      </span>
                      {att && (
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${att.color}`}>
                          {att.avatar}
                        </span>
                      )}
                      {!att && c.status === "aguardando" && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-red-50 text-red-500">Sem atendente</span>
                      )}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shrink-0">{c.unread}</span>
                  )}
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-400">Nenhuma conversa encontrada</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{selectedContact?.avatar}</span>
                </div>
                {selectedContact?.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-dash-fg">{selectedContact?.name}</p>
                <p className={`text-[11px] ${selectedContact?.online ? "text-emerald-500" : "text-gray-400"}`}>
                  {selectedContact?.online ? "Online agora" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Status changer */}
              {selectedContact && (
                <select
                  value={selectedContact.status}
                  onChange={(e) => changeStatus(selectedContact.id, e.target.value as ConvStatus)}
                  className="text-[11px] font-medium px-2 py-1 rounded-lg bg-gray-50 border-0 outline-none cursor-pointer"
                >
                  <option value="aguardando">⏳ Aguardando</option>
                  <option value="em_atendimento">🟢 Em atendimento</option>
                  <option value="finalizado">✅ Finalizado</option>
                </select>
              )}

              {/* Attendant assigner */}
              {selectedContact && (
                <select
                  value={selectedContact.attendantId || ""}
                  onChange={(e) => assignAttendant(selectedContact.id, e.target.value)}
                  className="text-[11px] font-medium px-2 py-1 rounded-lg bg-gray-50 border-0 outline-none cursor-pointer"
                >
                  <option value="">Atribuir atendente</option>
                  {attendants.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              )}

              <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Phone className="w-4 h-4" /></button>
              <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Attendant banner */}
          {selectedContact?.attendantId && (() => {
            const att = getAttendant(selectedContact.attendantId);
            return att ? (
              <div className="px-5 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${att.color}`}>{att.avatar}</div>
                <span className="text-[11px] text-dash-muted">Atendente: <span className="font-medium text-dash-fg">{att.name}</span></span>
              </div>
            ) : null;
          })()}

          {/* Messages */}
          <div className="flex-1 overflow-auto p-5 space-y-2" style={{ background: "linear-gradient(180deg, #f8f9fb 0%, #f1f3f8 100%)" }}>
            <div className="flex justify-center mb-4">
              <span className="text-[11px] text-gray-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">Hoje</span>
            </div>
            {currentMessages.map((m) => {
              const msgAtt = m.attendantId ? getAttendant(m.attendantId) : null;
              return (
                <div key={m.id} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[65%] text-sm leading-relaxed ${
                    m.from === "agent"
                      ? "bg-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/20"
                      : "bg-white text-dash-fg rounded-2xl rounded-bl-md shadow-sm"
                  }`}>
                    {m.from === "agent" && msgAtt && (
                      <div className="px-4 pt-2 pb-0">
                        <span className="text-[10px] font-medium text-white/70">{msgAtt.name}</span>
                      </div>
                    )}
                    <div className="px-4 py-2">
                      <p>{m.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${m.from === "agent" ? "text-white/60" : "text-gray-400"}`}>
                        <span className="text-[10px]">{m.time}</span>
                        {m.from === "agent" && (m.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            {selectedContact?.status === "finalizado" ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-400">Conversa finalizada</p>
                <button onClick={() => changeStatus(selectedContact.id, "em_atendimento")}
                  className="text-xs text-primary font-medium hover:underline mt-1">Reabrir conversa</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Smile className="w-5 h-5" /></button>
                <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Paperclip className="w-5 h-5" /></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  className="flex-1 py-2.5 px-4 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition"
                  placeholder="Digite uma mensagem..." />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversas;

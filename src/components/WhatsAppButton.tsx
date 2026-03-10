import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_NUMBER = "5511992698170";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const sendMessage = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-4 py-3 bg-[#00FF00]/10 border-b border-white/10">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00FF00]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.75.75 0 0 0 .916.92l5.671-1.49A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.513-5.243-1.408l-.374-.22-3.867 1.016 1.03-3.77-.242-.386A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span className="text-sm font-semibold text-white">{t.whatsapp.header}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-4">
            {t.whatsapp.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(opt.message)}
                className="text-left text-sm px-4 py-3 rounded-xl border border-[#00FF00]/30 text-white hover:bg-[#00FF00]/10 hover:border-[#00FF00] transition-all duration-200 group"
              >
                <span className="text-[#00FF00] font-bold mr-2 group-hover:mr-3 transition-all">
                  {i + 1}.
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "#00FF00",
          boxShadow: "0 0 20px rgba(0,255,0,0.6), 0 0 60px rgba(0,255,0,0.25)",
        }}
      >
        {open ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.75.75 0 0 0 .916.92l5.671-1.49A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.513-5.243-1.408l-.374-.22-3.867 1.016 1.03-3.77-.242-.386A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default WhatsAppButton;

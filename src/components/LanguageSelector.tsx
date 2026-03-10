import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeFlags, localeLabels, type Locale } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales: Locale[] = ["pt-BR", "pt-PT", "es", "en"];

const LanguageSelector = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          aria-label="Select language"
        >
          <span className="text-base leading-none">{localeFlags[locale]}</span>
          <Globe className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={`flex items-center gap-3 cursor-pointer ${loc === locale ? "bg-accent" : ""}`}
          >
            <span className="text-lg leading-none">{localeFlags[loc]}</span>
            <span className="text-sm">{localeLabels[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

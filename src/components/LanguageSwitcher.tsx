import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Locale, useI18n } from "@/i18n/I18nProvider";

const languages: Array<{ code: Locale; label: string }> = [{ code: "nl", label: "Nederlands" }, { code: "en", label: "English" }, { code: "fr", label: "Français" }];
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-10 gap-1 px-2 text-primary hover:bg-transparent hover:text-primary/80" aria-label="Taal kiezen"><Languages className="h-4 w-4"/><span className="text-[11px] font-semibold uppercase">{locale}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="min-w-40 bg-background border-foreground/10">{languages.map(({code,label})=><DropdownMenuItem key={code} onSelect={()=>setLocale(code)} className={locale===code?"text-primary":""}><span className="w-6 text-xs font-semibold uppercase">{code}</span>{label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
}

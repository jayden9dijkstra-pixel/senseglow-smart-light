import { PageLayout } from "@/components/layout/PageLayout";
import { WITHDRAWAL_FORM } from "@/lib/withdrawalForm";

const WithdrawalForm = () => (
  <PageLayout
    seo={{
      title: "Modelformulier voor herroeping | SenseGlow",
      description:
        "Wil je je aankoop herroepen? Je hebt een wettelijk herroepingsrecht van 14 dagen. Gebruik dit modelformulier of mail support@senseglow.shop.",
    }}
  >
    <div className="container py-12 max-w-3xl space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">Modelformulier voor herroeping</h1>
      <p className="text-foreground/70 leading-relaxed">
        Je hebt het wettelijke recht om je aankoop binnen 14 dagen na ontvangst zonder opgave van reden te herroepen.
        Bij SenseGlow heb je daarnaast 30 dagen retour. Kopieer het formulier hieronder, vul het in en mail het naar
        support@senseglow.shop. Een gewone e-mail met dezelfde gegevens mag ook.
      </p>
      <pre className="whitespace-pre-wrap text-sm text-foreground/80 bg-secondary p-5 rounded-lg border border-foreground/10 font-mono leading-relaxed">
        {WITHDRAWAL_FORM}
      </pre>
    </div>
  </PageLayout>
);

export default WithdrawalForm;

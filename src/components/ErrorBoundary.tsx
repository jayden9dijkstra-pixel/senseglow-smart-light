import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Vangnet tegen een blanco pagina. Zonder dit laat elke onverwachte
 * render-fout (in de checkout, een productpagina, de galerij — waar dan
 * ook) de hele site verdwijnen achter een leeg wit scherm, zonder melding
 * en zonder herstelmogelijkheid voor de bezoeker.
 *
 * Bewust simpel gehouden: logt naar console.error (zelfde patroon als de
 * rest van de codebase voor meting die het afrekenen nooit mag blokkeren),
 * geen nieuw site-event-type — dat vereist een wijziging in het strikte
 * SiteEventType-contract en mogelijk de database, buiten scope hiervan.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Onverwachte fout op de pagina:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <div className="text-4xl">💡</div>
        <div className="space-y-1.5">
          <h1 className="text-lg font-semibold text-foreground">
            Er ging iets mis
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Deze pagina liep vast. Vernieuwen lost dit meestal op — je winkelwagen blijft bewaard.
          </p>
        </div>
        <Button onClick={this.handleReload} size="lg" className="rounded-sm">
          Pagina vernieuwen
        </Button>
      </div>
    );
  }
}

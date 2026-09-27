import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider } from "@/contexts/LanguageContext";
import esMessages from "@/messages/es.json";

// Every component migrated in plan commits 9-16 needs BOTH providers during
// the transition: next-intl (real es.json content, so a broken message file
// fails tests here instead of only in the browser) for its own translated
// strings, and the legacy LanguageProvider, which still drives every
// not-yet-migrated component until commit 17 removes it.
function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="es" messages={esMessages}>
      <LanguageProvider>{children}</LanguageProvider>
    </NextIntlClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: Providers, ...options });
}

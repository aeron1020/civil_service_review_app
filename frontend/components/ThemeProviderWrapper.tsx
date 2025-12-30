"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="theme"
      // Setting this to false allows our custom CSS transitions to work
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}

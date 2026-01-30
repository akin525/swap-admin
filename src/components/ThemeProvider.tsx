"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We can define the props manually to avoid the import resolution error
export function ThemeProvider({
                                  children,
                                  ...props
                              }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
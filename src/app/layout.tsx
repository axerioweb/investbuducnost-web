import type { ReactNode } from "react";

// Root layout — samo prosleđuje children; pravi <html> je u [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

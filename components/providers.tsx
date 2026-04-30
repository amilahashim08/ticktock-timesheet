"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { Toast } from "@/components/ui/toast";
import { store } from "@/store";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toast />
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}

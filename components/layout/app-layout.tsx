"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { Navbar } from "@/components/nav/navbar";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="w-full" >
        <main className="flex flex-col h-[100dvh] sm:h-screen w-full overflow-auto">
          <Navbar />
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

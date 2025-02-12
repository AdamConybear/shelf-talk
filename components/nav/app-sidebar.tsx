"use client";

import { Plus, Search } from "lucide-react";
import { SidebarHeader, Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar, SidebarMenuAction } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { NavMain } from "./nav-main";
import shelfy from "@/public/images/shelfy.jpg";

export function AppSidebar() {
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
       <SidebarMenu>
        <SidebarMenuItem className="flex justify-center">
          {open ? 
            <Link href="/" className="flex items-center gap-2">
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent hover:text-inherit">
                <div>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image src={shelfy} alt="Shelf Talk" className="size-7" />
                  </div>
                  <span className="text-xl font-bold">Shelf Talk</span>
                </div>
              </SidebarMenuButton>
            </Link>
            : 
            <Link href="/" className="flex w-full justify-center">
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent hover:text-inherit">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={shelfy} alt="Shelf Talk" className="size-7" />
                </div>
              </SidebarMenuButton>
            </Link>
          }
          <SidebarMenuAction className="mt-1">
            <Search /> <span className="sr-only">Search books</span>
          </SidebarMenuAction>
        </SidebarMenuItem>
       </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col pt-3">
          <SidebarMenuItem className="flex justify-center">
            {open ? 
            <Link href="/" className="flex items-center w-[85%] px-2">
              <SidebarMenuButton size="lg" variant="outline" asChild className="rounded-full h-10 w-full p-2 mx-auto hover:bg-transparen">
                <div className="flex items-center w-full justify-between text-muted-foreground p-2">
                  <span className="font-semibold">New Book</span>
                  <div className="flex items-center gap-1">
                    <span className="border border-muted-foreground rounded-sm px-0.5 text-xs">⌘</span>
                    <span className="border border-muted-foreground rounded-sm px-0.5 text-xs">K</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </Link>
            :
            <Link href="/" className="flex size-10 items-center mx-auto justify-center rounded-full bg-neutral-200 cursor-pointer">
              <SidebarMenuButton asChild className="hover:bg-transparent">
                <Plus />
              </SidebarMenuButton>
            </Link>
            }
          </SidebarMenuItem>
          <NavMain />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
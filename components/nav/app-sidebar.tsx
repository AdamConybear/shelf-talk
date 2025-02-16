"use client";

import { Plus } from "lucide-react";
import { SidebarHeader, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { NavMain } from "./nav-main";
import shelfy from "@/public/images/shelfy.jpg";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "../ui/dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileUploader } from "../file-uploader";

export function AppSidebar() {
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
       <SidebarMenu>
        <SidebarMenuItem className="flex items-center">
          {open ? 
            <Link href="/" className="flex gap-2">
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
            <Link href="/" className="flex w-full justify-center mt-2">
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent hover:text-inherit">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={shelfy} alt="Shelf Talk" className="size-8" />
                </div>
              </SidebarMenuButton>
            </Link>
          }
          {/* <SidebarMenuAction className="mt-1">
            <Search /> <span className="sr-only">Search books</span>
          </SidebarMenuAction> */}
        </SidebarMenuItem>
       </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={cn(!open && "pt-3", "flex flex-col")}>
          {!open && (
            <SidebarMenuItem className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                      <Plus />
                    </Button>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add book to your shelf</DialogTitle>
                    <DialogDescription>
                      Upload an EPUB file to start chatting.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <FileUploader onSuccess={() => document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click()} />
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          )}
          <NavMain />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
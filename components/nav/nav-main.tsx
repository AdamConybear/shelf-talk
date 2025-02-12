"use client";

import { SidebarGroupLabel, SidebarMenuAction, SidebarMenuButton } from "../ui/sidebar";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { SidebarGroup } from "../ui/sidebar";
import { Book, X } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function NavMain() {
  const params = useParams();
  const { books, deleteBookAndChats } = useBooks();
  const router = useRouter();

  if (!books) return null; // Handle loading state

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Shelf</SidebarGroupLabel>
      <SidebarMenu>
        {books.length === 0 ? (
          <SidebarMenuItem>
            <span className="flex items-center justify-center px-4 py-1 text-xs text-muted-foreground">
              why no books?
            </span>
          </SidebarMenuItem>
        ) : (
          books.map((book) => (
            <SidebarMenuItem key={book.id}>
              <Link href={`/chat/${book.id}`}>
                <SidebarMenuButton 
                  asChild
                  data-active={book.id === String(params.bookId)}
                >
                  <div>
                    {book.preview ? (
                      <img src={book.preview} alt={book.name} className="w-4 h-6 object-cover" />
                    ) : (
                      <Book />
                    )}
                    <span>{book.name}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <X />
                    <span className="sr-only">delete</span>
                  </SidebarMenuAction>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Book</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{book.name}"? This action cannot be undone. 
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    {/* <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose> */}
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (book.id) {
                            await deleteBookAndChats(book.id);
                            if (book.id === String(params.bookId)) {
                              router.push('/');
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
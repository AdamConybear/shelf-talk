"use client";

import { SidebarGroupAction, SidebarGroupLabel, SidebarMenuAction, SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { SidebarGroup } from "../ui/sidebar";
import { Book, X, BookPlus } from "lucide-react";
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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FileUploader } from "../file-uploader";

export function NavMain() {
  const params = useParams();
  const { books, deleteBookAndChats } = useBooks();
  const router = useRouter();
  const { open } = useSidebar()

  if (!books) return null; // Handle loading state

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(!open && "hidden")}>Your Shelf</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction title="Add Book">
            <BookPlus /> <span className="sr-only">Add Book</span>
          </SidebarGroupAction>
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
      <SidebarMenu className={cn(!open && "mt-2", "flex flex-col gap-2")}>
        {books.length === 0 ? (
          <SidebarMenuItem>
            <span className="flex items-center text-center justify-center w-full py-1 text-xs text-muted-foreground">
              why no books?
            </span>
          </SidebarMenuItem>
        ) : (
          books.map((book) => (
            <SidebarMenuItem key={book.id}>
              <Link href={`/chat/${book.id}`} className="flex justify-center w-full">
                <SidebarMenuButton 
                  asChild
                  data-active={book.id === String(params.bookId)}
                >
                  <div>
                    {book.preview ? (
                      <Image src={book.preview} alt={book.name} width={400} height={600} className="w-4 h-6 object-cover" />
                    ) : (
                      <Book />
                    )}
                    <span>{book.displayName}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <X /> <span className="sr-only">Delete Book</span>
                  </SidebarMenuAction>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Book</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &quot;{book.displayName}&quot;? This action cannot be undone. 
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
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
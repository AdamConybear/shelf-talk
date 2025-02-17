"use client";

import * as React from "react"
import { Upload } from "lucide-react"
import Dropzone from "react-dropzone"
import ePub from 'epubjs'
import { useRouter } from "next/navigation"
import { cn, formatBytes } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useBooks } from '@/hooks/use-books'
import Section from "epubjs/types/section";
import Spine from "epubjs/types/spine";

// Extending the type
interface ExtendedSpine extends Spine {
  spineItems: Array<Section>; // Replace 'any' with a more specific type if known
}

interface FileUploaderProps {
  onSuccess?: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const { toast } = useToast()
  const { books, addBook, updateBookText } = useBooks()
  const router = useRouter()

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const newFile = acceptedFiles[0]
      
      // Check if book already exists
      const bookExists = books?.some(book => 
        book.name === newFile.name
      )

      if (bookExists) {
        toast({
          title: "Book already exists",
          description: "This book is already in your shelf",
          variant: "warning",
        })
        return
      }

      const book = ePub()
      
      try {
        const arrayBuffer = await newFile.arrayBuffer()
        await book.open(arrayBuffer)
        
        const coverUrl = await book.coverUrl()

        const coverResponse = await fetch(coverUrl || "")
        const coverBlob = await coverResponse.blob()

        // Convert blob to base64
        const base64Cover = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(coverBlob)
        })

        // Save to IndexedDB and get the new book ID
        const bookId = await addBook({
          name: newFile.name,
          displayName: newFile.name,
          preview: base64Cover,
          epubData: arrayBuffer,
        })

        // Get all book text
        let bookText = '';
        const spine = book.spine as ExtendedSpine;

        await Promise.all(spine.spineItems.map(async (section: Section) => {
          await section.load(book.load.bind(book));
          if(section.idref === "cover" || section.idref === "titlepage"){
            return;
          }
          // TODO: better parse epub so I only get the text I need
          let text = section.document.body.innerText
          text = text.replace(/[\n\t]/g, ''); // Remove all newline and tab characters
          bookText += text;
        }));

        updateBookText(bookId, bookText);

        toast({
          title: "Success",
          description: "Book added to your shelf",
          variant: "success",
        })

        // Call the onSuccess callback after successful upload (used for dialog)
        onSuccess?.()

        // Navigate to chat with the new book
        router.push(`/chat/${bookId}`)
      } catch (error) {
        console.error("Failed to add book:", error)
        toast({
          title: "Error",
          description: "Failed to add book to shelf",
          variant: "destructive",
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, addBook, router, toast, onSuccess]
  )

  return (
    <Dropzone
      onDrop={onDrop}
      accept={{ "application/epub+zip": [] }}
      maxSize={1024 * 1024 * 50} // 50MB
      maxFiles={1}
      multiple={false}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className={cn(
            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
            <div className="rounded-full border border-dashed p-3">
              <Upload
                className="size-7 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-px">
              <p className="font-medium text-muted-foreground">
                Drag {`'n'`} drop EPUB file here, or click to select file
              </p>
              <p className="text-sm text-muted-foreground/70">
                You can upload a file up to {formatBytes(1024 * 1024 * 50)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  )
}
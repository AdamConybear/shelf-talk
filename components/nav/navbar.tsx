"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useBooks } from "@/hooks/use-books";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

export function Navbar() {
  const params = useParams();
  const { books, updateDisplayName, updateProgress } = useBooks();
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [editedBookName, setEditedBookName] = useState("");
  
  const currentBook = params.bookId && books ? books.find(book => book.id === String(params.bookId)) : null;

  useEffect(() => {
    if (currentBook) {
      setProgress(currentBook.percentCompleted);
    }
  }, [currentBook]);

  useEffect(() => {
    if (isEditing && currentBook) {
      setEditedBookName(currentBook.displayName);
    }
  }, [isEditing, currentBook]);

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentBook) {
      updateDisplayName(currentBook.id, editedBookName);
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleProgressUpdate = () => {
    if (currentBook && progress >= 0 && progress <= 100) {
      updateProgress(currentBook.id, progress);
      setIsOpen(false);
    } else {
      toast({
        title: "Invalid progress percentage",
        description: "Please enter a percentage between 0 and 100",
        variant: "destructive",
      });
    }
  };

  const handleFinished = () => {
    if (currentBook) {
      updateProgress(currentBook.id, 100);
      setIsOpen(false);
      toast({
        title: "Congratulations!",
        description: "Great job finishing the book!",
      });
    }
  };

  return (
    <div className="p-2 flex flex-row mt-1.5 items-center min-w-0 bg-background">
      <div className="w-16 sm:w-32 flex-shrink-0">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex flex-col items-center min-w-0 px-2">
        {currentBook && !isEditing && (
          <Button 
            variant="link" 
            className="p-0 m-0 font-semibold truncate max-w-full" 
            onClick={() => setIsEditing(true)}
          >
            {currentBook.displayName}
          </Button>
        )}
        {currentBook && isEditing && (
          <div className="flex items-center gap-2">
            <Input
              className="w-auto min-w-[100px] max-w-[400px] h-7 text-sm text-center px-2"
              value={editedBookName}
              onChange={(e) => setEditedBookName(e.target.value)}
              autoFocus
              onKeyDown={handleNameSubmit}
              onBlur={(e) => {
                // Don't trigger onBlur if clicking the save button
                if (!e.relatedTarget?.closest('button')) {
                  setIsEditing(false);
                }
              }}
              style={{ width: `${Math.max(currentBook.displayName.length * 0.7, 10)}em` }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateDisplayName(currentBook.id, editedBookName);
                setIsEditing(false);
              }}
            >
              <Check />
            </Button>
          </div>
        )}
      </div>
      <div className="w-16 sm:w-32 flex-shrink-0 flex justify-end">
      {currentBook && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
              <Button variant="ghost" className="hidden sm:block">
                {currentBook.percentCompleted}% completed
              </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="ghost" className="sm:hidden">
              {currentBook.percentCompleted}%
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reading Progress</DialogTitle>
              <DialogDescription>Enter the percentage of the book you have read so far</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Currently</span>
                <Input 
                  type="number" 
                  defaultValue={currentBook.percentCompleted}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-20"
                />
                <span className="text-sm">% done</span>
              </div>
              <Progress value={progress} />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleFinished}>I'm Finished</Button>
              <Button onClick={handleProgressUpdate}>Save Progress</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
}
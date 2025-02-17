import { FileUploader } from "../components/file-uploader";
import Image from "next/image";
import shelfy from "@/public/images/shelfy.jpg";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-w-0 h-[calc(100vh-60px)] px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero Section with Image */}
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
          <div className="flex-shrink-0">
            <Image
              src={shelfy}
              alt="Shelfy - A cute shelf of books"
              width={120}
              height={120}
            />
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome to Shelf Talk
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Chat with your books without the fear of spoilers
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto text-center text-sm sm:text-base text-muted-foreground">
          <p>
            Upload your EPUB book and start a conversation. Shelf Talk tracks your 
            reading progress to ensure discussions remain spoiler-free, letting you 
            explore your book safely
          </p>
        </div>

        {/* Upload Section */}
        <div className="pt-4">
          <FileUploader />
        </div>
      </div>
    </div>
  );
}

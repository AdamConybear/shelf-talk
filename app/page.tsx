import { FileUploader } from "../components/file-uploader";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-w-0 h-[calc(100vh-60px)] px-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Shelf Talk
          </h1>
          <p className="text-xl text-muted-foreground">
            Chat with your books without the fear of spoilers
          </p>
        </div>

        {/* Description */}
        <div className="prose prose-neutral dark:prose-invert mx-auto">
          <p>
            Upload your EPUB book and start a conversation. Shelf Talk tracks your 
            reading progress to ensure discussions remain spoiler-free, letting you 
            explore your book safely, one chapter at a time.
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

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative bg-background bg-[url('/Leaf_Background_Spring.jpg')] bg-repeat">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-text">
            Looks like this page flew away!
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Maybe it went to catch some bugs or fish? Let&apos;s head back to safer waters!
          </p>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white 
            rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Island
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="w-full max-w-2xl">
          <Image
            src="/404.avif"
            alt="404 illustration"
            width={800}
            height={533}
            priority
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
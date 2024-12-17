import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative bg-[url('/Leaf_Background_Spring.jpg')] bg-repeat">
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col items-center justify-center z-10 p-4 sm:p-6 relative">
          <div className="text-center space-y-6 mb-4 sm:mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold text-primary">404</h1>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-medium text-text">
                Looks like this page flew away!
              </h2>
              <p className="text-text-secondary max-w-md mx-auto px-4">
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
        </div>

        <div className="relative w-full flex justify-center mt-auto">
          <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl">
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
    </div>
  );
}
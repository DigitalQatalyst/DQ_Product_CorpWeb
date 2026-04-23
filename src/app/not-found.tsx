import Link from "next/link";
import { ArrowRight, HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 number */}
        <div className="text-[10rem] font-bold leading-none text-primary/10 select-none">
          404
        </div>

        {/* Divider with DQ accent */}
        <div className="flex items-center justify-center gap-3 -mt-6 mb-8">
          <div className="h-px flex-1 bg-border" />
          <span className="text-secondary font-bold text-sm uppercase tracking-widest">
            Page Not Found
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          We couldn&apos;t find that page
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you&apos;re looking for may have been moved, deleted, or never
          existed. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all group"
          >
            <HomeIcon size={16} />
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 h-12 px-6 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all group"
          >
            Explore Services
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

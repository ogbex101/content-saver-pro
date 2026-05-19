import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-10 bg-card border-t border-border">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-xl font-semibold">
          BLESSING<span className="text-accent">.</span>
        </p>
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          © {new Date().getFullYear()} Blessing Adepitan. Made with <Heart size={12} className="text-accent fill-accent" /> All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

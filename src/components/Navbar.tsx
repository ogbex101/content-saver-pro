import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

export type NavItem = { label: string; id: string };

/** Links only to sections that are actually on the page. */
const Navbar = ({ name, items }: { name: string; items: NavItem[] }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const mark = name.split(/\s+/)[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (!isHome) {
      navigate({ to: "/" });
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
      return;
    }
    // Small delay to let the mobile menu close first
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const linkCls =
    "text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/70 hover:text-accent transition-colors duration-300";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-lg shadow-sm border-b border-border" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-18 md:h-20">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("home");
          }}
          className="font-display text-xl md:text-2xl font-semibold tracking-tight uppercase"
        >
          {mark || "Home"}
          <span className="text-accent">.</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
              className={linkCls}
            >
              {item.label}
            </a>
          ))}
          <Link to="/portfolio" className={linkCls}>
            All work
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("contact");
            }}
            className="bg-foreground text-background px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase flex items-center gap-2 hover:bg-foreground/90 transition-all duration-300"
          >
            Hire me <ArrowRight size={13} />
          </a>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left py-3 text-sm font-semibold tracking-[0.15em] uppercase text-foreground/80 hover:text-accent transition-colors border-b border-border"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/portfolio"
                onClick={() => setOpen(false)}
                className="text-left py-3 text-sm font-semibold tracking-[0.15em] uppercase text-foreground/80 hover:text-accent transition-colors border-b border-border"
              >
                All work
              </Link>
              <button
                onClick={() => scrollTo("contact")}
                className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold tracking-[0.15em] uppercase mt-4 flex items-center justify-center gap-2"
              >
                Hire me <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

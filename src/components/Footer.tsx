const Footer = ({ name }: { name: string }) => {
  const mark = name.split(/\s+/)[0];
  return (
    <footer className="py-10 bg-card border-t border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {mark && (
            <p className="font-display text-xl font-semibold uppercase">
              {mark}
              <span className="text-accent">.</span>
            </p>
          )}
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()}
            {name ? ` ${name}` : ""}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

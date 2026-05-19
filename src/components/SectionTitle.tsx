import AnimatedSection from "./AnimatedSection";

interface Props {
  title: string;
  subtitle?: string;
  label?: string;
}

const SectionTitle = ({ title, subtitle, label }: Props) => (
  <AnimatedSection className="text-center mb-12 md:mb-16">
    {label && <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">{label}</span>}
    <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">{title}</h2>
    <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
    {subtitle && <p className="text-muted-foreground max-w-xl mx-auto font-semibold">{subtitle}</p>}
  </AnimatedSection>
);

export default SectionTitle;
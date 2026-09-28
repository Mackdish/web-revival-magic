import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Brand } from "./brand";

const groups = [
  { title: "Services", links: [["Digital Marketing","/digital-marketing"],["SEO","/seo"],["Paid Advertising","/advertising"],["Web Development","/web-development"],["Software Development","/software-development"],["Automation & AI","/automation-ai"],["TradeMall Ads","/trademall-ads"]] },
  { title: "Company", links: [["About","/about"],["Selected Work","/case-studies"],["Insights","/insights"],["Contact","/contact"]] },
  { title: "Start", links: [["Free Digital Audit","/digital-audit"],["Pricing","/pricing"]] },
] as const;

export function SiteFooter() {
  return <footer className="border-t bg-ink text-ink-foreground">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_1.85fr] lg:px-8">
      <div>
        <Brand/>
        <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">Digital marketing, advertising and technology for businesses in Kenya.</p>
        <div className="mt-7 space-y-2 text-sm text-ink-foreground/85">
          <a href="tel:+254705186502" className="block hover:text-brand-light">0705 186 502</a>
          <a href="mailto:support@mackdish.store" className="block hover:text-brand-light">support@mackdish.store</a>
          <p>Kimathi Street, Nairobi CBD · Nairobi, Kenya</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href="https://wa.me/254705186502" target="_blank" rel="noreferrer" className="font-semibold text-brand-light hover:underline">WhatsApp</a>
          <a href="https://facebook.com/mackdishsolutions" target="_blank" rel="noreferrer" className="text-ink-foreground/80 hover:text-brand-light">Facebook</a>
          <a href="https://www.linkedin.com/company/mackdish-solutions" target="_blank" rel="noreferrer" className="text-ink-foreground/80 hover:text-brand-light">LinkedIn</a>
          <a href="https://instagram.com/mackdishsolutions" target="_blank" rel="noreferrer" className="text-ink-foreground/80 hover:text-brand-light">Instagram</a>
        </div>
        <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-light">Start a conversation <ArrowRight className="size-4"/></Link>
      </div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {groups.map(g=><div key={g.title}><h2 className="text-xs font-bold uppercase text-ink-muted">{g.title}</h2><ul className="mt-4 space-y-3">{g.links.map(([label,to])=><li key={label}><Link to={to} className="text-sm text-ink-foreground/80 hover:text-brand-light">{label}</Link></li>)}</ul></div>)}
      </div>
    </div>
    <div className="border-t border-ink-border"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between lg:px-8"><p>© 2026 Mackdish Solutions. All rights reserved.</p><p>Kenya-first. Built for practical growth.</p></div></div>
  </footer>;
}

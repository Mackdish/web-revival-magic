import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, Container, PageHero, SectionHeading } from "@/components/marketing/layout";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Digital Marketing Pricing Kenya, Mackdish Solutions" }, { name: "description", content: "Digital marketing packages from KSh 15,000 per month, with advertising spend separate." }, { property: "og:title", content: "Digital Marketing Pricing Kenya, Mackdish Solutions" }, { property: "og:description", content: "Digital marketing packages from KSh 15,000 per month, with advertising spend separate." }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://mackdish.store/pricing" }], links: [{ rel: "canonical", href: "https://mackdish.store/pricing" }] }),
  component: Page,
});

const plans = [
  { name: "Starter", price: "KSh 15,000", subtitle: "For a business that needs consistent digital activity and cleaner foundations.", items: ["Facebook + Instagram management","8, 12 content pieces","Content planning","Profile optimisation","WhatsApp CTA","Google Business optimisation","Monthly reporting"] },
  { name: "Growth", price: "KSh 30,000", subtitle: "For a business that wants marketing activity tied to a stronger enquiry pipeline.", popular: true, items: ["Everything in Starter, plus…","12, 16 content pieces","Reels / short-form content","Meta Ads management","TradeMall advertising","WhatsApp lead journey","Landing-page optimisation","Campaign reporting"] },
  { name: "Scale", price: "From KSh 50,000", subtitle: "For a broader acquisition programme with multiple channels and deeper implementation.", items: ["Everything in Growth, plus…","Google Ads management","SEO programme","Retargeting","Conversion tracking","Strategy sessions","Deeper reporting","Website / funnel work"] },
];

function Page() { return <>
  <PageHero eyebrow="Pricing" title="Know the starting point before we talk." description="Management fees are separate from ad spend. Web, software and automation projects are scoped separately." />
  <section className="py-20 sm:py-28"><Container><SectionHeading eyebrow="Monthly marketing" title="Three starting points." description="Your media budget is yours; Mackdish charges for the work of planning, creating, managing and improving the programme."/><div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map(p=><article key={p.name} className={`relative flex flex-col border p-7 sm:p-8 ${p.popular?"border-primary ring-1 ring-primary":""}`}>{p.popular&&<span className="absolute right-5 top-5 text-[10px] font-bold uppercase text-primary">Growth</span>}<p className="text-xs font-bold uppercase text-primary">{p.name}</p><h2 className="mt-5 font-display text-3xl font-semibold">{p.price}<span className="text-sm font-normal text-muted-foreground"> / month</span></h2><p className="mt-4 min-h-16 text-sm leading-6 text-muted-foreground">{p.subtitle}</p><ul className="mt-7 space-y-3">{p.items.map((item,i)=><li key={item} className="flex gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary"/>{item}</li>)}</ul><Button asChild className="mt-9 w-full" variant={p.popular?"default":"outline"}><Link to="/contact" search={{plan:p.name}}>Talk about {p.name}<ArrowRight/></Link></Button></article>)}</div>
  <div className="mt-10 grid gap-4 border-t pt-8 md:grid-cols-3"><div><p className="font-semibold">Starter ad spend</p><p className="mt-2 text-sm text-muted-foreground">Use a modest test budget first; scale after you know which offer and audience generate useful enquiries.</p></div><div><p className="font-semibold">Growth ad spend</p><p className="mt-2 text-sm text-muted-foreground">Budget separately for Meta, Google or TradeMall media so management and media costs stay clear.</p></div><div><p className="font-semibold">Web / software</p><p className="mt-2 text-sm text-muted-foreground">Quoted separately after scope, integrations and delivery requirements are understood.</p></div></div>
  </Container></section>
  <CTA title="Need a website, software system or automation?" description="Those projects are scoped around requirements rather than forced into a monthly marketing package." primary="Discuss a project" to="/contact" />
</>; }

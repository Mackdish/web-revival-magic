import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShoppingBag, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, Container, PageHero, SectionHeading } from "@/components/marketing/layout";
import { industries } from "@/content/site";
export const Route = createFileRoute("/solutions")({
  head: () => ({ meta: [
    { title: "Business Growth Solutions Kenya, Mackdish Solutions" },
    { name: "description", content: "Industry-focused digital marketing, advertising, website, software and automation solutions." },
    { property: "og:title", content: "Business Growth Solutions Kenya, Mackdish Solutions" },
    { property: "og:description", content: "Industry-focused digital marketing, advertising, website, software and automation solutions." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { property: "og:url", content: "https://mackdish.store/solutions" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/solutions" }] }),
  component: Page,
});
function Page() {
  return <>
    <PageHero eyebrow="Solutions" title="Solutions shaped around your customer and your operation." description="Start from the way your business sells, serves and follows up, not from a generic list of marketing tactics." />
    <section className="py-20 sm:py-28"><Container><SectionHeading eyebrow="Industries" title="Built around common business models."/><div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{industries.map(({title,description,icon:Icon})=><article key={title} className="border p-7"><Icon className="size-6 text-primary"/><h2 className="mt-8 font-display text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div></Container></section>
    <section className="border-y bg-muted/45 py-20"><Container className="grid gap-6 md:grid-cols-3">{[{title:"Customer acquisition",desc:"Combine search, social, TradeMall and WhatsApp around a clear commercial goal.",icon:ShoppingBag},{title:"Digital operations",desc:"Build websites, dashboards, systems and automations around how your team works.",icon:Wrench},{title:"Sector programs",desc:"Adapt the message, funnel and digital experience to education, hospitality, property and other sectors.",icon:Building2}].map(({title,desc,icon:Icon})=><article key={title} className="bg-background p-8"><Icon className="size-6 text-primary"/><h2 className="mt-8 font-display text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p><Button asChild variant="link" className="mt-4 px-0"><Link to="/contact">Discuss your business<ArrowRight/></Link></Button></article>)}</Container></section>
    <CTA title="Not sure which solution fits?" description="Start with the free digital audit and use it to decide what needs attention first." primary="Request a Free Audit" to="/digital-audit" />
  </>;
}

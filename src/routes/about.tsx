import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CTA, Container, PageHero, SectionHeading } from "@/components/marketing/layout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Mackdish Solutions, Digital Growth & Technology Partner" },
    { name: "description", content: "Meet Mackdish Solutions and founder Macknon Vulimu, building marketing, websites, software and automation for businesses in Kenya." },
    { property: "og:title", content: "About Mackdish Solutions" },
    { property: "og:description", content: "Meet the founder and the thinking behind Mackdish Solutions." },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: "https://mackdish.store/about" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/about" }] }),
  component: Page,
});

function Page() {
  const values = [
    { title: "Start with the business problem", description: "We begin with the customer, workflow or revenue problem before choosing a channel or technology." },
    { title: "Build for Kenyan conditions", description: "Mobile data, M-Pesa, WhatsApp and the way local teams actually work are part of the brief." },
    { title: "Leave the team with something usable", description: "A campaign, website or system should be understandable to the people who have to use it after launch." },
  ];

  return <>
    <PageHero eyebrow="About Mackdish Solutions" title="Built by a Kenyan developer who kept seeing the same digital gaps." description="Mackdish brings marketing, advertising and software together for businesses that want more customers and better day-to-day systems." />

    <section className="py-20 sm:py-28"><Container className="grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
      <div className="border bg-ink p-8 text-ink-foreground sm:p-10">
        <div className="grid size-20 place-items-center bg-primary font-display text-3xl font-bold text-primary-foreground">MV</div>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-brand-light">Founder</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">Macknon Vulimu</h2>
        <p className="mt-3 text-ink-muted">Founder, Mackdish Solutions</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://www.linkedin.com/company/mackdish-solutions" target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-light hover:underline">Mackdish on LinkedIn</a>
          <a href="mailto:info@mackdish.store" className="text-sm font-semibold text-brand-light hover:underline">Email Mackdish</a>
        </div>
      </div>
      <div>
        <SectionHeading eyebrow="Why I built Mackdish" title="The software has to work for the person using it." />
        <p className="mt-6 text-lg leading-8 text-muted-foreground">I kept seeing Kenyan schools, shops and small businesses pay for digital tools that looked impressive in a demo but were difficult to operate in real life. Mackdish grew from that frustration: build around the actual workflow, keep the scope clear, and make the next step easy for the customer or the staff member using the system.</p>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Today that means client websites, e-commerce, marketing campaigns and business systems alongside products we build and run ourselves, including TradeMall and other software platforms.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/contact">Talk to Mackdish <ArrowRight/></Link></Button><Button asChild size="lg" variant="outline"><Link to="/case-studies">See the work</Link></Button></div>
      </div>
    </Container></section>

    <section className="border-y bg-muted/45 py-20 sm:py-28"><Container><SectionHeading eyebrow="How we work" title="Clarity before complexity." /><div className="mt-12 grid gap-px bg-border md:grid-cols-3">{values.map(({title,description})=><article key={title} className="bg-background p-8"><CheckCircle2 className="size-6 text-primary"/><h2 className="mt-8 font-display text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div></Container></section>

    <section className="py-20 sm:py-28"><Container className="grid gap-10 md:grid-cols-3"><div><p className="text-xs font-bold uppercase text-primary">Kenya first</p><h2 className="mt-4 font-display text-2xl font-semibold">Built around Kenyan customers, phones, payments and business hours.</h2></div><div><p className="text-xs font-bold uppercase text-primary">Our product</p><h2 className="mt-4 font-display text-2xl font-semibold">TradeMall gives Mackdish a product we can build, operate and improve ourselves.</h2></div><div><p className="text-xs font-bold uppercase text-primary">Next</p><h2 className="mt-4 font-display text-2xl font-semibold">Build stronger digital infrastructure for growing businesses across Africa.</h2></div></Container></section>
    <CTA title="Want to talk through the problem before choosing a service?" primary="Start a conversation" to="/contact" />
  </>;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, CTA, Eyebrow, SectionHeading } from "@/components/marketing/layout";
import { growthStages, services, industries } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Mackdish Solutions, Digital Marketing, Advertising & Software in Kenya" },
    { name: "description", content: "Mackdish Solutions helps Kenyan businesses get found, generate enquiries and build the websites, software and automations behind their growth." },
    { property: "og:title", content: "Mackdish Solutions, Digital Marketing, Advertising & Software in Kenya" },
    { property: "og:description", content: "Marketing, advertising, websites, software and automation from one Kenyan digital partner." },
    { property: "og:type", content: "website" },{ property: "og:url", content: "https://mackdish.store/" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/" }] }),
  component: Home,
});

function Home() {
  return <>
    <section className="bg-hero text-hero-foreground">
      <Container className="grid min-h-[680px] items-center gap-14 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
        <div className="animate-rise">
          <Eyebrow>Digital marketing + technology / Kenya</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-8xl">More customers. Better systems. One partner.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-hero-muted">You post, run ads, get a few “price?” messages, then too many leads disappear. Mackdish connects the marketing, website and follow-up so the next step is obvious.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/digital-audit">Get a free digital audit<ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-hero-border bg-transparent text-hero-foreground hover:bg-hero-step"><Link to="/case-studies">See the work</Link></Button>
          </div>
          <p className="mt-5 text-sm text-hero-muted">Kenya-first delivery • WhatsApp-friendly customer journeys • Marketing and software under one roof</p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 bg-brand-light/10 blur-3xl" aria-hidden="true" />
          <div className="relative rotate-1 border-8 border-hero-step bg-background p-3 shadow-2xl">
            <div className="border bg-background p-5 text-foreground">
              <div className="flex items-center justify-between border-b pb-4"><span className="font-display font-bold">YOUR OFFER</span><span className="text-xs text-muted-foreground">TRADEMALL</span></div>
              <div className="py-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Seen the ad?</p><h2 className="mt-3 font-display text-4xl font-semibold leading-none">Turn interest into a WhatsApp enquiry.</h2><a href="https://wa.me/254705186502?text=Hi%20Mackdish%2C%20I%20saw%20your%20TradeMall%20advert%20and%27d%20like%20to%20learn%20more." target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition-transform duration-200 hover:translate-x-1"><span className="size-2 rounded-full bg-primary" /> Chat with the business</a></div>
              <div className="flex justify-between border-t pt-4 text-xs text-muted-foreground"><span>Advert</span><span>→</span><span>Enquiry</span></div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section className="border-b bg-background"><Container className="grid divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0">{["Get found","Get the click","Get the enquiry","Get the sale"].map((x,i)=><div key={x} className="px-5 py-6 text-sm font-semibold sm:px-7"><span className="mr-3 font-mono text-xs text-primary">0{i+1}</span>{x}</div>)}</Container></section>

    <section className="py-20 sm:py-28"><Container><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><Eyebrow>The problem we solve</Eyebrow><h2 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">Your digital channels should not work like separate businesses.</h2></div><div className="grid gap-0 border-t">{["Your Google profile says one thing and your social pages say another.","People ask for the price on WhatsApp but there is no follow-up system.","You spend on ads without knowing which enquiries became customers.","Your website looks fine on a laptop but is painful on a phone.","Your team repeats the same admin work every day."].map((x)=><div key={x} className="flex gap-4 border-b py-5 text-base leading-7"><Check className="mt-1 size-5 shrink-0 text-primary"/>{x}</div>)}</div></div></Container></section>

    <section className="border-y bg-muted/40 py-20 sm:py-28"><Container><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><div className="lg:sticky lg:top-28 lg:self-start"><Eyebrow>How we work</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold">One customer journey, not five disconnected tactics.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">We start with the action you need from the customer and work backwards.</p></div><div className="space-y-0 border-l-2 border-primary/30">{growthStages.map((stage)=><article key={stage.title} className="relative border-b bg-background p-7 pl-8 sm:p-10 sm:pl-12"><span className="absolute -left-[9px] top-10 size-4 rounded-full border-4 border-muted bg-primary" /><p className="text-xs font-bold uppercase tracking-wider text-primary">{stage.title}</p><h3 className="mt-3 font-display text-2xl font-semibold">{stage.description}</h3><div className="mt-6 flex flex-wrap gap-2">{stage.items.map(x=><span key={x} className="border px-3 py-1.5 text-xs">{x}</span>)}</div></article>)}</div></div></Container></section>

    <section className="py-20 sm:py-28"><Container><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Services" title="What we actually do." description="Pick one problem or combine the pieces. We scope the work around the business, not a fixed template."/><Link to="/services" className="text-sm font-semibold underline underline-offset-4">View all services →</Link></div><div className="mt-12 divide-y border-y">{services.map((s)=><Link key={s.title} to={s.to} className="group grid gap-5 py-7 transition-transform duration-200 hover:translate-x-1 md:grid-cols-[1fr_1.3fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase text-primary">{s.tags.join(" / ")}</p><h3 className="mt-2 font-display text-2xl font-semibold">{s.title}</h3></div><p className="max-w-xl text-sm leading-7 text-muted-foreground">{s.description}</p><ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></Link>)}</div></Container></section>

    <section className="bg-ink py-20 text-ink-foreground sm:py-28"><Container className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>Inside Mackdish</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold sm:text-6xl">TradeMall is our advertising network.</h2><p className="mt-5 max-w-xl leading-8 text-ink-muted">It is a Mackdish product. We use it when a campaign needs another distribution channel beyond social and search, with the click routed to a useful next step.</p><Button asChild size="lg" className="mt-8"><Link to="/trademall-ads">See TradeMall Ads <ArrowRight /></Link></Button></div><div className="border border-ink-border"><div className="grid grid-cols-[.9fr_1.1fr] border-b border-ink-border px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand-light"><span>Spec</span><span>Options</span></div>{[["Formats","728×90 · 300×250 · 320×50 · responsive"],["Location","Country · county · city"],["Audience","Device · browser / OS · category"],["Timing","Schedule campaigns around the offer"],["Destination","Website · landing page · WhatsApp"]].map(([label,value])=><div key={label} className="grid grid-cols-[.9fr_1.1fr] border-b border-ink-border px-5 py-5 last:border-b-0"><p className="text-sm font-semibold">{label}</p><p className="text-sm leading-6 text-ink-muted">{value}</p></div>)}</div></Container></section>

    <section className="py-20 sm:py-28"><Container><SectionHeading eyebrow="Who we work well with" title="Businesses where digital leads to a real conversation."/><div className="mt-12 grid border-l border-t sm:grid-cols-2 lg:grid-cols-4">{industries.map(({title,description})=><article key={title} className="border-b border-r p-7"><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p></article>)}</div></Container></section>

    <section className="border-t py-20 sm:py-28"><Container><div className="grid gap-10 md:grid-cols-3">{[{t:"First 30 days",d:"Audit the customer journey, clean up the foundations and decide what to measure."},{t:"Days 31, 60",d:"Launch the priority channel, tighten the offer and make the enquiry path easier."},{t:"Days 61, 90",d:"Review real enquiry data, improve the weak points and decide what deserves more budget."}].map(x=><article key={x.t} className="border-t-2 border-primary pt-5"><p className="text-xs font-bold uppercase text-primary">{x.t}</p><p className="mt-4 text-lg leading-8">{x.d}</p></article>)}</div><Button asChild size="lg" className="mt-12"><Link to="/contact" search={{ plan: "Growth" }}>Talk about your first 90 days <ArrowRight/></Link></Button></Container></section>
    <CTA title="Let’s fix the part of your digital journey that is leaking customers." description="Start with the free audit. If the opportunity is clear, we’ll show you what to do next." primary="Request the audit" to="/digital-audit" secondary="Talk to Mackdish" />
  </>;
}

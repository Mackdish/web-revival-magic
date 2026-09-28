import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, Container, PageHero, SectionHeading } from "@/components/marketing/layout";

export const Route = createFileRoute("/case-studies")({
  head: () => ({ meta: [
    { title: "Selected Work, Mackdish Solutions" },
    { name: "description", content: "Selected Mackdish work across websites, advertising technology, e-commerce and business software." },
    { property: "og:title", content: "Selected Work, Mackdish Solutions" },
    { property: "og:description", content: "Explore websites and digital platforms built by Mackdish Solutions." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://mackdish.store/case-studies" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/case-studies" }] }),
  component: Page,
});

const projects = [
  {
    type: "Education",
    name: "Mango Secondary School",
    description: "A school website presenting the institution, its information and school community.",
    href: "https://mangosecondaryschool.co.ke",
    label: "Visit live site",
  },
  {
    type: "Business website",
    name: "Wotetti",
    description: "A business website built to present the organisation and its services online.",
    href: "https://wotetti.top",
    label: "Visit live site",
  },
  {
    type: "Corporate website",
    name: "Unify Gents Group",
    description: "A corporate web presence for Unify Gents Group, with business information and a digital contact point.",
    href: "https://unifygentsgroup.co.ke",
    label: "Visit live site",
  },
  {
    type: "Construction / Project management",
    name: "BuildTrack 360",
    description: "A digital platform for construction and project tracking workflows.",
    href: "https://buildtrack360.co.ke",
    label: "Visit live site",
  },
  {
    type: "Church website",
    name: "Wotesda Central Church",
    description: "A church website for sharing ministry information and connecting with its congregation.",
    href: "https://wotesdacentralchurch.top",
    label: "Visit live site",
  },
  {
    type: "Church website",
    name: "Wotesda Church",
    description: "A church web presence for ministry updates, information and community engagement.",
    href: "https://wotesdachurch.top",
    label: "Visit live site",
  },
  {
    type: "Real estate",
    name: "Jatitosa Properties",
    description: "A property-focused website for showcasing real estate information and enquiries.",
    href: "https://jatitosaproperties.co.ke",
    label: "Visit live site",
  },
  {
    type: "University / Student community",
    name: "JOOUST Welfare",
    description: "A digital platform for student welfare information and community updates.",
    href: "https://jooustwelfare.top",
    label: "Visit live site",
  },
  {
    type: "Advertising technology",
    name: "TradeMall",
    description: "A Mackdish-owned advertising marketplace connecting advertisers and publishers with campaign targeting and reporting tools.",
    href: "https://trademall.co.ke",
    label: "Visit live platform",
  },
  {
    type: "Corporate website",
    name: "JNB Royal",
    description: "A corporate website presenting the organisation and its services.",
    href: "https://jnbroyal.co.ke",
    label: "Visit live site",
  },
  {
    type: "Technology / ICT",
    name: "Clisanco Technologies",
    description: "A technology company website presenting digital services, software, ICT and training solutions.",
    href: "https://clisancotechnologies.org",
    label: "Visit live site",
  },
  {
    type: "E-commerce",
    name: "Intech Computer Shop",
    description: "An online electronics store with a product catalogue, cart, M-Pesa STK push checkout, order tracking and Nairobi delivery flow.",
    href: "https://intechcomputershop.co.ke",
    label: "Visit live site",
  },
  {
    type: "Community / Non-profit",
    name: "Yricbo",
    description: "A website for a Kisumu-based organisation focused on education, technology training, mentorship and livelihood programmes.",
    href: "https://yricbo.com",
    label: "Visit live site",
  },
  {
    type: "Property software",
    name: "Oscarinno",
    description: "A property management platform connecting landlords, caretakers and tenants, with listings, rent and arrears tracking, maintenance requests and occupancy updates.",
    href: "https://oscarinno.com",
    label: "Visit live platform",
  },
];

function getScreenshotUrl(url: string) {
  return `https://image.thum.io/get/width/1200/crop/700/noanimate/${url}`;
}

function Page() {
  return <>
    <PageHero eyebrow="Selected work" title="Products, websites and systems we have built." description="Explore live websites and digital products built by Mackdish. Each project links to its live site, with a preview image to help you browse." />
    <section className="py-20 sm:py-28"><Container>
      <article className="overflow-hidden border bg-ink text-ink-foreground">
        <div className="grid lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-light">Product / Advertising technology</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">TradeMall</h2>
            <p className="mt-5 max-w-xl leading-8 text-ink-muted">A Mackdish-owned advertising network built for businesses that need another digital distribution channel beyond social media and search.</p>
            <div className="mt-8 flex flex-wrap gap-2">{["Advertiser campaigns","Publisher inventory","Country / county / city targeting","Responsive ad formats","Campaign dashboards","Website / WhatsApp destinations"].map(x=><span key={x} className="border border-ink-border px-3 py-2 text-xs">{x}</span>)}</div>
            <Button asChild size="lg" className="mt-9"><Link to="/trademall-ads">Explore TradeMall <ArrowRight/></Link></Button>
          </div>
          <a href="https://trademall.co.ke" target="_blank" rel="noreferrer" className="block min-h-64 bg-hero-step">
            <img src={getScreenshotUrl("https://trademall.co.ke")} alt="Screenshot preview of TradeMall" loading="lazy" className="h-full min-h-64 w-full object-cover object-top" />
          </a>
        </div>
      </article>

      <div className="mt-20">
        <SectionHeading eyebrow="Live examples" title="Open the work and inspect it yourself." description="Browse the websites and platforms below. Preview images are captured from the public websites; project descriptions are kept concise, without unverified performance claims."/>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <article key={project.name} className="flex min-w-0 flex-col overflow-hidden border">
            <a href={project.href} target="_blank" rel="noreferrer" className="block aspect-[16/10] overflow-hidden bg-muted" aria-label={`Open ${project.name} website`}>
              <img src={getScreenshotUrl(project.href)} alt={`Website screenshot preview of ${project.name}`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-[1.02]" />
            </a>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{project.type}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{project.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{project.description}</p>
              <a href={project.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{project.label}<ExternalLink className="size-4"/></a>
            </div>
          </article>)}
        </div>
      </div>

      <div className="mt-20 border-t pt-10">
        <SectionHeading eyebrow="More build work" title="Business software and digital operations."/>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="border p-7"><p className="text-xs font-bold uppercase text-primary">Education</p><h3 className="mt-3 font-display text-2xl font-semibold">School management workflows</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">Fees, exams, student records, reports, payments and communication workflows shaped around Kenyan school operations.</p></article>
          <article className="border p-7"><p className="text-xs font-bold uppercase text-primary">Retail</p><h3 className="mt-3 font-display text-2xl font-semibold">Inventory and sales systems</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">Stock, purchases, sales, invoices, reporting, role-based access and payment integrations for retail and wholesale workflows.</p></article>
        </div>
      </div>
    </Container></section>
    <CTA title="Have a business problem that needs both marketing and technology?" primary="Start a conversation" to="/contact" />
  </>;
}

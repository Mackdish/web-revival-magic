import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AuditForm } from "@/components/marketing/forms";
import { Container, PageHero, SectionHeading } from "@/components/marketing/layout";

export const Route = createFileRoute("/digital-audit")({
  head: () => ({ meta: [
    { title: "Free Digital Audit, Mackdish Solutions" },
    { name: "description", content: "Request a short review of your website, social presence and customer journey from Mackdish Solutions. Delivered within 2 working days." },
    { property: "og:title", content: "Free Digital Audit, Mackdish Solutions" },
    { property: "og:description", content: "Send your website or social link and get a short customer-journey review within 2 working days." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://mackdish.store/digital-audit" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/digital-audit" }] }),
  component: Page,
});

function Page() { return <>
  <PageHero eyebrow="Free digital audit" title="Find out what is costing you enquiries." description="Send us your website or social link. We’ll review the customer journey and return a short practical audit within 2 working days." />
  <section className="py-20 sm:py-28"><Container className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
    <div><SectionHeading eyebrow="What you receive" title="A short review you can actually use."/><div className="mt-8 space-y-4">{["Website and mobile experience","Google / local discovery","Social profile and offer clarity","Advert and landing-page opportunities","WhatsApp / contact journey","The first 3 changes we would make"].map(x=><div key={x} className="flex gap-3 text-sm leading-6"><Check className="mt-0.5 size-5 shrink-0 text-primary"/>{x}</div>)}</div><p className="mt-8 border-l-2 border-primary pl-5 text-sm leading-7 text-muted-foreground">The audit is prepared by Mackdish. If you want help implementing the changes, we can scope that separately.</p></div>
    <div className="border p-6 sm:p-8"><AuditForm/></div>
  </Container></section>
</>; }

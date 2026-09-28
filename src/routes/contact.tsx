import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/forms";
import { Container, PageHero, SectionHeading } from "@/components/marketing/layout";

const WHATSAPP_NUMBER = "254705186502";
const PHONE = "0705 186 502";
const EMAIL = "support@mackdish.store";
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}`;

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => {
    const params: { plan?: string; source?: string } = {};
    if (typeof search["plan"] === "string") params.plan = search["plan"];
    if (typeof search["source"] === "string") params.source = search["source"];
    return params;
  },
  head: () => ({ meta: [
    { title: "Contact Mackdish Solutions, Kenya" },
    { name: "description", content: "Talk to Mackdish Solutions about digital marketing, TradeMall advertising, websites, software and automation in Kenya." },
    { property: "og:title", content: "Contact Mackdish Solutions, Kenya" },
    { property: "og:description", content: "Start a direct conversation about marketing, advertising, websites, software or automation." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { property: "og:url", content: "https://mackdish.store/contact" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/contact" }] }),
  component: Page,
});

function Page() {
  const { plan, source } = useSearch({ from: "/contact" });
  const context = plan ? `${plan} package` : source ? source.replace(/-/g, " ") : undefined;
  const whatsappText = encodeURIComponent(
    plan
      ? `Hi Mackdish, I'm interested in the ${plan} package.`
      : source
        ? `Hi Mackdish, I came from ${source.replace(/-/g, " ")} and I'd like to discuss a project.`
        : "Hi Mackdish, I'd like to discuss my business."
  );

  return <>
    <PageHero eyebrow="Contact" title="Tell us what you want to improve or build." description="Choose a direct conversation or send the short form. We’ll use the context to shape the next step." />
    <section className="py-20 sm:py-28"><Container className="grid gap-14 lg:grid-cols-[.72fr_1.28fr]">
      <div>
        <SectionHeading eyebrow="Start here" title="No sales maze." description="If you already know what you need, WhatsApp is the fastest route. If the problem is still unclear, use the form."/>
        <div className="mt-8 space-y-3">
          <a href={`${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 border p-5 transition-transform duration-200 hover:translate-x-1">
            <MessageCircle className="size-5 text-primary"/>
            <div><p className="font-semibold">WhatsApp Mackdish</p><p className="text-sm text-muted-foreground">{plan ? `Start a chat about the ${plan} package.` : source ? `Continue from ${source.replace(/-/g, " ")}.` : "Start a direct conversation with Mackdish."}</p></div>
          </a>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-4 border p-5 transition-transform duration-200 hover:translate-x-1">
            <Phone className="size-5 text-primary"/><div><p className="font-semibold">{PHONE}</p><p className="text-sm text-muted-foreground">Call Mackdish directly.</p></div>
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 border p-5 transition-transform duration-200 hover:translate-x-1">
            <Mail className="size-5 text-primary"/><div><p className="font-semibold">{EMAIL}</p><p className="text-sm text-muted-foreground">Email for project and business enquiries.</p></div>
          </a>
          <div className="flex items-center gap-4 border p-5"><MapPin className="size-5 text-primary"/><div><p className="font-semibold">Kimathi Street, Nairobi CBD</p><p className="text-sm text-muted-foreground">Nairobi, Kenya · Mon, Fri 8:00am, 6:00pm, Sat 9:00am, 1:00pm EAT.</p></div></div>
        </div>
      </div>
      <div className="border p-6 sm:p-8"><ContactForm context={context} /></div>
    </Container></section>
  </>;
}

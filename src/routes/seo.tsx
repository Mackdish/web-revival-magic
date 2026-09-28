import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CapabilityPage } from "@/components/marketing/content-page";

export const Route = createFileRoute("/seo")({
  head: () => ({ meta: [{ title: "SEO Services Kenya, Mackdish Solutions" }, { name: "description", content: "Local SEO, technical SEO and Google Business optimisation for Kenyan businesses." }, { property: "og:title", content: "SEO Services Kenya, Mackdish Solutions" }, { property: "og:description", content: "Local SEO, technical SEO and Google Business optimisation for Kenyan businesses." }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://mackdish.store/seo" }], links: [{ rel: "canonical", href: "https://mackdish.store/seo" }] }),
  component: Page,
});

function Page() {
  return <CapabilityPage eyebrow="SEO" title="Be easier to find when customers are already looking." description="Local and technical SEO built around the searches that matter to your business." closingTitle="Want to know what is holding your search visibility back?" groups={[{ title: "Local SEO", description: "Improve local search and Maps visibility.", items: ["Google Business Profile", "Local pages", "Categories", "Reviews guidance"], icon: Search }, { title: "Technical SEO", description: "Fix the foundations behind crawlability and performance.", items: ["Indexing", "Page structure", "Mobile experience", "Performance"], icon: Search }, { title: "On-page SEO", description: "Make important pages clearer to search engines and customers.", items: ["Search intent", "Titles and descriptions", "Internal links", "Content structure"], icon: Search }, { title: "Search strategy", description: "Prioritise pages and topics around what customers search for.", items: ["Keyword research", "Competitor review", "Content planning", "Measurement"], icon: Search }]} />;
}
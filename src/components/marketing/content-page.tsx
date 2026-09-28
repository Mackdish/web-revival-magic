import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, Container, FeatureList, PageHero, SectionHeading } from "./layout";

type Group = { title: string; description: string; items: string[]; icon: LucideIcon };
export function CapabilityPage({ eyebrow, title, description, groups, closingTitle, ctaLabel = "Get a Free Digital Audit", ctaTo = "/digital-audit" }: { eyebrow: string; title: string; description: string; groups: Group[]; closingTitle: string; ctaLabel?: string; ctaTo?: string }) {
  return <><PageHero eyebrow={eyebrow} title={title} description={description} icon={groups[0]?.icon} /><section className="py-20 sm:py-28"><Container><SectionHeading eyebrow="Capabilities" title="A connected approach, not disconnected tactics." description="Each capability is designed to work with the rest of your customer journey, from discovery to enquiry and follow-up." /><div className="mt-14 grid border-l border-t md:grid-cols-2">{groups.map(({ title: groupTitle, description: groupDescription, items, icon: Icon }) => <article key={groupTitle} className="border-b border-r p-7 sm:p-9"><Icon className="size-6 text-primary" /><h2 className="mt-8 font-display text-2xl font-semibold">{groupTitle}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{groupDescription}</p><div className="mt-7"><FeatureList items={items} /></div></article>)}</div><div className="mt-12"><Button asChild size="lg"><Link to={ctaTo}>{ctaLabel}<ArrowRight /></Link></Button></div></Container></section><CTA title={closingTitle} primary={ctaLabel} to={ctaTo} /></>;
}

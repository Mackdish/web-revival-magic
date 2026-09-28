import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WHATSAPP_NUMBER = "254705186502";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

function Field({ label, name, type = "text", required = true, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return <div className="grid gap-2"><Label htmlFor={name}>{label}{required && <span className="text-primary"> *</span>}</Label><Input id={name} name={name} type={type} required={required} placeholder={placeholder} className="h-11" /></div>;
}

function Success({ title, text }: { title: string; text: string }) {
  return <div className="flex min-h-80 flex-col items-center justify-center border border-primary/20 bg-primary/5 p-8 text-center"><CheckCircle2 className="size-12 text-primary" /><h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2><p className="mt-3 max-w-md text-muted-foreground">{text}</p></div>;
}

function openWhatsApp(message: string) {
  window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

export function ContactForm({ context }: { context?: string | undefined }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (state === "done") {
    return <Success title="WhatsApp is ready." text="Your message has been prepared with the details you entered. Send it in WhatsApp to start the conversation with Mackdish." />;
  }

  return <form className="grid gap-5" onSubmit={(event) => {
    event.preventDefault();
    setState("loading");
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = [
      "Hi Mackdish, I'd like to discuss a project.",
      context ? `I'm interested in the ${context}.` : "",
      "",
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company")}`,
      `Phone / WhatsApp: ${data.get("phone")}`,
      `Website or social: ${data.get("website") || "Not provided"}`,
      `What I need: ${data.get("message")}`,
    ].filter(Boolean).join("\n");
    openWhatsApp(message);
    window.setTimeout(() => setState("done"), 350);
  }}>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" /><Field label="Company" name="company" /><Field label="Phone / WhatsApp" name="phone" type="tel" /><Field label="Website or social link" name="website" type="url" required={false} placeholder="https://" /></div>
    <div className="grid gap-2"><Label htmlFor="message">What do you want to improve or build? <span className="text-primary">*</span></Label><textarea id="message" name="message" required className="min-h-32 rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="For example: more WhatsApp enquiries, a new website, Google visibility, or a business system." /></div>
    <Button size="lg" disabled={state === "loading"}>{state === "loading" ? <Loader2 className="animate-spin" /> : <MessageCircle />}Send via WhatsApp</Button>
    <p className="text-xs leading-5 text-muted-foreground">Your details stay in the WhatsApp conversation you choose to send.</p>
  </form>;
}

export function AuditForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (state === "done") {
    return <Success title="Your WhatsApp message is ready." text="Send it to Mackdish and we’ll review the link you shared and prepare the short audit within 2 working days." />;
  }

  return <form className="grid gap-5" onSubmit={(event) => {
    event.preventDefault();
    setState("loading");
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = [
      "Hi Mackdish, I'd like my free digital audit.",
      "",
      `Name: ${data.get("name")}`,
      `Phone / WhatsApp: ${data.get("phone")}`,
      `Website or social: ${data.get("website")}`,
      "",
      "Please send me the short audit and the first three changes you would make.",
    ].join("\n");
    openWhatsApp(message);
    window.setTimeout(() => setState("done"), 350);
  }}>
    <Field label="Name" name="name" />
    <Field label="Phone / WhatsApp" name="phone" type="tel" />
    <Field label="Website or social link" name="website" type="url" placeholder="https://" />
    <Button size="lg" className="w-full" disabled={state === "loading"}>{state === "loading" ? <Loader2 className="animate-spin" /> : <MessageCircle />}Request my free audit</Button>
    <p className="text-xs leading-5 text-muted-foreground">Three fields. No long questionnaire. Your message opens directly in WhatsApp.</p>
  </form>;
}

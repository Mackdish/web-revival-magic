import { FormEvent, useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, LogOut, Send, UserRound } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({ meta: [
    { title: "My account | Mackdish" },
    { name: "description", content: "Manage your Mackdish profile and send project inquiries." },
    { property: "og:title", content: "My account | Mackdish" },
    { property: "og:description", content: "Manage your Mackdish profile and send project inquiries." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AccountPage,
});

const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().max(120),
  phone: z.string().trim().max(40),
});
const inquirySchema = z.object({
  service: z.string().max(80),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(4000),
});
const services = ["Web development", "Software development", "SEO", "Digital marketing", "Advertising", "Automation & AI", "Other"];

type Inquiry = { id: string; subject: string; service: string | null; status: string; created_at: string; message: string };

function AccountPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ display_name: "", company: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [inq, setInq] = useState({ service: services[0]!, subject: "", message: "" });
  const [inqMsg, setInqMsg] = useState("");
  const [error, setError] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const loadInquiries = async (uid: string) => {
    const { data } = await supabase.from("inquiries").select("id,subject,service,status,created_at,message").eq("user_id", uid).order("created_at", { ascending: false });
    setInquiries((data as Inquiry[]) ?? []);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { await navigate({ to: "/login", replace: true }); return; }
      setUserId(data.user.id); setEmail(data.user.email ?? "");
      const { data: p } = await supabase.from("profiles").select("display_name,company,phone").eq("user_id", data.user.id).maybeSingle();
      if (p) setProfile({ display_name: p.display_name ?? "", company: p.company ?? "", phone: p.phone ?? "" });
      await loadInquiries(data.user.id);
      setLoading(false);
    })();
  }, [navigate]);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setProfileMsg("");
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) { setError(parsed.error.issues[0]!.message); return; }
    const { error } = await supabase.from("profiles").upsert({ user_id: userId!, ...parsed.data, updated_at: new Date().toISOString() });
    if (error) setError(error.message); else setProfileMsg("Profile saved.");
  };

  const submitInquiry = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setInqMsg("");
    const parsed = inquirySchema.safeParse(inq);
    if (!parsed.success) { setError(parsed.error.issues[0]!.message); return; }
    const { error } = await supabase.from("inquiries").insert({ user_id: userId!, ...parsed.data });
    if (error) { setError(error.message); return; }
    setInq({ service: services[0]!, subject: "", message: "" });
    setInqMsg("Inquiry sent. Our team will get back to you soon.");
    await loadInquiries(userId!);
  };

  const logout = async () => { await supabase.auth.signOut(); await navigate({ to: "/login", replace: true }); };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading your account...</div>;

  const inputCls = "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
      <Link to="/" className="font-display text-lg font-semibold">Mackdish</Link>
      <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" />Sign out</button>
    </div></header>
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-2">
      <div className="lg:col-span-2"><h1 className="font-display text-3xl font-semibold">My account</h1><p className="mt-1 text-sm text-muted-foreground">{email}</p>
        {error && <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</div>
      <form onSubmit={saveProfile} className="grid content-start gap-4 rounded-lg border p-6">
        <h2 className="flex items-center gap-2 font-semibold"><UserRound className="size-4" />Your profile</h2>
        <label className="grid gap-1 text-sm">Full name *<input className={inputCls} value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} maxLength={100} required /></label>
        <label className="grid gap-1 text-sm">Company<input className={inputCls} value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} maxLength={120} /></label>
        <label className="grid gap-1 text-sm">Phone / WhatsApp<input className={inputCls} type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={40} /></label>
        <button className="h-11 rounded-md bg-primary font-semibold text-primary-foreground hover:opacity-90">Save profile</button>
        {profileMsg && <p className="flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="size-4" />{profileMsg}</p>}
      </form>
      <form onSubmit={submitInquiry} className="grid content-start gap-4 rounded-lg border p-6">
        <h2 className="flex items-center gap-2 font-semibold"><Send className="size-4" />Send an inquiry</h2>
        <label className="grid gap-1 text-sm">Service<select className={inputCls} value={inq.service} onChange={(e) => setInq({ ...inq, service: e.target.value })}>{services.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Subject *<input className={inputCls} value={inq.subject} onChange={(e) => setInq({ ...inq, subject: e.target.value })} maxLength={200} required /></label>
        <label className="grid gap-1 text-sm">Message *<textarea className="min-h-32 rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={inq.message} onChange={(e) => setInq({ ...inq, message: e.target.value })} maxLength={4000} required /></label>
        <button className="h-11 rounded-md bg-primary font-semibold text-primary-foreground hover:opacity-90">Submit inquiry</button>
        {inqMsg && <p className="flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="size-4" />{inqMsg}</p>}
      </form>
      <section className="rounded-lg border p-6 lg:col-span-2">
        <h2 className="font-semibold">My inquiries</h2>
        {inquiries.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No inquiries yet.</p> :
          <ul className="mt-4 divide-y">{inquiries.map((i) => <li key={i.id} className="py-3"><div className="flex items-center justify-between gap-4"><b className="text-sm">{i.subject}</b><span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{i.status.replace("_", " ")}</span></div><p className="mt-1 text-xs text-muted-foreground">{i.service} · {new Date(i.created_at).toLocaleDateString()}</p><p className="mt-2 text-sm text-muted-foreground">{i.message}</p></li>)}</ul>}
      </section>
    </main>
  </div>;
}

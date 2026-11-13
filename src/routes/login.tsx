import { FormEvent, useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { getCrmRole, getCurrentUser, signInWithPassword, supabase } from "../lib/auth";

export const Route = createFileRoute("/login")({ head: () => ({ meta: [{ title: "Sign in | Mackdish Workspace" }, { name: "description", content: "Sign in to your private Mackdish business workspace." }, { property: "og:title", content: "Sign in | Mackdish Workspace" }, { property: "og:description", content: "Sign in to your private Mackdish business workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(true); const [submitting,setSubmitting]=useState(false);
  useEffect(() => {
    let cancelled=false;
    const check=async()=>{
      if(!supabase){ if(!cancelled){setError("Authentication is not configured.");setLoading(false);} return; }
      try { const user=await getCurrentUser(); if(user) await navigate({to:(await getCrmRole(user.id))==="admin"?"/dashboard":"/account",replace:true}); }
      catch(e){ if(!cancelled)setError(e instanceof Error?e.message:"Unable to check your session."); }
      finally { if(!cancelled)setLoading(false); }
    }; void check(); return()=>{cancelled=true};
  },[navigate]);
  const submit=async(e:FormEvent)=>{
    e.preventDefault();setError("");setSubmitting(true);
    try { const {user}=await signInWithPassword(email.trim(),password); if(!user)throw new Error("Unable to sign in."); const role=await getCrmRole(user.id); await navigate({to: role==="admin"?"/dashboard":"/account",replace:true}); }
    catch(e){setError(e instanceof Error?e.message:"Unable to sign in.");} finally{setSubmitting(false)}
  };
  if(loading)return <div className="workspace-site flex min-h-screen items-center justify-center text-muted-foreground">Checking session...</div>;
  return <div className="workspace-site min-h-screen text-foreground"><div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
    <div className="hidden flex-col justify-between border-r border-primary/60 bg-ink p-10 lg:flex"><div><div className="flex items-center gap-3"><div className="grid size-10 place-items-center bg-primary text-primary-foreground"><ShieldCheck className="size-5"/></div><b className="font-display text-lg uppercase tracking-wide">Mackdish</b></div><div className="mt-28 max-w-lg"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-primary">Business workspace</p><h2 className="mt-5 font-display text-5xl font-bold uppercase leading-tight">Run sales, clients and delivery from one place.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">A private workspace for your clients, projects and sales.</p></div></div><p className="text-xs text-muted-foreground">Mackdish Solutions · Private workspace</p></div>
    <div className="flex items-center justify-center px-5 py-10"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><b className="font-display text-lg uppercase tracking-wide">Mackdish</b></div><div className="mb-8"><p className="font-display text-xs font-bold uppercase tracking-[.2em] text-primary">Private workspace</p><h1 className="mt-3 font-display text-3xl font-bold uppercase">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to your Mackdish workspace.</p></div>
      <form onSubmit={submit} className="workspace-panel space-y-5 p-6 shadow-2xl">
        <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email</span><div className="workspace-input flex items-center gap-3 px-3"><Mail className="size-4 text-muted-foreground"/><input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="auth-input"/></div></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Password</span><div className="workspace-input flex items-center gap-3 px-3"><LockKeyhole className="size-4 text-muted-foreground"/><input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" className="auth-input"/></div></label>
        {error&&<div className="border border-destructive/60 bg-destructive/15 p-3 text-sm text-destructive-foreground">{error}</div>}
        <button disabled={submitting} className="workspace-action flex h-12 w-full items-center justify-center gap-2 font-semibold disabled:opacity-60">{submitting?"Signing in...":"Sign in"}<ArrowRight className="size-4"/></button>
        <p className="text-center text-sm text-muted-foreground">No account? <Link to="/signup" className="font-semibold text-primary hover:underline">Create one</Link></p>
      </form><style>{".auth-input{height:3rem;width:100%;background:transparent;outline:none;font-size:.875rem;color:inherit}.auth-input::placeholder{color:var(--muted-foreground)}"}</style>
    </div></div></div></div>;
}

import { FormEvent, useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { getCrmRole, getCurrentUser, signInWithPassword, supabase } from "../lib/auth";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(true); const [submitting,setSubmitting]=useState(false);
  useEffect(() => {
    let cancelled=false;
    const check=async()=>{
      if(!supabase){ if(!cancelled){setError("Authentication is not configured.");setLoading(false);} return; }
      try { const user=await getCurrentUser(); if(user && await getCrmRole(user.id)) await navigate({to:"/dashboard",replace:true}); }
      catch(e){ if(!cancelled)setError(e instanceof Error?e.message:"Unable to check your session."); }
      finally { if(!cancelled)setLoading(false); }
    }; void check(); return()=>{cancelled=true};
  },[navigate]);
  const submit=async(e:FormEvent)=>{
    e.preventDefault();setError("");setSubmitting(true);
    try { const {user}=await signInWithPassword(email.trim(),password); if(!user)throw new Error("Unable to sign in."); const role=await getCrmRole(user.id); if(!role){await supabase?.auth.signOut();throw new Error("Your account has not been granted workspace access yet.");} await navigate({to:"/dashboard",replace:true}); }
    catch(e){setError(e instanceof Error?e.message:"Unable to sign in.");} finally{setSubmitting(false)}
  };
  if(loading)return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Checking session...</div>;
  return <div className="min-h-screen bg-slate-950 text-slate-100"><div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
    <div className="hidden flex-col justify-between border-r border-slate-800 p-10 lg:flex"><div><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-slate-950"><ShieldCheck className="size-5"/></div><b>Mackdish</b></div><div className="mt-28 max-w-lg"><p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Business workspace</p><h2 className="mt-5 text-5xl font-bold leading-tight">Run sales, clients and delivery from one place.</h2><p className="mt-6 text-lg leading-8 text-slate-400">A private workspace protected by Supabase authentication and database-level access controls.</p></div></div><p className="text-xs text-slate-600">Mackdish Solutions · Private workspace</p></div>
    <div className="flex items-center justify-center px-5 py-10"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><b>Mackdish</b></div><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Private workspace</p><h1 className="mt-3 text-3xl font-bold">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to your Mackdish workspace.</p></div>
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Email</span><div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3"><Mail className="size-4 text-slate-500"/><input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="auth-input"/></div></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Password</span><div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3"><LockKeyhole className="size-4 text-slate-500"/><input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" className="auth-input"/></div></label>
        {error&&<div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-300">{error}</div>}
        <button disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-60">{submitting?"Signing in...":"Sign in"}<ArrowRight className="size-4"/></button>
        <p className="text-center text-sm text-slate-500">No account? <Link to="/signup" className="font-semibold text-white hover:underline">Create one</Link></p>
      </form><style>{".auth-input{height:3rem;width:100%;background:transparent;outline:none;font-size:.875rem;color:white}.auth-input::placeholder{color:#475569}"}</style>
    </div></div></div></div>;
}
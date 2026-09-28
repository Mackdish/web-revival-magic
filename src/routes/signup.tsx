import { FormEvent, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signUpWithPassword } from "../lib/auth";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({ head: () => ({ meta: [{ title: "Create account | Mackdish Workspace" }, { name: "description", content: "Create your Mackdish workspace account." }, { property: "og:title", content: "Create account | Mackdish Workspace" }, { property: "og:description", content: "Create your Mackdish workspace account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: SignupPage });

function SignupPage(){
 const navigate=useNavigate();
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState("");
 const [error,setError]=useState(""); const [success,setSuccess]=useState(""); const [submitting,setSubmitting]=useState(false);
 const submit=async(e:FormEvent)=>{
  e.preventDefault();setError("");setSuccess("");
  if(password.length<8){setError("Use at least 8 characters for your password.");return}
  if(password!==confirm){setError("Passwords do not match.");return}
  setSubmitting(true);
  try{ const data=await signUpWithPassword(email.trim(),password); if(data.session){await navigate({to:"/dashboard",replace:true});return} setSuccess("Account created. Check your email to confirm your account, then sign in."); }
  catch(e){setError(e instanceof Error?e.message:"Unable to create your account.");} finally{setSubmitting(false)}
 };
 return <div className="min-h-screen bg-slate-950 text-slate-100"><div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 py-10"><div className="w-full max-w-md">
  <div className="mb-8 text-center"><div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-white text-slate-950"><ShieldCheck className="size-6"/></div><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Mackdish workspace</p><h1 className="mt-3 text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm text-slate-500">Create credentials for the secure workspace.</p></div>
  <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
   <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Email</span><div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3"><Mail className="size-4 text-slate-500"/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="auth-input" placeholder="you@example.com"/></div></label>
   <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Password</span><div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3"><LockKeyhole className="size-4 text-slate-500"/><input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input" placeholder="At least 8 characters"/></div></label>
   <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Confirm password</span><input required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="auth-input rounded-xl border border-slate-700 bg-slate-950 px-3"/></label>
   {error&&<div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-300">{error}</div>}
   {success&&<div className="flex gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-3 text-sm text-emerald-300"><CheckCircle2 className="mt-0.5 size-4 shrink-0"/><span>{success} <Link to="/login" className="font-semibold underline">Sign in</Link></span></div>}
   <button disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-60">{submitting?"Creating account...":"Create account"}<ArrowRight className="size-4"/></button>
   <Button type="button" variant="outline" className="w-full" onClick={async () => { const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" }); if (result.error) setError(result.error.message); else if (!result.redirected) await navigate({to:"/dashboard",replace:true}); }}>Continue with Google</Button>
   <p className="text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-white hover:underline">Sign in</Link></p>
   <p className="text-center text-xs leading-5 text-slate-600">Creating an account does not grant CRM access. Workspace access is assigned separately.</p>
  </form><style>{".auth-input{height:3rem;width:100%;background:transparent;outline:none;font-size:.875rem;color:white}.auth-input::placeholder{color:#475569}"}</style>
 </div></div></div>
}
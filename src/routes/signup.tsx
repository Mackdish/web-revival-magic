import { FormEvent, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signUpWithPassword } from "../lib/auth";

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
  try{ const data=await signUpWithPassword(email.trim(),password); if(data.session){await navigate({to:"/account",replace:true});return} setSuccess("Account created. Check your email to confirm your account, then sign in."); }
  catch(e){setError(e instanceof Error?e.message:"Unable to create your account.");} finally{setSubmitting(false)}
 };
 return <div className="workspace-site min-h-screen text-foreground"><div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 py-10"><div className="w-full max-w-md">
  <div className="mb-8 text-center"><div className="mx-auto mb-4 grid size-12 place-items-center bg-primary text-primary-foreground"><ShieldCheck className="size-6"/></div><p className="font-display text-xs font-bold uppercase tracking-[.2em] text-primary">Mackdish workspace</p><h1 className="mt-3 font-display text-3xl font-bold uppercase">Create your account</h1><p className="mt-2 text-sm text-muted-foreground">Create credentials for the secure workspace.</p></div>
  <form onSubmit={submit} className="workspace-panel space-y-5 p-6 shadow-2xl">
   <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email</span><div className="workspace-input flex items-center gap-3 px-3"><Mail className="size-4 text-muted-foreground"/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="auth-input" placeholder="you@example.com"/></div></label>
   <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Password</span><div className="workspace-input flex items-center gap-3 px-3"><LockKeyhole className="size-4 text-muted-foreground"/><input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input" placeholder="At least 8 characters"/></div></label>
   <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Confirm password</span><input required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="auth-input workspace-input px-3"/></label>
   {error&&<div className="border border-destructive/60 bg-destructive/15 p-3 text-sm text-destructive-foreground">{error}</div>}
   {success&&<div className="flex gap-3 border border-primary/60 bg-primary/10 p-3 text-sm text-primary"><CheckCircle2 className="mt-0.5 size-4 shrink-0"/><span>{success} <Link to="/login" className="font-semibold underline">Sign in</Link></span></div>}
   <button disabled={submitting} className="workspace-action flex h-12 w-full items-center justify-center gap-2 font-semibold disabled:opacity-60">{submitting?"Creating account...":"Create account"}<ArrowRight className="size-4"/></button>
   <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>
   <p className="text-center text-xs leading-5 text-muted-foreground">Create an account to manage your profile and send inquiries to our team.</p>
  </form><style>{".auth-input{height:3rem;width:100%;background:transparent;outline:none;font-size:.875rem;color:inherit}.auth-input::placeholder{color:var(--muted-foreground)}"}</style>
 </div></div></div>
}

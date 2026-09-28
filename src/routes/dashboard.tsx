import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getCrmRole, getCurrentUser, signOut } from "../lib/auth";
import { insertCrmActivity, insertCrmLead, loadCrmFromSupabase, markCrmMessageRead, supabase, updateCrmAutomation, updateCrmLeadStage, updateCrmTask, updateCrmWorkflow } from "../lib/crm-supabase";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Filter,
  GitBranch,
  Globe,
  LayoutDashboard,
  Megaphone,
  Menu,
  Phone,
  Plus,
  Search,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
type ActivityType = "Lead created" | "Call" | "WhatsApp" | "Email" | "Meeting" | "Note" | "Proposal";

type Lead = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  status: LeadStatus;
  value: number;
  owner: string;
  createdAt: string;
  lastActivity: string;
  nextFollowUp: string;
};

type Task = {
  id: string;
  title: string;
  leadId?: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

type CRMActivity = {
  id: string;
  leadId: string;
  type: ActivityType;
  note: string;
  createdAt: string;
};

type View = "overview" | "leads" | "pipeline" | "tasks" | "activity" | "accounts" | "companies" | "contacts" | "deals" | "inbox" | "projects" | "quotes" | "invoices" | "payments" | "campaigns" | "sources" | "automation" | "workflows" | "analytics" | "search";

const STORAGE = {
  leads: "mackdish_crm_leads",
  companies: "mackdish_crm_companies",
  contacts: "mackdish_crm_contacts",
  deals: "mackdish_crm_deals",
  messages: "mackdish_crm_messages",
  projects: "mackdish_crm_projects",
  quotes: "mackdish_crm_quotes",
  invoices: "mackdish_crm_invoices",
  payments: "mackdish_crm_payments",
  campaigns: "mackdish_crm_campaigns",
  automations: "mackdish_crm_automations",
  workflows: "mackdish_crm_workflows",
  tasks: "mackdish_crm_tasks",
  activities: "mackdish_crm_activities",
};

const stages: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal", "Won"];

type Company = { id: string; name: string; industry: string; phone: string; email: string; website: string; location: string; status: "Prospect" | "Customer" | "Inactive"; notes: string };
type Contact = { id: string; companyId: string; name: string; role: string; phone: string; email: string; preferredChannel: "WhatsApp" | "Phone" | "Email" };
type Deal = { id: string; companyId: string; name: string; value: number; stage: LeadStatus; expectedClose: string; service: string; owner: string };
type Message = { id: string; companyId: string; contactId: string; channel: "WhatsApp" | "Email" | "SMS" | "Call"; direction: "Inbound" | "Outbound"; subject: string; body: string; createdAt: string; read: boolean };
type LeadSource = "Meta Ads" | "TradeMall Ads" | "Website" | "Google" | "WhatsApp" | "Referral" | "Email" | "LinkedIn" | "Other";
type Automation = { id: string; name: string; trigger: "New Lead" | "Status Changed" | "Quote Sent" | "Invoice Overdue" | "Payment Received" | "Task Due"; action: "Create Task" | "Send WhatsApp" | "Send Email" | "Assign Lead" | "Create Activity"; active: boolean; runs: number };
type Workflow = { id: string; name: string; description: string; steps: string[]; active: boolean };
type Campaign = { id: string; name: string; channel: "Meta Ads" | "TradeMall Ads" | "Google Ads" | "Email" | "Organic" | "Referral"; status: "Draft" | "Active" | "Paused" | "Completed"; budget: number; leads: number; qualified: number; revenue: number; startDate: string; endDate: string };
type Project = { id: string; companyId: string; dealId: string; name: string; service: string; status: "Not Started" | "In Progress" | "Review" | "Completed"; startDate: string; dueDate: string; progress: number; owner: string };
type Quote = { id: string; companyId: string; dealId: string; number: string; title: string; amount: number; status: "Draft" | "Sent" | "Accepted" | "Declined"; validUntil: string; createdAt: string };
type Invoice = { id: string; companyId: string; projectId: string; number: string; amount: number; paid: number; status: "Draft" | "Sent" | "Part Paid" | "Paid" | "Overdue"; dueDate: string };
type Payment = { id: string; invoiceId: string; companyId: string; amount: number; method: "M-Pesa" | "Bank" | "Cash" | "Card" | "Other"; reference: string; date: string };

const seedCompanies: Company[] = [
  { id: "company-1", name: "ABC Hardware", industry: "Hardware", phone: "0700 000 001", email: "john@example.com", website: "", location: "Kakamega", status: "Prospect", notes: "Interested in website and SEO." },
  { id: "company-2", name: "Zeddy Real Estate", industry: "Real Estate", phone: "0700 000 002", email: "sarah@example.com", website: "", location: "Nairobi", status: "Prospect", notes: "Digital marketing proposal sent." },
  { id: "company-3", name: "Mitra Electronics", industry: "Electronics", phone: "0700 000 005", email: "mercy@example.com", website: "", location: "Kakamega", status: "Customer", notes: "Active Mackdish client." },
];
const seedContacts: Contact[] = [
  { id: "contact-1", companyId: "company-1", name: "John Kamau", role: "Owner", phone: "0700 000 001", email: "john@example.com", preferredChannel: "WhatsApp" },
  { id: "contact-2", companyId: "company-2", name: "Sarah Wanjiku", role: "Director", phone: "0700 000 002", email: "sarah@example.com", preferredChannel: "Phone" },
  { id: "contact-3", companyId: "company-3", name: "Mercy Achieng", role: "Manager", phone: "0700 000 005", email: "mercy@example.com", preferredChannel: "WhatsApp" },
];
const seedAutomations: Automation[] = [
 { id:"automation-1", name:"New lead follow-up", trigger:"New Lead", action:"Create Task", active:true, runs:34 },
 { id:"automation-2", name:"Quote follow-up", trigger:"Quote Sent", action:"Create Task", active:true, runs:12 },
 { id:"automation-3", name:"Overdue invoice alert", trigger:"Invoice Overdue", action:"Send WhatsApp", active:true, runs:5 },
 { id:"automation-4", name:"Payment activity", trigger:"Payment Received", action:"Create Activity", active:true, runs:18 },
];
const seedWorkflows: Workflow[] = [
 { id:"workflow-1", name:"New Lead → Qualified", description:"Standard sales qualification sequence", steps:["Create lead","Assign owner","Create follow-up task","Qualify","Move to pipeline"], active:true },
 { id:"workflow-2", name:"Won Deal → Project", description:"Client onboarding and delivery handoff", steps:["Mark deal Won","Create project","Create kickoff task","Send onboarding message"], active:true },
 { id:"workflow-3", name:"Invoice → Collection", description:"Structured payment follow-up", steps:["Issue invoice","Monitor due date","Create reminder","Record payment","Close balance"], active:true },
];

const seedCampaigns: Campaign[] = [
  { id: "campaign-1", name: "TradeMall Advertiser Onboarding", channel: "TradeMall Ads", status: "Active", budget: 15000, leads: 18, qualified: 7, revenue: 75000, startDate: "2026-09-01", endDate: "2026-10-01" },
  { id: "campaign-2", name: "Meta Digital Marketing Leads", channel: "Meta Ads", status: "Active", budget: 10000, leads: 24, qualified: 9, revenue: 120000, startDate: "2026-09-10", endDate: "2026-10-10" },
  { id: "campaign-3", name: "Organic Website Enquiries", channel: "Organic", status: "Active", budget: 0, leads: 11, qualified: 5, revenue: 80000, startDate: "2026-09-01", endDate: "2026-10-01" },
];

const seedProjects: Project[] = [
  { id: "project-1", companyId: "company-3", dealId: "deal-3", name: "TradeMall Advertising Campaign", service: "TradeMall Ads", status: "In Progress", startDate: "2026-09-18", dueDate: "2026-10-18", progress: 45, owner: "Mackdish" },
  { id: "project-2", companyId: "company-1", dealId: "deal-1", name: "ABC Hardware Website", service: "Web + SEO", status: "Not Started", startDate: "2026-10-01", dueDate: "2026-10-30", progress: 0, owner: "Mackdish" },
];
const seedQuotes: Quote[] = [
  { id: "quote-1", companyId: "company-2", dealId: "deal-2", number: "QT-2026-001", title: "Digital Marketing Retainer", amount: 25000, status: "Sent", validUntil: "2026-10-01", createdAt: "2026-09-22" },
  { id: "quote-2", companyId: "company-1", dealId: "deal-1", number: "QT-2026-002", title: "Website + SEO", amount: 80000, status: "Draft", validUntil: "2026-10-05", createdAt: "2026-09-23" },
];
const seedInvoices: Invoice[] = [
  { id: "invoice-1", companyId: "company-3", projectId: "project-1", number: "INV-2026-001", amount: 75000, paid: 50000, status: "Part Paid", dueDate: "2026-10-01" },
  { id: "invoice-2", companyId: "company-2", projectId: "", number: "INV-2026-002", amount: 25000, paid: 0, status: "Sent", dueDate: "2026-09-30" },
];
const seedPayments: Payment[] = [
  { id: "payment-1", invoiceId: "invoice-1", companyId: "company-3", amount: 50000, method: "M-Pesa", reference: "QWE12345", date: "2026-09-20" },
];

const seedMessages: Message[] = [
  { id: "msg-1", companyId: "company-2", contactId: "contact-2", channel: "WhatsApp", direction: "Inbound", subject: "Marketing proposal", body: "Hi, can we adjust the proposal to include monthly content?", createdAt: "Today, 11:05", read: false },
  { id: "msg-2", companyId: "company-1", contactId: "contact-1", channel: "WhatsApp", direction: "Outbound", subject: "Website + SEO", body: "I have shared the package details. Let me know a good time for a call.", createdAt: "Today, 09:45", read: true },
  { id: "msg-3", companyId: "company-3", contactId: "contact-3", channel: "Email", direction: "Outbound", subject: "TradeMall campaign report", body: "Your latest advertising report is ready for review.", createdAt: "Yesterday, 16:30", read: true },
];

const seedDeals: Deal[] = [
  { id: "deal-1", companyId: "company-1", name: "Website + SEO", value: 80000, stage: "Qualified", expectedClose: "2026-10-01", service: "Web + SEO", owner: "Mackdish" },
  { id: "deal-2", companyId: "company-2", name: "Digital Marketing", value: 25000, stage: "Proposal", expectedClose: "2026-09-30", service: "Digital Marketing", owner: "Mackdish" },
  { id: "deal-3", companyId: "company-3", name: "TradeMall Advertising", value: 75000, stage: "Won", expectedClose: "2026-09-18", service: "TradeMall Ads", owner: "Mackdish" },
];

const seedLeads: Lead[] = [
  { id: "lead-1", name: "John Kamau", company: "ABC Hardware", phone: "0700 000 001", email: "john@example.com", source: "WhatsApp", status: "Qualified", value: 80000, owner: "Mackdish", createdAt: "2026-09-20", lastActivity: "Today", nextFollowUp: "2026-09-24" },
  { id: "lead-2", name: "Sarah Wanjiku", company: "Zeddy Real Estate", phone: "0700 000 002", email: "sarah@example.com", source: "Referral", status: "Proposal", value: 25000, owner: "Mackdish", createdAt: "2026-09-19", lastActivity: "Yesterday", nextFollowUp: "2026-09-24" },
  { id: "lead-3", name: "Brian Otieno", company: "Green Valley School", phone: "0700 000 003", email: "brian@example.com", source: "Facebook", status: "Contacted", value: 60000, owner: "Mackdish", createdAt: "2026-09-21", lastActivity: "2 days ago", nextFollowUp: "2026-09-25" },
  { id: "lead-4", name: "Peter Mwangi", company: "Intech Computer Shop", phone: "0700 000 004", email: "peter@example.com", source: "TradeMall", status: "New", value: 45000, owner: "Mackdish", createdAt: "2026-09-22", lastActivity: "Today", nextFollowUp: "2026-09-24" },
  { id: "lead-5", name: "Mercy Achieng", company: "Mitra Electronics", phone: "0700 000 005", email: "mercy@example.com", source: "Cold outreach", status: "Won", value: 75000, owner: "Mackdish", createdAt: "2026-09-18", lastActivity: "3 days ago", nextFollowUp: "2026-10-01" },
];

const seedTasks: Task[] = [
  { id: "task-1", title: "Follow up Zeddy Real Estate proposal", leadId: "lead-2", due: "2026-09-24", priority: "High", done: false },
  { id: "task-2", title: "Call ABC Hardware", leadId: "lead-1", due: "2026-09-24", priority: "Medium", done: false },
  { id: "task-3", title: "Send Green Valley School website proposal", leadId: "lead-3", due: "2026-09-25", priority: "High", done: false },
  { id: "task-4", title: "Onboard Intech Computer Shop", leadId: "lead-5", due: "2026-09-23", priority: "Low", done: true },
];

const seedActivities: CRMActivity[] = [
  { id: "activity-1", leadId: "lead-2", type: "Proposal", note: "Digital marketing quotation sent", createdAt: "Today, 10:20" },
  { id: "activity-2", leadId: "lead-1", type: "WhatsApp", note: "Customer asked for website and SEO package", createdAt: "Today, 09:45" },
  { id: "activity-3", leadId: "lead-4", type: "Lead created", note: "New lead from TradeMall enquiry", createdAt: "Yesterday, 16:30" },
  { id: "activity-4", leadId: "lead-3", type: "Call", note: "Discussed school website requirements", createdAt: "Yesterday, 11:10" },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function money(value: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function AdminPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [crmError, setCrmError] = useState("");
  const [query, setQuery] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [createModule, setCreateModule] = useState<View | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", company: "", phone: "", email: "", source: "Website", value: "" });

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      if (!supabase) {
        if (!cancelled) {
          setCrmError("The workspace connection is unavailable.");
          setAuthChecking(false);
        }
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!user) {
          await navigate({ to: "/login", replace: true });
          return;
        }

        const role = await getCrmRole(user.id);
        if (!role) {
          await signOut();
          await navigate({ to: "/login", replace: true });
          return;
        }

        if (!cancelled) {
          setAuthorized(true);
          setAuthChecking(false);
        }
      } catch (error) {
        if (!cancelled) {
          setCrmError(error instanceof Error ? error.message : "Unable to verify admin access.");
          setAuthChecking(false);
        }
      }
    };

    void verifyAdmin();

    const authListener = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session) void navigate({ to: "/login", replace: true });
    });

    return () => {
      cancelled = true;
      authListener?.data.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const data = await loadCrmFromSupabase();
        if (cancelled || !data) return;
        setLeads(data.leads);
        setTasks(data.tasks);
        setActivities(data.activities);
        setCompanies(data.companies);
        setContacts(data.contacts);
        setDeals(data.deals);
        setMessages(data.messages);
        setProjects(data.projects);
        setQuotes(data.quotes);
        setInvoices(data.invoices);
        setPayments(data.payments);
        setCampaigns(data.campaigns);
        setAutomations(data.automations);
        setWorkflows(data.workflows);
        setLoaded(true);
      } catch (error) {
        if (!cancelled) {
          setCrmError(error instanceof Error ? error.message : "Unable to connect to the CRM database.");
          setLoaded(true);
        }
      }
    };

    void loadData();
    return () => { cancelled = true; };
  }, [authorized]);

  const leadMap = useMemo(() => Object.fromEntries(leads.map((lead) => [lead.id, lead])), [leads]);
  const openLeads = leads.filter((lead) => !["Won", "Lost"].includes(lead.status));
  const pipelineValue = openLeads.reduce((sum, lead) => sum + lead.value, 0);
  const wonValue = leads.filter((lead) => lead.status === "Won").reduce((sum, lead) => sum + lead.value, 0);
  const overdueTasks = tasks.filter((task) => !task.done && task.due < todayIso());
  const pendingTasks = tasks.filter((task) => !task.done);
  const filteredLeads = leads.filter((lead) => {
    const text = query.toLowerCase();
    return [lead.name, lead.company, lead.phone, lead.email, lead.source, lead.status].some((value) => value.toLowerCase().includes(text));
  });

  const addLead = async () => {
    if (!newLead.name.trim() || !newLead.company.trim()) return;
    try {
      if (supabase) {
        const saved = await insertCrmLead({
          name: newLead.name.trim(), company: newLead.company.trim(), phone: newLead.phone.trim(),
          email: newLead.email.trim(), source: newLead.source, status: "New", value: Number(newLead.value) || 0,
        });
        if (!saved) return;
        const lead: Lead = {
          id: saved.id, name: saved.name, company: saved.company ?? "", phone: saved.phone ?? "",
          email: saved.email ?? "", source: saved.source ?? "Other", status: saved.status,
          value: Number(saved.value ?? 0), owner: saved.owner_id ?? "Mackdish",
          createdAt: saved.created_at?.slice(0, 10) ?? todayIso(), lastActivity: "Just now", nextFollowUp: todayIso(),
        };
        setLeads((current) => [lead, ...current]);
        await insertCrmActivity({ leadId: lead.id, type: "Lead created", note: "Lead added manually" });
        setActivities((current) => [{ id: crypto.randomUUID(), leadId: lead.id, type: "Lead created", note: "Lead added manually", createdAt: "Just now" }, ...current]);
      }
      setNewLead({ name: "", company: "", phone: "", email: "", source: "Website", value: "" });
      setShowLeadForm(false); setView("leads");
    } catch (error) {
      setCrmError(error instanceof Error ? error.message : "Unable to create lead.");
    }
  };

  const updateStage = async (leadId: string, status: LeadStatus) => {
    try {
      if (supabase) await updateCrmLeadStage(leadId, status);
      setLeads((current) => current.map((lead) => lead.id === leadId ? { ...lead, status, lastActivity: "Just now" } : lead));
      if (supabase) await insertCrmActivity({ leadId, type: "Note", note: `Stage moved to ${status}` });
      setActivities((current) => [{ id: crypto.randomUUID(), leadId, type: "Note", note: `Stage moved to ${status}`, createdAt: "Just now" }, ...current]);
    } catch (error) {
      setCrmError(error instanceof Error ? error.message : "Unable to update lead.");
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    const completed = !task.done;
    try {
      if (supabase) await updateCrmTask(taskId, completed);
      setTasks((current) => current.map((item) => item.id === taskId ? { ...item, done: completed } : item));
    } catch (error) {
      setCrmError(error instanceof Error ? error.message : "Unable to update task.");
    }
  };


  if (authChecking) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Verifying admin access...</div>;
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-300">
        <div>
          <p className="text-lg font-semibold text-white">Admin access is unavailable</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">{crmError || "Your account is not authorized to access this portal."}</p>
          <button onClick={() => void navigate({ to: "/login", replace: true })} className="mt-6 bg-white px-4 py-2 text-sm font-semibold text-slate-950">Go to sign in</button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return <div className="min-h-screen bg-slate-950 p-8 text-slate-200">Loading CRM...</div>;
  }

  const creatableViews: View[] = ["leads","companies","contacts","deals","tasks","activity","inbox","projects","quotes","invoices","payments","campaigns","automation","workflows"];
  const createLabels: Partial<Record<View,string>> = {
    leads:"New lead", companies:"New company", contacts:"New contact", deals:"New deal",
    tasks:"New task", activity:"Log activity", inbox:"New message", projects:"New project",
    quotes:"New quote", invoices:"New invoice", payments:"Record payment", campaigns:"New campaign",
    automation:"New automation", workflows:"New workflow",
  };
  const openCreateForm = (target: View) => {
    if (target === "leads") setShowLeadForm(true);
    else if (creatableViews.includes(target)) setCreateModule(target);
  };

  const nav = [
    { id: "overview" as View, label: "Overview", icon: LayoutDashboard },
    { id: "leads" as View, label: "Leads", icon: Users },
    { id: "pipeline" as View, label: "Pipeline", icon: Target },
    { id: "tasks" as View, label: "Tasks & Follow-ups", icon: CheckCircle2 },
    { id: "activity" as View, label: "Activity", icon: Activity },
    { id: "accounts" as View, label: "Accounts", icon: CircleDollarSign },
    { id: "companies" as View, label: "Companies", icon: Building2 },
    { id: "contacts" as View, label: "Contacts", icon: Users },
    { id: "deals" as View, label: "Deals", icon: CircleDollarSign },
    { id: "inbox" as View, label: "Inbox", icon: Activity },
    { id: "projects" as View, label: "Projects", icon: Target },
    { id: "quotes" as View, label: "Quotes & Proposals", icon: ArrowRight },
    { id: "invoices" as View, label: "Invoices", icon: CircleDollarSign },
    { id: "payments" as View, label: "Payments", icon: CheckCircle2 },
    { id: "campaigns" as View, label: "Campaigns", icon: Megaphone },
    { id: "sources" as View, label: "Lead Sources", icon: Globe },
    { id: "automation" as View, label: "Automations", icon: Zap },
    { id: "workflows" as View, label: "Workflows", icon: GitBranch },
    { id: "analytics" as View, label: "Analytics", icon: BarChart3 },
    { id: "search" as View, label: "Global Search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-950 p-5 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold tracking-tight">Mackdish CRM</p>
              <p className="text-xs text-slate-500">Phase 1 · Sales foundation</p>
            </div>
            <button className="lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close menu"><X className="size-5" /></button>
          </div>
          {creatableViews.includes(view) && <button onClick={() => openCreateForm(view)} className="mt-8 flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> {createLabels[view] ?? "Create"}</button>}
          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => { setView(item.id); setMobileNav(false); }} className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-medium transition ${view === item.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="size-4" />{item.label}</button>;
            })}
          </nav>
          <div className="absolute bottom-6 left-5 right-5 border-t border-slate-800 pt-5 text-xs text-slate-500">
            <div className="flex items-center justify-between gap-2">
              <span>Authenticated · Supabase CRM</span>
              <button onClick={() => void signOut()} className="text-slate-400 hover:text-white">Sign out</button>
            </div>
          </div>
        </aside>

        {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileNav(false)} />}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu className="size-5" /></button>
              <div>
                <p className="text-xs text-slate-500">Mackdish Solutions</p>
                <h1 className="text-sm font-semibold">{view === "overview" ? "CRM Overview" : nav.find((item) => item.id === view)?.label}</h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads..." className="w-44 bg-transparent outline-none placeholder:text-slate-600" /></div>
              {creatableViews.includes(view) && <button onClick={() => openCreateForm(view)} className="flex items-center gap-2 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="size-4" /> {createLabels[view] ?? "Create"}</button>}
              <button onClick={() => void signOut()} className="flex items-center gap-2 border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"><X className="size-4" /> Sign out</button>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {view === "overview" && (
              <Overview
                leads={leads}
                openLeads={openLeads}
                pipelineValue={pipelineValue}
                wonValue={wonValue}
                overdueTasks={overdueTasks}
                pendingTasks={pendingTasks}
                activities={activities}
                leadMap={leadMap}
                onView={setView}
                onToggleTask={toggleTask}
              />
            )}

            {view === "leads" && (
              <LeadsView leads={filteredLeads} onStageChange={updateStage} onAdd={() => openCreateForm("leads")} />
            )}

            {view === "pipeline" && (
              <PipelineView leads={leads} onStageChange={updateStage} />
            )}

            {view === "tasks" && (
              <TasksView tasks={tasks} leadMap={leadMap} onToggle={toggleTask} />
            )}

            {view === "activity" && (
              <ActivityView activities={activities} leadMap={leadMap} />
            )}
            {view === "accounts" && <AccountsView companies={companies} contacts={contacts} deals={deals} projects={projects} invoices={invoices} payments={payments} />}
            {view === "companies" && <CompaniesView companies={companies} contacts={contacts} deals={deals} />}
            {view === "contacts" && <ContactsView contacts={contacts} companies={companies} />}
            {view === "deals" && <DealsView deals={deals} companies={companies} />}
            {view === "inbox" && <InboxView messages={messages} companies={companies} contacts={contacts} onRead={async (id) => {
              try { if (supabase) await markCrmMessageRead(id); setMessages(current => current.map(m => m.id === id ? { ...m, read: true } : m)); } catch (error) { setCrmError(error instanceof Error ? error.message : "Unable to update message."); }
            }} />}
            {view === "projects" && <ProjectsView projects={projects} companies={companies} />}
            {view === "quotes" && <QuotesView quotes={quotes} companies={companies} />}
            {view === "invoices" && <InvoicesView invoices={invoices} companies={companies} />}
            {view === "payments" && <PaymentsView payments={payments} companies={companies} invoices={invoices} />}
            {view === "campaigns" && <CampaignsView campaigns={campaigns} />}
            {view === "sources" && <SourcesView leads={leads} campaigns={campaigns} />}
            {view === "automation" && <AutomationView automations={automations} setAutomations={setAutomations} />}
            {view === "workflows" && <WorkflowsView workflows={workflows} setWorkflows={setWorkflows} />}
            {view === "analytics" && <AnalyticsView leads={leads} deals={deals} invoices={invoices} payments={payments} campaigns={campaigns} tasks={tasks} activities={activities} />}
            {view === "search" && <GlobalSearchView leads={leads} companies={companies} contacts={contacts} deals={deals} projects={projects} quotes={quotes} invoices={invoices} />}
          </div>
        </main>
      </div>

      {createModule && createModule !== "leads" && (
        <CreateRecordModal
          module={createModule}
          companies={companies}
          contacts={contacts}
          deals={deals}
          leads={leads}
          invoices={invoices}
          projects={projects}
          onClose={() => setCreateModule(null)}
          onCreated={async () => {
            setCreateModule(null);
            try {
              const data = await loadCrmFromSupabase();
              if (data) {
                setLeads(data.leads); setTasks(data.tasks); setActivities(data.activities);
                setCompanies(data.companies); setContacts(data.contacts); setDeals(data.deals);
                setMessages(data.messages); setProjects(data.projects); setQuotes(data.quotes);
                setInvoices(data.invoices); setPayments(data.payments); setCampaigns(data.campaigns);
                setAutomations(data.automations); setWorkflows(data.workflows);
              }
            } catch (error) {
              setCrmError(error instanceof Error ? error.message : "Record was created, but the dashboard could not refresh.");
            }
          }}
        />
      )}

      {showLeadForm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/70 p-4">
          <div className="mx-auto mt-10 max-w-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl sm:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div><p className="text-xs font-bold uppercase text-primary">CRM</p><h2 className="mt-1 text-2xl font-bold">Create lead</h2><p className="mt-2 text-sm text-slate-400">Capture the minimum information needed to start a relationship.</p></div>
              <button onClick={() => setShowLeadForm(false)} aria-label="Close"><X className="size-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact name" value={newLead.name} onChange={(value) => setNewLead({ ...newLead, name: value })} />
              <Field label="Company" value={newLead.company} onChange={(value) => setNewLead({ ...newLead, company: value })} />
              <Field label="Phone / WhatsApp" value={newLead.phone} onChange={(value) => setNewLead({ ...newLead, phone: value })} />
              <Field label="Email" value={newLead.email} onChange={(value) => setNewLead({ ...newLead, email: value })} />
              <Field label="Estimated value (KES)" value={newLead.value} onChange={(value) => setNewLead({ ...newLead, value })} type="number" />
              <label className="grid gap-2 text-xs font-semibold text-slate-300">Lead source<select value={newLead.source} onChange={(event) => setNewLead({ ...newLead, source: event.target.value })} className="border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-normal text-slate-100 outline-none"><option>Website</option><option>WhatsApp</option><option>Meta Ads</option><option>LinkedIn</option><option>Google</option><option>TradeMall Ads</option><option>Referral</option><option>Email</option><option>Other</option></select></label>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <button onClick={() => setShowLeadForm(false)} className="border border-slate-700 px-5 py-3 text-sm font-semibold">Cancel</button>
              <button onClick={addLead} className="bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Create lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type CreateRecordModalProps = {
  module: View;
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  leads: Lead[];
  invoices: Invoice[];
  projects: Project[];
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function CreateRecordModal({ module, companies, contacts, deals, leads, invoices, projects, onClose, onCreated }: CreateRecordModalProps) {
  const [form, setForm] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const titleMap: Partial<Record<View,string>> = {
    companies:"Create company", contacts:"Create contact", deals:"Create deal", tasks:"Create task",
    activity:"Log activity", inbox:"Compose message", projects:"Create project", quotes:"Create quote",
    invoices:"Create invoice", payments:"Record payment", campaigns:"Create campaign",
    automation:"Create automation", workflows:"Create workflow",
  };
  const title = titleMap[module] ?? "Create record";
  const set = (key:string, value:string) => setForm(current => ({ ...current, [key]: value }));
  const value = (key:string) => form[key] ?? "";

  const input = (key:string,label:string,type="text",required=false,placeholder="") => (
    <Field label={label} value={value(key)} onChange={v=>set(key,v)} type={type} required={required} placeholder={placeholder} />
  );
  const select = (key:string,label:string,options:string[],required=false) => (
    <label className="grid gap-2 text-xs font-semibold text-slate-300">
      {label}
      <select required={required} value={value(key)} onChange={e=>set(key,e.target.value)} className="border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-normal text-slate-100 outline-none focus:border-primary">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option=><option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
  const relationSelect = (key:string,label:string,options:{id:string;label:string}[],required=false) => (
    <label className="grid gap-2 text-xs font-semibold text-slate-300">
      {label}
      <select required={required} value={value(key)} onChange={e=>set(key,e.target.value)} className="border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-normal text-slate-100 outline-none focus:border-primary">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  );

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) { setError("Supabase is not configured."); return; }
    setSaving(true); setError("");
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id ?? null;
      let table = "";
      let payload: Record<string, unknown> = {};

      if (module === "companies") {
        table="crm_companies";
        payload={name:value("name"),industry:value("industry"),phone:value("phone"),email:value("email"),website:value("website"),location:value("location"),status:value("status")||"Prospect",notes:value("notes"),created_by:userId};
      } else if (module === "contacts") {
        table="crm_contacts";
        payload={company_id:value("company_id")||null,name:value("name"),role:value("role"),phone:value("phone"),email:value("email"),preferred_channel:value("preferred_channel")||"WhatsApp",created_by:userId};
      } else if (module === "deals") {
        table="crm_deals";
        payload={company_id:value("company_id")||null,name:value("name"),value:Number(value("value"))||0,stage:value("stage")||"New",expected_close:value("expected_close")||null,service:value("service"),owner_id:userId};
      } else if (module === "tasks") {
        table="crm_tasks";
        payload={title:value("title"),description:value("description"),due_date:value("due_date")||null,lead_id:value("lead_id")||null,company_id:value("company_id")||null,deal_id:value("deal_id")||null,assigned_to:userId,created_by:userId};
      } else if (module === "activity") {
        table="crm_activities";
        payload={type:value("type")||"Note",title:value("title"),body:value("body"),lead_id:value("lead_id")||null,company_id:value("company_id")||null,contact_id:value("contact_id")||null,deal_id:value("deal_id")||null,created_by:userId};
      } else if (module === "inbox") {
        table="crm_messages";
        payload={company_id:value("company_id")||null,contact_id:value("contact_id")||null,channel:value("channel")||"WhatsApp",direction:value("direction")||"Outbound",subject:value("subject"),body:value("body"),created_by:userId};
      } else if (module === "projects") {
        table="crm_projects";
        payload={company_id:value("company_id")||null,deal_id:value("deal_id")||null,name:value("name"),service:value("service"),status:value("status")||"Not Started",start_date:value("start_date")||null,due_date:value("due_date")||null,progress:Number(value("progress"))||0,owner_id:userId};
      } else if (module === "quotes") {
        table="crm_quotes";
        payload={company_id:value("company_id")||null,deal_id:value("deal_id")||null,number:value("number"),title:value("title"),amount:Number(value("amount"))||0,status:value("status")||"Draft",valid_until:value("valid_until")||null};
      } else if (module === "invoices") {
        table="crm_invoices";
        payload={company_id:value("company_id")||null,project_id:value("project_id")||null,number:value("number"),amount:Number(value("amount"))||0,paid:Number(value("paid"))||0,status:value("status")||"Draft",due_date:value("due_date")||null};
      } else if (module === "payments") {
        table="crm_payments";
        payload={invoice_id:value("invoice_id"),company_id:value("company_id")||null,amount:Number(value("amount"))||0,method:value("method")||"M-Pesa",reference:value("reference"),date:value("date")||todayIso(),created_by:userId};
      } else if (module === "campaigns") {
        table="crm_campaigns";
        payload={name:value("name"),channel:value("channel")||"Meta Ads",status:value("status")||"Draft",budget:Number(value("budget"))||0,start_date:value("start_date")||null,end_date:value("end_date")||null,created_by:userId};
      } else if (module === "automation") {
        table="crm_automations";
        payload={name:value("name"),trigger:value("trigger")||"New Lead",action:value("action")||"Create Task",active:value("active")!=="false",runs:0,created_by:userId};
      } else if (module === "workflows") {
        table="crm_workflows";
        payload={name:value("name"),description:value("description"),active:true,created_by:userId};
      }

      if (!table) throw new Error("This module does not support creating records.");
      const { data, error: insertError } = await supabase.from(table).insert(payload).select().single();
      if (insertError) throw insertError;

      if (module === "workflows" && data) {
        const steps = value("steps").split("\n").map(step=>step.trim()).filter(Boolean);
        if (steps.length) {
          const { error: stepError } = await supabase.from("crm_workflow_steps").insert(
            steps.map((step, index)=>({workflow_id:data.id,position:index+1,title:step}))
          );
          if (stepError) throw stepError;
        }
      }

      await onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save record.");
    } finally {
      setSaving(false);
    }
  };

  const companyOptions=companies.map(c=>({id:c.id,label:c.name}));
  const contactOptions=contacts.map(c=>({id:c.id,label:c.name}));
  const dealOptions=deals.map(d=>({id:d.id,label:d.name}));
  const leadOptions=leads.map(l=>({id:l.id,label:`${l.name} · ${l.company}`}));
  const invoiceOptions=invoices.map(i=>({id:i.id,label:i.number}));
  const projectOptions=projects.map(p=>({id:p.id,label:p.name}));

  return <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4">
    <div className="mx-auto mt-8 max-w-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl sm:p-8">
      <div className="mb-7 flex items-start justify-between">
        <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Mackdish CRM</p><h2 className="mt-2 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm text-slate-400">Enter the information for this module. The record will be saved to the CRM database.</p></div>
        <button onClick={onClose} aria-label="Close"><X className="size-5"/></button>
      </div>
      <form onSubmit={save}>
        <div className="grid gap-4 sm:grid-cols-2">
          {module==="companies" && <>
            {input("name","Company name","text",true)}{input("industry","Industry")}{input("phone","Phone / WhatsApp")}{input("email","Email","email")}{input("website","Website","url")}{input("location","Location")}{select("status","Status",["Prospect","Active","Inactive"])}{input("notes","Notes")}
          </>}
          {module==="contacts" && <>
            {relationSelect("company_id","Company",companyOptions,true)}{input("name","Contact name","text",true)}{input("role","Role")}{input("phone","Phone / WhatsApp")}{input("email","Email","email")}{select("preferred_channel","Preferred channel",["WhatsApp","Email","SMS","Call"])}
          </>}
          {module==="deals" && <>
            {relationSelect("company_id","Company",companyOptions)}{input("name","Deal name","text",true)}{input("value","Deal value (KES)","number",true)}{select("stage","Stage",stages)}{input("expected_close","Expected close","date")}{input("service","Service")}
          </>}
          {module==="tasks" && <>
            {input("title","Task title","text",true)}{input("description","Description")}{input("due_date","Due date","datetime-local")}{relationSelect("lead_id","Lead",leadOptions)}{relationSelect("company_id","Company",companyOptions)}{relationSelect("deal_id","Deal",dealOptions)}
          </>}
          {module==="activity" && <>
            {select("type","Activity type",["Lead created","Call","WhatsApp","Email","Meeting","Note","Proposal"],true)}{input("title","Activity title","text",true)}{relationSelect("lead_id","Lead",leadOptions)}{relationSelect("company_id","Company",companyOptions)}{relationSelect("contact_id","Contact",contactOptions)}{relationSelect("deal_id","Deal",dealOptions)}{input("body","Notes")}
          </>}
          {module==="inbox" && <>
            {relationSelect("company_id","Company",companyOptions)}{relationSelect("contact_id","Contact",contactOptions)}{select("channel","Channel",["WhatsApp","Email","SMS","Call"],true)}{select("direction","Direction",["Inbound","Outbound"],true)}{input("subject","Subject")}{input("body","Message","text",true)}
          </>}
          {module==="projects" && <>
            {relationSelect("company_id","Company",companyOptions)}{relationSelect("deal_id","Deal",dealOptions)}{input("name","Project name","text",true)}{input("service","Service")}{select("status","Status",["Not Started","In Progress","Review","Completed"])}{input("start_date","Start date","date")}{input("due_date","Due date","date")}{input("progress","Progress (%)","number")}
          </>}
          {module==="quotes" && <>
            {relationSelect("company_id","Company",companyOptions)}{relationSelect("deal_id","Deal",dealOptions)}{input("number","Quote number","text",true)}{input("title","Title","text",true)}{input("amount","Amount (KES)","number",true)}{select("status","Status",["Draft","Sent","Accepted","Declined"])}{input("valid_until","Valid until","date")}
          </>}
          {module==="invoices" && <>
            {relationSelect("company_id","Company",companyOptions)}{relationSelect("project_id","Project",projectOptions)}{input("number","Invoice number","text",true)}{input("amount","Amount (KES)","number",true)}{input("paid","Paid amount (KES)","number")}{select("status","Status",["Draft","Sent","Part Paid","Paid","Overdue"])}{input("due_date","Due date","date")}
          </>}
          {module==="payments" && <>
            {relationSelect("invoice_id","Invoice",invoiceOptions,true)}{relationSelect("company_id","Company",companyOptions)}{input("amount","Amount (KES)","number",true)}{select("method","Payment method",["M-Pesa","Bank","Cash","Card","Other"],true)}{input("reference","Reference")}{input("date","Payment date","date")}
          </>}
          {module==="campaigns" && <>
            {input("name","Campaign name","text",true)}{select("channel","Channel",["Meta Ads","TradeMall Ads","Google Ads","Email","Organic","Referral"])}{select("status","Status",["Draft","Active","Paused","Completed"])}{input("budget","Budget (KES)","number")}{input("start_date","Start date","date")}{input("end_date","End date","date")}
          </>}
          {module==="automation" && <>
            {input("name","Automation name","text",true)}{select("trigger","Trigger",["New Lead","Status Changed","Quote Sent","Invoice Overdue","Payment Received","Task Due"])}{select("action","Action",["Create Task","Send WhatsApp","Send Email","Assign Lead","Create Activity"])}{select("active","Status",["true","false"])}
          </>}
          {module==="workflows" && <>
            {input("name","Workflow name","text",true)}{input("description","Description")}{input("steps","Steps (one per line)")}
          </>}
        </div>
        {error&&<div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-300">{error}</div>}
        <div className="mt-7 flex justify-end gap-3 border-t border-slate-800 pt-5">
          <button type="button" onClick={onClose} className="border border-slate-700 px-5 py-3 text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving?"Saving...":"Save record"}</button>
        </div>
      </form>
    </div>
  </div>;
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="grid gap-2 text-xs font-semibold text-slate-300">{label}<input required={required} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-normal text-slate-100 outline-none placeholder:text-slate-600 focus:border-primary" /></label>;
}

function Overview({ leads, openLeads, pipelineValue, wonValue, overdueTasks, pendingTasks, activities, leadMap, onView, onToggleTask }: { leads: Lead[]; openLeads: Lead[]; pipelineValue: number; wonValue: number; overdueTasks: Task[]; pendingTasks: Task[]; activities: CRMActivity[]; leadMap: Record<string, Lead>; onView: (view: View) => void; onToggleTask: (id: string) => void }) {
  const cards = [
    { label: "Open leads", value: openLeads.length, detail: `${leads.length} total records`, icon: Users },
    { label: "Pipeline value", value: money(pipelineValue), detail: "Open opportunities", icon: Target },
    { label: "Won value", value: money(wonValue), detail: "Closed won", icon: CircleDollarSign },
    { label: "Follow-ups", value: pendingTasks.length, detail: `${overdueTasks.length} overdue`, icon: Clock3 },
  ];
  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Today</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Know what needs attention.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Phase 1 puts leads, pipeline, activities and follow-ups in one operational view.</p></div><span className="text-xs text-slate-500">Local CRM · ready for backend in Phase 2</span></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => { const Icon = card.icon; return <button key={card.label} onClick={() => onView(card.label === "Follow-ups" ? "tasks" : card.label === "Pipeline value" || card.label === "Won value" ? "pipeline" : "leads")} className="border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-600"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{card.label}</span><Icon className="size-4 text-primary" /></div><p className="mt-4 text-2xl font-bold">{card.value}</p><p className="mt-1 text-xs text-slate-500">{card.detail}</p></button>; })}
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <section className="border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-5"><div><h3 className="font-semibold">Pipeline</h3><p className="mt-1 text-xs text-slate-500">Open value by stage</p></div><button onClick={() => onView("pipeline")} className="text-xs font-semibold text-primary">View pipeline <ArrowRight className="ml-1 inline size-3" /></button></div>
        <div className="grid gap-3 p-5 sm:grid-cols-5">{stages.map((stage) => { const items = leads.filter((lead) => lead.status === stage); return <div key={stage} className="rounded-sm bg-slate-950 p-3"><p className="text-[11px] font-semibold uppercase text-slate-500">{stage}</p><p className="mt-3 text-xl font-bold">{items.length}</p><p className="mt-1 text-xs text-slate-500">{money(items.reduce((sum, lead) => sum + lead.value, 0))}</p></div>; })}</div>
      </section>
      <section className="border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-5"><div><h3 className="font-semibold">Needs attention</h3><p className="mt-1 text-xs text-slate-500">Tasks that can move revenue forward</p></div><button onClick={() => onView("tasks")} className="text-xs font-semibold text-primary">All tasks</button></div>
        <div className="divide-y divide-slate-800">{pendingTasks.slice(0, 4).map((task) => <button key={task.id} onClick={() => onToggleTask(task.id)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-white/[0.03]"><span className={`mt-0.5 size-4 rounded-full border ${task.priority === "High" ? "border-red-400" : "border-slate-600"}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{task.title}</span><span className="mt-1 block text-xs text-slate-500">{task.due} · {task.priority} priority</span></span></button>)}</div>
        {pendingTasks.length === 0 && <p className="p-5 text-sm text-slate-500">No pending tasks.</p>}
      </section>
    </div>
    <section className="border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 p-5"><div><h3 className="font-semibold">Recent activity</h3><p className="mt-1 text-xs text-slate-500">Latest customer and pipeline events</p></div><button onClick={() => onView("activity")} className="text-xs font-semibold text-primary">Activity log</button></div>
      <div className="divide-y divide-slate-800">{activities.slice(0, 5).map((item) => <div key={item.id} className="flex gap-4 p-4"><div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Activity className="size-4" /></div><div><p className="text-sm"><span className="font-semibold">{leadMap[item.leadId]?.company ?? "Lead"}</span> · {item.note}</p><p className="mt-1 text-xs text-slate-500">{item.type} · {item.createdAt}</p></div></div>)}</div>
    </section>
  </div>;
}

function LeadsView({ leads, onStageChange, onAdd }: { leads: Lead[]; onStageChange: (id: string, status: LeadStatus) => void; onAdd: () => void }) {
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">CRM</p><h2 className="mt-2 text-3xl font-bold">Leads</h2><p className="mt-2 text-sm text-slate-400">One list for every prospect and active opportunity.</p></div><button onClick={onAdd} className="flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Add lead</button></div><div className="overflow-hidden border border-slate-800 bg-slate-900"><div className="grid grid-cols-[1.4fr_1fr_120px_130px_120px] gap-4 border-b border-slate-800 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500"><span>Lead</span><span>Source</span><span>Stage</span><span>Value</span><span>Follow-up</span></div>{leads.map((lead) => <div key={lead.id} className="grid grid-cols-[1.4fr_1fr_120px_130px_120px] items-center gap-4 border-b border-slate-800 px-5 py-4 last:border-0"><div><p className="text-sm font-semibold">{lead.company}</p><p className="mt-1 text-xs text-slate-500">{lead.name} · {lead.phone}</p></div><span className="text-xs text-slate-400">{lead.source}</span><select value={lead.status} onChange={(event) => onStageChange(lead.id, event.target.value as LeadStatus)} className="border border-slate-800 bg-slate-950 px-2 py-2 text-xs outline-none"><option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal</option><option>Won</option><option>Lost</option></select><span className="text-sm font-semibold">{money(lead.value)}</span><span className="text-xs text-slate-500">{lead.nextFollowUp}</span></div>)}{leads.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No leads match your search.</p>}</div></div>;
}

function PipelineView({ leads, onStageChange }: { leads: Lead[]; onStageChange: (id: string, status: LeadStatus) => void }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Sales</p><h2 className="mt-2 text-3xl font-bold">Pipeline</h2><p className="mt-2 text-sm text-slate-400">Move opportunities through the sales process as conversations progress.</p></div><div className="grid gap-4 overflow-x-auto pb-4 lg:grid-cols-5">{stages.map((stage) => { const items = leads.filter((lead) => lead.status === stage); return <div key={stage} className="min-w-[260px] border border-slate-800 bg-slate-900"><div className="border-b border-slate-800 p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{stage}</h3><span className="text-xs text-slate-500">{items.length}</span></div><p className="mt-1 text-xs text-slate-500">{money(items.reduce((sum, lead) => sum + lead.value, 0))}</p></div><div className="space-y-3 p-3">{items.map((lead) => <article key={lead.id} className="border border-slate-800 bg-slate-950 p-4"><p className="text-sm font-semibold">{lead.company}</p><p className="mt-1 text-xs text-slate-500">{lead.name}</p><p className="mt-4 text-sm font-bold">{money(lead.value)}</p><div className="mt-4 flex items-center gap-2"><Phone className="size-3 text-slate-500" /><span className="text-xs text-slate-500">{lead.phone}</span></div><label className="mt-4 grid gap-1 text-[10px] font-bold uppercase text-slate-600">Move to<select value={lead.status} onChange={(event) => onStageChange(lead.id, event.target.value as LeadStatus)} className="border border-slate-800 bg-slate-900 px-2 py-2 text-xs font-normal normal-case text-slate-300"><option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal</option><option>Won</option><option>Lost</option></select></label></article>)}</div></div>; })}</div></div>;
}

function TasksView({ tasks, leadMap, onToggle }: { tasks: Task[]; leadMap: Record<string, Lead>; onToggle: (id: string) => void }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Work queue</p><h2 className="mt-2 text-3xl font-bold">Tasks & follow-ups</h2><p className="mt-2 text-sm text-slate-400">Keep every opportunity attached to a next action.</p></div><div className="border border-slate-800 bg-slate-900 divide-y divide-slate-800">{tasks.map((task) => <div key={task.id} className="flex items-center gap-4 p-5"><button onClick={() => onToggle(task.id)} className={`grid size-6 shrink-0 place-items-center rounded-full border ${task.done ? "border-primary bg-primary text-primary-foreground" : "border-slate-600"}`} aria-label={task.done ? "Mark task open" : "Mark task complete"}>{task.done && <Check className="size-3" />}</button><div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${task.done ? "text-slate-500 line-through" : ""}`}>{task.title}</p><p className="mt-1 text-xs text-slate-500">{task.leadId ? leadMap[task.leadId]?.company : "General"} · due {task.due}</p></div><span className={`text-xs font-semibold ${task.priority === "High" ? "text-red-400" : task.priority === "Medium" ? "text-amber-400" : "text-slate-500"}`}>{task.priority}</span></div>)}</div></div>;
}

function GlobalSearchView({ leads, companies, contacts, deals, projects, quotes, invoices }: { leads: Lead[]; companies: Company[]; contacts: Contact[]; deals: Deal[]; projects: Project[]; quotes: Quote[]; invoices: Invoice[] }) {
 const [q,setQ]=useState("");
 const term=q.trim().toLowerCase();
 const groups=[
  {label:"Leads",rows:leads.filter(x=>[x.name,x.company,x.email,x.phone,x.status].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.name,meta:x.company+" · "+x.status}))},
  {label:"Companies",rows:companies.filter(x=>[x.name,x.industry,x.phone,x.email].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.name,meta:x.industry+" · "+x.status}))},
  {label:"Contacts",rows:contacts.filter(x=>[x.name,x.role,x.phone,x.email].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.name,meta:x.role+" · "+x.phone}))},
  {label:"Deals",rows:deals.filter(x=>[x.name,x.service,x.stage].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.name,meta:x.service+" · "+money(x.value)}))},
  {label:"Projects",rows:projects.filter(x=>[x.name,x.service,x.status].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.name,meta:x.service+" · "+x.status}))},
  {label:"Quotes",rows:quotes.filter(x=>[x.number,x.title,x.status].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.number+" · "+x.title,meta:money(x.amount)+" · "+x.status}))},
  {label:"Invoices",rows:invoices.filter(x=>[x.number,x.status,x.dueDate].some(v=>String(v||"").toLowerCase().includes(term))).map(x=>({id:x.id,title:x.number,meta:money(x.amount)+" · "+x.status}))},
 ];
 const total=groups.reduce((s,g)=>s+g.rows.length,0);
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Navigation</p><h2 className="mt-2 text-3xl font-bold">Global Search</h2><p className="mt-2 text-sm text-slate-400">Search customers, leads, deals and financial records from one place.</p></div><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600"/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, company, phone, email, deal, invoice..." className="w-full border border-slate-800 bg-slate-900 py-4 pl-12 pr-4 text-sm outline-none focus:border-primary"/></div>{q&&<p className="text-xs text-slate-500">{total} matching records</p>}{!q?<div className="border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-500">Start typing to search across the CRM.</div>:<div className="space-y-4">{groups.filter(g=>g.rows.length).map(g=><section key={g.label} className="border border-slate-800 bg-slate-900"><div className="border-b border-slate-800 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">{g.label}</div>{g.rows.slice(0,8).map(row=><div key={row.id} className="flex items-center justify-between gap-4 border-b border-slate-800 p-4 last:border-0"><div><p className="text-sm font-semibold">{row.title}</p><p className="mt-1 text-xs text-slate-500">{row.meta}</p></div><ArrowRight className="h-4 w-4 text-slate-700"/></div>)}</section>)}</div>}</div>;
}

function AnalyticsView({ leads, deals, invoices, payments, campaigns, tasks, activities }: { leads: Lead[]; deals: Deal[]; invoices: Invoice[]; payments: Payment[]; campaigns: Campaign[]; tasks: Task[]; activities: CRMActivity[] }) {
 const won=deals.filter(d=>d.stage==="Won"), lost=deals.filter(d=>d.stage==="Lost"), open=deals.filter(d=>d.stage!=="Won"&&d.stage!=="Lost");
 const pipeline=open.reduce((s,d)=>s+d.value,0), wonValue=won.reduce((s,d)=>s+d.value,0), billed=invoices.reduce((s,i)=>s+i.amount,0), collected=payments.reduce((s,p)=>s+p.amount,0), outstanding=billed-collected;
 const conversion=deals.length?Math.round(won.length/deals.length*100):0;
 const qualified=leads.filter(l=>["Qualified","Proposal","Won"].includes(l.status)).length;
 const completion=tasks.length?Math.round(tasks.filter(t=>t.done).length/tasks.length*100):0;
 const roi=campaigns.reduce((s,c)=>s+c.budget,0)>0?Math.round(campaigns.reduce((s,c)=>s+c.revenue,0)/campaigns.reduce((s,c)=>s+c.budget,0)*100):0;
 const stage=[["New",leads.filter(l=>l.status==="New").length],["Contacted",leads.filter(l=>l.status==="Contacted").length],["Qualified",leads.filter(l=>l.status==="Qualified").length],["Proposal",leads.filter(l=>l.status==="Proposal").length],["Won",leads.filter(l=>l.status==="Won").length],["Lost",leads.filter(l=>l.status==="Lost").length]];
 const max=Math.max(1,...stage.map(x=>Number(x[1])));
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Management intelligence</p><h2 className="mt-2 text-3xl font-bold">Analytics</h2><p className="mt-2 text-sm text-slate-400">A single operating view of sales, delivery, collections and marketing performance.</p></div>
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Won revenue",money(wonValue)],["Open pipeline",money(pipeline)],["Collected",money(collected)],["Outstanding",money(outstanding)]].map(([l,v])=><div key={String(l)} className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">{l}</p><p className="mt-2 text-2xl font-bold">{v}</p></div>)}</div>
 <div className="grid gap-4 xl:grid-cols-3"><div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Pipeline conversion</h3><p className="mt-2 text-3xl font-bold">{conversion}%</p><p className="mt-1 text-xs text-slate-500">{won.length} won of {deals.length} deals</p></div><div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Qualified lead rate</h3><p className="mt-2 text-3xl font-bold">{leads.length?Math.round(qualified/leads.length*100):0}%</p><p className="mt-1 text-xs text-slate-500">{qualified} of {leads.length} leads reached qualified stage or beyond</p></div><div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Marketing return</h3><p className="mt-2 text-3xl font-bold">{roi}%</p><p className="mt-1 text-xs text-slate-500">Revenue / tracked campaign spend</p></div></div>
 <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]"><div className="border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">Lead funnel</h3><span className="text-xs text-slate-500">{leads.length} total</span></div><div className="mt-6 space-y-4">{stage.map(([label,value])=><div key={String(label)}><div className="mb-2 flex justify-between text-xs"><span>{label}</span><span className="text-slate-500">{value}</span></div><div className="h-2 bg-slate-800"><div className="h-2 bg-primary" style={{width:(Number(value)/max*100)+"%"}} /></div></div>)}</div></div>
 <div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Operations</h3><div className="mt-5 space-y-4"><div className="flex justify-between"><span className="text-sm text-slate-400">Tasks completed</span><span className="font-semibold">{completion}%</span></div><div className="flex justify-between"><span className="text-sm text-slate-400">Activities logged</span><span className="font-semibold">{activities.length}</span></div><div className="flex justify-between"><span className="text-sm text-slate-400">Won deals</span><span className="font-semibold">{won.length}</span></div><div className="flex justify-between"><span className="text-sm text-slate-400">Lost deals</span><span className="font-semibold">{lost.length}</span></div><div className="flex justify-between"><span className="text-sm text-slate-400">Campaigns active</span><span className="font-semibold">{campaigns.filter(c=>c.status==="Active").length}</span></div></div></div></div>
 <div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Attention queue</h3><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="bg-slate-950 p-4"><p className="text-xs text-slate-500">Open pipeline</p><p className="mt-1 text-sm font-semibold">{open.length} deals · {money(pipeline)}</p></div><div className="bg-slate-950 p-4"><p className="text-xs text-slate-500">Uncollected</p><p className="mt-1 text-sm font-semibold">{money(outstanding)}</p></div><div className="bg-slate-950 p-4"><p className="text-xs text-slate-500">Open tasks</p><p className="mt-1 text-sm font-semibold">{tasks.filter(t=>!t.done).length}</p></div></div></div></div>;
}

function AutomationView({ automations, setAutomations }: { automations: Automation[]; setAutomations: React.Dispatch<React.SetStateAction<Automation[]>> }) {
 const toggle=async(id:string)=>{
   const current=automations.find(x=>x.id===id);
   if(!current) return;
   const active=!current.active;
   try { if(supabase) await updateCrmAutomation(id,active); setAutomations(xs=>xs.map(x=>x.id===id?{...x,active}:x)); }
   catch(error){ console.error(error); }
 };
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Operations</p><h2 className="mt-2 text-3xl font-bold">Automations</h2><p className="mt-2 text-sm text-slate-400">Turn repetitive CRM events into consistent follow-up actions.</p></div><div className="grid gap-4">{automations.map(a=><article key={a.id} className="border border-slate-800 bg-slate-900 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold">{a.name}</h3><p className="mt-2 text-xs text-slate-500">When <span className="text-slate-300">{a.trigger}</span> → <span className="text-slate-300">{a.action}</span></p></div><button onClick={()=>toggle(a.id)} className={`border px-4 py-2 text-xs font-semibold ${a.active?"border-primary text-primary":"border-slate-700 text-slate-500"}`}>{a.active?"Active":"Paused"}</button></div><div className="mt-4 text-xs text-slate-600">Executed {a.runs} times</div></article>)}</div><div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Recommended rules</h3><p className="mt-2 text-sm text-slate-400">New lead → follow-up task, proposal sent → reminder, overdue invoice → collection task, payment received → customer activity.</p></div></div>;
}
function WorkflowsView({ workflows, setWorkflows }: { workflows: Workflow[]; setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>> }) {
 const toggle=async(id:string)=>{
   const current=workflows.find(x=>x.id===id);
   if(!current) return;
   const active=!current.active;
   try { if(supabase) await updateCrmWorkflow(id,active); setWorkflows(xs=>xs.map(x=>x.id===id?{...x,active}:x)); }
   catch(error){ console.error(error); }
 };
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Process</p><h2 className="mt-2 text-3xl font-bold">Workflows</h2><p className="mt-2 text-sm text-slate-400">Reusable processes for sales, onboarding and collections.</p></div><div className="grid gap-4 xl:grid-cols-3">{workflows.map(w=><article key={w.id} className="border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{w.name}</h3><button onClick={()=>toggle(w.id)} className="text-xs text-primary">{w.active?"On":"Off"}</button></div><p className="mt-2 text-sm text-slate-500">{w.description}</p><ol className="mt-5 space-y-3">{w.steps.map((step,i)=><li key={step} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">{i+1}</span><span>{step}</span></li>)}</ol></article>)}</div></div>;
}

function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
 const totalLeads=campaigns.reduce((s,c)=>s+c.leads,0), totalQualified=campaigns.reduce((s,c)=>s+c.qualified,0), totalRevenue=campaigns.reduce((s,c)=>s+c.revenue,0), totalBudget=campaigns.reduce((s,c)=>s+c.budget,0);
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Marketing CRM</p><h2 className="mt-2 text-3xl font-bold">Campaigns</h2><p className="mt-2 text-sm text-slate-400">Connect campaign activity to qualified pipeline and revenue.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Leads",totalLeads],["Qualified",totalQualified],["Revenue",money(totalRevenue)],["Tracked spend",money(totalBudget)]].map(([l,v])=><div key={String(l)} className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">{l}</p><p className="mt-2 text-2xl font-bold">{v}</p></div>)}</div><div className="overflow-hidden border border-slate-800 bg-slate-900">{campaigns.map(c=><div key={c.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 md:grid-cols-[1.6fr_120px_90px_90px_120px_120px] md:items-center"><div><p className="font-semibold">{c.name}</p><p className="mt-1 text-xs text-slate-500">{c.channel} · {c.startDate} to {c.endDate}</p></div><span className="text-xs text-primary">{c.status}</span><span className="text-sm">{c.leads} leads</span><span className="text-sm">{c.qualified} qualified</span><span className="font-semibold">{money(c.revenue)}</span><span className="text-xs text-slate-500">Spend {money(c.budget)}</span></div>)}</div></div>;
}
function SourcesView({ leads, campaigns }: { leads: Lead[]; campaigns: Campaign[] }) {
 const sources: LeadSource[]=["Meta Ads","TradeMall Ads","Website","Google","WhatsApp","Referral","Email","LinkedIn","Other"];
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Attribution</p><h2 className="mt-2 text-3xl font-bold">Lead Sources</h2><p className="mt-2 text-sm text-slate-400">Preserve acquisition context so leads can be connected to campaign and revenue outcomes.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{sources.map(source=>{const rows=leads.filter(l=>l.source===source);const won=rows.filter(l=>l.status==="Won").length;return <div key={source} className="border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">{source}</h3><span className="text-xs text-slate-500">{rows.length} leads</span></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Qualified</p><p className="mt-1 text-lg font-bold">{rows.filter(l=>l.status==="Qualified"||l.status==="Proposal"||l.status==="Won").length}</p></div><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Won</p><p className="mt-1 text-lg font-bold">{won}</p></div></div></div>})}</div><div className="border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Attribution rules</h3><ul className="mt-3 space-y-2 text-sm text-slate-400"><li>• Keep original source stable once captured.</li><li>• Store campaign separately from source.</li><li>• Connect campaign, lead, deal and closed revenue before judging campaign performance.</li></ul></div></div>;
}

function ProjectsView({ projects, companies }: { projects: Project[]; companies: Company[] }) {
 const cm=Object.fromEntries(companies.map(c=>[c.id,c.name]));
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Delivery</p><h2 className="mt-2 text-3xl font-bold">Projects</h2><p className="mt-2 text-sm text-slate-400">Turn won deals into tracked client delivery.</p></div><div className="grid gap-4 xl:grid-cols-2">{projects.map(p=><article key={p.id} className="border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between gap-4"><div><h3 className="font-semibold">{p.name}</h3><p className="mt-1 text-xs text-slate-500">{cm[p.companyId]} · {p.service}</p></div><span className="text-xs font-semibold text-primary">{p.status}</span></div><div className="mt-5 h-2 bg-slate-800"><div className="h-2 bg-primary" style={{width: p.progress+"%"}} /></div><div className="mt-3 flex justify-between text-xs text-slate-500"><span>{p.progress}% complete</span><span>Due {p.dueDate}</span></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Owner</p><p className="mt-1 text-sm">{p.owner}</p></div><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Started</p><p className="mt-1 text-sm">{p.startDate}</p></div></div></article>)}</div></div>;
}
function QuotesView({ quotes, companies }: { quotes: Quote[]; companies: Company[] }) {
 const cm=Object.fromEntries(companies.map(c=>[c.id,c.name]));
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Sales documents</p><h2 className="mt-2 text-3xl font-bold">Quotes & Proposals</h2><p className="mt-2 text-sm text-slate-400">Track commercial documents from draft to acceptance.</p></div><div className="overflow-hidden border border-slate-800 bg-slate-900">{quotes.map(q=><div key={q.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 md:grid-cols-[110px_1.5fr_130px_110px_130px] md:items-center"><span className="text-xs font-semibold text-primary">{q.number}</span><div><p className="text-sm font-semibold">{q.title}</p><p className="mt-1 text-xs text-slate-500">{cm[q.companyId]}</p></div><span className="font-semibold">{money(q.amount)}</span><span className="text-xs text-slate-400">{q.status}</span><span className="text-xs text-slate-500">Valid {q.validUntil}</span></div>)}</div></div>;
}
function InvoicesView({ invoices, companies }: { invoices: Invoice[]; companies: Company[] }) {
 const cm=Object.fromEntries(companies.map(c=>[c.id,c.name]));
 const outstanding=invoices.reduce((s,i)=>s+i.amount-i.paid,0);
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Finance</p><h2 className="mt-2 text-3xl font-bold">Invoices</h2><p className="mt-2 text-sm text-slate-400">Track billed value, collections and outstanding balances.</p></div><div className="grid gap-4 sm:grid-cols-3"><div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Billed</p><p className="mt-2 text-2xl font-bold">{money(invoices.reduce((s,i)=>s+i.amount,0))}</p></div><div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Collected</p><p className="mt-2 text-2xl font-bold">{money(invoices.reduce((s,i)=>s+i.paid,0))}</p></div><div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Outstanding</p><p className="mt-2 text-2xl font-bold">{money(outstanding)}</p></div></div><div className="overflow-hidden border border-slate-800 bg-slate-900">{invoices.map(i=><div key={i.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 md:grid-cols-[130px_1fr_120px_120px_120px] md:items-center"><span className="text-xs font-semibold text-primary">{i.number}</span><span className="text-sm">{cm[i.companyId]}</span><span className="font-semibold">{money(i.amount)}</span><span className="text-xs text-slate-400">{i.status}</span><span className="text-xs text-slate-500">Due {i.dueDate}</span></div>)}</div></div>;
}
function PaymentsView({ payments, companies, invoices }: { payments: Payment[]; companies: Company[]; invoices: Invoice[] }) {
 const cm=Object.fromEntries(companies.map(c=>[c.id,c.name]));
 const im=Object.fromEntries(invoices.map(i=>[i.id,i.number]));
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Collections</p><h2 className="mt-2 text-3xl font-bold">Payments</h2><p className="mt-2 text-sm text-slate-400">Every payment tied back to the customer and invoice.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Total collected</p><p className="mt-2 text-2xl font-bold">{money(payments.reduce((s,p)=>s+p.amount,0))}</p></div><div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Transactions</p><p className="mt-2 text-2xl font-bold">{payments.length}</p></div></div><div className="overflow-hidden border border-slate-800 bg-slate-900">{payments.map(p=><div key={p.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 md:grid-cols-[1fr_130px_120px_130px_130px] md:items-center"><div><p className="text-sm font-semibold">{cm[p.companyId]}</p><p className="mt-1 text-xs text-slate-500">{im[p.invoiceId]} · {p.reference}</p></div><span className="font-semibold">{money(p.amount)}</span><span className="text-xs text-primary">{p.method}</span><span className="text-xs text-slate-500">{p.date}</span><span className="text-xs text-slate-500">{p.reference}</span></div>)}</div></div>;
}

function InboxView({ messages, companies, contacts, onRead }: { messages: Message[]; companies: Company[]; contacts: Contact[]; onRead: (id: string) => void }) {
  const companyMap=Object.fromEntries(companies.map(c=>[c.id,c.name]));
  const contactMap=Object.fromEntries(contacts.map(c=>[c.id,c.name]));
  const unread=messages.filter(m=>!m.read).length;
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Communication</p><h2 className="mt-2 text-3xl font-bold">Inbox</h2><p className="mt-2 text-sm text-slate-400">One timeline for customer conversations across WhatsApp, email, SMS and calls.</p></div><span className="border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">{unread} unread</span></div><div className="border border-slate-800 bg-slate-900 divide-y divide-slate-800">{messages.map(message=><button key={message.id} onClick={()=>onRead(message.id)} className={`flex w-full gap-4 p-5 text-left hover:bg-white/[0.03] ${!message.read ? "bg-primary/[0.04]" : ""}`}><div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">{message.channel === "WhatsApp" ? "WA" : message.channel.slice(0,2)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{companyMap[message.companyId] ?? "Customer"}</p><span className="text-xs text-slate-600">·</span><span className="text-xs text-slate-500">{contactMap[message.contactId] ?? "Contact"}</span><span className="text-xs text-primary">{message.channel}</span></div><p className="mt-2 text-sm font-medium">{message.subject}</p><p className="mt-1 truncate text-xs text-slate-500">{message.body}</p><p className="mt-2 text-[11px] text-slate-600">{message.direction} · {message.createdAt}</p></div>{!message.read && <span className="mt-2 size-2 rounded-full bg-primary" />}</button>)}</div></div>;
}

function CompaniesView({ companies, contacts, deals }: { companies: Company[]; contacts: Contact[]; deals: Deal[] }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Accounts</p><h2 className="mt-2 text-3xl font-bold">Companies</h2><p className="mt-2 text-sm text-slate-400">A customer and prospect directory connected to contacts and deals.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{companies.map((company) => { const people=contacts.filter(c=>c.companyId===company.id).length; const value=deals.filter(d=>d.companyId===company.id).reduce((s,d)=>s+d.value,0); return <article key={company.id} className="border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{company.name}</h3><p className="mt-1 text-xs text-slate-500">{company.industry} · {company.location}</p></div><span className="text-[10px] font-bold uppercase text-primary">{company.status}</span></div><p className="mt-5 text-sm text-slate-400">{company.notes}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Contacts</p><p className="mt-1 font-semibold">{people}</p></div><div className="bg-slate-950 p-3"><p className="text-[10px] uppercase text-slate-600">Deal value</p><p className="mt-1 font-semibold">{money(value)}</p></div></div></article>; })}</div></div>;
}

function ContactsView({ contacts, companies }: { contacts: Contact[]; companies: Company[] }) {
  const companyMap=Object.fromEntries(companies.map(c=>[c.id,c.name]));
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">People</p><h2 className="mt-2 text-3xl font-bold">Contacts</h2><p className="mt-2 text-sm text-slate-400">Decision makers and customer contacts linked to their companies.</p></div><div className="overflow-hidden border border-slate-800 bg-slate-900">{contacts.map(contact=><div key={contact.id} className="grid gap-3 border-b border-slate-800 p-5 last:border-0 sm:grid-cols-[1.4fr_1fr_1fr_120px] sm:items-center"><div><p className="text-sm font-semibold">{contact.name}</p><p className="mt-1 text-xs text-slate-500">{contact.role} · {companyMap[contact.companyId] ?? "Unlinked"}</p></div><span className="text-xs text-slate-400">{contact.phone}</span><span className="text-xs text-slate-400">{contact.email}</span><span className="text-xs font-semibold text-primary">{contact.preferredChannel}</span></div>)}</div></div>;
}

function DealsView({ deals, companies }: { deals: Deal[]; companies: Company[] }) {
  const companyMap=Object.fromEntries(companies.map(c=>[c.id,c.name]));
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Revenue</p><h2 className="mt-2 text-3xl font-bold">Deals</h2><p className="mt-2 text-sm text-slate-400">Every commercial opportunity with value, service and expected close date.</p></div><div className="overflow-hidden border border-slate-800 bg-slate-900">{deals.map(deal=><div key={deal.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 md:grid-cols-[1.5fr_1fr_130px_130px_120px] md:items-center"><div><p className="text-sm font-semibold">{deal.name}</p><p className="mt-1 text-xs text-slate-500">{companyMap[deal.companyId] ?? "Unlinked"} · {deal.service}</p></div><span className="text-sm font-bold">{money(deal.value)}</span><span className="text-xs text-slate-400">{deal.stage}</span><span className="text-xs text-slate-400">{deal.expectedClose}</span><span className="text-xs text-slate-500">{deal.owner}</span></div>)}</div></div>;
}

function ActivityView({ activities, leadMap }: { activities: CRMActivity[]; leadMap: Record<string, Lead> }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Timeline</p><h2 className="mt-2 text-3xl font-bold">Activity</h2><p className="mt-2 text-sm text-slate-400">A unified record of calls, WhatsApp, meetings, proposals and notes.</p></div><div className="border border-slate-800 bg-slate-900 divide-y divide-slate-800">{activities.map((item) => <div key={item.id} className="flex gap-4 p-5"><div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Activity className="size-4" /></div><div><p className="text-sm font-semibold">{leadMap[item.leadId]?.company ?? "Lead"}</p><p className="mt-1 text-sm text-slate-300">{item.note}</p><p className="mt-1 text-xs text-slate-500">{item.type} · {item.createdAt}</p></div></div>)}</div></div>;
}

function AccountsView({ companies, contacts, deals, projects, invoices, payments }: { companies: Company[]; contacts: Contact[]; deals: Deal[]; projects: Project[]; invoices: Invoice[]; payments: Payment[] }) {
  const rows = companies.map((company) => {
    const people = contacts.filter((c) => c.companyId === company.id);
    const companyDeals = deals.filter((d) => d.companyId === company.id);
    const openDeals = companyDeals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
    const companyProjects = projects.filter((p) => p.companyId === company.id);
    const companyInvoices = invoices.filter((i) => i.companyId === company.id);
    const invoiced = companyInvoices.reduce((s, i) => s + i.amount, 0);
    const collected = payments.filter((p) => p.companyId === company.id).reduce((s, p) => s + p.amount, 0);
    const outstanding = Math.max(invoiced - collected, 0);
    return { company, people, openDeals, companyProjects, invoiced, collected, outstanding, dealValue: companyDeals.reduce((s, d) => s + d.value, 0) };
  });
  const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);
  const totalPipeline = rows.reduce((s, r) => s + r.openDeals.reduce((x, d) => x + d.value, 0), 0);
  const activeProjects = rows.reduce((s, r) => s + r.companyProjects.filter((p) => p.status !== "Completed").length, 0);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Client accounts</p>
        <h2 className="mt-2 text-3xl font-bold">Accounts</h2>
        <p className="mt-2 text-sm text-slate-400">A 360° view of every client account — relationships, pipeline, delivery and money in one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Open pipeline</p><p className="mt-2 text-2xl font-bold">{money(totalPipeline)}</p></div>
        <div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Outstanding balances</p><p className="mt-2 text-2xl font-bold">{money(totalOutstanding)}</p></div>
        <div className="border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">Active projects</p><p className="mt-2 text-2xl font-bold">{activeProjects}</p></div>
      </div>
      <div className="overflow-hidden border border-slate-800 bg-slate-900">
        {rows.map(({ company, people, openDeals, companyProjects, collected, outstanding, dealValue }) => (
          <div key={company.id} className="grid gap-4 border-b border-slate-800 p-5 last:border-0 lg:grid-cols-[1.4fr_1fr_1fr_1fr_120px] lg:items-center">
            <div>
              <p className="text-sm font-semibold">{company.name}</p>
              <p className="mt-1 text-xs text-slate-500">{company.industry} · {company.location} · {people.length} contact{people.length === 1 ? "" : "s"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-600">Pipeline</p>
              <p className="mt-1 text-sm font-semibold">{money(openDeals.reduce((s, d) => s + d.value, 0))}</p>
              <p className="text-xs text-slate-500">{openDeals.length} open deal{openDeals.length === 1 ? "" : "s"} · {money(dealValue)} total</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-600">Delivery</p>
              <p className="mt-1 text-sm font-semibold">{companyProjects.length} project{companyProjects.length === 1 ? "" : "s"}</p>
              <p className="text-xs text-slate-500">{companyProjects.filter((p) => p.status !== "Completed").length} active</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-600">Collected</p>
              <p className="mt-1 text-sm font-semibold">{money(collected)}</p>
              <p className={`text-xs ${outstanding > 0 ? "text-amber-400" : "text-slate-500"}`}>{outstanding > 0 ? `${money(outstanding)} outstanding` : "Fully paid"}</p>
            </div>
            <span className="text-[10px] font-bold uppercase text-primary">{company.status}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="p-5 text-sm text-slate-500">No accounts yet. Add a company to start building client accounts.</p>}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Workspace | Mackdish Solutions" }, { name: "description", content: "Private Mackdish sales, clients and projects workspace." }, { property: "og:title", content: "Workspace | Mackdish Solutions" }, { property: "og:description", content: "Private Mackdish sales, clients and projects workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPage,
});

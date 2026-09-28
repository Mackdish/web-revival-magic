import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://heixdwwxiqvuhptxpafz.supabase.co";
const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ?? DEFAULT_SUPABASE_URL;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

export async function loadCrmFromSupabase() {
  if (!supabase) return null;

  const tables = [
    "crm_leads",
    "crm_tasks",
    "crm_activities",
    "crm_companies",
    "crm_contacts",
    "crm_deals",
    "crm_messages",
    "crm_projects",
    "crm_quotes",
    "crm_invoices",
    "crm_payments",
    "crm_campaigns",
    "crm_automations",
    "crm_workflows",
    "crm_workflow_steps",
  ] as const;

  const results = await Promise.all(
    tables.map(async (table) => {
      const query =
        table === "crm_workflow_steps"
          ? supabase.from(table).select("*").order("position")
          : supabase.from(table).select("*").order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) throw new Error(`${table}: ${error.message}`);
      return [table, data ?? []] as const;
    }),
  );

  const rows = Object.fromEntries(results) as Record<(typeof tables)[number], any[]>;

  const workflowSteps = rows.crm_workflow_steps;
  const workflows = rows.crm_workflows.map((workflow) => ({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description ?? "",
    active: workflow.active,
    steps: workflowSteps
      .filter((step) => step.workflow_id === workflow.id)
      .sort((a, b) => a.position - b.position)
      .map((step) => step.title),
  }));

  return {
    leads: rows.crm_leads.map((x) => ({
      id: x.id, name: x.name, company: x.company ?? "", phone: x.phone ?? "",
      email: x.email ?? "", source: x.source ?? "Other", status: x.status,
      value: Number(x.value ?? 0), owner: x.owner_id ?? "Mackdish",
      createdAt: x.created_at?.slice(0, 10) ?? "", lastActivity: x.updated_at?.slice(0, 10) ?? "",
      nextFollowUp: x.updated_at?.slice(0, 10) ?? "",
    })),
    tasks: rows.crm_tasks.map((x) => ({
      id: x.id, title: x.title, leadId: x.lead_id ?? undefined,
      due: x.due_date?.slice(0, 10) ?? "", priority: x.priority ?? "Medium", done: x.completed ?? false,
    })),
    activities: rows.crm_activities.map((x) => ({
      id: x.id, leadId: x.lead_id ?? "", type: x.type, note: x.body ?? x.title,
      createdAt: x.created_at?.slice(0, 16).replace("T", " ") ?? "",
    })),
    companies: rows.crm_companies.map((x) => ({
      id: x.id, name: x.name, industry: x.industry ?? "", phone: x.phone ?? "",
      email: x.email ?? "", website: x.website ?? "", location: x.location ?? "",
      status: x.status === "Active" ? "Customer" : x.status, notes: x.notes ?? "",
    })),
    contacts: rows.crm_contacts.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", name: x.name, role: x.role ?? "",
      phone: x.phone ?? "", email: x.email ?? "",
      preferredChannel: x.preferred_channel === "Call" ? "Phone" : x.preferred_channel ?? "WhatsApp",
    })),
    deals: rows.crm_deals.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", name: x.name, value: Number(x.value ?? 0),
      stage: x.stage, expectedClose: x.expected_close ?? "", service: x.service ?? "",
      owner: x.owner_id ?? "Mackdish",
    })),
    messages: rows.crm_messages.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", contactId: x.contact_id ?? "",
      channel: x.channel, direction: x.direction, subject: x.subject ?? "",
      body: x.body, createdAt: x.created_at?.slice(0, 16).replace("T", " ") ?? "", read: x.read,
    })),
    projects: rows.crm_projects.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", dealId: x.deal_id ?? "", name: x.name,
      service: x.service ?? "", status: x.status, startDate: x.start_date ?? "",
      dueDate: x.due_date ?? "", progress: x.progress ?? 0, owner: x.owner_id ?? "Mackdish",
    })),
    quotes: rows.crm_quotes.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", dealId: x.deal_id ?? "", number: x.number,
      title: x.title, amount: Number(x.amount ?? 0), status: x.status,
      validUntil: x.valid_until ?? "", createdAt: x.created_at?.slice(0, 10) ?? "",
    })),
    invoices: rows.crm_invoices.map((x) => ({
      id: x.id, companyId: x.company_id ?? "", projectId: x.project_id ?? "", number: x.number,
      amount: Number(x.amount ?? 0), paid: Number(x.paid ?? 0), status: x.status,
      dueDate: x.due_date ?? "",
    })),
    payments: rows.crm_payments.map((x) => ({
      id: x.id, invoiceId: x.invoice_id, companyId: x.company_id ?? "", amount: Number(x.amount ?? 0),
      method: x.method, reference: x.reference ?? "", date: x.date ?? "",
    })),
    campaigns: rows.crm_campaigns.map((x) => ({
      id: x.id, name: x.name, channel: x.channel, status: x.status,
      budget: Number(x.budget ?? 0), leads: x.leads ?? 0, qualified: x.qualified ?? 0,
      revenue: Number(x.revenue ?? 0), startDate: x.start_date ?? "", endDate: x.end_date ?? "",
    })),
    automations: rows.crm_automations.map((x) => ({
      id: x.id, name: x.name, trigger: x.trigger, action: x.action,
      active: x.active, runs: x.runs ?? 0,
    })),
    workflows,
  };
}

export async function insertCrmLead(lead: {
  name: string; company: string; phone: string; email: string;
  source: string; status: string; value: number;
}) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("crm_leads").insert({
    name: lead.name, company: lead.company, phone: lead.phone, email: lead.email,
    source: lead.source, status: lead.status, value: lead.value,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCrmLeadStage(id: string, status: string) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function insertCrmActivity(activity: {
  leadId: string; type: string; note: string;
}) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_activities").insert({
    lead_id: activity.leadId, type: activity.type,
    title: activity.note, body: activity.note,
  });
  if (error) throw error;
}

export async function updateCrmTask(id: string, completed: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_tasks").update({ completed }).eq("id", id);
  if (error) throw error;
}

export async function markCrmMessageRead(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_messages").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function updateCrmAutomation(id: string, active: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_automations").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function updateCrmWorkflow(id: string, active: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("crm_workflows").update({ active }).eq("id", id);
  if (error) throw error;
}

import { Bot, Braces, Building2, ChartNoAxesCombined, Code2, GraduationCap, Megaphone, Search, ShoppingBag, Store, Target, Workflow, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; to: string };
export type Service = { title: string; description: string; to: string; icon: LucideIcon; tags: string[] };

export const navigation: NavItem[] = [
  { label: "Services", to: "/services" },
  { label: "TradeMall Ads", to: "/trademall-ads" },
  { label: "Work", to: "/case-studies" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Insights", to: "/insights" },
];

export const services: Service[] = [
  { title: "Digital Marketing", description: "Content, social media and campaigns built around a clear customer action.", to: "/digital-marketing", icon: Megaphone, tags: ["Social media", "Content", "Lead generation"] },
  { title: "SEO", description: "Local and technical SEO that helps customers find you when they are already looking.", to: "/seo", icon: Search, tags: ["Local SEO", "Technical SEO", "Google Business"] },
  { title: "Paid Advertising", description: "Meta, Google and TradeMall campaigns with landing pages and conversion tracking.", to: "/advertising", icon: Target, tags: ["Meta", "Google", "TradeMall"] },
  { title: "Web Development", description: "Fast business websites, landing pages and e-commerce experiences designed to convert.", to: "/web-development", icon: Code2, tags: ["Websites", "E-commerce", "Landing pages"] },
  { title: "Software Development", description: "Custom dashboards, SaaS products and business systems built around real workflows.", to: "/software-development", icon: Braces, tags: ["SaaS", "Dashboards", "APIs"] },
  { title: "Automation & AI", description: "Connect repetitive work, notifications and AI-assisted processes so teams spend less time on admin.", to: "/automation-ai", icon: Bot, tags: ["Automation", "AI", "Integrations"] },
];

export const growthStages = [
  { title: "Get found", description: "Show up where a customer is looking or scrolling.", items: ["Google", "Meta", "SEO", "TradeMall"] },
  { title: "Give them a reason", description: "Make the offer, proof and next step obvious.", items: ["Content", "Offers", "Landing pages", "Product pages"] },
  { title: "Make contact easy", description: "Turn interest into a conversation or transaction.", items: ["WhatsApp", "Phone", "Forms", "Checkout"] },
  { title: "Follow up", description: "Do not lose people who were interested but not ready.", items: ["WhatsApp", "Email", "Remarketing", "CRM"] },
  { title: "Learn", description: "Use actual enquiries and conversion data to improve the next campaign.", items: ["Leads", "Conversions", "Ad data", "Analytics"] },
];

export const industries = [
  { title: "Retail & hardware", description: "Product discovery, local enquiries, offers and WhatsApp sales.", icon: Store },
  { title: "Education", description: "Admissions campaigns, school websites and parent communication.", icon: GraduationCap },
  { title: "Property", description: "Listing visibility, lead capture and follow-up for property teams.", icon: Building2 },
  { title: "E-commerce", description: "Product pages, acquisition campaigns and conversion journeys.", icon: ShoppingBag },
];

export const articles = [
  { slug: "generate-more-customers-online", category: "Business Growth", title: "How Kenyan Businesses Can Generate More Customers Online", excerpt: "A practical look at the path from being seen to getting a useful enquiry.", readTime: "7 min read" },
  { slug: "small-business-digital-marketing-budget", category: "Digital Marketing", title: "How Much Should a Small Business Spend on Digital Marketing?", excerpt: "Set a marketing budget around commercial goals instead of copying someone else's number.", readTime: "6 min read" },
  { slug: "facebook-ads-vs-google-ads-kenya", category: "Advertising", title: "Facebook Ads vs Google Ads for Kenyan Businesses", excerpt: "Understand discovery versus search intent and where each channel fits.", readTime: "8 min read" },
  { slug: "more-whatsapp-enquiries", category: "Conversion", title: "How to Get More WhatsApp Enquiries", excerpt: "Fix the journey between seeing an advert and starting a useful sales conversation.", readTime: "5 min read" },
  { slug: "local-seo-kenyan-businesses", category: "SEO", title: "How Local SEO Can Help Kenyan Businesses", excerpt: "The practical foundations behind local discovery and Google Business visibility.", readTime: "7 min read" },
  { slug: "how-trademall-advertising-works", category: "TradeMall", title: "How TradeMall Advertising Works", excerpt: "Where TradeMall fits alongside search, social and direct-response campaigns.", readTime: "5 min read" },
];

import Link from "next/link";
import { Code2, ShieldCheck, BarChart3, Cloud, Headset, CheckCircle2, ArrowRight } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = {
  title: "Enterprise IT Services & Consulting | Premium 365 Limited",
  description:
    "Software engineering, cybersecurity audits, Power BI data analytics, cloud migrations, and managed IT support based in Birmingham, UK.",
};

const services = [
  {
    id: "software",
    num: "01",
    title: "Custom Software & Web Engineering",
    icon: Code2,
    badge: "Full-Stack Development",
    summary:
      "Modern, scalable web applications, client portals, and bespoke workflow software engineered with Next.js, TypeScript, Python, and robust database architectures.",
    capabilities: [
      "Bespoke SaaS platforms and internal operations portals",
      "API design, REST/GraphQL endpoints, and third-party integrations",
      "Modern database modeling (PostgreSQL, Supabase, Redis)",
      "Automated CI/CD pipelines and automated test coverage",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker"],
  },
  {
    id: "cybersecurity",
    num: "02",
    title: "Cybersecurity & Risk Mitigation",
    icon: ShieldCheck,
    badge: "Enterprise Defense",
    summary:
      "Protect your data, infrastructure, and reputation with comprehensive vulnerability assessments, Cyber Essentials certification guidance, and zero-trust security policies.",
    capabilities: [
      "Cyber Essentials & Cyber Essentials Plus audit readiness",
      "Network penetration testing and vulnerability assessments",
      "Zero-Trust identity and access management (IAM)",
      "Incident response planning and employee phishing simulations",
    ],
    techStack: ["Cisco Meraki", "Microsoft Defender", "Snort", "CrowdStrike", "Zero Trust", "MFA/SSO"],
  },
  {
    id: "analytics",
    num: "03",
    title: "Data Analytics & Power BI Dashboards",
    icon: BarChart3,
    badge: "Business Intelligence",
    summary:
      "Transform disorganized spreadsheets and raw transactional data into clean, interactive Power BI executive dashboards that drive faster, profitable commercial decisions.",
    capabilities: [
      "Automated ETL pipelines consolidating multi-source business data",
      "Interactive Power BI executive dashboards and real-time KPIs",
      "Financial, operational, and customer performance reporting",
      "Data governance, sanitization, and automated scheduling",
    ],
    techStack: ["Power BI", "DAX", "SQL Server", "PostgreSQL", "Python Pandas", "BigQuery"],
  },
  {
    id: "cloud",
    num: "04",
    title: "Cloud Architecture & Migration",
    icon: Cloud,
    badge: "Cloud Modernisation",
    summary:
      "Design, migrate, and optimize secure cloud environments across AWS, Microsoft Azure, and hybrid deployments with high availability and predictable costs.",
    capabilities: [
      "Legacy on-premises to cloud migration roadmaps",
      "Infrastructure as Code (Terraform) for repeatable environments",
      "Automated multi-region backups and disaster recovery plans",
      "Cloud cost auditing and compute right-sizing",
    ],
    techStack: ["AWS", "Microsoft Azure", "Terraform", "Kubernetes", "Supabase", "Cloudflare"],
  },
  {
    id: "managed-it",
    num: "05",
    title: "Managed IT Support & Modern Workplace",
    icon: Headset,
    badge: "Operational Support",
    summary:
      "End-to-end device provisioning, Microsoft 365 tenant administration, and proactive remote helpdesk support tailored to keeping your UK team running smoothly.",
    capabilities: [
      "Microsoft 365 & Google Workspace tenant security hardening",
      "Hardware fleet provisioning (Laptops & Workstations from our shop)",
      "Proactive 24/7 network monitoring and patch management",
      "UK business-hours technical support SLA",
    ],
    techStack: ["Microsoft 365", "Intune", "Azure AD / Entra ID", "Remote Monitoring", "SLA Helpdesk"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Technical Advisory & Delivery
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
              Expertise to solve real business bottlenecks.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We provide practical, pragmatic technology delivery—from custom web development and cybersecurity hardening to business intelligence dashboards and cloud migrations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Catalogue */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isReversed = index % 2 === 1;

            return (
              <article
                key={service.id}
                id={service.id}
                className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs transition-all hover:border-blue-400 hover:shadow-xl"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Service Information */}
                  <div className={`space-y-6 lg:col-span-7 ${isReversed ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-blue-600">{service.num}</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                        {service.badge}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {service.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Capabilities</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {service.capabilities.map((cap) => (
                          <div key={cap} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technology Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
                      >
                        <span>Enquire About {service.badge}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Box / Decorative Card */}
                  <div className={`lg:col-span-5 ${isReversed ? "lg:order-1" : ""}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-4 shadow-xs">
                      <div className="grid h-20 w-20 mx-auto place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{service.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Delivered by certified UK engineers adhering to rigorous industry benchmarks and transparent project milestones.
                      </p>
                      <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-left">
                        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                          <p className="text-[10px] text-slate-400 font-bold">TIMELINE</p>
                          <p className="text-xs font-bold text-slate-800">2-6 Weeks Typical</p>
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                          <p className="text-[10px] text-slate-400 font-bold">FORMAT</p>
                          <p className="text-xs font-bold text-slate-800">Fixed or Retainer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Project Delivery Methodology */}
        <div className="mt-24 rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 shadow-xs">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Our Methodology</span>
            <h2 className="font-display text-3xl font-bold text-slate-900">How We Deliver Results</h2>
            <p className="text-sm text-slate-600">
              A transparent, milestone-driven framework designed to eliminate surprises and maximize ROI.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Discovery & Audit", desc: "We evaluate existing systems, workflows, data schemas, and pain points." },
              { step: "02", title: "Architecture & Plan", desc: "Detailed technical specification, cost forecast, and delivery timeline." },
              { step: "03", title: "Agile Execution", desc: "Iterative sprints with transparent client demos and progress reviews." },
              { step: "04", title: "Handover & Support", desc: "Comprehensive documentation, team training, and proactive maintenance." },
            ].map((st) => (
              <div key={st.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-2">
                <span className="font-mono text-sm font-black text-blue-600">{st.step}</span>
                <h3 className="font-bold text-slate-900 text-base">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Project Enquiry Form */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:items-start" id="enquiry">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Let’s Connect</span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Discuss your technical challenge.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fill in the form to describe your scope or book an exploratory consultation with our senior engineering team in Birmingham.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 text-xs text-slate-600 shadow-xs">
              <p className="font-bold text-slate-900">Direct Advisory Contact:</p>
              <p>Email: consulting@premium365.uk</p>
              <p>Registered Office: 36 Hallewell Road, Birmingham, B16 0LR, UK</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}

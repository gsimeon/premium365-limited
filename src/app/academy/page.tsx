import Link from "next/link";
import { ShieldCheck, Database, Cloud, Terminal, CheckCircle2, BookOpen, Clock, Users } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = {
  title: "Professional Training Academy | Premium 365 Limited",
  description:
    "Accredited professional training programmes in Cybersecurity, Power BI Data Analytics, Cloud Engineering, and Python Automation based in Birmingham, UK.",
};

const courses = [
  {
    id: "cybersecurity-foundations",
    num: "01",
    title: "Practical Cybersecurity & SOC Foundations",
    icon: ShieldCheck,
    level: "Beginner to Intermediate",
    duration: "6 Weeks (Live Cohort)",
    summary:
      "Master the foundations of enterprise defensive security, network packet analysis, Cyber Essentials standards, and incident triage with guided virtual labs.",
    syllabus: [
      "Network protocols, OSI model & packet inspection with Wireshark",
      "Vulnerability assessment methodologies & threat vectors",
      "Cyber Essentials, ISO 27001 & UK GDPR compliance frameworks",
      "Defensive endpoint security & SIEM event analysis",
    ],
    outcomes: "Prepared for junior SOC Analyst and IT Security Specialist roles.",
  },
  {
    id: "data-analysis-power-bi",
    num: "02",
    title: "Enterprise Data Analytics with Power BI",
    icon: Database,
    level: "Intermediate",
    duration: "4 Weeks (Interactive Labs)",
    summary:
      "Transform messy operational databases and spreadsheets into automated, high-impact executive dashboards using SQL, Power Query, and DAX calculations.",
    syllabus: [
      "Relational data modeling (Star schemas, fact & dimension tables)",
      "Advanced DAX measures, time intelligence, and KPI cards",
      "SQL data querying, filtering, and database transformations",
      "Executive UX dashboard design & automated refresh scheduling",
    ],
    outcomes: "Equipped to deliver commercial business intelligence reports independently.",
  },
  {
    id: "cloud-engineering-fundamentals",
    num: "03",
    title: "Cloud Engineering & DevOps Fundamentals",
    icon: Cloud,
    level: "Intermediate to Advanced",
    duration: "8 Weeks (Hands-on Cloud Sandbox)",
    summary:
      "Build a rock-solid foundation in modern cloud infrastructure across AWS, Microsoft Azure, Docker containerisation, and Terraform Infrastructure as Code.",
    syllabus: [
      "Virtual networks, VPCs, subnets, routing, and security groups",
      "Compute provisioning (EC2, Azure VMs, containerised workloads)",
      "Infrastructure as Code (Terraform) and repeatable deployments",
      "CI/CD automation pipelines with GitHub Actions",
    ],
    outcomes: "Ready to deploy, secure, and maintain commercial cloud workloads.",
  },
  {
    id: "python-automation",
    num: "04",
    title: "Python for Enterprise Automation",
    icon: Terminal,
    level: "Beginner to Intermediate",
    duration: "4 Weeks (Project-Based)",
    summary:
      "Automate tedious manual workflows, extract web and API data, and process large datasets with clean, maintainable Python scripts.",
    syllabus: [
      "Core Python syntax, data structures, and script architecture",
      "REST API integration, JSON processing, and web scraping",
      "Automating Excel and CSV reporting pipelines with Pandas",
      "Scheduling background tasks and error alerting mechanisms",
    ],
    outcomes: "Able to automate repetitive workplace operations and data transfers.",
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Premium 365 Academy · UK
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight">
              Build high-demand tech capability with practical direction.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              We deliver practitioner-led training programmes designed to equip professionals and enterprise teams with hands-on skills in cybersecurity, business intelligence, cloud architecture, and automation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Course Catalogue */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-10">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article
                key={course.id}
                id={course.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 shadow-xl transition-all hover:border-slate-700 hover:shadow-2xl"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                  {/* Left Column: Course Overview */}
                  <div className="space-y-4 lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-black text-blue-400">{course.num}</span>
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {course.title}
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {course.summary}
                    </p>

                    <div className="pt-2 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Syllabus Modules</p>
                      <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-300">
                        {course.syllabus.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 text-xs">
                      <strong className="text-slate-300">Career Outcome: </strong>
                      <span className="text-slate-400">{course.outcomes}</span>
                    </div>
                  </div>

                  {/* Right Column: Training Details & Enquiry Action */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Delivery Format</p>
                        <p className="text-sm font-bold text-white">Live Virtual & Birmingham On-Premises</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span>Cohort Capacity:</span>
                        <span className="text-slate-200 font-medium">Max 12 Learners / Cohort</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span>Lab Environment:</span>
                        <span className="text-slate-200 font-medium">Cloud Sandboxes Included</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span>Certification:</span>
                        <span className="text-slate-200 font-medium">Verified Certificate of Completion</span>
                      </div>
                    </div>

                    <Link
                      href={`/contact?course=${encodeURIComponent(course.title)}`}
                      className="w-full text-center rounded-full bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
                    >
                      Enquire for Upcoming Cohort ↗
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Corporate Capability Section */}
        <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Corporate Upskilling</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Upskill your entire technical team with bespoke curriculum.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We design tailored multi-week training cohorts for UK businesses, public sector suppliers, and enterprises seeking to bridge internal skill gaps in cloud security and data literacy.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <Users className="h-5 w-5 text-blue-400" />
                <p className="mt-2 font-bold text-white">Team Cohort Training</p>
                <p className="mt-1 text-slate-400">Private training scheduled around your operational sprints.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <p className="mt-2 font-bold text-white">Bespoke Lab Exercises</p>
                <p className="mt-1 text-slate-400">Practise on datasets and cloud configurations relevant to your stack.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Enquiry Form */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Enrolment & Enquiries</span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              Enquire about course dates and registration.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Course places are confirmed following an exploratory review to match your current proficiency with the most suitable syllabus.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 text-xs text-slate-400">
              <p className="font-bold text-white">Academy Admissions:</p>
              <p>Email: academy@premium365.uk</p>
              <p>Location: 36 Hallewell Road, Birmingham, B16 0LR, UK</p>
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

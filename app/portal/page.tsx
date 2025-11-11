"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, FileText, Images, MessageSquare, CreditCard, Calendar, Home, LogIn, LogOut, Download } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// =====================
// Supabase Client (browser)
// =====================
const HAS_SUPABASE = Boolean(
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) &&
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);

const supabaseBrowser = () =>
  HAS_SUPABASE
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
      )
    : null;

// =====================
// Fallback Demo Data (used if Supabase env keys are not set)
// =====================
const mockProject = {
  id: "AR-24518",
  property: { address: "123 Maple Ave, Hamilton, NJ", type: "Residential" },
  contractor: { name: "Arctic Roofing & Restoration", phone: "888-352-7284", email: "support@arcticroofing.org" },
  status: "Production Scheduled",
  schedule: { installDate: "2025-11-18", arrivalWindow: "8:00–9:00 AM" },
  financials: {
    estimateTotal: 17250,
    paid: 5000,
    outstanding: 12250,
    milestones: [
      { label: "Deposit", amount: 5000, paid: true },
      { label: "Materials Delivered", amount: 5250, paid: false },
      { label: "Substantial Completion", amount: 7000, paid: false },
    ],
  },
  timeline: [
    { date: "2025-11-08", title: "Claim Approved / Retail Accepted", desc: "Scope finalized and signed.", done: true },
    { date: "2025-11-09", title: "Color Selected", desc: "GAF Timberline HDZ – Pewter Gray.", done: true },
    { date: "2025-11-12", title: "Materials Ordered", desc: "ABC Supply order #89102.", done: true },
    { date: "2025-11-17", title: "Dumpster Drop", desc: "20 yd scheduled.", done: false },
    { date: "2025-11-18", title: "Install Day", desc: "Crew arrival 8–9 AM.", done: false },
    { date: "2025-11-20", title: "Final Clean & Walkthrough", desc: "Magnet sweep + punch list.", done: false },
    { date: "2025-11-21", title: "Final Invoice & Warranty", desc: "Upload warranty registration.", done: false },
  ],
  photos: [
    { id: 1, label: "Before – Front Elevation", url: "https://picsum.photos/seed/roof1/600/360" },
    { id: 2, label: "Decking – Section A", url: "https://picsum.photos/seed/roof2/600/360" },
    { id: 3, label: "After – Rear Elevation", url: "https://picsum.photos/seed/roof3/600/360" },
  ],
  documents: [
    { id: "doc1", name: "Signed Proposal.pdf", size: "312 KB", file_url: "project-docs:demo/proposal.pdf" },
    { id: "doc2", name: "Insurance Scope.pdf", size: "1.1 MB", file_url: "project-docs:demo/scope.pdf" },
    { id: "doc3", name: "Warranty Registration.pdf", size: "98 KB", file_url: "project-docs:demo/warranty.pdf" },
  ],
  messages: [
    { id: 1, from: "Arctic PM", at: "2025-11-10 09:15", text: "Hi! Install on Tue 11/18. Weather looks good so far." },
    { id: 2, from: "Homeowner", at: "2025-11-10 10:02", text: "Perfect—do pets need to be inside?" },
  ],
};

// =====================
// Small UI helpers
// =====================
function Card({ children, className = "" }) {
  return <div className={`bg-white/80 backdrop-blur border border-black/5 rounded-2xl shadow-sm p-5 ${className}`}>{children}</div>;
}
function Pill({ children }) {
  return <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-wide">{children}</span>;
}
function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-black/60 mt-1">{label}</div>
    </div>
  );
}
function TimelineItem({ item }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className={`w-5 h-5 mt-0.5 ${item.done ? "opacity-100" : "opacity-30"}`} />
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        <div className="text-xs text-black/60">{item.date}</div>
        <div className="text-sm mt-1">{item.desc}</div>
      </div>
    </div>
  );
}
function Currency({ amount }) { return <span>${(amount / 1).toLocaleString()}</span>; }
function Header({ onLogout }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-black" />
        <div>
          <div className="text-xl font-bold">Arctic Homeowner Portal</div>
          <div className="text-xs text-black/60">Project transparency • Photos • Documents • Messages</div>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-xl hover:bg-black/5">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}

// =====================
// Auth (Magic link if Supabase; otherwise demo sign-in)
// =====================
function Login({ onLogin, onSent }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supa = useMemo(() => supabaseBrowser(), []);

  const submit = async (e) => {
    e.preventDefault();
    if (!HAS_SUPABASE || !supa) {
      // Demo sign-in without backend
      onLogin({ id: "demo-user", email, role: "homeowner" });
      return;
    }
    const { error } = await supa.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}` : undefined },
    });
    if (error) alert(error.message);
    else { setSent(true); onSent?.(email); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white p-6">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-black" />
          <div>
            <div className="text-xl font-bold">Arctic Homeowner Portal</div>
            <div className="text-xs text-black/60">{HAS_SUPABASE ? "Secure magic-link sign in" : "Demo mode • no database (enter any email)"}</div>
          </div>
        </div>
        {sent ? (
          <div className="text-sm">Check <b>{email}</b> for your sign-in link.</div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            <label className="text-sm">Email</label>
            <input className="border rounded-xl px-3 py-2" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm">
              <LogIn className="w-4 h-4"/> {HAS_SUPABASE ? "Send magic link" : "Enter demo portal"}
            </button>
            {HAS_SUPABASE ? (<div className="text-xs text-black/60 mt-1">No passwords. We’ll email you a one-time link.</div>) : null}
          </form>
        )}
      </Card>
    </div>
  );
}

// =====================
// Homeowner Dashboard (loads from DB if available)
// =====================
function Dashboard({ user }) {
  const [tab, setTab] = useState("overview");
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const supa = useMemo(() => supabaseBrowser(), []);

  useEffect(() => {
    if (!HAS_SUPABASE || !supa || !user) return; // demo mode uses mock
    (async () => {
      // Load projects via membership
      const { data: m, error: mErr } = await supa.from("project_members").select("project_id");
      if (mErr) console.error(mErr);
      const projectIds = (m||[]).map(x=>x.project_id);
      if (!projectIds.length) return;
      const { data: p } = await supa.from("projects").select("*, properties(*)").in("id", projectIds).order("created_at", { ascending: false });
      const chosen = (p||[])[0];
      setProject(chosen || null);
      if (chosen) {
        const [{ data: t }, { data: ph }, { data: dd }, { data: mm }] = await Promise.all([
          supa.from("timeline_events").select("*").eq("project_id", chosen.id).order("date"),
          supa.from("photos").select("*").eq("project_id", chosen.id).order("created_at", { ascending: false }),
          supa.from("documents").select("*").eq("project_id", chosen.id).order("created_at", { ascending: false }),
          supa.from("messages").select("*, from:users(id,name)").eq("project_id", chosen.id).order("created_at")
        ]);
        setTimeline(t||[]); setPhotos(ph||[]); setDocs(dd||[]); setMessages(mm||[]);
      }
    })();
  }, [user, supa]);

  const p = HAS_SUPABASE && project ? {
    id: project.id.slice(0,8),
    property: { address: project?.properties?.address || "", type: "Residential" },
    contractor: { name: "Arctic Roofing & Restoration", phone: "888-352-7284", email: "support@arcticroofing.org" },
    status: project.status || "Scheduled",
    schedule: { installDate: project.install_date || "TBD", arrivalWindow: project.arrival_window || "TBD" },
    financials: mockProject.financials,
    timeline: timeline.map(t=>({ date: t.date, title: t.title, desc: t.description, done: t.done })),
    photos: photos.map(ph=>({ id: ph.id, label: ph.label, url: ph.file_url })),
    documents: docs.map(d=>({ id: d.id, name: d.name, size: `${Math.round((d.size_bytes||0)/1024)} KB`, file_url: d.file_url })),
    messages: messages.map(m=>({ id: m.id, from: m.from?.name || "User", at: m.created_at, text: m.body }))
  } : mockProject;

  const progress = Math.round((p.timeline.filter(t=>t.done).length / Math.max(1,p.timeline.length)) * 100);

  async function downloadDoc(d){
    if (!HAS_SUPABASE) return alert("Demo: not connected to storage.");
    const s = supabaseBrowser();
    if (!s) return;
    const parts = (d.file_url||"").split(":");
    if (parts.length===2) {
      const { data } = await s.storage.from(parts[0]).createSignedUrl(parts[1], 60);
      if (data?.signedUrl) window.location.href = data.signedUrl;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onLogout={()=>{ const s = supabaseBrowser(); s?.auth.signOut(); if (!HAS_SUPABASE) window.location.reload(); }} />

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5"/>
                <div>
                  <div className="text-sm text-black/60">Project</div>
                  <div className="font-semibold">#{p.id} • {p.property.address}</div>
                </div>
              </div>
              <Pill>{p.status}</Pill>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Progress" value={`${progress}%`} />
              <Stat label="Install Date" value={p.schedule.installDate} />
              <Stat label="Arrival" value={p.schedule.arrivalWindow} />
            </div>
          </Card>
          <Card>
            <div className="text-sm font-semibold mb-2">Your PM</div>
            <div className="text-sm">{p.contractor.name}</div>
            <div className="text-xs text-black/60">{p.contractor.phone}</div>
            <div className="text-xs text-black/60">{p.contractor.email}</div>
            <button className="mt-3 text-sm border px-3 py-1.5 rounded-xl hover:bg-black/5">Message Project Manager</button>
          </Card>
        </div>

        <Card>
          <div className="flex flex-wrap gap-2 text-sm">
            <button onClick={()=>setTab("overview")} className={`px-3 py-1.5 rounded-xl border ${tab==="overview"?"bg-black text-white":"hover:bg-black/5"}`}><Home className="w-4 h-4 inline mr-1"/>Overview</button>
            <button onClick={()=>setTab("timeline")} className={`px-3 py-1.5 rounded-xl border ${tab==="timeline"?"bg-black text-white":"hover:bg-black/5"}`}><Calendar className="w-4 h-4 inline mr-1"/>Timeline</button>
            <button onClick={()=>setTab("photos")} className={`px-3 py-1.5 rounded-xl border ${tab==="photos"?"bg-black text-white":"hover:bg-black/5"}`}><Images className="w-4 h-4 inline mr-1"/>Photos</button>
            <button onClick={()=>setTab("docs")} className={`px-3 py-1.5 rounded-xl border ${tab==="docs"?"bg-black text-white":"hover:bg-black/5"}`}><FileText className="w-4 h-4 inline mr-1"/>Documents</button>
            <button onClick={()=>setTab("messages")} className={`px-3 py-1.5 rounded-xl border ${tab==="messages"?"bg-black text-white":"hover:bg-black/5"}`}><MessageSquare className="w-4 h-4 inline mr-1"/>Messages</button>
            <button onClick={()=>setTab("payments")} className={`px-3 py-1.5 rounded-xl border ${tab==="payments"?"bg-black text-white":"hover:bg-black/5"}`}><CreditCard className="w-4 h-4 inline mr-1"/>Payments</button>
          </div>

          {tab === "overview" && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <Card>
                <div className="text-sm font-semibold mb-2">Upcoming</div>
                <div className="text-sm">Dumpster drop on <b>Mon, Nov 17</b></div>
                <div className="text-sm">Install day <b>Tue, Nov 18</b> • Arrival {p.schedule.arrivalWindow}</div>
                <div className="text-xs text-black/60 mt-2">We notify you if weather forces a change.</div>
              </Card>
              <Card>
                <div className="text-sm font-semibold mb-2">What to Expect</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Keep pets and vehicles inside/away from driveway.</li>
                  <li>Some vibration and noise from 8 AM to 5 PM.</li>
                  <li>Final magnet sweep and photo report after install.</li>
                </ul>
              </Card>
            </div>
          )}

          {tab === "timeline" && (
            <div className="mt-4 grid gap-4">
              {p.timeline.map((t, i) => (
                <TimelineItem key={i} item={t} />
              ))}
            </div>
          )}

          {tab === "photos" && (
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {p.photos.map(ph => (
                <div key={ph.id} className="border rounded-2xl overflow-hidden">
                  <img src={ph.url} alt={ph.label} className="w-full h-40 object-cover"/>
                  <div className="p-3 text-sm">{ph.label}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "docs" && (
            <div className="mt-4 grid gap-2">
              {p.documents.map(d => (
                <div key={d.id} className="flex items-center justify-between border rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4"/>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-black/60">{d.size}</div>
                  </div>
                  <button onClick={()=>downloadDoc(d)} className="text-sm flex items-center gap-1 border px-3 py-1.5 rounded-xl hover:bg-black/5"><Download className="w-4 h-4"/> Download</button>
                </div>
              ))}
            </div>
          )}

          {tab === "messages" && (
            <div className="mt-4 grid gap-3">
              {p.messages.map(m => (
                <div key={m.id} className="border rounded-2xl p-3">
                  <div className="text-xs text-black/60">{m.from} • {m.at}</div>
                  <div className="text-sm mt-1">{m.text}</div>
                </div>
              ))}
              <MessageComposer projectId={HAS_SUPABASE && project ? project.id : null} />
            </div>
          )}

          {tab === "payments" && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <Card>
                <div className="text-sm">Estimate Total</div>
                <div className="text-2xl font-semibold"><Currency amount={p.financials.estimateTotal}/></div>
                <div className="text-sm mt-2">Paid: <b><Currency amount={p.financials.paid}/></b></div>
                <div className="text-sm">Outstanding: <b><Currency amount={p.financials.outstanding}/></b></div>
              </Card>
              <Card>
                <div className="text-sm font-semibold mb-2">Milestones</div>
                <div className="grid gap-2">
                  {p.financials.milestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between border rounded-xl px-3 py-2">
                      <div className="text-sm">{m.label}</div>
                      <div className="text-sm"><Currency amount={m.amount}/> {m.paid?"• Paid":""}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 inline-flex items-center gap-2 border px-3 py-2 rounded-xl hover:bg-black/5 text-sm"><CreditCard className="w-4 h-4"/> Pay Securely</button>
              </Card>
            </div>
          )}
        </Card>

        <div className="text-xs text-center text-black/60">
          © {new Date().getFullYear()} Arctic Roofing & Restoration • {HAS_SUPABASE ? "Secure client portal" : "Demo (connect Supabase to go live)"}
        </div>
      </div>
    </div>
  );
}

function MessageComposer({ projectId }){
  const [text, setText] = useState("");
  const s = useMemo(()=>supabaseBrowser(), []);
  const disabled = !projectId || !HAS_SUPABASE || !s;
  return (
    <div className="flex gap-2 mt-2">
      <input className="flex-1 border rounded-xl px-3 py-2" placeholder={disabled?"Sign in to a real project to message":"Type a message to your Project Manager…"} value={text} onChange={e=>setText(e.target.value)} disabled={disabled}/>
      <button className={`border px-4 py-2 rounded-xl text-sm ${disabled?"opacity-50":"hover:bg-black/5"}`} disabled={disabled} onClick={async()=>{
        if (!text.trim()) return;
        const { data: u } = await s!.auth.getUser();
        const uid = u?.user?.id;
        if (!uid) return;
        await s!.from("messages").insert({ project_id: projectId, from_user_id: uid, body: text.trim() });
        setText("");
      }}>Send</button>
    </div>
  );
}

// =====================
// Admin (real) when Supabase is connected; else demo admin fallback
// =====================
function AdminReal() {
  const s = useMemo(()=>supabaseBrowser(), []);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ address: "", city: "", state: "NJ", zip: "", status: "Scheduled", install_date: "", arrival_window: "8:00–9:00 AM", homeowner_email: "" });

  useEffect(() => {
    (async () => {
      const { data: me } = await s!.auth.getUser();
      if (!me?.user?.id) return;
      const { data: roleRow } = await s!.from("users").select("role").eq("id", me.user.id).maybeSingle();
      if (!roleRow || !["admin","pm"].includes(roleRow.role)) {
        alert("No admin access on this account.");
        return;
      }
      const { data } = await s!.from("projects").select("*, properties(*)").order("created_at", { ascending: false });
      setProjects(data || []);
    })();
  }, [s]);

  async function createProject(e){
    e.preventDefault();
    const { data: prop, error: e1 } = await s!.from("properties").insert({ address: form.address, city: form.city, state: form.state, zip: form.zip }).select().single();
    if (e1) return alert(e1.message);
    const { data: proj, error: e2 } = await s!.from("projects").insert({ property_id: prop.id, status: form.status, install_date: form.install_date || null, arrival_window: form.arrival_window }).select().single();
    if (e2) return alert(e2.message);

    if (form.homeowner_email) {
      const { data: homeowner } = await s!.from("users").select("id").eq("email", form.homeowner_email).maybeSingle();
      if (homeowner?.id) {
        await s!.from("project_members").upsert({ project_id: proj.id, user_id: homeowner.id, role: "homeowner" });
      } else {
        await s!.auth.signInWithOtp({ email: form.homeowner_email, options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined } });
        alert("Invite sent. After the homeowner logs in, open this project and click 'Add Member'.");
      }
    }
    setForm(prev=>({ ...prev, address: "", city: "", zip: "", homeowner_email: "" }));
    const { data: refreshed } = await s!.from("projects").select("*, properties(*)").order("created_at", { ascending: false });
    setProjects(refreshed||[]);
  }

  async function addMember(projectId){
    const email = prompt("Homeowner email to add to this project:");
    if (!email) return;
    const { data: homeowner } = await s!.from("users").select("id").eq("email", email).maybeSingle();
    if (homeowner?.id) {
      await s!.from("project_members").upsert({ project_id: projectId, user_id: homeowner.id, role: "homeowner" });
      alert("Access granted.");
    } else {
      await s!.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined } });
      alert("Invite sent. Add them after they log in at least once.");
    }
  }

  return (
    <Card>
      <div className="text-lg font-semibold">Admin – Projects</div>
      <form onSubmit={createProject} className="grid md:grid-cols-2 gap-3 mt-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Street address" value={form.address} onChange={e=>setForm(v=>({...v,address:e.target.value}))} required />
        <input className="border rounded-xl px-3 py-2" placeholder="City" value={form.city} onChange={e=>setForm(v=>({...v,city:e.target.value}))} />
        <input className="border rounded-xl px-3 py-2" placeholder="State" value={form.state} onChange={e=>setForm(v=>({...v,state:e.target.value}))} />
        <input className="border rounded-xl px-3 py-2" placeholder="ZIP" value={form.zip} onChange={e=>setForm(v=>({...v,zip:e.target.value}))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Install date (YYYY-MM-DD)" value={form.install_date} onChange={e=>setForm(v=>({...v,install_date:e.target.value}))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Arrival window" value={form.arrival_window} onChange={e=>setForm(v=>({...v,arrival_window:e.target.value}))} />
        <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Homeowner email (optional to invite)" value={form.homeowner_email} onChange={e=>setForm(v=>({...v,homeowner_email:e.target.value}))} />
        <button className="border px-3 py-2 rounded-xl hover:bg-black/5 text-sm">Create project</button>
      </form>

      <div className="grid gap-2 mt-4">
        {projects.map(p => (
          <div key={p.id} className="border rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{p.properties?.address}</div>
              <div className="text-xs text-black/60">{p.status} • Install {p.install_date || 'TBD'} • {p.arrival_window || 'TBD'}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs border px-2 py-1 rounded-xl hover:bg-black/5" onClick={()=>addMember(p.id)}>Add Member</button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-black/60 mt-3">Revoke access by deleting the homeowner row from <code>project_members</code> for that project.</div>
    </Card>
  );
}

function AdminDemo({ onExit }) {
  const [homeowners, setHomeowners] = useState([
    { id: "u1", name: "Jane Doe", email: "jane@example.com", projectId: "AR-24518" }
  ]);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  function addHomeowner(e){
    e.preventDefault();
    const projectId = `AR-${Math.floor(10000+Math.random()*89999)}`;
    const id = cryptoRandomId();
    setHomeowners(prev => [...prev, { id, name: form.name, email: form.email, projectId }]);
    setForm({ name: "", email: "", address: "" });
  }
  function inviteLink(h){
    const token = btoa(`${h.email}|${h.projectId}`);
    return `${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/portal?token=${token}`;
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Admin Demo – Control Homeowners</div>
        <button onClick={onExit} className="text-sm border px-3 py-1.5 rounded-xl hover:bg-black/5">Close</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="text-sm font-semibold mb-2">Create Project & Invite Homeowner</div>
          <form onSubmit={addHomeowner} className="grid gap-2">
            <input required className="border rounded-xl px-3 py-2" placeholder="Homeowner name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} />
            <input required type="email" className="border rounded-xl px-3 py-2" placeholder="Homeowner email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} />
            <input className="border rounded-xl px-3 py-2" placeholder="Property address (optional)" value={form.address} onChange={e=>setForm(v=>({...v,address:e.target.value}))} />
            <button className="mt-1 border px-3 py-2 rounded-xl hover:bg-black/5 text-sm">Create & Generate Invite</button>
            <div className="text-xs text-black/60">Demo only: this doesn’t save to a server yet.</div>
          </form>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2">Homeowners</div>
          <div className="grid gap-2">
            {homeowners.map(h => (
              <div key={h.id} className="border rounded-xl p-3">
                <div className="text-sm font-medium">{h.name} • {h.email}</div>
                <div className="text-xs text-black/60">Project #{h.projectId}</div>
                <div className="flex gap-2 mt-2">
                  <a className="text-xs underline" href={inviteLink(h)} target="_blank" rel="noreferrer">Open homeowner link</a>
                  <button className="text-xs border px-2 py-1 rounded-xl hover:bg-black/5" onClick={()=>navigator.clipboard.writeText(inviteLink(h))}>Copy invite</button>
                  <button className="text-xs border px-2 py-1 rounded-xl hover:bg-black/5" onClick={()=>setHomeowners(prev=>prev.filter(x=>x.id!==h.id))}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs text-black/60 mt-4">Next step: set Supabase keys on your host to switch from demo → live.</div>
    </Card>
  );
}

function cryptoRandomId(){
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const a = new Uint32Array(2);
    crypto.getRandomValues(a);
    return Array.from(a).map(n=>n.toString(16)).join("");
  }
  return Math.random().toString(16).slice(2);
}

// =====================
// Root Component
// =====================
export default function PortalDemo() {
  const [session, setSession] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const s = useMemo(()=>supabaseBrowser(), []);

  useEffect(() => {
    if (!HAS_SUPABASE || !s) return;
    s.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = s.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => { sub?.subscription?.unsubscribe?.(); };
  }, [s]);

  const isLive = HAS_SUPABASE && Boolean(session);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black" />
            <div>
              <div className="text-xl font-bold">Arctic Homeowner Portal</div>
              <div className="text-xs text-black/60">{HAS_SUPABASE ? (isLive? "Live • Magic link login" : "Waiting for sign-in") : "Demo • Connect Supabase to go live"}</div>
            </div>
          </div>
          {!isLive ? null : (
            <button onClick={()=>setShowAdmin(v=>!v)} className="text-sm border px-3 py-1.5 rounded-xl hover:bg-black/5">{showAdmin? "Close Admin" : "Open Admin"}</button>
          )}
        </div>

        {!HAS_SUPABASE || !session ? (
          <Login onLogin={(demoUser)=>setSession({ user: demoUser })} onSent={()=>{}} />
        ) : showAdmin ? (
          <AdminReal />
        ) : (
          <Dashboard user={session.user} />
        )}
      </div>
    </div>
  );
}

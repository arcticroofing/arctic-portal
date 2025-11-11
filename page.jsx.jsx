import React, { useState } from "react";
import { CheckCircle, FileText, Images, MessageSquare, CreditCard, Calendar, Home, LogIn, LogOut, Download } from "lucide-react";

// --- Mock Auth (replace with Clerk/Auth.js/Supabase Auth) ---
const mockUser = { email: "jane.doe@email.com", name: "Jane Doe" };

const mockProject = {
  id: "AR-24518",
  property: {
    address: "123 Maple Ave, Hamilton, NJ",
    type: "Residential",
  },
  contractor: {
    name: "Arctic Roofing & Restoration",
    phone: "888-352-7284",
    email: "support@arcticroofing.org",
  },
  status: "Production Scheduled",
  schedule: {
    installDate: "2025-11-18",
    arrivalWindow: "8:00–9:00 AM",
  },
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
    { id: "doc1", name: "Signed Proposal.pdf", size: "312 KB" },
    { id: "doc2", name: "Insurance Scope.pdf", size: "1.1 MB" },
    { id: "doc3", name: "Warranty Registration.pdf", size: "98 KB" },
  ],
  messages: [
    { id: 1, from: "Arctic PM", at: "2025-11-10 09:15", text: "Hi Jane! Install on Tue 11/18. Weather looks good so far." },
    { id: 2, from: "Jane", at: "2025-11-10 10:02", text: "Perfect—please confirm if pets need to be inside." },
  ],
};

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur border border-black/5 rounded-2xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-wide">{children}</span>
  );
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

function Currency({ amount }) {
  return <span>${(amount / 1).toLocaleString()}</span>;
}

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

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const submit = (e) => {
    e.preventDefault();
    onLogin(mockUser);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white p-6">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-black" />
          <div>
            <div className="text-xl font-bold">Arctic Homeowner Portal</div>
            <div className="text-xs text-black/60">Secure access to your roofing project</div>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <label className="text-sm">Email</label>
          <input className="border rounded-xl px-3 py-2" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <label className="text-sm">One‑time code</label>
          <input className="border rounded-xl px-3 py-2" placeholder="123456" value={code} onChange={(e)=>setCode(e.target.value)} />
          <button className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm">
            <LogIn className="w-4 h-4"/> Sign in
          </button>
          <div className="text-xs text-black/60 mt-1">We use passwordless magic links or codes. No account to remember.</div>
        </form>
      </Card>
    </div>
  );
}

function Dashboard({ user }) {
  const [tab, setTab] = useState("overview");
  const p = mockProject;
  const progress = Math.round((p.timeline.filter(t=>t.done).length / p.timeline.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onLogout={()=>window.location.reload()} />

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
                  <button className="text-sm flex items-center gap-1 border px-3 py-1.5 rounded-xl hover:bg-black/5"><Download className="w-4 h-4"/> Download</button>
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
              <div className="flex gap-2 mt-2">
                <input className="flex-1 border rounded-xl px-3 py-2" placeholder="Type a message to your Project Manager…"/>
                <button className="border px-4 py-2 rounded-xl hover:bg-black/5 text-sm">Send</button>
              </div>
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

        <div className="text-xs text-center text-black/60">© {new Date().getFullYear()} Arctic Roofing & Restoration • Secure client portal demo</div>
      </div>
    </div>
  );
}

export default function PortalDemo() {
  const [user, setUser] = useState(null);
  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}

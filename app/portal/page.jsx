"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  FileText,
  Images,
  MessageSquare,
  CreditCard,
  Calendar,
  Home,
  LogIn,
  LogOut,
  Download,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Simple reusable card component
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border bg-white/60 backdrop-blur p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

// Currency formatter
const Currency = ({ amount }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

// ---------------- Portal Dashboard ----------------
function Dashboard({ user }) {
  const [tab, setTab] = useState("overview");

  // Demo project data
  const p = {
    name: "123 Main St, Bridgewater NJ",
    status: "Production Scheduled",
    timeline: [
      { date: "2025-11-05", title: "Claim Approved", done: true },
      { date: "2025-11-07", title: "Materials Ordered", done: true },
      { date: "2025-11-10", title: "Install Day", done: false },
    ],
    documents: [
      { name: "Insurance Scope.pdf", size: "1.4 MB" },
      { name: "Warranty Certificate.pdf", size: "0.8 MB" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      "https://images.unsplash.com/photo-1581092334519-7b2c3a05e9b1",
    ],
    messages: [
      {
        id: 1,
        from: "Project Manager",
        at: "Nov 8, 2025 9:02am",
        text: "Materials have been confirmed with ABC Supply.",
      },
      {
        id: 2,
        from: "You",
        at: "Nov 8, 2025 9:05am",
        text: "Thank you! Looking forward to install day.",
      },
    ],
    financials: {
      estimateTotal: 15000,
      paid: 5000,
      outstanding: 10000,
      milestones: [
        { label: "Initial Deposit", amount: 5000, paid: true },
        { label: "Completion Payment", amount: 10000, paid: false },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-arctic-blue/20 to-white text-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Home className="w-6 h-6 text-arctic-blue" /> {p.name}
          </h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm border rounded-xl px-3 py-1 flex items-center gap-1 hover:bg-black/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <Card>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              ["overview", "Overview"],
              ["timeline", "Timeline"],
              ["photos", "Photos"],
              ["docs", "Documents"],
              ["messages", "Messages"],
              ["payments", "Payments"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-3 py-1.5 rounded-xl border ${
                  tab === id
                    ? "bg-black text-white"
                    : "hover:bg-black/5 text-black/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ---- Tabs ---- */}
          {tab === "overview" && (
            <div className="mt-4 grid gap-2 text-sm">
              <div>
                <b>Status:</b> {p.status}
              </div>
              <div>
                <b>Next Step:</b> Crew scheduled for {p.timeline[2].date}
              </div>
            </div>
          )}

          {tab === "timeline" && (
            <div className="mt-4 grid gap-2">
              {p.timeline.map((t, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between border rounded-xl px-3 py-2 ${
                    t.done ? "bg-green-50" : ""
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-black/60">{t.date}</div>
                  </div>
                  {t.done && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              ))}
            </div>
          )}

          {tab === "photos" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {p.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Project Photo"
                  className="rounded-xl object-cover w-full h-32 border"
                />
              ))}
            </div>
          )}

          {tab === "docs" && (
            <div className="mt-4 grid gap-2">
              {p.documents.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-xl px-3 py-2"
                >
                  <div>
                    <div className="text-sm">{d.name}</div>
                    <div className="text-xs text-black/60">{d.size}</div>
                  </div>
                  <button className="border px-3 py-1 rounded-xl flex items-center gap-2 hover:bg-black/5 text-sm">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "messages" && (
            <div className="mt-4 grid gap-3">
              {p.messages.map((m) => (
                <div key={m.id} className="border rounded-2xl p-3">
                  <div className="text-xs text-black/60">
                    {m.from} • {m.at}
                  </div>
                  <div className="text-sm mt-1">{m.text}</div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 border rounded-xl px-3 py-2"
                  placeholder="Type a message to your Project Manager…"
                />
                <button className="border px-4 py-2 rounded-xl hover:bg-black/5 text-sm">
                  Send
                </button>
              </div>
            </div>
          )}

          {tab === "payments" && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <Card>
                <div className="text-sm">Estimate Total</div>
                <div className="text-2xl font-semibold">
                  <Currency amount={p.financials.estimateTotal} />
                </div>
                <div className="text-sm mt-2">
                  Paid: <b><Currency amount={p.financials.paid} /></b>
                </div>
                <div className="text-sm">
                  Outstanding: <b><Currency amount={p.financials.outstanding} /></b>
                </div>
              </Card>
              <Card>
                <div className="text-sm font-semibold mb-2">Milestones</div>
                <div className="grid gap-2">
                  {p.financials.milestones.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-xl px-3 py-2"
                    >
                      <div className="text-sm">{m.label}</div>
                      <div className="text-sm">
                        <Currency amount={m.amount} /> {m.paid ? "• Paid" : ""}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 inline-flex items-center gap-2 border px-3 py-2 rounded-xl hover:bg-black/5 text-sm">
                  <CreditCard className="w-4 h-4" /> Pay Securely
                </button>
              </Card>
            </div>
          )}
        </Card>

        <div className="text-xs text-center text-black/60">
          © {new Date().getFullYear()} Arctic Roofing & Restoration • Secure
          client portal demo
        </div>
      </div>
    </div>
  );
}

// --------------- Auth -----------------
function Login({ onLogin }) {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-arctic-blue/10">
      <Card className="max-w-sm w-full">
        <h1 className="text-xl font-semibold mb-2 text-center">
          Arctic Roofing Homeowner Portal
        </h1>
        <p className="text-sm text-center mb-4">
          Sign in via magic link to view your project.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="border rounded-xl px-3 py-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white rounded-xl py-2 text-sm"
        >
          Send Magic Link
        </button>
      </Card>
    </div>
  );
}

// --------------- Root Component -----------------
export default function PortalDemo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}

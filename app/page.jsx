export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-start p-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold mb-2">Arctic Roofing &amp; Restoration</h1>
        <p className="text-black/70 mb-4">Welcome. Access the homeowner portal below.</p>
        <a
          href="/portal"
          className="inline-block border rounded-2xl px-4 py-2 hover:bg-black/5"
        >
          Open Homeowner Portal
        </a>
      </div>
    </main>
  );
}

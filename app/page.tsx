import Link from 'next/link';

export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: 'ui-sans-serif, system-ui'}}>
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>Arctic Roofing & Restoration</h1>
      <p style={{opacity: .7, marginBottom: 16}}>Welcome. Access the homeowner portal below.</p>
      <Link href="/portal" style={{border: '1px solid #000', borderRadius: 12, padding: '10px 14px', display: 'inline-block'}}>Open Homeowner Portal</Link>
    </main>
  );
}

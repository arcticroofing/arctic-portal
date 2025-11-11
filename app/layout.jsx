import "./globals.css";

export const metadata = {
  title: "Arctic Homeowner Portal",
  description: "Client portal for Arctic Roofing & Restoration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-arctic">{children}</body>
    </html>
  );
}

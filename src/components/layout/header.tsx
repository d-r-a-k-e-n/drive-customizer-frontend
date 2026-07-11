import SiteNav from "@/components/layout/siteNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <SiteNav />
    </header>
  );
}

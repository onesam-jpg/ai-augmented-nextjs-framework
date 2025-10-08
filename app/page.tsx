import ContactForm from '../components/ContactForm';

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <section className="relative overflow-hidden py-20 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_60%)]" />
        <h1 className="text-5xl font-bold tracking-tight">Build AI Agents Faster</h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          A minimal Next.js + TypeScript starter with Dev Container, Playwright E2E,
          and Vercel CI/CD wired in. Deploy previews are automatic.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a className="rounded-md bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500" href="https://vercel.com/new">Deploy Now</a>
          <a className="text-zinc-200 underline" href="https://nextjs.org/docs">Read Docs</a>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 p-5">
          <h3 className="text-lg font-semibold">Dev Container</h3>
          <p className="mt-2 text-sm text-zinc-400">Consistent environment with Node 20, pnpm, and performance-tuned VS Code settings.</p>
        </div>
        <div className="rounded-lg border border-zinc-800 p-5">
          <h3 className="text-lg font-semibold">E2E by Playwright</h3>
          <p className="mt-2 text-sm text-zinc-400">Cross-browser tests with traces and reports that gate deployments.</p>
        </div>
        <div className="rounded-lg border border-zinc-800 p-5">
          <h3 className="text-lg font-semibold">CI/CD via Vercel</h3>
          <p className="mt-2 text-sm text-zinc-400">Automatic Preview on PRs and Production on main; least-privilege secrets.</p>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 p-6">
          <h3 className="text-xl font-semibold">Testimonials</h3>
          <p className="mt-2 text-zinc-400">“This starter cut our setup time from days to hours.”</p>
          <p className="mt-1 text-sm text-zinc-500">— A happy team</p>
        </div>
        <div className="rounded-lg border border-zinc-800 p-6">
          <h3 className="text-xl font-semibold">Pricing</h3>
          <ul className="mt-2 text-zinc-400 list-disc pl-5">
            <li>Free: Use as-is under your repo</li>
            <li>Pro: Extend with your CI/CD, tools, and governance</li>
          </ul>
        </div>
      </section>

      <section className="prose prose-invert mt-16">
        <h3>FAQ</h3>
        <p><strong>How do I deploy?</strong> Use the GitHub Actions workflow or <code>scripts/deploy.sh</code>.</p>
        <p><strong>Can I add my tools?</strong> Yes—configure in the Dev Container, governance, and MCP config.</p>
      </section>

      <section className="mt-16 border-t border-zinc-800 pt-12">
        <h2 className="text-center text-3xl font-semibold">Contact Us</h2>
        <ContactForm />
      </section>
    </main>
  );
}

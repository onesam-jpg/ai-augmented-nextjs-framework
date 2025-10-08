import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import ThemeToggle from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'AI Agentic Next.js Starter',
  description: 'Launch faster with a production-ready AI/Next.js scaffold.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-no-flash" strategy="beforeInteractive">
          {`
          (function(){
            try{
              var t=localStorage.getItem('theme');
              var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
              if(t==='dark'||(!t&&d)) document.documentElement.classList.add('dark');
              else document.documentElement.classList.remove('dark');
            }catch(e){}
          })();
          `}
        </Script>
      </head>
      <body>
        <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="font-semibold">AI Agentic Next.js Starter</div>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}

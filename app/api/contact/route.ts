import { NextResponse } from 'next/server';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  hp: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    // Honeypot: ignore bot submissions
    if (data.hp && data.hp.trim() !== '') {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Optional webhook integration
    if (process.env.CONTACT_WEBHOOK_URL) {
      try {
        await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
        });
      } catch {
        // Swallow webhook errors to avoid leaking infra details
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
  }
}

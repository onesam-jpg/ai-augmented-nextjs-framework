"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type FormData = z.infer<typeof Schema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');

  const onSubmit = async (data: FormData) => {
    setStatus('idle');
    // Client-side validate with zod as a safety net
    const parsed = Schema.safeParse(data);
    if (!parsed.success) return;
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setStatus('ok'); reset(); }
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-xl space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600" placeholder="Jane Doe" {...register('name', { required: true, minLength: 2 })} />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message || 'Name is required'}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600" placeholder="jane@example.com" type="email" {...register('email', { required: true })} />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message || 'Email is required'}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea id="message" className="mt-1 h-32 w-full resize-y rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600" placeholder="How can we help?" {...register('message', { required: true, minLength: 10 })} />
        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message || 'Please enter a message'}</p>}
      </div>
      {/* Honeypot field (hidden from users, visible to bots) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp">Do not fill</label>
        <input id="hp" tabIndex={-1} autoComplete="off" {...register('hp')} />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={isSubmitting} className="rounded-md bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 disabled:opacity-50" type="submit">
          {isSubmitting ? 'Sending…' : 'Send'}
        </button>
        {status === 'ok' && <span className="text-sm text-emerald-400">Thanks! We\'ll be in touch.</span>}
        {status === 'error' && <span className="text-sm text-red-400">Something went wrong. Try again.</span>}
      </div>
    </form>
  );
}

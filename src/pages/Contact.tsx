import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, Card, Button, inputClass } from "@/components/ui";
import { profile, social } from "@/data/profile";
import { Github, Linkedin, Mail, Send, IdCard, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // Local-only fallback: no backend configured. Opens the user's mail client
    // with the message pre-filled. Supabase contact_messages table is the
    // planned future transport.
    const subject = encodeURIComponent(`Hello from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    reset();
  };

  function downloadVcf() {
    const blob = new Blob([profile.vcfText], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-with-fox.vcf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Questions, feedback, or opportunities — my inbox is open."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <h2 className="mt-4 text-lg font-semibold">Your email client should be open</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-500 dark:text-ink-400">
                The message was pre-addressed to {profile.email}. If nothing happened, reach me
                directly at that address.
              </p>
              <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                Write another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input id="name" className={inputClass} placeholder="Your name" {...register("name")} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={inputClass}
                  placeholder="What's on your mind?"
                  {...register("message")}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                <Send className="h-4 w-4" /> Send Message
              </Button>
              <p className="text-xs text-ink-400">
                This form validates locally and hands off to your email client — no data is stored
                on this site.
              </p>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-semibold">Digital business card</h2>
            <div className="mt-4 rounded-xl border border-ink-200 bg-gradient-to-br from-ink-50 to-white p-5 dark:border-ink-700 dark:from-ink-900 dark:to-ink-900/60">
              <p className="text-lg font-semibold">🦊 {profile.brand}</p>
              <p className="text-sm text-accent-500">{profile.role}</p>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                {profile.email}
                <br />
                @code-with-fox
              </p>
            </div>
            <button
              onClick={downloadVcf}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink-300 px-4 py-2 text-sm hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
            >
              <IdCard className="h-4 w-4" /> Download Contact (.vcf)
            </button>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Elsewhere</h2>
            <ul className="mt-3 space-y-2">
              {social.map((s) => {
                const Icon = socialIcons[s.icon] ?? Mail;
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
                    >
                      <Icon className="h-4 w-4 text-accent-500" />
                      <span className="font-medium">{s.label}</span>
                      <span className="ml-auto truncate text-xs text-ink-400">{s.handle}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

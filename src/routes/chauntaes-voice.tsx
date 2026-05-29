import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection, CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Shield, Phone, HeartHandshake, Scale, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/chauntaes-voice")({
  head: () => ({
    meta: [
      { title: "Chauntae's Voice — Domestic Violence Support | LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Chauntae's Voice is a domestic violence support initiative of LuxeNova Community Wellness, established in loving memory of Chauntae Renee Jones (1985–1999). Confidential safety planning, shelter and legal referrals, and trauma-informed advocacy for women and families.",
      },
      { property: "og:title", content: "Chauntae's Voice — In Loving Memory" },
      {
        property: "og:description",
        content:
          "A domestic violence support initiative in honor of Chauntae Renee Jones. Helping women and families find safety, dignity, and a path forward.",
      },
    ],
  }),
  component: ChauntaesVoicePage,
});

function ChauntaesVoicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Chauntae's Voice · In Loving Memory"
          title="A voice for women who can no longer speak for themselves."
          description="Chauntae's Voice is a domestic violence support initiative of LuxeNova Community Wellness, established in honor of Chauntae Renee Jones (1985–1999). What was taken from her, we work every day to protect for others."
        />

        <ContentSection title="Her story is why we exist">
          <p>
            Chauntae Renee Jones was 14 years old and eight months pregnant when
            her life — and the life of her unborn daughter — was taken in
            Mattapan in September 1999. She was a friend. She was a daughter, a
            granddaughter, and a young woman with a future ahead of her.
          </p>
          <p>
            Nearly three decades later, women and girls are still being harmed,
            silenced, and lost. Chauntae's Voice exists so that survivors have
            somewhere to turn — with dignity, confidentiality, and follow-through
            — and so that her name continues to mean something in the
            communities she came from.
          </p>
        </ContentSection>

        <CardGrid
          columns={3}
          items={[
            {
              icon: Shield,
              title: "Safety Planning",
              body:
                "Confidential, one-on-one safety planning for women and families in unsafe homes — at their pace, in their language, on their terms.",
            },
            {
              icon: HeartHandshake,
              title: "Shelter & Support Referrals",
              body:
                "Warm referrals to vetted domestic violence shelters, counseling, and trauma-informed support partners across Massachusetts.",
            },
            {
              icon: Scale,
              title: "Legal Navigation",
              body:
                "Guidance on restraining orders, custody questions, and connection to legal aid partners — without judgment and without rushing.",
            },
          ]}
        />

        <CalloutNote>
          <p className="font-display text-lg text-foreground">If you are in immediate danger, call 911.</p>
          <p className="mt-3">
            For 24/7 confidential support, the <strong>National Domestic
            Violence Hotline</strong> is available at{" "}
            <a className="text-rosewood underline-offset-4 hover:underline" href="tel:18007997233">
              1-800-799-7233
            </a>{" "}
            or text <strong>"START" to 88788</strong>. In Massachusetts,{" "}
            <strong>SafeLink</strong> is reachable at{" "}
            <a className="text-rosewood underline-offset-4 hover:underline" href="tel:18779857300">
              1-877-785-2020
            </a>
            . You can also reach LuxeNova confidentially through our request
            form below.
          </p>
        </CalloutNote>

        <ContentSection title="How to reach us — confidentially">
          <p>
            Every Chauntae's Voice request is handled privately by a small,
            trained team. You do not need to share more than you are ready to
            share. We will listen first, then help you organize next steps.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/referrals"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
            >
              Confidential Request <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/30"
            >
              <Phone className="h-4 w-4" /> Contact our team
            </Link>
          </div>
        </ContentSection>

        <ContentSection>
          <div className="rounded-3xl border border-rosewood/30 bg-accent/40 p-7 text-center shadow-soft md:p-10">
            <p className="font-display text-2xl text-balance md:text-3xl">
              In loving memory of Chauntae Renee Jones
            </p>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              February 20, 1985 — September 28, 1999 · Boston, Massachusetts
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/80">
              Her voice was silenced, but it carries on through every woman who
              finds safety, every family that finds stability, and every
              survivor who is met with dignity.
            </p>
          </div>
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}

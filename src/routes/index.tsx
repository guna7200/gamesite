import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import mascots from "@/assets/mascots.png.asset.json";
import blueberry from "@/assets/jj-Blueberry_Coconut.png.asset.json";
import grape from "@/assets/jj-Grape.png.asset.json";
import kiwi from "@/assets/jj-Kiwi.png.asset.json";
import litchi from "@/assets/jj-Litchi.png.asset.json";
import strawberry from "@/assets/jj-Strawberry.png.asset.json";
import cBlue from "@/assets/char-Blue.png.asset.json";
import cYellow from "@/assets/char-Yellow.png.asset.json";
import cGreen from "@/assets/char-Green.png.asset.json";
import cRed from "@/assets/char-Red.png.asset.json";
import shotTitle from "@/assets/shot-25.webp.asset.json";
import shotStart from "@/assets/shot-24.webp.asset.json";
import shotPlay from "@/assets/shot-23.webp.asset.json";
import shotWin from "@/assets/results.png.asset.json";

export const GAME_URL = "https://jellyarena.digifox.live/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jelly Arena — Grab, Fill, Smash | Inspired by Jack & Jelly" },
      { name: "description", content: "A 60-second jelly brawl on an ocean arena, inspired by the colours of Jack & Jelly. Play Jelly Arena free in your browser." },
      { property: "og:title", content: "Jelly Arena — Inspired by Jack & Jelly" },
      { property: "og:description", content: "Grab your jellies, fill your totem, smash the rest. Play now in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FLAVORS = [
  { name: "Blueberry Coconut", img: blueberry.url, s: 1, color: "var(--fruit-blueberry)" },
  { name: "Grape", img: grape.url, s: 1.35, color: "var(--fruit-grape)" },
  { name: "Kiwi", img: kiwi.url, s: 1, color: "var(--fruit-kiwi)" },
  { name: "Litchi", img: litchi.url, s: 1.35, color: "var(--fruit-litchi)" },
  { name: "Strawberry", img: strawberry.url, s: 1.35, color: "var(--fruit-strawberry)" },
];

const FEATURES = [
  { t: "60-second matches", d: "Every round is a one-minute sprint. Fast to learn, hard to put down." },
  { t: "Fill your totem", d: "Grab jelly cubes in your colour and deposit them — first to 10/10 fires the totem." },
  { t: "Charge & smash", d: "Hit Space or the Charge button to slam rivals and knock their jellies loose." },
  { t: "Power-ups", d: "Keys 1, 2 and 3 trigger power-ups — like the freeze — to swing the match." },
  { t: "Four-way battles", d: "Red, Blue, Green and Yellow face off. Play as one, AI controls the rest." },
  { t: "Easy · Normal · Hard", d: "Pick your AI difficulty and play right in the browser, keyboard or touch." },
];

const GUIDES = [
  { name: "Blue", img: cBlue.url, color: "var(--fruit-blueberry)", step: "Step 1 · Move", say: "Wheee! Zoom me around with WASD or the arrow keys. I'm squishy but SPEEDY!", key: "WASD / ← ↑ → ↓" },
  { name: "Yellow", img: cYellow.url, color: "var(--warm)", step: "Step 2 · Grab", say: "Ooh, shiny cubes! Scoop up the jelly cubes in YOUR colour — they're yours, finders keepers!", key: "Grab cubes" },
  { name: "Green", img: cGreen.url, color: "var(--fruit-kiwi)", step: "Step 3 · Fill your totem", say: "Carry them home and drop them in your totem. Fill it to 10/10 and it FIRES! Kaboom!", key: "10/10 = win" },
  { name: "Red", img: cRed.url, color: "var(--fruit-strawberry)", step: "Step 4 · Charge & smash", say: "Someone in your way? Press SPACE to charge and bonk them! Keys 1 2 3 unleash power-ups!", key: "Space · 1 2 3" },
];

const SHOTS = [
  { src: shotTitle.url, c: "Title screen — pick your AI difficulty" },
  { src: shotStart.url, c: "Countdown on the ocean arena" },
  { src: shotPlay.url, c: "Mid-match: race to deposit your cubes" },
  { src: shotWin.url, c: "Totem fired — the match result" },
];

function PlayButton({ children = "Play Now", size = "lg" }: { children?: string; size?: "lg" | "md" }) {
  return (
    <a
      href={GAME_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-jelly inline-flex items-center gap-2 rounded-full bg-primary font-display uppercase tracking-wide text-primary-foreground shadow-[0_10px_0_var(--warm),0_20px_50px_-10px_var(--primary)] ${size === "lg" ? "px-10 py-4 text-2xl" : "px-6 py-2.5 text-lg"}`}
    >
      ▶ {children}
    </a>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset['parallax']);
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    addEventListener("scroll", on, { passive: true });
    run();
    return () => removeEventListener("scroll", on);
  }, []);
}

function Particles({ count = 18 }: { count?: number }) {
  const colors = FLAVORS.map((f) => f.color);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="anim-rise absolute bottom-[-20px] rounded-full blur-[1px]"
          style={{
            left: `${(i * 53) % 100}%`,
            width: 6 + (i % 4) * 4,
            height: 6 + (i % 4) * 4,
            background: colors[i % 5],
            boxShadow: `0 0 12px ${colors[i % 5]}`,
            animationDuration: `${9 + (i % 6) * 2}s`,
            animationDelay: `${-i * 1.3}s`,
          }}
        />
      ))}
    </div>
  );
}

function Index() {
  useReveal();
  useParallax();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const flavor = FLAVORS[active]!;
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => ((l ?? 0) + 1) % SHOTS.length);
      if (e.key === "ArrowLeft") setLightbox((l) => ((l ?? 0) + SHOTS.length - 1) % SHOTS.length);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [lightbox]);

  return (
    <div className="overflow-x-hidden">
      {/* NAV */}
      <header ref={navRef} className="fixed inset-x-0 top-0 z-40">
        <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-2 sm:px-6">
          <a href="#top" className="font-display text-xl text-primary sm:text-2xl">JELLY ARENA</a>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#flavors" className="hover:text-foreground">Inspiration</a>
            <a href="#bridge" className="hover:text-foreground">Bottle to Arena</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How to Play</a>
            <a href="#gallery" className="hover:text-foreground">Gallery</a>
          </nav>
          <PlayButton size="md" />
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24">
        <img src={shotPlay.url} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" data-parallax="0.15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--background)_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <Particles />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <p className="reveal glass mx-auto inline-block rounded-full px-4 py-1 text-sm text-accent">Inspired by Jack &amp; Jelly</p>
          <h1 className="reveal mt-5 font-display text-5xl leading-[0.95] text-primary drop-shadow-[0_6px_0_var(--warm)] sm:text-7xl md:text-8xl">
            Grab. Fill.<br />Smash the rest.
          </h1>
          <p className="reveal mx-auto mt-5 max-w-xl text-lg text-foreground/90">
            60 seconds. Four jellies. One ocean arena. Fill your totem first and fire it at your rivals.
          </p>
          <div className="reveal mt-8"><PlayButton /></div>
          <img src={mascots.url} alt="The four Jelly Arena characters: Blue, Red, Yellow and Green" className="anim-wobble mx-auto mt-10 w-full max-w-3xl drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" />
        </div>
      </section>

      {/* FLAVORS */}
      <section
        id="flavors"
        className="relative overflow-hidden py-24 transition-[background] duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 40%, color-mix(in oklab, ${flavor.color} 45%, transparent), var(--background) 70%)` }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal text-center">
            <p className="font-display text-accent">THE REAL-WORLD SPARK</p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl">Five flavours. One jelly world.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Jelly Arena takes its bounce from Jack &amp; Jelly — fruit drinks packed with jelly cubes. Their bold fruit colours and jiggly cubes became the spark for our arena.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 items-end gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {FLAVORS.map((f, i) => (
              <button
                key={f.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`reveal group relative flex flex-col items-center rounded-3xl p-3 outline-none transition ${active === i ? "glass" : ""} ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span aria-hidden className="absolute inset-x-6 bottom-8 top-12 rounded-full opacity-60 blur-3xl transition group-hover:opacity-100" style={{ background: f.color }} />
                <div data-parallax={(0.04 + (i % 3) * 0.03).toFixed(2)}>
                  <img
                    src={f.img}
                    alt={`Jack & Jelly ${f.name} bottle`}
                    loading="lazy"
                    className="anim-float relative h-60 w-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 sm:h-72"
                    style={{ animationDelay: `${-i * 1.1}s`, scale: String(f.s) }}
                  />
                </div>
                <span className="relative mt-3 font-display text-lg" style={{ color: f.color }}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BRIDGE */}
      <section id="bridge" className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background),var(--ocean)_55%,var(--background))] py-24">
        <Particles count={10} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_auto_1fr]">
          <div className="reveal flex justify-center -space-x-16">
            {FLAVORS.map((f, i) => (
              <img key={f.name} src={f.img} alt="" aria-hidden loading="lazy" className="anim-float h-44 w-auto object-contain sm:h-56" style={{ animationDelay: `${-i * 0.9}s`, zIndex: i === 2 ? 5 : 5 - Math.abs(2 - i) }} />
            ))}
          </div>
          <div className="reveal text-center font-display text-6xl text-primary">→</div>
          <div className="reveal overflow-hidden rounded-3xl border-4 border-metal shadow-[0_0_60px_-10px_var(--arena)]">
            <img src={shotStart.url} alt="Jelly Arena characters on the green ocean arena" loading="lazy" className="w-full" />
          </div>
        </div>
        <div className="relative mx-auto mt-16 grid max-w-5xl gap-4 px-4 sm:grid-cols-3">
          {[
            ["Jelly cubes", "The cubes floating inside each bottle become the collectable cubes you race to grab."],
            ["Fruit colours", "Bold, juicy colours carry into the four glossy jelly fighters and their totems."],
            ["Bounce & shine", "Glossy bottles inspired the squishy, shiny feel of every jelly on the field."],
          ].map(([t, d], i) => (
            <div key={t} className="reveal glass rounded-3xl p-6" style={{ transitionDelay: `${i * 100}ms` }}>
              <h3 className="font-display text-2xl text-primary">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal text-center">
            <p className="font-display text-accent">HOW IT PLAYS</p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl">Built for one-more-round</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.t} className="reveal glass group rounded-3xl p-6 transition hover:-translate-y-1" style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                <span className="anim-wobble inline-block h-10 w-10 rounded-full" style={{ background: FLAVORS[i % 5]!.color, boxShadow: `0 0 24px ${FLAVORS[i % 5]!.color}`, animationDelay: `${-i * 0.4}s` }} />
                <h3 className="mt-4 font-display text-2xl">{f.t}</h3>
                <p className="mt-2 text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="reveal glass mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-2xl px-6 py-4 text-sm text-muted-foreground">
            <span><b className="text-foreground">WASD / Arrows</b> move</span>
            <span><b className="text-foreground">Space</b> charge</span>
            <span><b className="text-foreground">1 2 3</b> power-ups</span>
            <span><b className="text-foreground">Esc</b> pause</span>
            <span><b className="text-foreground">M</b> mute</span>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY */}
      <section id="how" className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--arena)_25%,var(--background)),var(--background))] py-24">
        <Particles count={10} />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="reveal text-center">
            <p className="font-display text-accent">HOW TO PLAY</p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl">Let the jellies explain!</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">You've got 60 seconds. Four steps. Infinite wobble.</p>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {GUIDES.map((g, i) => (
              <div key={g.name} className={`reveal flex items-end gap-4 ${i % 2 ? "md:mt-16 md:flex-row-reverse" : ""}`} style={{ transitionDelay: `${(i % 2) * 120}ms` }}>
                <img src={g.img} alt={`${g.name} jelly`} loading="lazy" className="anim-wobble h-28 w-28 shrink-0 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.45)] sm:h-36 sm:w-36" style={{ animationDelay: `${-i * 0.6}s` }} />
                <div className="relative min-w-0 flex-1 rounded-3xl border-2 bg-card p-5 shadow-[0_10px_40px_-15px_var(--primary)]" style={{ borderColor: g.color }}>
                  <span className={`absolute bottom-6 h-5 w-5 rotate-45 border-2 bg-card -left-[11px] border-r-0 border-t-0 ${i % 2 ? "md:left-auto md:-right-[11px] md:border-r-2 md:border-t-2 md:border-b-0 md:border-l-0" : ""}`} style={{ borderColor: g.color }} />
                  <p className="font-display text-sm uppercase tracking-wide" style={{ color: g.color }}>{g.step}</p>
                  <p className="mt-2 text-lg leading-snug">"{g.say}"</p>
                  <span className="mt-3 inline-block rounded-full bg-muted px-3 py-1 font-display text-xs text-muted-foreground">{g.key}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-14 text-center">
            <p className="font-display text-2xl text-primary">"Ready? 3… 2… 1… JIGGLE!"</p>
            <div className="mt-6"><PlayButton>Let's Play</PlayButton></div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal text-center font-display text-4xl sm:text-6xl">Straight from the arena</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {SHOTS.map((s, i) => (
              <button key={s.c} onClick={() => setLightbox(i)} className="reveal group overflow-hidden rounded-3xl border-2 border-border text-left" style={{ transitionDelay: `${(i % 2) * 100}ms` }}>
                <img src={s.src} alt={s.c} loading="lazy" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />
                <p className="bg-card px-5 py-3 text-sm text-muted-foreground">{s.c}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div role="dialog" aria-modal aria-label="Screenshot viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur" onClick={() => setLightbox(null)}>
          <img src={SHOTS[lightbox]!.src} alt={SHOTS[lightbox]!.c} className="max-h-[85vh] max-w-full rounded-2xl" />
          <button aria-label="Close" className="glass absolute right-4 top-4 rounded-full px-4 py-2 font-display" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-28">
        <img src={shotTitle.url} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" data-parallax="0.1" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,var(--background)_75%)]" />
        <Particles count={12} />
        <div className="reveal relative mx-auto max-w-3xl px-4 text-center">
          <img src={mascots.url} alt="" aria-hidden loading="lazy" className="anim-wobble mx-auto w-full max-w-md" />
          <h2 className="mt-6 font-display text-5xl text-primary drop-shadow-[0_5px_0_var(--warm)] sm:text-7xl">Your totem is waiting</h2>
          <p className="mt-4 text-lg text-foreground/90">Free in your browser. No download. 60 seconds to glory.</p>
          <div className="mt-8"><PlayButton>Play Jelly Arena</PlayButton></div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Jelly Arena · Inspired by Jack &amp; Jelly. Product images belong to their owners.
      </footer>
    </div>
  );
}

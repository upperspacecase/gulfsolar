import Image from "next/image";
import Calculator from "./_components/Calculator";
import NzTime from "./_components/NzTime";
import TestimonialsCarousel from "./_components/TestimonialsCarousel";
import StatCounter from "./_components/StatCounter";
import settings from "../data/calculator-settings.json";

const savingsStats = [
  {
    value: "$2.4M",
    label: "estimated savings tracked",
  },
  {
    value: "318",
    label: "installs completed",
  },
  {
    value: "+12%",
    label: "power price change (12 mo)",
  },
];

const caseStudies = [
  {
    location: "Oneroa",
    size: "6.2 kW",
    result: "Bill range: $260 → $85–$120/month",
    note: "Matched to a north-facing roof with moderate shading.",
    image: "/gettyimages-836208384-2048x2048.jpg",
  },
  {
    location: "Surfdale",
    size: "4.8 kW",
    result: "Bill range: $190 → $60–$95/month",
    note: "Optimized for daytime usage and battery-ready wiring.",
    image: "/gettyimages-836208384-2048x2048.jpg",
  },
  {
    location: "Palm Beach",
    size: "7.1 kW",
    result: "Bill range: $320 → $110–$150/month",
    note: "Larger system to offset electric water heating.",
    image: "/gettyimages-836208384-2048x2048.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative min-h-screen bg-[url('/hcrop1450x1208@stretch@crop2@2x.png')] bg-cover bg-center p-6 md:p-10">
        <div className="mx-auto h-[calc(100vh-48px)] max-w-6xl rounded-[2px] bg-white/95 p-4 shadow-soft md:h-[calc(100vh-80px)] md:p-6">
          <div className="h-full overflow-y-auto rounded-[26px] bg-white">
            <section
              id="calculator"
              className="relative mx-4 mt-4 min-h-[520px] overflow-hidden rounded-3xl bg-slate-900 text-white md:min-h-[560px]"
            >
              <Image
                src="/science-in-hd-yqEJ8HQ8y2o-unsplash-scaled.webp"
                alt=""
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-xs text-white/80">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    GS
                  </span>
                  Gulf Solar
                </div>
                <div className="flex items-center gap-3">
                  <NzTime />
                  <details className="dropdown dropdown-end">
                    <summary className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/20">
                      ≡
                    </summary>
                    <ul className="menu dropdown-content z-[2] w-40 rounded-box bg-white p-2 text-sm text-slate-900 shadow">
                      <li>
                        <a href="#about">About us</a>
                      </li>
                      <li>
                        <a href="#estimate">Calculator</a>
                      </li>
                    </ul>
                  </details>
                </div>
              </div>

              <div className="absolute inset-x-8 bottom-8 md:inset-x-12">
                <div className="flex w-full items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Waiheke Solar installation done right.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm text-white/80">
                      We provide a full range of services designed to meet the
                      specific needs of our clients on Waiheke Island, Great
                      Barrier Island, and Auckland.
                    </p>
                  </div>
                  <a
                    href="#estimate"
                    className="btn btn-primary btn-sm md:btn-md self-end"
                  >
                    Get a free quote
                  </a>
                </div>
              </div>
            </section>

            <section id="saves" className="px-10 py-12 lg:px-14">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Stats
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-slate-900">
                Real installs, real savings — updated for Gulf homeowners.
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {savingsStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-6">
                    <p className="text-7xl font-semibold text-primary">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="estimate" className="mx-10 mb-10 mt-10">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Get your solar estimate in 60 seconds.
                  </h2>
                  <p className="mt-3 text-sm text-slate-600">
                    Email only. We send your breakdown and one follow-up. No
                    pressure.
                  </p>
                </div>
                <Calculator settings={settings} />
              </div>
            </section>

            <section className="px-10 pb-16 lg:px-14">
              <TestimonialsCarousel items={caseStudies} />
            </section>


            <section className="px-10 pb-16 lg:px-14">
              <div className="rounded-3xl bg-slate-900 px-10 py-12 text-white">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <h2 className="text-3xl font-semibold">
                      Ready to see your Gulf Solar range?
                    </h2>
                    <p className="mt-3 text-sm text-white/70">
                      Get the breakdown in your inbox and decide if it makes
                      sense. No pressure, just clarity.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        Email only
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        One follow-up
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        Local assumptions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start lg:justify-end">
                    <a href="#estimate" className="btn btn-primary">
                      Get my estimate breakdown
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section id="about" className="px-10 pb-20 lg:px-14">
              <div className="rounded-3xl bg-slate-50 p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Founder’s note
                </p>
                <div className="mt-4 grid gap-6 md:grid-cols-[120px_1fr] md:items-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full">
                    <Image
                      src="/eel.jpg"
                      alt="Founder portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      We built this to make the decision easier.
                    </h3>
                    <p className="mt-4 text-sm text-slate-600">
                      I started Gulf Solar after watching neighbors on Waiheke get
                      buried in confusing quotes. We built a calculator-first process
                      so you can see the numbers before any sales chat. If our
                      estimate helps you decide, great. If not, you still get clarity.
                    </p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      — Alex, Founder
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="px-10 pb-12 lg:px-14">
              <div className="rounded-3xl border border-slate-200 bg-white px-10 py-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3 text-slate-900">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold">
                      GS
                    </span>
                    <span className="text-sm font-semibold">Gulf Solar</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
                    <a href="#calculator" className="hover:text-slate-900">
                      Residential
                    </a>
                    <a href="#saves" className="hover:text-slate-900">
                      Commercial
                    </a>
                    <a href="#about" className="hover:text-slate-900">
                      About us
                    </a>
                    <a href="#estimate" className="hover:text-slate-900">
                      Contact
                    </a>
                  </div>

                  <a href="#estimate" className="btn btn-primary btn-sm">
                    Get a free quote →
                  </a>
                </div>

                <div className="mt-10 flex flex-col gap-6 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-300">Privacy Policy</span>
                    <span className="text-slate-300">Designed by: Gulf Solar</span>
                  </div>
                  <p>© 2026 Gulf Solar. All rights reserved.</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
                      IG
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
                      FB
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Image
                    src="/Add a heading.png"
                    alt="Gulf Solar"
                    width={2000}
                    height={300}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

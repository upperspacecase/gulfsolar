"use client";

import Image from "next/image";

const photos = [
  { src: "/Statics/DSC00151.JPG", alt: "Solar panel installation detail" },
  { src: "/Statics/DSC00152.JPG", alt: "Rooftop solar array" },
  { src: "/Statics/DSC00155.JPG", alt: "Solar panel close-up" },
  { src: "/Statics/DSC00158.JPG", alt: "Installation in progress" },
  { src: "/Statics/DSC00182.JPG", alt: "Completed solar installation" },
  { src: "/Statics/DSC00149.JPG", alt: "Panel mounting work" },
];

export default function PhotoGalleryStrip() {
  return (
    <section className="relative overflow-hidden bg-stone">
      {/* Mobile: horizontal scroll */}
      <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start relative w-[80vw] h-[250px]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="80vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop: auto-scrolling marquee */}
      <div className="hidden md:block overflow-hidden">
        <div className="flex animate-marquee gap-1" style={{ width: "max-content" }}>
          {[...photos, ...photos].map((photo, i) => (
            <div
              key={i}
              className="flex-shrink-0 relative w-[400px] lg:w-[500px] h-[300px]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

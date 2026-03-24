import "./globals.css";

export const metadata = {
  title: "Gulf Solar | Waiheke Island Solar Installers",
  description:
    "Premium solar panel installation for Waiheke Island, Great Barrier Island, and the Hauraki Gulf. Expert island solar systems built for salt, wind, and longevity.",
  openGraph: {
    title: "Gulf Solar | Hauraki Gulf Solar Installers",
    description:
      "Premium solar panel installation for Waiheke Island, Great Barrier Island, and the Hauraki Gulf. Expert island solar systems.",
    url: "https://gulfsolar.co.nz",
    siteName: "Gulf Solar",
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: "/Statics/DSC00174.JPG",
        width: 1200,
        height: 630,
        alt: "Gulf Solar — Island Solar Installation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Solar | Hauraki Gulf Solar Installers",
    description:
      "Premium solar installations for Waiheke Island, Great Barrier Island, and the Hauraki Gulf.",
    images: ["/Statics/DSC00174.JPG"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: new URL("https://gulfsolar.co.nz"),
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Gulf Solar",
    description:
      "Premium solar panel installation for Waiheke Island, Great Barrier Island, and the Hauraki Gulf.",
    url: "https://gulfsolar.co.nz",
    telephone: "+64225225012",
    email: "info@gulfsolar.co.nz",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -36.7833,
        longitude: 175.0833,
      },
      geoRadius: "80000",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Waiheke Island",
      addressRegion: "Auckland",
      addressCountry: "NZ",
    },
    sameAs: [],
  };

  return (
    <html lang="en" data-theme="gulf">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}

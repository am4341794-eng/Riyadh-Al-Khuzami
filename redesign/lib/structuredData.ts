import { COMPANY, DISCIPLINES } from "./content";

/**
 * schema.org description of the business.
 *
 * Emitted as JSON-LD in the document head so search engines and knowledge
 * panels can read the company's identity, contact details and service list —
 * none of which are machine-readable from a canvas-and-SVG landing page.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: COMPANY.nameAr,
    alternateName: COMPANY.nameEn,
    url: COMPANY.websiteHref,
    logo: `${COMPANY.websiteHref}/brand/logo.jpeg`,
    description: COMPANY.tagline,
    foundingDate: String(COMPANY.foundedYear),
    telephone: COMPANY.phone,
    email: COMPANY.email,
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      postOfficeBoxNumber: "301328",
      addressLocality: "الرياض",
      postalCode: "12223",
      addressCountry: "SA",
    },
    knowsLanguage: ["ar", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "مجالات التخصص",
      itemListElement: DISCIPLINES.map((discipline) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: discipline.title,
          alternateName: discipline.en,
          description: discipline.summary,
        },
      })),
    },
  };
}

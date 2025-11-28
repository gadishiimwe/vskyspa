import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  canonical?: string;
  image?: string;
  type?: string;
  twitterCardType?: string;
  keywords?: string[];
  siteName?: string;
  jsonLd?: Array<Record<string, unknown>>;
  additionalMetaTags?: React.ReactNode;
}

/**
 * SEO component to add meta tags, Open Graph, Twitter Cards, and canonical link
 * Usage: pass unique title, description, url, and optional open graph & twitter data
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  canonical,
  image,
  type = "website",
  twitterCardType = "summary_large_image",
  keywords = [],
  siteName = "V&SKY SPA",
  jsonLd,
  additionalMetaTags,
}) => {
  const canonicalUrl = canonical || url;
  const structuredData = jsonLd?.filter(Boolean) ?? [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical Link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script
          key={`ldjson-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Additional meta tags */}
      {additionalMetaTags}
    </Helmet>
  );
};

export default SEO;

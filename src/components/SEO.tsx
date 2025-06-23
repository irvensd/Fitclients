import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title = "FitClient - Simple CRM Software for Personal Trainers",
  description = "Manage your personal training business effortlessly with FitClient CRM. Schedule sessions, track payments, monitor client progress, and grow your fitness business.",
  keywords = "personal trainer software, fitness CRM, client management software, personal training business",
  image = "https://fitclients-4c5f2.web.app/og-image.png",
  url = "https://fitclients-4c5f2.web.app",
  type = "website"
}: SEOProps) => {
  const fullTitle = title.includes('FitClient') ? title : `${title} | FitClient`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO; 
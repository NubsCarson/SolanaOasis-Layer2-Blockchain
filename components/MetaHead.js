import Head from 'next/head';

const MetaHead = ({ title, description }) => {
  const defaultTitle = "Solana Oasis Layer2";
  const defaultDescription = "A high-performance Layer 2 solution for Solana, enabling scalable AI computation";
  const defaultImage = "/oasis.png";
  const siteUrl = "https://solanaoasis.vercel.app";

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="title" content={title || defaultTitle} />
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={`${siteUrl}${defaultImage}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={title || defaultTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={`${siteUrl}${defaultImage}`} />
      <meta name="twitter:creator" content="@MoneroSolana" />

      {/* Favicon */}
      <link rel="icon" href="/oasis.png" />
      <link rel="apple-touch-icon" href="/oasis.png" />

      {/* Additional Meta */}
      <meta name="theme-color" content="#7C3AED" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
};

export default MetaHead; 
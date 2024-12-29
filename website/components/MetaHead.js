import Head from 'next/head';

const MetaHead = ({ title, description }) => {
  const defaultTitle = "Solana Oasis Layer2";
  const defaultDescription = "A high-performance Layer 2 solution for Solana, enabling scalable AI computation";
  const defaultImage = "/oasis.png";
  const siteUrl = "https://solana-oasis.vercel.app";
  const absoluteImageUrl = `${siteUrl}${defaultImage}`;

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
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
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
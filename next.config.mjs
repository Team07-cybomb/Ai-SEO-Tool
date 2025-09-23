/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ static export enable
 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ required for static export if using <Image />
  },
};
 
export default nextConfig;
 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Foto galeri disimpan di Cloudinary
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  allowedDevOrigins:['192.168.100.17'],
};

export default nextConfig;

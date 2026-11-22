import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevents ESLint errors from failing the build on Vercel
    ignoreDuringBuilds: true,
  },
  // Permitir cargar imágenes desde el dominio local (para las fotos de perfil subidas)
  images: {
    domains: ['localhost'],
  },
  // Opciones de configuración experimentales
  experimental: {
    serverActions: {
      // Aumentamos el límite de tamaño para los Server Actions (para subir imágenes)
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;

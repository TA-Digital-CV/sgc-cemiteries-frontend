import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Função para parsear domains de variável de ambiente
type RemotePattern = {
  protocol?: "https" | "http";
  hostname: string;
  port?: string;
  pathname?: string;
};

const getRemotePatterns = (): RemotePattern[] => {
  const patterns: RemotePattern[] = [];

  // Adicionar domains extras via env (separados por vírgula)
  // Ex: NEXT_PUBLIC_ALLOWED_DOMAINS=example.com,cdn.example.com
  const extraDomains =
    process.env.NEXT_PUBLIC_ALLOWED_DOMAINS?.split(",") || [];

  extraDomains.forEach((domain) => {
    const trimmedDomain = domain.trim();
    if (trimmedDomain) {
      patterns.push({
        protocol: "https" as const,
        hostname: trimmedDomain,
      });
    }
  });

  return patterns;
};

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: basePath,
  images: {
    remotePatterns: getRemotePatterns(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

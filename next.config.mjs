/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tokentool.io',
                port: '',
                pathname: '/**',
            }]
    },
    env: {
        nextPublicWalletConnectProjectID: '03ce2a3b8eed74d935e1bf886b9d3755',
        nextPublicRainbowKitProjectID: '0223afa9d737c7dca5ee7da65f2b9e97',
    }
};

export default nextConfig;

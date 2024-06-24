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
        nextRaydiumCpSwapDevnet: 'CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW',
        nextRaydiumCpSwapMainnet: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
        nextLiquidityLockerDevnet: '4ycA4x1FJdbFsa6XQZrDaCBBefaDDzZnQMubavi3jpEx',
        nextLiquidityLockerMainnet: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
        nextNftStorageApiKey: 'f07d1484.bb78513c38b54a3fa48b069b1ffaca1d'
    }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.nivato.ir',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;

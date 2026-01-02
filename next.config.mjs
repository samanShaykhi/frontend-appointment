/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nivato.ir',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;

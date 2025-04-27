/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/api/auth/login',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
      },
    ]
  },

  images: {
    domains: [
      'gravatar.com',
      'lh3.googleusercontent.com',
      'googleusercontent.com'
    ],
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }
    return config
  }
}

module.exports = nextConfig

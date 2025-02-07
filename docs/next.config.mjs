import nextra from 'nextra'

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  basePath: process.env.NODE_ENV !== 'production' ? '' : '/docs'
}

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  search: {
    codeblocks: false
  }
})

export default withNextra(nextConfig)
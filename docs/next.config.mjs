import nextra from 'nextra'

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export'
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
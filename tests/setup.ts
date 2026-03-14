import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    const React = require('react')
    return React.createElement('img', { src, alt })
  },
}))

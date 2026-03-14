import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

// next/image is already mocked in setup.ts

vi.mock('@/lib/fonts', () => ({
  bebas: { className: 'bebas-mock' },
  playfair: { className: 'playfair-mock' },
}))

vi.mock('@/components/ui/PhishWiseLogo', () => ({
  PhishWiseLogo: () => React.createElement('div', { 'data-testid': 'phishwise-logo' }, 'Logo'),
}))

import { useSession, signOut } from 'next-auth/react'
import { Navbar } from '@/components/dashboard/Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders PhishWise brand text', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'USER', schoolId: null, image: null } },
      status: 'authenticated',
      update: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(screen.getByText('PHISH')).toBeDefined()
    expect(screen.getByText('WISE')).toBeDefined()
  })

  it('renders user nav items (Dashboard, Training) for USER role', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'USER', schoolId: null, image: null } },
      status: 'authenticated',
      update: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Training').length).toBeGreaterThan(0)
    expect(screen.queryByText('Overview')).toBeNull()
    expect(screen.queryByText('Users')).toBeNull()
  })

  it('renders manager nav items (Overview, Users, Training) for MANAGER role', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'manager-1', name: 'Manager User', email: 'manager@example.com', role: 'MANAGER', schoolId: 'school-1', image: null } },
      status: 'authenticated',
      update: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Users').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Training').length).toBeGreaterThan(0)
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  it('renders manager nav items for ADMIN role', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', schoolId: 'school-1', image: null } },
      status: 'authenticated',
      update: vi.fn(),
    } as any)

    render(<Navbar />)

    // ADMIN shares the manager nav (isManager check includes ADMIN)
    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Users').length).toBeGreaterThan(0)
  })

  it('renders sign out button when user is logged in', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'USER', schoolId: null, image: null } },
      status: 'authenticated',
      update: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(screen.getByText('Sign out')).toBeDefined()
  })
})

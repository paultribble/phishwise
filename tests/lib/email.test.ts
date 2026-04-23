import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = { ...process.env }

// Mock send function
const mockSend = vi.fn().mockResolvedValue({ id: 'mock-id' })

// Mock resend with a proper class constructor
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend }
    },
  }
})

describe('sendEmail (Resend)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockSend.mockResolvedValue({ id: 'mock-id' })
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.NEXTAUTH_SECRET = 'test-secret'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('sends email when RESEND_API_KEY is set', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test Subject',
      html: '<p>Test body</p>',
      fromName: 'Test Sender',
    })

    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test body</p>',
        from: 'Test Sender <noreply@phishwise.org>',
      })
    )
  })

  it('logs warning and returns when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })

    expect(warnSpy).toHaveBeenCalledWith(
      '[Email] RESEND_API_KEY not configured. Email not sent:'
    )
    expect(mockSend).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('uses correct fromField format with fromName', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Security Alert',
      html: '<p>Alert</p>',
      fromName: 'Amazon Account Security',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Amazon Account Security <noreply@phishwise.org>',
      })
    )
  })

  it('uses base email when no fromName provided', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@phishwise.org',
      })
    )
  })

  it('adds reply_to when replyTo is provided', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      replyTo: 'security@amazon.com',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        reply_to: 'security@amazon.com',
      })
    )
  })

  it('does not add reply_to when replyTo is not provided', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.reply_to).toBeUndefined()
  })

  it('handles Resend SDK errors gracefully', async () => {
    mockSend.mockRejectedValue(new Error('Resend API error'))

    const { sendEmail } = await import('@/lib/email')

    await expect(
      sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      })
    ).rejects.toThrow('Resend error: Resend API error')
  })

  it('adds unsubscribe footer when isSimulation is true and userId provided', async () => {
    process.env.NEXTAUTH_URL = 'https://phishwise.org'

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test Simulation',
      html: '<p>Click here</p>',
      isSimulation: true,
      userId: 'user-123',
    })

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain('Unsubscribe from simulations')
    expect(callArgs.html).toContain('phishing awareness simulation')
    expect(callArgs.html).toContain('/api/users/unsubscribe?token=')
  })

  it('does NOT add unsubscribe footer when isSimulation is false', async () => {
    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Regular Email',
      html: '<p>Normal content</p>',
      isSimulation: false,
      userId: 'user-123',
    })

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).not.toContain('Unsubscribe from simulations')
    expect(callArgs.html).toBe('<p>Normal content</p>')
  })
})

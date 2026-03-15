import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = { ...process.env }

describe('sendEmail (SendGrid only)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    delete process.env.SENDGRID_API_KEY
    delete process.env.SENDER_EMAIL
  })

  afterEach(() => {
    process.env.SENDGRID_API_KEY = originalEnv.SENDGRID_API_KEY
    process.env.SENDER_EMAIL = originalEnv.SENDER_EMAIL
  })

  it('sends email via SendGrid when SENDGRID_API_KEY is set', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key'

    const mockSetApiKey = vi.fn()
    const mockSend = vi.fn().mockResolvedValue([{}])
    const sgMailMock = { default: { setApiKey: mockSetApiKey, send: mockSend } }

    vi.doMock('@sendgrid/mail', () => sgMailMock)

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })

    expect(mockSetApiKey).toHaveBeenCalledWith('SG.test-key')
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>test</p>',
        from: 'noreply@phishwise.app',
      })
    )
  })

  it('uses custom from address when provided', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key'

    const mockSetApiKey = vi.fn()
    const mockSend = vi.fn().mockResolvedValue([{}])
    const sgMailMock = { default: { setApiKey: mockSetApiKey, send: mockSend } }

    vi.doMock('@sendgrid/mail', () => sgMailMock)

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>test</p>',
      from: 'security@verify-account.com',
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'security@verify-account.com',
      })
    )
  })

  it('uses SENDER_EMAIL environment variable as fallback', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key'
    process.env.SENDER_EMAIL = 'custom@example.com'

    const mockSetApiKey = vi.fn()
    const mockSend = vi.fn().mockResolvedValue([{}])
    const sgMailMock = { default: { setApiKey: mockSetApiKey, send: mockSend } }

    vi.doMock('@sendgrid/mail', () => sgMailMock)

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'custom@example.com',
      })
    )
  })

  it('throws when SendGrid API key is not configured', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })

    expect(warnSpy).toHaveBeenCalledWith('[Email] SENDGRID_API_KEY not configured. Email not sent:')
    warnSpy.mockRestore()
  })

  it('throws when SendGrid API returns an error', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key'

    const mockSetApiKey = vi.fn()
    const mockSend = vi.fn().mockRejectedValue(new Error('SendGrid API error'))
    const sgMailMock = { default: { setApiKey: mockSetApiKey, send: mockSend } }

    vi.doMock('@sendgrid/mail', () => sgMailMock)

    const { sendEmail } = await import('@/lib/email')

    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })
    ).rejects.toThrow('SendGrid error: SendGrid API error')
  })
})

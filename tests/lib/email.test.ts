import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = { ...process.env }

describe('sendEmail', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    // Clear relevant env vars before each test
    delete process.env.RESEND_API_KEY
    delete process.env.SENDGRID_API_KEY
  })

  afterEach(() => {
    // Restore env
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY
    process.env.SENDGRID_API_KEY = originalEnv.SENDGRID_API_KEY
  })

  it('uses Resend when RESEND_API_KEY is set', async () => {
    process.env.RESEND_API_KEY = 'test-resend-key'

    const mockSend = vi.fn().mockResolvedValue({ error: null })
    const mockResendInstance = { emails: { send: mockSend } }

    class MockResend {
      constructor(key: string) {}
      emails = mockResendInstance.emails
    }

    vi.doMock('resend', () => ({ Resend: MockResend }))

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })

    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>test</p>',
      })
    )
  })

  it('throws when Resend returns an error', async () => {
    process.env.RESEND_API_KEY = 'test-resend-key'

    const mockSend = vi.fn().mockResolvedValue({ error: { message: 'Resend API error' } })
    const mockResendInstance = { emails: { send: mockSend } }

    class MockResend {
      constructor(key: string) {}
      emails = mockResendInstance.emails
    }

    vi.doMock('resend', () => ({ Resend: MockResend }))

    const { sendEmail } = await import('@/lib/email')

    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })
    ).rejects.toThrow('Resend error: Resend API error')
  })

  it('uses SendGrid when only SENDGRID_API_KEY is set', async () => {
    process.env.SENDGRID_API_KEY = 'test-sendgrid-key'

    const mockSetApiKey = vi.fn()
    const mockSend = vi.fn().mockResolvedValue([{}, {}])
    const sgMailMock = { default: { setApiKey: mockSetApiKey, send: mockSend } }

    vi.doMock('@sendgrid/mail', () => sgMailMock)

    const { sendEmail } = await import('@/lib/email')

    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })

    expect(mockSetApiKey).toHaveBeenCalledWith('test-sendgrid-key')
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>test</p>',
      })
    )
  })

  it('logs to console and does not throw when neither key is set', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { sendEmail } = await import('@/lib/email')

    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>test</p>' })
    ).resolves.toBeUndefined()

    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})

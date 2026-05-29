import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'LuxeNova Community Wellness'
const SENDER_DOMAIN = 'notify.luxenovataxandfinancials.com'
const FROM_DOMAIN = 'notify.luxenovataxandfinancials.com'

const FieldSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().max(4000),
})

const BodySchema = z.object({
  formName: z.string().min(1).max(120),
  fields: z.array(FieldSchema).min(1).max(60),
})

const WINDOW_SECONDS = 60
const MAX_PER_WINDOW = 5

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const Route = createFileRoute('/api/public/notify-staff')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json(
            { error: 'Server configuration error' },
            { status: 500 },
          )
        }

        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          'unknown'
        if (rateLimited(ip)) {
          return Response.json({ error: 'Too many requests' }, { status: 429 })
        }

        let parsed
        try {
          const json = await request.json()
          parsed = BodySchema.safeParse(json)
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid payload', details: parsed.error.flatten() },
            { status: 400 },
          )
        }

        const { formName, fields } = parsed.data
        const templateName = 'staff-notification'
        const template = TEMPLATES[templateName]
        const recipient = template.to!
        const messageId = crypto.randomUUID()
        const submittedAt = new Date().toISOString()

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Ensure an unsubscribe token exists for the recipient (required by queue).
        const normalized = recipient.toLowerCase()
        const { data: existing } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token')
          .eq('email', normalized)
          .maybeSingle()
        let unsubscribeToken = existing?.token
        if (!unsubscribeToken) {
          unsubscribeToken = generateToken()
          await supabase
            .from('email_unsubscribe_tokens')
            .upsert(
              { token: unsubscribeToken, email: normalized },
              { onConflict: 'email', ignoreDuplicates: true },
            )
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalized)
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        const data = { formName, submittedAt, fields }
        const element = React.createElement(template.component, data)
        const html = await render(element)
        const plainText = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function'
            ? template.subject(data)
            : template.subject

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: templateName,
          recipient_email: recipient,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text: plainText,
            purpose: 'transactional',
            label: templateName,
            idempotency_key: messageId,
            unsubscribe_token: unsubscribeToken,
            queued_at: submittedAt,
          },
        })

        if (enqueueError) {
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json(
            { error: 'Failed to enqueue email' },
            { status: 500 },
          )
        }

        return Response.json({ success: true })
      },
    },
  },
})

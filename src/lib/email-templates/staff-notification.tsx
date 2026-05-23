import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'LuxeNova Community Wellness'
const STAFF_EMAIL = 'tjohnson@luxenovawellnesscommunity.com'

interface StaffNotificationProps {
  formName?: string
  submittedAt?: string
  fields?: Array<{ label: string; value: string }>
}

const StaffNotificationEmail = ({
  formName = 'Website form',
  submittedAt,
  fields = [],
}: StaffNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New {formName} submission for {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New submission: {formName}</Heading>
        <Text style={meta}>
          {SITE_NAME}
          {submittedAt ? ` · ${submittedAt}` : ''}
        </Text>
        <Hr style={hr} />
        <Section>
          {fields.length === 0 ? (
            <Text style={text}>No fields were submitted.</Text>
          ) : (
            fields.map((f, i) => (
              <Section key={i} style={{ marginBottom: 14 }}>
                <Text style={label}>{f.label}</Text>
                <Text style={value}>{f.value || '—'}</Text>
              </Section>
            ))
          )}
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          This message was generated automatically from a form on{' '}
          {SITE_NAME}. Replies should be sent directly to the submitter.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: StaffNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New ${data?.formName || 'website'} submission — ${SITE_NAME}`,
  displayName: 'Staff form notification',
  to: STAFF_EMAIL,
  previewData: {
    formName: 'Food Drive Interest Form',
    submittedAt: new Date().toISOString(),
    fields: [
      { label: 'Full Name', value: 'Jane Doe' },
      { label: 'Email', value: 'jane@example.com' },
    ],
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = { padding: '28px 28px', maxWidth: '600px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 6px',
}
const meta = { fontSize: '12px', color: '#7a7a7a', margin: '0' }
const hr = { borderColor: '#eaeaea', margin: '20px 0' }
const label = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#8a6b5c',
  margin: '0 0 2px',
}
const value = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6' }
const footer = {
  fontSize: '11px',
  color: '#999',
  margin: '20px 0 0',
  lineHeight: '1.5',
}

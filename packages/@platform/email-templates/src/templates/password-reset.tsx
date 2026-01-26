/**
 * Password Reset Template
 *
 * Sent when a user requests to reset their password.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface PasswordResetEmailProps {
  userName?: string;
  resetUrl: string;
  expiresIn?: string;
}

export function PasswordResetEmail({
  userName,
  resetUrl,
  expiresIn = '1 hour',
}: PasswordResetEmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Reset your Hyyve password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hi{userName ? ` ${userName}` : ''},</Text>
          <Text style={text}>
            We received a request to reset your password. Click the button below
            to set a new password for your Hyyve account.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>This link expires in {expiresIn}.</Text>
          <Text style={warning}>
            If you didn&apos;t request a password reset, you can safely ignore
            this email. Your password will remain unchanged.
          </Text>
          <Text style={footer}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
};

const buttonContainer = {
  padding: '27px 48px 27px 48px',
};

const button = {
  backgroundColor: '#5046e5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
};

const warning = {
  color: '#9ca3af',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '22px',
  padding: '0 48px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};

const link = {
  color: '#5046e5',
  textDecoration: 'underline',
};

export default PasswordResetEmail;

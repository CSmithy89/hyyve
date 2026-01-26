/**
 * Email Verification Template
 *
 * Sent when a user registers to verify their email address.
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

export interface VerificationEmailProps {
  userName?: string;
  verificationUrl: string;
  expiresIn?: string;
}

export function VerificationEmail({
  userName,
  verificationUrl,
  expiresIn = '24 hours',
}: VerificationEmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Verify your Hyyve account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Hyyve{userName ? `, ${userName}` : ''}!</Heading>
          <Text style={text}>
            Thanks for signing up! Please verify your email address to complete
            your account setup and start building amazing AI workflows.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            This link expires in {expiresIn}. If you didn&apos;t create a Hyyve
            account, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
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

export default VerificationEmail;

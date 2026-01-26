/**
 * Team Invitation Template
 *
 * Sent when a user is invited to join a team/workspace.
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

export interface TeamInvitationEmailProps {
  teamName: string;
  inviterName: string;
  inviteUrl: string;
  role?: string;
  expiresIn?: string;
}

export function TeamInvitationEmail({
  teamName,
  inviterName,
  inviteUrl,
  role = 'member',
  expiresIn = '7 days',
}: TeamInvitationEmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been invited to join {teamName} on Hyyve</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Team Invitation</Heading>
          <Text style={text}>
            <strong>{inviterName}</strong> has invited you to join{' '}
            <strong>{teamName}</strong> on Hyyve as a {role}.
          </Text>
          <Text style={text}>
            Join the team to start collaborating on AI workflows, agents, and
            more.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={inviteUrl}>
              Accept Invitation
            </Button>
          </Section>
          <Text style={text}>This invitation expires in {expiresIn}.</Text>
          <Text style={footer}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={inviteUrl} style={link}>
              {inviteUrl}
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

export default TeamInvitationEmail;

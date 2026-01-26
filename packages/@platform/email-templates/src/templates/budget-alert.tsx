/**
 * Budget Alert Template
 *
 * Sent when usage approaches or exceeds budget limits.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface BudgetAlertEmailProps {
  percentage: number;
  currentUsage: number;
  budgetLimit: number;
  dashboardUrl: string;
  workspaceName?: string;
}

export function BudgetAlertEmail({
  percentage,
  currentUsage,
  budgetLimit,
  dashboardUrl,
  workspaceName,
}: BudgetAlertEmailProps): React.ReactElement {
  const isWarning = percentage < 100;
  const alertEmoji = isWarning ? '⚠️' : '🚨';
  const alertLevel = percentage >= 100 ? 'exceeded' : percentage >= 90 ? 'critical' : 'warning';

  return (
    <Html>
      <Head />
      <Preview>
        {`${alertEmoji} Budget Alert: ${percentage}% of your limit ${percentage >= 100 ? 'exceeded' : 'reached'}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {alertEmoji} Budget {alertLevel === 'exceeded' ? 'Exceeded' : 'Alert'}
          </Heading>
          {workspaceName && (
            <Text style={text}>Workspace: {workspaceName}</Text>
          )}
          <Section style={usageBox}>
            <Text style={usageTitle}>Current Usage</Text>
            <Text style={usageAmount}>
              ${currentUsage.toFixed(2)}
              <span style={usageLimit}> / ${budgetLimit.toFixed(2)}</span>
            </Text>
            <Text style={usagePercent}>{percentage}% of budget</Text>
            <div style={progressContainer}>
              <div
                style={{
                  ...progressBar,
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor:
                    alertLevel === 'exceeded'
                      ? '#ef4444'
                      : alertLevel === 'critical'
                        ? '#f97316'
                        : '#fbbf24',
                }}
              />
            </div>
          </Section>
          <Text style={text}>
            {alertLevel === 'exceeded'
              ? 'Your usage has exceeded your budget limit. Your services may be affected. Please review your usage immediately.'
              : alertLevel === 'critical'
                ? 'You are approaching your budget limit. Consider upgrading your plan or reducing usage to avoid interruptions.'
                : 'You have used a significant portion of your budget. Monitor your usage to stay within limits.'}
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={alertLevel === 'exceeded' ? buttonDanger : buttonWarning}
              href={dashboardUrl}
            >
              View Usage Dashboard
            </Button>
          </Section>
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

const buttonWarning = {
  backgroundColor: '#f97316',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
};

const buttonDanger = {
  backgroundColor: '#ef4444',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
};

const usageBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  margin: '20px 48px',
  padding: '24px',
  textAlign: 'center' as const,
};

const usageTitle = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
};

const usageAmount = {
  color: '#1f2937',
  fontSize: '36px',
  fontWeight: '700',
  margin: '0 0 4px 0',
};

const usageLimit = {
  color: '#9ca3af',
  fontSize: '20px',
  fontWeight: '400',
};

const usagePercent = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const progressContainer = {
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  height: '8px',
  overflow: 'hidden',
  width: '100%',
};

const progressBar = {
  height: '100%',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
};

export default BudgetAlertEmail;

/**
 * Workflow Completion Template
 *
 * Sent when a workflow execution completes (success or failure).
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

export interface WorkflowCompletionEmailProps {
  workflowName: string;
  status: 'success' | 'failed';
  detailsUrl: string;
  executionTime?: string;
  errorMessage?: string;
}

export function WorkflowCompletionEmail({
  workflowName,
  status,
  detailsUrl,
  executionTime,
  errorMessage,
}: WorkflowCompletionEmailProps): React.ReactElement {
  const isSuccess = status === 'success';
  const statusEmoji = isSuccess ? '✅' : '❌';
  const statusText = isSuccess ? 'completed successfully' : 'failed';

  return (
    <Html>
      <Head />
      <Preview>
        {statusEmoji} Workflow &quot;{workflowName}&quot; {statusText}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {statusEmoji} Workflow {isSuccess ? 'Complete' : 'Failed'}
          </Heading>
          <Text style={text}>
            Your workflow <strong>&quot;{workflowName}&quot;</strong> has{' '}
            {statusText}.
          </Text>
          {executionTime && (
            <Text style={text}>Execution time: {executionTime}</Text>
          )}
          {!isSuccess && errorMessage && (
            <Section style={errorBox}>
              <Text style={errorText}>
                <strong>Error:</strong> {errorMessage}
              </Text>
            </Section>
          )}
          <Section style={buttonContainer}>
            <Button style={isSuccess ? buttonSuccess : buttonError} href={detailsUrl}>
              View Details
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

const buttonSuccess = {
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
};

const buttonError = {
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

const errorBox = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
  margin: '20px 48px',
  padding: '12px 16px',
};

const errorText = {
  color: '#991b1b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: 0,
  padding: 0,
};

export default WorkflowCompletionEmail;

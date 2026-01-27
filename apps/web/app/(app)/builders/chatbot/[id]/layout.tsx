/**
 * Chatbot Builder Layout
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC1: Three-panel layout
 *
 * Layout with header and full-height workspace.
 */

import { ChatbotBuilderHeader } from '@/components/builders/chatbot';

interface ChatbotBuilderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ChatbotBuilderLayout({
  children,
}: ChatbotBuilderLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <ChatbotBuilderHeader />
      {children}
    </div>
  );
}

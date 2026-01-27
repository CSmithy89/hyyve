/**
 * Sidebar Navigation Stories
 *
 * Story: 0-2-15 Create Storybook Visual Regression Baseline
 * Reference: Wireframe navigation components
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from '@/components/nav';

const meta: Meta<typeof AppSidebar> = {
  title: 'Navigation/Sidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main navigation sidebar with Hyyve branding. Appears on all authenticated pages.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background-dark">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-4">
        <p className="text-text-secondary">Main content area</p>
      </div>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-4">
        <p className="text-text-secondary">Content with collapsed sidebar</p>
      </div>
    </div>
  ),
};

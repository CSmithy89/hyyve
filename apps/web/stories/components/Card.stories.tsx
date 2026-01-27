/**
 * Card Component Stories
 *
 * Story: 0-2-15 Create Storybook Visual Regression Baseline
 * Reference: shadcn/ui Card with Hyyve overrides
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component with Hyyve dark theme styling. Used for content containers throughout the platform.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">
          This is the card content area. You can put any content here.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[300px] p-4">
      <p className="text-white">Simple card with content</p>
    </Card>
  ),
};

export const MetricCard: Story = {
  render: () => (
    <Card className="w-[200px] p-4">
      <div className="text-sm text-text-secondary mb-1">Total Users</div>
      <div className="text-3xl font-bold text-white">2,341</div>
      <div className="text-xs text-emerald-400 mt-2">+5.2% from last week</div>
    </Card>
  ),
};

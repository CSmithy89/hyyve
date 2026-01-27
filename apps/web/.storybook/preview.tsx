/**
 * Storybook Preview Configuration
 *
 * Story: 0-2-15 Create Storybook Visual Regression Baseline
 */

import type { Preview } from '@storybook/react';
import React from 'react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#121121' },
        { name: 'light', value: '#f6f6f8' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background-dark min-h-screen p-4 font-display">
        <Story />
      </div>
    ),
  ],
};

export default preview;

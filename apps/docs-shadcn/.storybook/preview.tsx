import type { Preview } from '@storybook/react-vite';
import { applyBrandMode, createGlobalTypes, initialGlobals } from './globals';
import './styles.css';

const preview: Preview = {
  globalTypes: createGlobalTypes(),
  initialGlobals,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { globals }) => {
      applyBrandMode(globals.brand, globals.mode);
      return (
        <div className="bg-background font-sans text-foreground">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

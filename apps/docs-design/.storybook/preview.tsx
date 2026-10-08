import { brands } from '@brt/design';
import tokensCss from '@brt/design/tokens.css?raw';
import type { Preview } from '@storybook/react-vite';
import { applyBrandMode, createGlobalTypes, initialGlobals } from './globals';

const style = document.createElement('style');
style.textContent = tokensCss;
style.textContent += '\nbody { background: var(--brt-color-bg-base); }';
document.head.appendChild(style);

const preview: Preview = {
  globalTypes: createGlobalTypes(Object.keys(brands)),
  initialGlobals,
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { globals }) => {
      applyBrandMode(globals.brand, globals.mode);
      return (
        <div style={{ fontFamily: 'var(--brt-font-sans)', color: 'var(--brt-color-text-base)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

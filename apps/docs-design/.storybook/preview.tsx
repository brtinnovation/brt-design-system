import tokensCss from '@brt-innovation/design/tokens.css?raw';
import type { Preview } from '@storybook/react-vite';
import { applyBrand, globalTypes, initialGlobals } from './globals';

const style = document.createElement('style');
style.textContent = tokensCss;
style.textContent += '\nbody { background: var(--brt-color-bg-primary); }';
document.head.appendChild(style);

const preview: Preview = {
  globalTypes,
  initialGlobals,
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { globals }) => {
      applyBrand(globals.brand);
      return (
        <div style={{ fontFamily: 'var(--brt-font-sans)', color: 'var(--brt-color-text-primary)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

import type { Preview } from '@storybook/react-vite';

// toolbar เลือก brand / mode — เหมือนกันทุก Storybook ของ package
export function createGlobalTypes(brands: string[] = ['brt']): NonNullable<Preview['globalTypes']> {
  return {
    brand: {
      description: 'Brand',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: brands, dynamicTitle: true },
    },
    mode: {
      description: 'Mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  };
}

export const initialGlobals = { brand: 'brt', mode: 'light' };

export function applyBrandMode(brand: string, mode: string) {
  const root = document.documentElement;
  root.dataset.brand = brand;
  root.dataset.mode = mode;
}

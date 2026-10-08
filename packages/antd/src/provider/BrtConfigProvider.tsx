import type { BrandName, Mode } from '@brt/design';
import { ConfigProvider, type ConfigProviderProps } from 'antd';
import thTH from 'antd/locale/th_TH';
import { useEffect, useMemo, type ReactNode } from 'react';
import { getThemeConfig } from '../theme';

export interface BrtConfigProviderProps extends Omit<ConfigProviderProps, 'theme'> {
  brand?: BrandName;
  mode?: Mode;
  /** merge ทับ ThemeConfig ของ brand — ใช้เท่าที่จำเป็น */
  theme?: ConfigProviderProps['theme'];
  children: ReactNode;
}

/**
 * ตั้ง brand ที่เดียว: antd ได้ theme ผ่าน context
 * และ <html data-brand data-mode> ทำให้ style adapter (@brt/tailwind, @brt/css) เปลี่ยนตาม
 */
export function BrtConfigProvider({
  brand = 'brt',
  mode = 'light',
  locale = thTH,
  theme,
  children,
  ...rest
}: BrtConfigProviderProps) {
  const themeConfig = useMemo(() => {
    const base = getThemeConfig(brand, mode);
    return theme ? { ...base, ...theme, token: { ...base.token, ...theme.token } } : base;
  }, [brand, mode, theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.brand = brand;
    root.dataset.mode = mode;
  }, [brand, mode]);

  return (
    <ConfigProvider {...rest} locale={locale} theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
}

import { defaultBrand, type Brand, type Mode } from '@brt-innovation/design';
import { ConfigProvider, type ConfigProviderProps } from 'antd';
import thTH from 'antd/locale/th_TH';
import { useMemo, type ReactNode } from 'react';
import { getThemeConfig } from '../theme';

export interface BrtConfigProviderProps extends Omit<ConfigProviderProps, 'theme'> {
  /** brand ที่โปรเจกต์ประกาศด้วย `defineBrand()` — ไม่ส่ง = `defaultBrand` */
  brand?: Brand;
  mode?: Mode;
  /** merge ทับ ThemeConfig ของ brand — ใช้เท่าที่จำเป็น */
  theme?: ConfigProviderProps['theme'];
  children: ReactNode;
}

/** ตั้ง brand ที่เดียว: component ของ antd ได้ theme ผ่าน context */
export function BrtConfigProvider({
  brand = defaultBrand,
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

  return (
    <ConfigProvider {...rest} locale={locale} theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
}

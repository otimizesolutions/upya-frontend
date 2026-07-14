import { PropsWithChildren, useMemo } from 'react';
import merge from 'deepmerge';
import { ThemeContext, ThemeContextValue } from './theme-context';
import { defaults } from './theme-defaults';

export type ThemeProviderProps = PropsWithChildren<{
  theme?: Partial<ThemeContextValue>;
}>;

export const ThemeProvider = ({
  children,
  theme: partialTheme,
}: ThemeProviderProps) => {
  const theme = useMemo(() => {
    return merge<ThemeContextValue>(defaults, partialTheme || {});
  }, [partialTheme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

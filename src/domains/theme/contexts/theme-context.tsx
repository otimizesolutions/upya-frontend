import { createContext } from 'react';
import { defaults } from './theme-defaults';

type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'ultralight'
  | 'thin'
  | 'light'
  | 'medium'
  | 'regular'
  | 'semibold'
  | 'condensedBold'
  | 'condensed'
  | 'heavy'
  | 'black';

export interface ThemeInputValue {
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  spacing: number;
  color: string;
  placeholderColor: string;
  fontFamily?: string;
  fontSize: number;
  labelColor: string;
  labelFontSize: number;
  labelFontFamily?: string;
  labelSpacing: number;
  adornIconSize: number;
}

export type ThemeInputVariant = 'default';

export interface ThemeButtonValue {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  color: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: FontWeight;
}

export type ThemeButtonVariant = 'default';

export interface ThemeLinkValue {
  color: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: FontWeight;
}

export type ThemeLinkVariant = 'default';

export interface ThemeFormMessageValue {
  color: string;
  errorColor: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: FontWeight;
}

export interface ThemeContextValue {
  inputVariants: Record<ThemeInputVariant, ThemeInputValue>;
  buttonVariants: Record<ThemeButtonVariant, ThemeButtonValue>;
  linkVariants: Record<ThemeLinkVariant, ThemeLinkValue>;
  formMessage: ThemeFormMessageValue;
}

export const ThemeContext = createContext(defaults);

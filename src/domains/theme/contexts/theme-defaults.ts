import {
  destructive,
  paper,
  paperForeground,
  paperForegroundMuted,
  primary,
  primaryForeground,
} from '@/domains/theme/constants/colors';
import { regular } from '@/domains/theme/constants/font-sizes';
import {
  ThemeContextValue,
  ThemeInputValue,
  ThemeButtonValue,
  ThemeLinkValue,
  ThemeFormMessageValue,
} from './theme-context';

export const inputDefault: ThemeInputValue = {
  backgroundColor: paper,
  borderColor: paper,
  borderWidth: 1,
  color: paperForeground,
  borderRadius: 10,
  fontSize: regular,
  paddingHorizontal: 18,
  paddingVertical: 13,
  placeholderColor: paperForegroundMuted,
  spacing: 20,
  labelColor: paperForeground,
  labelFontSize: regular,
  labelSpacing: 5,
  adornIconSize: 20,
};

export const buttonDefault: ThemeButtonValue = {
  backgroundColor: primary,
  borderColor: primary,
  borderWidth: 1,
  paddingHorizontal: 10,
  paddingVertical: 15,
  borderRadius: 50,
  color: primaryForeground,
  fontSize: regular,
  fontWeight: '500',
};

export const linkDefault: ThemeLinkValue = {
  color: primary,
  fontSize: regular,
  fontWeight: '500',
};

export const formMessageDefault: ThemeFormMessageValue = {
  color: paperForegroundMuted,
  errorColor: destructive,
  fontSize: regular,
};

export const defaults: ThemeContextValue = {
  inputVariants: {
    default: inputDefault,
  },
  buttonVariants: {
    default: buttonDefault,
  },
  linkVariants: {
    default: linkDefault,
  },
  formMessage: formMessageDefault,
};

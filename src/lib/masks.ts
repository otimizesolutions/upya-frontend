import type { Mask } from 'react-native-mask-input';
import { Masks } from 'react-native-mask-input';

const BRL_LANDLINE_PHONE: Mask = [
  '(',
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

/** Máximo de caracteres do telefone mascarado: `(00) 00000-0000`. */
export const PHONE_MAX_LENGTH = 15;

/**
 * Máscara de telefone BR (fix ou celular).
 * Até 10 dígitos: (00) 0000-0000
 * 11 dígitos: (00) 00000-0000 (`Masks.BRL_PHONE`)
 */
export const PHONE_MASK: Mask = (text = '') => {
  const digits = text.replace(/\D/g, '');
  return digits.length > 10 ? Masks.BRL_PHONE : BRL_LANDLINE_PHONE;
};

/** Máximo de caracteres do CPF mascarado: `000.000.000-00`. */
export const CPF_MAX_LENGTH = 14;

/** Máscara de CPF BR: `000.000.000-00`. */
export const CPF_MASK: Mask = Masks.BRL_CPF;

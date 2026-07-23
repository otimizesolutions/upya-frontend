import { z } from 'zod';

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    const sum = cpf
      .slice(0, length)
      .split('')
      .reduce(
        (total, digit, index) => total + Number(digit) * (length + 1 - index),
        0,
      );
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(cpf[9]) &&
    calculateDigit(10) === Number(cpf[10])
  );
}

/** Mensagens alinhadas à API (`user.password`). */
export const PASSWORD_MIN_LENGTH_MESSAGE = 'Deve ter pelo menos 8 caracteres';
export const PASSWORD_SPECIAL_CHAR_MESSAGE =
  'Deve conter um caractere especial';
export const PASSWORD_SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

export function hasPasswordMinLength(value: string) {
  return value.length >= 8;
}

export function hasPasswordSpecialChar(value: string) {
  return PASSWORD_SPECIAL_CHAR_REGEX.test(value);
}

export const passwordSchema = z
  .string()
  .min(8, PASSWORD_MIN_LENGTH_MESSAGE)
  .regex(PASSWORD_SPECIAL_CHAR_REGEX, PASSWORD_SPECIAL_CHAR_MESSAGE);

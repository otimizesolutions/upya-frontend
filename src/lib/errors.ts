import { AxiosError } from 'axios';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from '@backpackapp-io/react-native-toast';

export type Form<T extends FieldValues = FieldValues> = UseFormReturn<
  T,
  unknown,
  T
>;

export const DEFAULT_MESSAGE = 'Aconteceu um erro desconhecido!';

export interface ErrorData {
  nonFieldError?: string | null;
  fieldErrors?: Record<string, unknown>;
}

export const parseActionError = (
  error: unknown,
  defaultMessage: string = DEFAULT_MESSAGE,
): ErrorData => {
  if (!error) {
    return { nonFieldError: defaultMessage };
  }
  if (error instanceof AxiosError) {
    const { response } = error;
    if (!response?.data) {
      return { nonFieldError: defaultMessage };
    }
    if (typeof response.data === 'string') {
      return { nonFieldError: defaultMessage };
    }
    if (response.data.detail && typeof response.data.detail === 'string') {
      return { nonFieldError: String(response.data.detail) };
    }
    if (response.status === 400) {
      if (response.data.detail && Object.keys(response.data).length === 1) {
        return { fieldErrors: response.data.detail };
      }
      return { fieldErrors: response.data };
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((error as any).message) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { nonFieldError: String((error as any).message) };
  }
  return { nonFieldError: defaultMessage };
};

export type FlattenFieldErrorsOptions = {
  /** Quando true, junta todas as mensagens do array com `\n`. */
  joinMessages?: boolean;
  /** Traduz cada mensagem antes de aplicar no formulário. */
  translateMessages?: (messages: string[]) => string[];
};

/** Achata erros aninhados do DRF (`user.email` → path `user.email`). */
export const flattenFieldErrors = (
  fieldErrors: Record<string, unknown>,
  prefix = '',
  options: FlattenFieldErrorsOptions = {},
): Record<string, string> => {
  const { joinMessages = false, translateMessages } = options;
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(fieldErrors)) {
    if (key === 'non_field_errors' || key === 'detail') continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;

      const rawMessages = value.map(String);
      const messages = translateMessages
        ? translateMessages(rawMessages)
        : rawMessages;

      if (messages.length === 0) continue;

      result[path] = joinMessages ? messages.join('\n') : messages[0];
      continue;
    }

    if (value && typeof value === 'object') {
      Object.assign(
        result,
        flattenFieldErrors(value as Record<string, unknown>, path, options),
      );
      continue;
    }

    if (value != null && value !== '') {
      const rawMessages = [String(value)];
      const messages = translateMessages
        ? translateMessages(rawMessages)
        : rawMessages;
      if (messages[0]) {
        result[path] = messages[0];
      }
    }
  }

  return result;
};

export type ApplyFormErrorsOptions = {
  defaultMessage?: string;
  /** Mapa de path da API → nome do campo no react-hook-form. */
  fieldMap?: Record<string, string>;
  /** Quando true, junta todas as mensagens do array com `\n`. */
  joinMessages?: boolean;
  /** Traduz cada mensagem antes de aplicar no formulário. */
  translateMessages?: (messages: string[]) => string[];
};

/**
 * Aplica erros de validação da API no formulário.
 * Retorna os nomes dos campos do form que receberam erro.
 */
export const applyFormErrors = (
  error: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: Form<any>,
  defaultMessageOrOptions: string | ApplyFormErrorsOptions = DEFAULT_MESSAGE,
): string[] => {
  const options: ApplyFormErrorsOptions =
    typeof defaultMessageOrOptions === 'string'
      ? { defaultMessage: defaultMessageOrOptions }
      : defaultMessageOrOptions;
  const defaultMessage = options.defaultMessage ?? DEFAULT_MESSAGE;
  const translateMessages = options.translateMessages;

  const { nonFieldError, fieldErrors } = parseActionError(
    error,
    defaultMessage,
  );
  const appliedFields: string[] = [];

  if (fieldErrors) {
    const nestedNonField = fieldErrors.non_field_errors;
    if (Array.isArray(nestedNonField) && nestedNonField.length > 0) {
      const messages = translateMessages
        ? translateMessages(nestedNonField.map(String))
        : nestedNonField.map(String);
      if (messages[0]) toast(messages[0]);
    }

    const flatErrors = flattenFieldErrors(fieldErrors, '', {
      joinMessages: options.joinMessages,
      translateMessages,
    });

    for (const [apiField, errorMessage] of Object.entries(flatErrors)) {
      const formField = options.fieldMap?.[apiField] ?? apiField;
      form.setError(formField, { message: errorMessage });
      appliedFields.push(formField);
    }
  }

  if (nonFieldError) {
    const message = translateMessages
      ? (translateMessages([nonFieldError])[0] ?? nonFieldError)
      : nonFieldError;
    toast(message);
  }

  return appliedFields;
};

export const applyNonFormErrors = (
  error: unknown,
  defaultMessage: string = DEFAULT_MESSAGE,
) => {
  const { nonFieldError } = parseActionError(error, defaultMessage);
  if (nonFieldError) {
    toast(nonFieldError);
  }
};

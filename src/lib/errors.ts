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

export const applyFormErrors = (
  error: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: Form<any>,
  defaultMessage: string = DEFAULT_MESSAGE,
) => {
  const { nonFieldError, fieldErrors } = parseActionError(
    error,
    defaultMessage,
  );
  if (fieldErrors) {
    for (const field of Object.keys(fieldErrors)) {
      const errorValue = fieldErrors[field];
      const errorMessage = Array.isArray(errorValue)
        ? String(errorValue[0])
        : String(errorValue);
      form.setError(field, { message: errorMessage });
    }
  }

  if (nonFieldError) {
    toast(nonFieldError);
  }
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

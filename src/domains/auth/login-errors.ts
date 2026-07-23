import { AxiosError } from 'axios';
import { toast } from '@backpackapp-io/react-native-toast';
import { translateApiErrorMessage } from '@/lib/api-error-messages';
import {
  applyFormErrors,
  DEFAULT_MESSAGE,
  parseActionError,
  type Form,
} from '@/lib/errors';

const LOGIN_FRIENDLY_MESSAGES: Record<string, string> = {
  'e-mail ou senha inválidos': 'E-mail ou senha incorretos.',
  'no active account found with the given credentials':
    'E-mail ou senha incorretos.',
  'this account does not have a customer profile.':
    'Esta conta não possui perfil de cliente.',
  'esta conta não possui perfil de cliente.':
    'Esta conta não possui perfil de cliente.',
  'this account does not have a professional profile.':
    'Esta conta não possui perfil de profissional.',
  'esta conta não possui perfil de profissional.':
    'Esta conta não possui perfil de profissional.',
};

function toFriendlyLoginMessage(message: string): string {
  const key = message.trim().toLowerCase();
  return (
    LOGIN_FRIENDLY_MESSAGES[key] ??
    translateApiErrorMessage(message) ??
    'Não foi possível entrar. Tente novamente.'
  );
}

/** Aplica erro de login no root (mensagem acima de "Esqueceu senha?") + destaque nos campos. */
function setLoginFormError(
  form: Form<{ email: string; password: string }>,
  message: string,
) {
  form.setError('root', { message });
  form.setError('email', { type: 'server' });
  form.setError('password', { type: 'server' });
}

/**
 * Trata erros do login com mensagens amigáveis (401/403/rede/timeout).
 */
export function applyLoginErrors(
  error: unknown,
  form: Form<{ email: string; password: string }>,
) {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      const message = 'A requisição demorou demais. Tente novamente.';
      setLoginFormError(form, message);
      toast(message);
      return;
    }

    if (!error.response) {
      const message = 'Não foi possível conectar. Verifique sua internet.';
      setLoginFormError(form, message);
      toast(message);
      return;
    }

    const status = error.response.status;

    if (status === 401 || status === 403) {
      const { nonFieldError, fieldErrors } = parseActionError(
        error,
        'E-mail ou senha incorretos.',
      );
      const detail =
        nonFieldError ||
        (typeof fieldErrors?.detail === 'string'
          ? fieldErrors.detail
          : Array.isArray(fieldErrors?.detail)
            ? String(fieldErrors.detail[0])
            : null);

      const message = toFriendlyLoginMessage(
        detail ?? 'E-mail ou senha incorretos.',
      );
      setLoginFormError(form, message);
      return;
    }

    if (status === 400) {
      applyFormErrors(error, form, {
        translateMessages: (messages) => messages.map(toFriendlyLoginMessage),
      });
      return;
    }

    const message = 'Não foi possível entrar. Tente novamente.';
    setLoginFormError(form, message);
    toast(message);
    return;
  }

  const { nonFieldError } = parseActionError(error, DEFAULT_MESSAGE);
  const message = toFriendlyLoginMessage(
    nonFieldError ?? 'Não foi possível entrar. Tente novamente.',
  );
  setLoginFormError(form, message);
  toast(message);
}

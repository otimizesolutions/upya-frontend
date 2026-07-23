/**
 * Traduz mensagens de validação da API para português.
 * O mapeamento é por texto conhecido (EN ↔ PT); mensagens novas
 * desconhecidas são preservadas para não bloquear a exibição.
 */

const API_ERROR_MESSAGE_PT: Record<string, string> = {
  // Gerais
  'this field is required.': 'Este campo é obrigatório.',
  'this field may not be blank.': 'Este campo é obrigatório.',
  'ensure this field has no more than 160 characters.':
    'Certifique-se de que este campo não tenha mais de 160 caracteres.',
  'ensure this field has no more than 15 characters.':
    'Certifique-se de que este campo não tenha mais de 15 caracteres.',
  'ensure this field has no more than 11 characters.':
    'Certifique-se de que este campo não tenha mais de 11 caracteres.',
  'ensure this field has no more than 20 characters.':
    'Certifique-se de que este campo não tenha mais de 20 caracteres.',

  // E-mail
  'this email is already registered.': 'Este e-mail já está cadastrado.',
  "the emails don't match.": 'Os e-mails não coincidem.',
  'enter a valid email address.': 'Digite um e-mail válido.',

  // Telefone
  'this phone number is already registered.':
    'Este telefone já está cadastrado.',
  'the value is not a valid phone number.': 'Digite um telefone válido.',

  // CPF
  'this cpf number is already registered.': 'Este CPF já está cadastrado.',
  'the value is not a valid cpf number.': 'Digite um CPF válido.',

  // Senha
  'the password must be at least 8 characters long.':
    'Deve ter pelo menos 8 caracteres',
  'the password must contain at least one special character.':
    'Deve conter um caractere especial',
  "the passwords don't match.": 'As senhas não coincidem.',

  // CREFITO
  'this crefito is already registered.': 'Este CREFITO já está cadastrado.',

  // Login / autenticação
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

  // Já em português (normalização / idempotência)
  'este campo é obrigatório.': 'Este campo é obrigatório.',
  'certifique-se de que este campo não tenha mais de 160 caracteres.':
    'Certifique-se de que este campo não tenha mais de 160 caracteres.',
  'certifique-se de que este campo não tenha mais de 15 caracteres.':
    'Certifique-se de que este campo não tenha mais de 15 caracteres.',
  'certifique-se de que este campo não tenha mais de 11 caracteres.':
    'Certifique-se de que este campo não tenha mais de 11 caracteres.',
  'este e-mail já está cadastrado.': 'Este e-mail já está cadastrado.',
  'os e-mails não coincidem.': 'Os e-mails não coincidem.',
  'digite um e-mail válido.': 'Digite um e-mail válido.',
  'este telefone já está cadastrado.': 'Este telefone já está cadastrado.',
  'digite um telefone válido.': 'Digite um telefone válido.',
  'este cpf já está cadastrado.': 'Este CPF já está cadastrado.',
  'digite um cpf válido.': 'Digite um CPF válido.',
  'deve ter pelo menos 8 caracteres': 'Deve ter pelo menos 8 caracteres',
  'deve conter um caractere especial': 'Deve conter um caractere especial',
  'as senhas não coincidem.': 'As senhas não coincidem.',
  'este crefito já está cadastrado.': 'Este CREFITO já está cadastrado.',
};

function normalizeMessageKey(message: string) {
  return message.trim().toLowerCase();
}

/** Traduz uma mensagem da API para português quando houver mapeamento. */
export function translateApiErrorMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return trimmed;

  const mapped = API_ERROR_MESSAGE_PT[normalizeMessageKey(trimmed)];
  if (mapped) return mapped;

  return trimmed;
}

/** Traduz uma lista de mensagens e remove duplicatas. */
export function translateApiErrorMessages(messages: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const message of messages) {
    const translated = translateApiErrorMessage(String(message));
    if (!translated || seen.has(translated)) continue;
    seen.add(translated);
    result.push(translated);
  }

  return result;
}

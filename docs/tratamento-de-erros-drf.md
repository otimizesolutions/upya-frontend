# Tratamento de Erros do Django-Rest-Framework

Existe um sistema para tratamento de erros em `@lib/errors.ts` que faz o parsing de erros com os formatos devolvidos pelo `django` e `django-rest-framework` e emite `Toasts` ou aplica os erros aos formulários do `react-hook-form`.

## Modo de uso:

Dentro de uma `useMutation` do `react-query` devemos utilizar o `onError` da seguinte forma:

```typescript
import { useMutation } from '@tanstack/react-query';
import { applyFormErrors, Form } from '@/lib/errors';

interface MutationProps {
  // ...
}

const useMyActionMutation = (form: Form<MutationProps>) => {
  useMutation({
    mutationFn: (props) => {},
    onSuccess: () => {},
    onError: (err) => applyFormErrors(err, form),
  });
};
```

Em caso de ações que não são relacionadas a formulários, utilizar:

```typescript
import { useMutation } from '@tanstack/react-query';
import { applyNonFormErrors } from '@/lib/errors';

interface MutationProps {
  // ...
}

const useMyActionMutation = () => {
  useMutation({
    mutationFn: (props) => {},
    onSuccess: () => {},
    onError: (err) => applyNonFormErrors(err),
  });
};
```

export interface User {
  id: number;
  last_login: string;
  email: string;
  name: string;
  date_joined: string;
  phone?: string;
  photo?: string | null;
  is_phone_confirmed?: boolean;
}

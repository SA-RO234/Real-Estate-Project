export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
  created_at?: string;
  avatar?: string;
  status: number;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  role: string;
  avatar: string;
  status: number;
}

export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
}

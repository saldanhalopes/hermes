import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const hermesApi = async (path: string, options: RequestInit = {}) => {
  const user = auth.currentUser;
  let token: string | null = null;
  
  if (user) {
    token = await user.getIdToken();
  } else {
    // Check for development mock token
    token = localStorage.getItem('MOCK_ACCESS_TOKEN');
  }

  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para continuar.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro na requisição à API');
  }

  return response.json();
};

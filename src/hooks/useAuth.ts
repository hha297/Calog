import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Login logic here
      setUser({ email });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, login };
};

// Simulación de sistema de autenticación para el MVP
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  userType: 'foodie' | 'restaurant';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'foodie' | 'restaurant';
  createdAt: string;
}

// Simulación de hash de contraseña (en producción usar bcrypt)
const hashPassword = (password: string): string => {
  return btoa(password + 'foodiesbnb-salt');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const authService = {
  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<{ user: User; success: boolean; error?: string }> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('foodiesBnbUsers') || '[]');
      
      // Verificar si el email ya existe
      const existingUser = users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        return { user: null as any, success: false, error: 'Este email ya está registrado' };
      }

      // Validaciones
      if (data.password.length < 6) {
        return { user: null as any, success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      if (!data.fullName.trim()) {
        return { user: null as any, success: false, error: 'El nombre completo es requerido' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { user: null as any, success: false, error: 'Email inválido' };
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        email: data.email.toLowerCase(),
        fullName: data.fullName.trim(),
        userType: data.userType,
        password: hashPassword(data.password),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('foodiesBnbUsers', JSON.stringify(users));

      // Retornar usuario sin contraseña
      const { password: _, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, success: true };
    } catch (error) {
      return { user: null as any, success: false, error: 'Error al registrar usuario' };
    }
  },

  // Iniciar sesión
  login: async (data: LoginData): Promise<{ user: User; success: boolean; error?: string }> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('foodiesBnbUsers') || '[]');
      
      const user = users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
      
      if (!user) {
        return { user: null as any, success: false, error: 'Email no registrado' };
      }

      if (!verifyPassword(data.password, user.password)) {
        return { user: null as any, success: false, error: 'Contraseña incorrecta' };
      }

      // Guardar sesión
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('foodiesBnbCurrentUser', JSON.stringify(userWithoutPassword));

      return { user: userWithoutPassword, success: true };
    } catch (error) {
      return { user: null as any, success: false, error: 'Error al iniciar sesión' };
    }
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    try {
      const currentUser = localStorage.getItem('foodiesBnbCurrentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch {
      return null;
    }
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('foodiesBnbCurrentUser');
  },

  // Verificar si hay usuarios registrados (para testing)
  getRegisteredUsers: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('foodiesBnbUsers') || '[]');
    } catch {
      return [];
    }
  }
};

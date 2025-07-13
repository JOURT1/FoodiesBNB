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
  phone?: string;
  bio?: string;
  preferences?: string[];
  restaurantInfo?: {
    description?: string;
    specialties?: string[];
    capacity?: number;
    openingHours?: string;
  };
  updatedAt?: string;
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
  },

  // Actualizar perfil de usuario
  updateProfile: async (userId: string, data: {
    fullName?: string;
    phone?: string;
    bio?: string;
    preferences?: string[];
    restaurantInfo?: {
      description?: string;
      specialties?: string[];
      capacity?: number;
      openingHours?: string;
    };
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('foodiesBnbUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Actualizar datos del usuario
      users[userIndex] = { ...users[userIndex], ...data, updatedAt: new Date().toISOString() };
      
      // Guardar en localStorage
      localStorage.setItem('foodiesBnbUsers', JSON.stringify(users));
      
      // Actualizar usuario actual si es el mismo
      const currentUser = localStorage.getItem('foodiesBnbCurrentUser');
      if (currentUser) {
        const current = JSON.parse(currentUser);
        if (current.id === userId) {
          const { password: _, ...updatedUser } = users[userIndex];
          localStorage.setItem('foodiesBnbCurrentUser', JSON.stringify(updatedUser));
          return { success: true, user: updatedUser };
        }
      }

      const { password: _, ...updatedUser } = users[userIndex];
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Error al actualizar perfil' };
    }
  },

  // Cambiar contraseña
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('foodiesBnbUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      const user = users[userIndex];
      
      // Verificar contraseña actual
      if (!verifyPassword(currentPassword, user.password)) {
        return { success: false, error: 'La contraseña actual es incorrecta' };
      }

      // Validar nueva contraseña
      if (newPassword.length < 6) {
        return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
      }

      // Actualizar contraseña
      users[userIndex].password = hashPassword(newPassword);
      users[userIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('foodiesBnbUsers', JSON.stringify(users));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al cambiar contraseña' };
    }
  }
};

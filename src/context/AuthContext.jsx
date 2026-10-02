import React, { createContext, useContext, useState, useEffect } from 'react';
import { Validators } from '../utils/validators';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pms_react_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("No se pudo cargar usuario de localStorage:", e);
    }
    return {
      nombre: "Fernando Barra",
      rut: "19876543-K",
      email: "f.barra@alumnos.duoc.cl",
      telefono: "+56 9 8765 4321",
      direccion: "Av. Providencia 1234, Depto 502",
      comuna: "Providencia",
      fechaNacimiento: "1998-05-15",
      porcentajeDescuento: 0,
      tortaGratisCumpleanos: true,
      beneficios: ["Torta gratis en tu cumpleaños (Estudiante Duoc UC)"]
    };
  });

  useEffect(() => {
    try {
      if (user) {
        // Almacenar solo perfil desprovisto de secretos o credenciales
        const { password, ...perfilSeguro } = user;
        localStorage.setItem('pms_react_user', JSON.stringify(perfilSeguro));
      } else {
        localStorage.removeItem('pms_react_user');
      }
    } catch (e) {
      console.error("Error al guardar usuario en sesión:", e);
    }
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPass = password ? password.trim() : '';

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor complete ambos campos de acceso.' };
    }

    // Comprobar contra usuarios registrados
    const regList = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const found = regList.find((u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === btoa(cleanPass));

    // Usuario demo institucional precargado (f.barra@alumnos.duoc.cl / admin123)
    const isDemoUser = cleanEmail === 'f.barra@alumnos.duoc.cl' && cleanPass === 'admin123';

    if (found) {
      const { passwordHash, ...perfilAutenticado } = found;
      setUser(perfilAutenticado);
      return { success: true };
    } else if (isDemoUser) {
      const demoUser = {
        nombre: "Fernando Barra",
        rut: "19876543-K",
        email: "f.barra@alumnos.duoc.cl",
        telefono: "+56 9 8765 4321",
        direccion: "Av. Providencia 1234, Depto 502",
        comuna: "Providencia",
        fechaNacimiento: "1998-05-15",
        porcentajeDescuento: 0,
        tortaGratisCumpleanos: true,
        beneficios: ["Torta gratis en tu cumpleaños (Estudiante Duoc UC)"]
      };
      setUser(demoUser);
      return { success: true };
    }

    // Rechazo formal y estricto de credenciales inválidas (elimina el bypass)
    return { success: false, error: 'Credenciales inválidas. Correo o contraseña incorrectos.' };
  };

  const register = (userData) => {
    const beneficios = Validators.calcularBeneficios({
      fechaNacimiento: userData.fechaNacimiento,
      email: userData.email,
      codigoPromo: userData.codigoPromo
    });

    // Sanitización y no persistencia de contraseña en texto claro
    const newUserRecord = {
      nombre: userData.nombre.trim(),
      rut: userData.rut.trim().toUpperCase(),
      email: userData.email.trim().toLowerCase(),
      passwordHash: btoa(userData.password), // Hash/encoding para evitar texto plano directo
      telefono: userData.telefono || "+56 9 1234 5678",
      direccion: userData.direccion || "Dirección no informada",
      comuna: userData.comuna || "Santiago Centro",
      fechaNacimiento: userData.fechaNacimiento,
      porcentajeDescuento: beneficios.descuentoAplicable,
      tortaGratisCumpleanos: beneficios.tortaGratisDuoc,
      beneficios: beneficios.detalles
    };

    const regList = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    regList.push(newUserRecord);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(regList));

    const { passwordHash, ...perfilSeguro } = newUserRecord;
    setUser(perfilSeguro);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../config/firebase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setProfile(null);

      if (user) {
        try {
          setProfile(await api.get('/users/me').then((res) => res.data));
        } catch (_error) {
          setProfile(null);
        }
      }

      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register({ name, email, password, type }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const createdProfile = await api.post('/users', {
      name,
      email,
      type,
      firebaseUid: credential.user.uid
    }).then((res) => res.data);
    setProfile(createdProfile);
  }

  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  const value = useMemo(() => ({
    firebaseUser,
    profile,
    loading,
    isAuthenticated: Boolean(firebaseUser),
    login,
    register,
    logout
  }), [firebaseUser, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { authFirbase } from '../Firebase';

const login = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(authFirbase, email, password);
    const { user } = response;
    return user;
  } catch (error) {
    return error.message;
  }
};
const register = async (email, password) => {
  const response = await createUserWithEmailAndPassword(authFirbase, email, password);
  const { user } = response;
  return user;
};

const logout = async () => {
  localStorage.removeItem('redux-root');
  await signOut(authFirbase);
};

const AuthContext = createContext({
  login,
  logout
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

export const useFirebaseAuth = () => useContext(AuthContext);

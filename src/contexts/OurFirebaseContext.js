import PropTypes from 'prop-types';
import { createContext } from 'react';
import { authFirbase, googleAuthProvider } from '../Firebase';

const login = async (email, password) => {
  try {
    const result = await authFirbase.signInWithEmailAndPassword(email, password);
    const { user } = result;
    const authtoken = await user.getIdTokenResult();
    return authtoken;
  } catch (error) {
    return error.message;
  }
};

const register = async (email) => {
  try {
    const config = {
      url: `http://localhost:3000/auth/complete-registration/${email}`,
      handleCodeInApp: true
    };
    await authFirbase.sendSignInLinkToEmail(email, config);
    return { res: `Email sent to ${email}`, status: 'success' };
  } catch (error) {
    return { res: error, status: 'error' };
  }
};

const completeRegistration = async (email, password) => {
  try {
    const result = await authFirbase.signInWithEmailLink(email, window.location.href);
    let authToken = null;
    if (result.user.emailVerified) {
      const user = authFirbase.currentUser;
      await user.updatePassword(password);
      authToken = await user.getIdTokenResult();
    }
    return authToken;
  } catch (error) {
    return { res: error, status: 'error' };
  }
};

const loginWithGoogle = async () => {
  try {
    const result = await authFirbase.signInWithPopup(googleAuthProvider);
    const { user } = result;
    return await user.getIdTokenResult();
  } catch (error) {
    return { res: error, status: 'error' };
  }
};

const logout = () => {
  localStorage.removeItem('redux-root');
  authFirbase.signOut();
};

const AuthContext = createContext({
  login,
  register,
  completeRegistration,
  loginWithGoogle,
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
        completeRegistration,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

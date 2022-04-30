// import PropTypes from 'prop-types';
// import { createContext, useContext } from 'react';
// import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
// import { authFirbase } from '../Firebase';

// const login = async (email, password) => {
//   try {
//     const response = await signInWithEmailAndPassword(authFirbase, email, password);
//     const { user } = response;
//     return user;
//   } catch (error) {
//     return error.message;
//   }
// };

// const logout = () => {
//   localStorage.removeItem('redux-root');
//   signOut(authFirbase);
// };

// const AuthContext = createContext({
//   login,
//   logout
// });

// AuthProvider.propTypes = {
//   children: PropTypes.node
// };

// function AuthProvider({ children }) {
//   return (
//     <AuthContext.Provider
//       value={{
//         login,

//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export { AuthContext, AuthProvider };

// export const useFirebaseAuth = () => useContext(AuthContext);

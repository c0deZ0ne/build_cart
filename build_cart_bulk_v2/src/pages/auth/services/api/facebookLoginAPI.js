import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { app } from './config';

const provider = new FacebookAuthProvider();
const auth = getAuth(app);

export const facebookLoginAPI = async () => {
  const fbAuth = signInWithPopup(auth, provider);
  return fbAuth;
};

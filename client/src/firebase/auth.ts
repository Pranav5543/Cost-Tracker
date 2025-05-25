import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./config";

// Register a new user with email and password
export const registerUser = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Login with email and password
export const loginUser = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout the current user
export const logoutUser = async (): Promise<void> => {
  return await signOut(auth);
};

// Get the current authenticated user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

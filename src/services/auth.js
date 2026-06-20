// src/services/auth.js

import {
    GoogleAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
  
  import { auth } from "../firebase";
  
  // Providers
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  
  // Microsoft (works via OAuthProvider in Firebase)
  const microsoftProvider = new OAuthProvider("microsoft.com");
  
  // Optional scopes (recommended)
  googleProvider.addScope("profile");
  googleProvider.addScope("email");
  
  githubProvider.addScope("user:email");
  
  microsoftProvider.setCustomParameters({
    prompt: "select_account",
  });
  
  // Sign in methods
  export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };
  
  export const signInWithGithub = async () => {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  };
  
  export const signInWithMicrosoft = async () => {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user;
  };
  
  // Logout
  export const logout = () => {
    return signOut(auth);
  };
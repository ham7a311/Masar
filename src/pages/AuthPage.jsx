import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import logo from "../assets/logo.png";
import OAuthButton from "../components/OAuthButton";
import { GoogleIcon, GitHubIcon, MicrosoftIcon } from "../components/OAuthIcons";
import { AccentUnderline } from "../components/SectionAccent";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithMicrosoft,
} from "../services/auth";
import { getPostAuthPath, getUserProfile } from "../services/userProfile";
import { auth } from "../firebase";
import "./auth-page.css";

const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    icon: GoogleIcon,
    signIn: signInWithGoogle,
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: GitHubIcon,
    signIn: signInWithGithub,
  },
  {
    id: "microsoft",
    label: "Continue with Microsoft",
    icon: MicrosoftIcon,
    signIn: signInWithMicrosoft,
  },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        navigate(getPostAuthPath(profile), { replace: true });
      } catch {
        navigate("/onboarding", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  const redirectAfterSignIn = async (user) => {
    const profile = await getUserProfile(user.uid);
    navigate(getPostAuthPath(profile), { replace: true });
  };

  const handleSignIn = async (providerId, signInFn) => {
    if (loadingProvider) return;

    setLoadingProvider(providerId);
    setError(null);

    try {
      const user = await signInFn();
      await redirectAfterSignIn(user);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        setError(null);
      } else {
        setError(err?.message || "Sign in failed. Please try again.");
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  if (checkingAuth) {
    return <div className="auth-loading-screen">Loading...</div>;
  }

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel" aria-hidden="true">
        <div className="auth-brand-grid" />
        <div className="auth-brand-glow" />
        <div className="auth-brand-content">
          <div className="auth-brand-mark">
            <span className="auth-brand-ring auth-brand-ring-1" />
            <span className="auth-brand-ring auth-brand-ring-2" />
            <img src={logo} alt="" className="auth-brand-logo" />
          </div>
          <p className="auth-brand-tagline">
            Find your path with{" "}
            <AccentUnderline tone="dark">clarity</AccentUnderline>
          </p>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-grid" aria-hidden="true" />

        <div className="auth-card">
          <Link to="/" className="auth-back-link">
            ← Back to home
          </Link>

          <h1 className="auth-card-title">Welcome to Masar</h1>
          <p className="auth-card-subtitle">
            Sign in to continue your career journey
          </p>

          <div className="auth-divider" aria-hidden="true">
            or continue with
          </div>

          <div className="auth-buttons">
            {PROVIDERS.map(({ id, label, icon, signIn }) => (
              <OAuthButton
                key={id}
                icon={icon}
                label={label}
                loading={loadingProvider === id}
                disabled={Boolean(loadingProvider && loadingProvider !== id)}
                onClick={() => handleSignIn(id, signIn)}
              />
            ))}
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <p className="auth-footer">
            By continuing, you agree to Masar&apos;s future Terms &amp; Privacy
            Policy
          </p>
        </div>
      </main>
    </div>
  );
}

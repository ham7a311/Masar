import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getPostAuthPath, getUserProfile } from "../services/userProfile";
import "../pages/dashboard-page.css";

/**
 * Redirects authenticated users away from the public homepage.
 */
export default function HomeAuthRedirect({ children }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setReady(true);
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

  if (!ready) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  return children;
}

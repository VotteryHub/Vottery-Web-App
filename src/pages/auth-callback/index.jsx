import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const readAuthError = () => {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    search.get("error_description") ||
    search.get("error") ||
    hash.get("error_description") ||
    hash.get("error") ||
    ""
  );
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [working, setWorking] = useState(true);

  const message = useMemo(() => {
    if (working) return "Completing secure sign-in...";
    if (error) return `Authentication failed: ${error}`;
    return "Sign-in completed. Redirecting...";
  }, [working, error]);

  useEffect(() => {
    let mounted = true;
    const complete = async () => {
      try {
        const authError = readAuthError();
        if (authError) {
          if (mounted) {
            setError(authError);
            setWorking(false);
          }
          return;
        }
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!mounted) return;
        if (data?.session?.user) {
          navigate("/home-feed-dashboard", { replace: true });
          return;
        }
        setError("No authenticated session returned from provider.");
        setWorking(false);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Unexpected callback error.");
        setWorking(false);
      }
    };
    complete();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-xl p-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">Authentication Callback</h1>
        <p className={`mt-3 text-sm ${error ? "text-red-400" : "text-muted-foreground"}`}>
          {message}
        </p>
        {!working && error && (
          <button
            className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground"
            onClick={() => navigate("/multi-authentication-gateway", { replace: true })}
          >
            Back to Multi-Auth Gateway
          </button>
        )}
      </div>
    </div>
  );
}


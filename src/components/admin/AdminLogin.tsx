import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { Lock } from "lucide-react";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    // On success, AdminPage re-renders automatically via useAuth state
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-light flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-gold" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1 font-semibold">Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg font-semibold">{error}</div>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground py-3 rounded-lg font-bold transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState } from "react";
import { useAuth } from "./AuthContext.jsx"
import { authAPI, storage } from "../services/api.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    setCurrentUser(null);
    storage.removeToken();
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleFormSwitch = (isLoginForm) => {
    setIsLogin(isLoginForm);
    setFormData({
      name: "",
      email: "",
      password: "",
      showPassword: false,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { email, password } = formData;
        const response = await authAPI.login({ email, password });


        storage.setToken(response.token);
        login(response.user); 

        console.log("Login successful:", response);

        const from = location.state?.from?.pathname || "/reports";
        navigate(from, { replace: true });
      } else {
        const { name, email, password } = formData;
        const response = await authAPI.register({ name, email, password });

        storage.setToken(response.token);
        login(response.user);

        console.log("Registration successful:", response);
        alert(`Account created successfully! Welcome, ${response.user.name}`);

        handleFormSwitch(true);
        navigate("/reports", { replace: true });
      }
    } catch (err) {
      setError(err.message);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8] dark:bg-[#151121] relative overflow-hidden p-4 font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),transparent)]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),transparent)] translate-x-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-xl p-8 text-white bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-white/70">
              {isLogin
                ? "Find what's lost, report what's found."
                : "Join Track Back and never lose track again."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-8 relative w-full bg-black/30 rounded-lg p-1 flex">
            <div
              className={`absolute top-0 left-0 w-1/2 h-full bg-[#5a2aea] rounded transition-transform duration-300 ${
                isLogin ? "translate-x-0" : "translate-x-full"
              }`}
            />
            <button
              onClick={() => handleFormSwitch(true)}
              className={`w-1/2 text-center py-2 rounded font-semibold relative z-10 ${
                isLogin ? "text-white" : "text-white/60"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleFormSwitch(false)}
              className={`w-1/2 text-center py-2 rounded font-semibold relative z-10 ${
                !isLogin ? "text-white" : "text-white/60"
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg h-14 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a2aea] transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  🔒
                </span>
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg h-14 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a2aea] transition-all duration-300"
                  required
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 password-toggle cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {formData.showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5a2aea] text-white font-bold h-12 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_#5a2aea] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  👤
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg h-14 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a2aea] transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg h-14 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a2aea] transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  🔒
                </span>
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg h-14 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a2aea] transition-all duration-300"
                  required
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 password-toggle cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {formData.showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5a2aea] text-white font-bold h-12 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_#5a2aea] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

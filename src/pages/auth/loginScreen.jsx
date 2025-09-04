import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLock , AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail } from "react-icons/ai"; // icon mắt
import "./login.css";
import { loginUser } from "../../services/auth/firebaseApi";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const handleLogin = async () => {
    setError("");
    setLoading(true);

    const res = await loginUser(email, password);
    setLoading(false);

    if (res.success) {
      const role = res.user.role;
      if (role === "admin") navigate("/admin-home");
      else if (role === "manager") navigate("/manager-home");
      else if (role === "staff") navigate("/staff");
      else navigate("/home");
    } else {
      setError(res.message);
    }
  };
  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">Chào mừng!</h1>
        <div className="input-wrapper">
          <AiOutlineMail className="input-icon" />
          <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        

        <div className="password-wrapper input-wrapper">
          <AiOutlineLock  className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="eye-button"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {error && <div className="error-text">* {error}</div>}
        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="forgot-password">
          <a href="#">Quên mật khẩu?</a>
        </div>
        
        <div className="register-link">
          <span className="register-text">Chưa có tài khoản?</span>
            <Link to="/register" className="register-link-text">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

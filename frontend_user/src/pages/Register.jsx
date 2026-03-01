import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
    accountType:"user"
  });

  const handleChange = e =>
    setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();

    if(form.password !== form.confirmPassword)
      return alert("Passwords do not match");

    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange}/>
        <input name="email" placeholder="Email" onChange={handleChange}/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange}/>

        <button>Register</button>
      </form>
      <div className="link">
        <Link to="/login">Already have account?</Link>
      </div>
    </div>
  );
}

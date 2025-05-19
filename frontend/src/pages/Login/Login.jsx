import { useState, useContext } from 'react';
import {api, basePath} from '../../services/api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { LoaderContext } from '../../contexts/LoaderContext';
import { useError } from '../../contexts/ErrorContext';  // Importing useError

const Login = () => {
  const { startLoading, finishLoading } = useContext(LoaderContext);
  const { showError } = useError();  // Accessing the showError function from context
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    setLoading(true);

    try {
      // await api.get('/sanctum/csrf-cookie');
      const response = await api.post(basePath+'/login', formData);
     
      const { user_id, user_name } = response.data.user;
      
      const token = response.data.token;
      dispatch(loginSuccess({ user_id, user_name, token }));

      navigate('/dashboard');
    } catch (err) {
      finishLoading();
      showError(err.response ? err.response.data.message : 'Server error');
    } finally {
      finishLoading();
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
            />
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                name="remember"
                className="mr-2 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#655de9] hover:bg-[#4e6feb] text-white font-bold py-2 px-4 rounded-md transition duration-300"
            disabled={loading}
          >
            Login
          </button>
        </form>

        {/* <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account? <span className="text-purple-600 hover:underline cursor-pointer">Register</span>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
import CardWithHeader from '../../components/CardWithHeader'
import { LoaderContext } from '../../contexts/LoaderContext';
import { useContext, useEffect, useState } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { api, basePath } from '../../services/api';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const { startLoading, finishLoading } = useContext(LoaderContext);
    const { showError, showSuccess } = useError();
    const navigate = useNavigate();
    const { id } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        role: '',
        email: '',
        mobile: '',
        gender: '',
        branch: '',
        status: false,
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                startLoading();
                const token = localStorage.getItem('token');
                const res = await api.get(`${basePath}/getEditUser/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const user = res.data.user;

                setFormData({
                    fullName: user.fullName || '',
                    role: user.role || '',
                    email: user.email || '',
                    mobile: user.mobile || '',
                    gender: user.gender || '',
                    branch: user.branch || '',
                    status: user.status === 1,
                    password: '',
                    confirmPassword: '',
                });
            } catch (err) {
                showError('Failed to fetch user details.');
            } finally {
                finishLoading();
            }
        };

        fetchUser();
    }, [id]);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const getPasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const mediumPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

        if (strongPasswordRegex.test(password)) return 'Strong';
        if (mediumPasswordRegex.test(password)) return 'Medium';
        return 'Weak';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        startLoading();

        if (formData.password !== formData.confirmPassword) {
            finishLoading();
            return showError("Passwords do not match.");
        }

        if (formData.password && passwordStrength !== 'Strong') {
            finishLoading();
            return showError("Password must be strong.");
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                status: formData.status ? 1 : 0,
            };

            // Remove password if not updated
            if (!formData.password) {
                delete payload.password;
                delete payload.confirmPassword;
            }

            const response = await api.put(`${basePath}/updateUser/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status) {
                showSuccess("User updated successfully");
                navigate(-1);
            } else {
                showError(response.data.message || "Update failed.");
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Server error');
        } finally {
            finishLoading();
        }
    };

    const inputClasses = "mt-1 block w-full border rounded-md p-2 bg-white text-gray-800 border-gray-400 " +
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 " +
        "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300";

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <CardWithHeader
            title="Edit User"
            actions={[
                {
                    label: 'Back',
                    icon: <ArrowLeft size={16} />,
                    onClick: () => navigate(-1)
                }
            ]}
        >
            <div className="max-w-4xl mx-auto p-6 rounded-2xl shadow my-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Full Name</label>
                            <input
                                type="text"
                                className={inputClasses}
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInput}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Role</label>
                            <select
                                className={inputClasses}
                                name="role"
                                value={formData.role}
                                onChange={handleInput}
                            >
                                <option>Super Admin</option>
                                <option>Admin</option>
                                <option>Teacher</option>
                                <option>Parent</option>
                                <option>Student</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Email Address</label>
                            <input
                                type="email"
                                className={inputClasses}
                                name="email"
                                value={formData.email}
                                onChange={handleInput}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Phone Number</label>
                            <input
                                type="tel"
                                className={inputClasses}
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInput}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Gender</label>
                            <select
                                className={inputClasses}
                                name="gender"
                                value={formData.gender}
                                onChange={handleInput}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Branch</label>
                            <select
                                className={inputClasses}
                                name="branch"
                                value={formData.branch}
                                onChange={handleInput}
                            >
                                <option value="1">Branch 1</option>
                                <option value="2">Branch 2</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${inputClasses} pr-10`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInput}
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Password Strength: {passwordStrength}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`${inputClasses} pr-10`}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInput}
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center mt-3 space-x-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleInput}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 dark:bg-gray-600 peer-checked:dark:bg-indigo-500 transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-[21px] transition-all duration-400"></div>
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Active / Inactive</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </CardWithHeader>
    );
};

export default EditUser;
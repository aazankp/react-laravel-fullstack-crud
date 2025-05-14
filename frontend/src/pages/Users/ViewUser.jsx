import CardWithHeader from '../../components/CardWithHeader'
import { LoaderContext } from '../../contexts/LoaderContext';
import { useContext, useEffect, useState } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { api, basePath } from '../../services/api';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ViewUser = () => {
    const { startLoading, finishLoading } = useContext(LoaderContext);
    const { showError } = useError();
    const navigate = useNavigate();
    const { id } = useParams();

    const [userData, setUserData] = useState({
        fullName: '',
        role: '',
        email: '',
        mobile: '',
        gender: '',
        branch: '',
        status: false,
        password: '',
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

                setUserData({
                    fullName: user.fullName || '',
                    role: user.role || '',
                    email: user.email || '',
                    mobile: user.mobile || '',
                    gender: user.gender || '',
                    branch: user.branch || '',
                    status: user.status === 1,
                });
                
            } catch (err) {
                showError('Failed to fetch user details.');
            } finally {
                finishLoading();
            }
        };

        fetchUser();
    }, [id]);

    const inputClasses = "mt-1 block w-full border rounded-md p-2 bg-white text-gray-800 border-gray-400 " +
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 " +
        "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300";

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <CardWithHeader
            title="View User"
            actions={[
                {
                    label: 'Back',
                    icon: <ArrowLeft size={16} />,
                    onClick: () => navigate(-1)
                }
            ]}
        >
            <div className="max-w-4xl mx-auto p-6 rounded-2xl shadow my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Full Name</label>
                        <div className={inputClasses}>{userData.fullName}</div>
                    </div>

                    <div>
                        <label className={labelClasses}>Role</label>
                        <div className={inputClasses}>{userData.role}</div>
                    </div>

                    <div>
                        <label className={labelClasses}>Email Address</label>
                        <div className={inputClasses}>{userData.email}</div>
                    </div>

                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <div className={inputClasses}>{userData.mobile}</div>
                    </div>

                    <div>
                        <label className={labelClasses}>Gender</label>
                        <div className={inputClasses}>{userData.gender}</div>
                    </div>

                    <div>
                        <label className={labelClasses}>Branch</label>
                        <div className={inputClasses}>{userData.branch}</div>
                    </div>

                    <div className="flex items-center mt-3 space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                        <div className="flex items-center space-x-2">
                            <span className={userData.status ? "text-green-600" : "text-red-600"}>
                                {userData.status ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </CardWithHeader>
    );
};

export default ViewUser;
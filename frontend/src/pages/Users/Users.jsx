import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import CardWithHeader from '../../components/CardWithHeader';
import DataTable from '../../components/DataTable';
import { useError } from '../../contexts/ErrorContext';
import { LoaderContext } from '../../contexts/LoaderContext';
import { api, basePath } from '../../services/api';

const Users = () => {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);
    const { startLoading, finishLoading } = useContext(LoaderContext);
    const { showError, showSuccess } = useError();
    const [reloadTrigger, setReloadTrigger] = useState(0); // Add reloadTrigger state

    const handleDelete = (itemId) => {
        setDeletingItem(itemId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            startLoading();
            const token = localStorage.getItem('token');
            const res = await api.delete(`${basePath}/deleteUser/${deletingItem}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.status) {
                showSuccess("User deleted successfully.");
                setShowConfirmModal(false);
                setReloadTrigger(prev => prev + 1);
            } else {
                showError("Deletion failed.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Server error");
        } finally {
            finishLoading();
            setShowConfirmModal(false);
        }
    };

    const Header = [
        { label: 'ID', key: 'id', sortable: true },
        { label: 'Full Name', key: 'fullName', sortable: true },
        { label: 'Email', key: 'email', sortable: true },
        { label: 'Mobile', key: 'mobile', sortable: true },
        { label: 'Created At', key: 'created_at', sortable: true },
        { label: 'Action', key: 'action', sortable: false },
    ];

    const Actions = [
        {
            label: 'View',
            icon: Eye,
            onClick: (item) => navigate(`/organization/users/view/${item.id}`)
        },
        {
            label: 'Edit',
            icon: Edit,
            onClick: (item) => navigate(`/organization/users/edit/${item.id}`)
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: (item) => handleDelete(item.id)
        }
    ];

    const Export = {
        isExport: true,
        hit_url_csv: '/export_csv_users',
        hit_url_pdf: '/export_pdf_users',
    };

    return (
        <CardWithHeader
            title="Users"
            actions={[
                {
                    label: 'Add User',
                    icon: <Plus size={16} />,
                    onClick: () => navigate('/organization/users/add'),
                },
            ]}
        >
            <DataTable
                headers={Header}
                hit_url='/get_users'
                actions={Actions}
                Export={Export}
                reloadTrigger={reloadTrigger}
            />
            
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Deletion</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CardWithHeader>
    );
};

export default Users;
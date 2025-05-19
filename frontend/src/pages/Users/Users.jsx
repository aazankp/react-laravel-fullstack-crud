import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, ShieldCheck } from 'lucide-react';
import CardWithHeader from '../../components/CardWithHeader';
import DataTable from '../../components/DataTable';
import { useError } from '../../contexts/ErrorContext';
import { LoaderContext } from '../../contexts/LoaderContext';
import { api, basePath } from '../../services/api';
import { useSelector } from "react-redux";
import usePermissions from "../../services/usePermissions";
import ConfirmModal from '../../components/ConfirmModal';

const Users = () => {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);
    const { startLoading, finishLoading } = useContext(LoaderContext);
    const { showError, showSuccess } = useError();
    const [reloadTrigger, setReloadTrigger] = useState(0); // Add reloadTrigger state
    const userId = useSelector((state) => state.auth.user_id);

    useEffect(() => {
        startLoading();
        finishLoading();
        // const timer = setTimeout(() => {
        // }, 500);

        // return () => clearTimeout(timer); // cleanup
    }, []);

    const moduleId = 1;
    const submoduleId = 2;

    const { canEdit, canDelete, canView, canRoles } = usePermissions(userId, moduleId, submoduleId);

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
        canView && {
            label: 'View',
            icon: Eye,
            onClick: (item) => navigate(`/organization/users/view/${item.id}`)
        },
        canEdit && {
            label: 'Edit',
            icon: Edit,
            onClick: (item) => navigate(`/organization/users/edit/${item.id}`)
        },
        canRoles && {
            label: 'Roles',
            icon: ShieldCheck,
            onClick: (item) => navigate(`/organization/users/roles/${item.id}`)
        },
        canDelete && {
            label: 'Delete',
            icon: Trash2,
            onClick: (item) => handleDelete(item.id)
        }
    ].filter(Boolean);

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
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this user? This action cannot be undone."
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    confirmText="Yes, Delete"
                    cancelText="Cancel"
                />
            )}
        </CardWithHeader>
    );
};

export default Users;
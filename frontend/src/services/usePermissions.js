import { useState, useEffect } from 'react';
import { api, basePath } from './api';

export default function usePermissions(userId, moduleId, submoduleId) {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`${basePath}/users/module-access/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawAccess = res.data.module_access;

        if (!rawAccess) {
          setPermissions({});
          return;
        }

        let access;
        try {
          access = JSON.parse(rawAccess);
        } catch (error) {
          console.error('Invalid JSON in module_access:', rawAccess);
          setPermissions({});
          return;
        }

        const module = access?.[moduleId];
        const submodule = module?.children?.[submoduleId];

        if (!module?.visible || !submodule?.visible) {
          setPermissions({});
          return;
        }

        const ops = submodule.operations || [];
        const formattedPermissions = {};

        for (const op of ops) {
          formattedPermissions[`can${op.charAt(0).toUpperCase() + op.slice(1)}`] = true;
        }

        setPermissions(formattedPermissions);
      } catch (error) {
        console.error('Permission fetch error:', error);
        setPermissions({});
      }
    };

    fetchPermissions();
  }, [userId, moduleId, submoduleId]);

  return permissions;
}
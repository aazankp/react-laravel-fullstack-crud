import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CardWithHeader from "../../components/CardWithHeader";
import { LoaderContext } from "../../contexts/LoaderContext";
import { useError } from "../../contexts/ErrorContext";
import { api, basePath } from "../../services/api";

export default function ViewUserPermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startLoading, finishLoading } = useContext(LoaderContext);
  const { showSuccess, showError } = useError();

  const [modules, setModules] = useState([]);
  const [access, setAccess] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const token = localStorage.getItem("token");

        const [modRes, accRes] = await Promise.all([
          api.get(`${basePath}/modules`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`${basePath}/users/module-access/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const parsedModules = modRes.data.map((mod) => ({
          ...mod,
          children: (mod.children || []).map((child) => ({
            ...child,
            operations: typeof child.operations === "string"
              ? JSON.parse(child.operations)
              : child.operations || [],
          })),
        }));

        const parsedAccess = accRes.data.module_access;
        setModules(parsedModules);
        setAccess(typeof parsedAccess === "string" ? JSON.parse(parsedAccess) : parsedAccess || {});
      } catch (err) {
        showError("Failed to load module access.");
      } finally {
        finishLoading();
      }
    };

    fetchData();
  }, [id]);

  const toggleModule = (moduleId, children) => {
    setAccess((prev) => {
      const visible = !(prev[moduleId]?.visible || false);
      return {
        ...prev,
        [moduleId]: {
          visible,
          children: visible
            ? Object.fromEntries(children.map((c) => [c.id, { visible: true, operations: [...c.operations] }]))
            : {},
        },
      };
    });
  };

  const toggleSubmodule = (moduleId, subId) => {
    setAccess((prev) => {
      const mod = prev[moduleId] || { visible: false, children: {} };
      const current = mod.children[subId] || { visible: false, operations: [] };
      const module = modules.find((m) => m.id === moduleId);
      const sub = module?.children.find((c) => c.id === subId);
      const operations = sub?.operations || [];

      return {
        ...prev,
        [moduleId]: {
          ...mod,
          visible: true,
          children: {
            ...mod.children,
            [subId]: {
              visible: !current.visible,
              operations: !current.visible ? [...operations] : [],
            },
          },
        },
      };
    });
  };

  const toggleOperation = (moduleId, subId, op) => {
    setAccess((prev) => {
      const mod = prev[moduleId] || { visible: false, children: {} };
      const sub = mod.children[subId] || { visible: false, operations: [] };
      const operations = sub.operations.includes(op)
        ? sub.operations.filter((o) => o !== op)
        : [...sub.operations, op];

      return {
        ...prev,
        [moduleId]: {
          ...mod,
          visible: true,
          children: {
            ...mod.children,
            [subId]: {
              ...sub,
              visible: true,
              operations,
            },
          },
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      startLoading();
      const token = localStorage.getItem("token");
      await api.post(
        `${basePath}/users/save-module-access/${id}`,
        { module_access: JSON.stringify(access) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Roles saved successfully.");
      navigate(-1);
    } catch {
      showError("Failed to save permissions.");
    } finally {
      finishLoading();
    }
  };

  return (
    <CardWithHeader
      title="User Roles"
      actions={[{ label: "Back", icon: <ArrowLeft size={16} />, onClick: () => navigate(-1) }]}
    >
      <div className="max-w-6xl mx-auto p-6">
        <ul className="space-y-6">
          {modules.map((mod) => {
            const modAccess = access[mod.id] || { visible: false, children: {} };
            return (
              <li key={mod.id}>
                <label className="flex items-center mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modAccess.visible}
                    onChange={() => toggleModule(mod.id, mod.children)}
                    className="mr-2 w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 select-none">
                    {mod.name}
                  </span>
                </label>

                {modAccess.visible && mod.children?.length > 0 && (
                  <ul className="ml-6 space-y-3">
                    {mod.children.map((sub) => {
                      const subAccess = modAccess.children?.[sub.id] || { visible: false, operations: [] };
                      return (
                        <li key={sub.id} className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={subAccess.visible}
                              onChange={() => toggleSubmodule(mod.id, sub.id)}
                              className="w-3 h-3 accent-indigo-500"
                            />
                            <span>{sub.name}</span>
                          </label>

                          {subAccess.visible && (
                            <div className="flex space-x-5">
                              {sub.operations.map((op) => (
                                <label
                                  key={op}
                                  className="inline-flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400"
                                >
                                  <input
                                    type="checkbox"
                                    checked={subAccess.operations.includes(op)}
                                    onChange={() => toggleOperation(mod.id, sub.id, op)}
                                    className="w-3 h-3 accent-indigo-600"
                                  />
                                  <span className="capitalize">{op}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 text-right">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Save Roles
          </button>
        </div>
      </div>
    </CardWithHeader>
  );
}
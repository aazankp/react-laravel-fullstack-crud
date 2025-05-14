const CardWithHeader = ({ title = '', actions = [], children }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="flex gap-2">
          {actions && actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl shadow hover:bg-blue-700 transition"
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-gray-600 dark:text-gray-300 text-sm">
        {children}
      </div>
    </div>
  );
};

export default CardWithHeader;
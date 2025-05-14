import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { MdCheckCircleOutline, MdErrorOutline } from 'react-icons/md';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

const CustomCloseButton = ({ closeToast }) => (
    <button onClick={closeToast} className="absolute top-2 right-2 text-white hover:text-green-400 transition duration-200">
        ×
    </button>
);

export const ErrorProvider = ({ children }) => {
  const showError = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <MdErrorOutline color="red" size={22} />,
        className: 'relative p-4 pr-12 rounded-lg shadow-lg bg-white-200 text-black text-sm', // 👈 custom class
        closeButton: CustomCloseButton,
        progressStyle: {
          background: 'red',
        }
    });      
  };

  const showSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <MdCheckCircleOutline color="green" size={22} />,
        className: 'relative p-4 pr-12 rounded-lg shadow-lg bg-white-200 text-black text-sm',
        closeButton: CustomCloseButton,
        progressStyle: {
          background: 'green',
        }
    });      
  };

  return (
    <ErrorContext.Provider value={{ showError, showSuccess }}>
      {children}
    </ErrorContext.Provider>
  );
};
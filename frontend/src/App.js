import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { ErrorProvider } from './contexts/ErrorContext';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setTheme } from "./redux/slices/themeSlice";

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

// User
import Users from './pages/Users/Users';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import ViewUser from './pages/Users/ViewUser';
import ViewUserPermissions from './pages/Users/ModulePermissions';

function App() {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      dispatch(setTheme(storedTheme === "true"));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.className = mode ? "dark" : "";
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ErrorProvider>
      <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/organization/users" element={<Users />} />
                <Route path="/organization/users/add" element={<AddUser />} />
                <Route path="/organization/users/edit/:id" element={<EditUser />} />
                <Route path="/organization/users/view/:id" element={<ViewUser />} />
                <Route path="/organization/users/roles/:id" element={<ViewUserPermissions />} />
              </Route>
            </Route>
          </Routes>
        </Router>
    </ErrorProvider>
  );
}

export default App;
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./views/MainPage/MainPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ProjectListPage from "./views/ProjectListPage/ProjectListPage";
import ProjectDetailPage from "./views/ProjectDetailPage/ProjectDetailPage";
import CreateFundingProjectPage from "./views/CreateProjectPage/CreateFundingProjectPage";
import CreateWithProjectPage from "./views/CreateProjectPage/CreateWithProjectPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Routing/ProtectedRoute";
import "./styles/global.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile/*"
            element={<ProtectedRoute element={ProfilePage} />}
          />
          <Route path="/projects" exact element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/create-funding-project"
            element={<ProtectedRoute element={CreateFundingProjectPage} />}
          />
          <Route
            path="/create-with-project"
            element={<ProtectedRoute element={CreateWithProjectPage} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

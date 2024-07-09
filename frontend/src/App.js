import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./views/MainPage/MainPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ProjectListPage from "./views/ProjectListPage/ProjectListPage";
import ProjectDetailPage from "./views/ProjectDetailPage/ProjectDetailPage";
import CreateFundingProjectPage from "./views/CreateProjectPage/CreateFundingProjectPage";
import CreateWithProjectPage from "./views/CreateProjectPage/CreateWithProjectPage";
import "./styles/global.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/*" element={<ProfilePage />} />
        <Route path="/projects" exact element={<ProjectListPage />} />
        <Route
          path="/projects/:id"
          element={<ProjectDetailPage projectType="funding" />}
        />
        <Route
          path="/create-funding-project"
          element={<CreateFundingProjectPage />}
        />
        <Route
          path="/create-with-project"
          element={<CreateWithProjectPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;

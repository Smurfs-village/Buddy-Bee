import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./views/MainPage/MainPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ScrollToTop from "./components/Routing/ScrollToTop";
import ProjectListPage from "./views/ProjectListPage/ProjectListPage";
import ProjectDetailPage from "./views/ProjectDetailPage/ProjectDetailPage";
import CreateFundingProjectPage from "./views/CreateProjectPage/CreateFundingProjectPage";
import CreateWithProjectPage from "./views/CreateProjectPage/CreateWithProjectPage";
import CreatePageLayout from "./components/Layout/CreatePageLayout"; // 경로 수정
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Routing/ProtectedRoute";
import KakaoRedirectHandler from "./views/LoginPage/KakaoRedirectHandler"; // 추가
import "./styles/global.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" exact element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/auth/kakao/callback"
            element={<KakaoRedirectHandler />}
          />{" "}
          {/* 추가 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route
              path="/create-funding-project"
              element={<CreateFundingProjectPage />}
            />
            <Route
              path="/create-with-project"
              element={<CreateWithProjectPage />}
            />
            <Route
              path="/projects/:id/edit"
              element={<CreatePageLayout />} // 수정 페이지 추가
            />
          </Route>
          <Route path="/projects" exact element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

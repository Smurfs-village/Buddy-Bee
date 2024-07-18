import { Route, Routes } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import MyProfile from "./MyProfile";
import MyPosts from "./MyPosts";
import Bookmarks from "./Bookmarks";
import ParticipatedProjects from "./ParticipatedProjects";
import Top from "../../components/Common/Top";
import Aside from "../../components/Common/Aside";
import BackgroundGrid from "../../components/Layout/BackGroundGrid";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="profile-page">
        <Top />
        <div className="MyProfile_main_aside_rightContainer_wrapper">
          <Aside />
          <div className="profile-content">
            <Routes>
              <Route path="/" element={<MyProfile />} />
              <Route path="posts" element={<MyPosts />} />
              <Route
                path="participated-projects"
                element={<ParticipatedProjects />}
              />
              <Route path="bookmarks" element={<Bookmarks />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

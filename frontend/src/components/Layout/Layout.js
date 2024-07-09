import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-layout">
      <Header />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

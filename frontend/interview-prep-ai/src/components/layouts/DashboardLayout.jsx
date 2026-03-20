import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="min-h-screen bg-amber-100">
      <Navbar />

      {user && <div>{children}</div>}
    </div>
  );
};

export default DashboardLayout;

import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center">
        <Link to="/profile">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full mr-3 bg-amber-600 flex items-center justify-center text-white ">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </Link>

        <div>
          <Link
            to="/profile"
            className="text-[15px] tracking-widest font-medium text-slate-600  "
          >
            {user.name || ""}
          </Link>
          <br></br>
          <button
            className="text-amber-600 tracking-widest font-medium  text-smcursor-pointer hover:underline"
            onClick={handelLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;

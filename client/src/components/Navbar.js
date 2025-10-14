import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";
import { useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faFileAlt,
  faSignInAlt,
  faSignOutAlt,
  faGlobeAmericas,
  faTelescope,
  faStar 
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ title = "Prime Construct" }) => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const sidebarRef = useRef(null); // create a ref to the sidebar element

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleMouseEnter = () => {
    // set showSidebar to true when mouse enters the sidebar
    setShowSidebar(true);
  };

  const handleMouseLeave = () => {
    // set showSidebar to false when mouse leaves the sidebar
    setShowSidebar(false);
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {showSidebar ? <FaTimes /> : <FaBars />}
      </button>
      <div
        className={`sidenav${showSidebar ? " open" : ""}`}
        ref={sidebarRef} // set the ref to the sidebar element
        onMouseEnter={handleMouseEnter} // handle mouse enter event
        onMouseLeave={handleMouseLeave} // handle mouse leave event
      >
        <ul className="navbar-nav">
          <p className="nav-link">{dateTime.toLocaleString()}</p>

          {user && user.role === "Student" ? (
            <>

              <li className="nav-item">
                <Link to="/apod" role="button" className="nav-link">
                  <FontAwesomeIcon
                    icon={faStar }
                    style={{ marginRight: "10px", color: "white" }}
                  />
                  APOD
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/marssol" role="button" className="nav-link">
                  <FontAwesomeIcon
                    icon={faGlobeAmericas}
                    style={{ marginRight: "10px", color: "white" }}
                  />
                  Mars Rover
                </Link>
              </li>

              <li
                className="nav-item"
                onClick={() => {
                  setUser(null);
                  localStorage.clear();
                  toast.success("Logout Successful!");
                  navigate("/login", { replace: true });
                }}
              >
                <button className="btn btn-danger">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "10px", color: "black",  }}
                  />
                  Logout
                </button>
              </li>
            </>
          ) :
            user && user.role === "" ? (
              <>

                
              </>
            ) :
              user && user.role === "" ? (
                <>
                  
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      to="/login"
                      className="nav-link"
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon
                        icon={faSignInAlt}
                        style={{ marginRight: "10px", color: "white" }}
                      />
                      Login
                    </Link>
                  </li>
                </>
              )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;

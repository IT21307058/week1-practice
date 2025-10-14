import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header
      className="d-flex justify-content-between align-items-center py-3 px-4"
      style={{ background: "linear-gradient(to right, #03045E , #0077B6)" }}
    >
      {user && user.role === "Student" ? (
        <Link
          to="/products"
          className="navbar-brand"
          style={{ textDecoration: "none"  ,display: "flex", alignItems: "center"}}
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/nasa-6.svg"
            className="rounded-circle mr-2"
            width="90"
            height="90"
            style={{ paddingLeft: "25px" }} 
          />
          <h1 className="m-2 text-white" style={{ paddingLeft: "10px" }}>
            NASA
          </h1>
        </Link>
      ) : (
        <Link
          to="/"
          className="navbar-brand"
          style={{ textDecoration: "none"  ,display: "flex", alignItems: "center"}}
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/nasa-6.svg"
            className="rounded-circle mr-2"
            width="90"
            height="90"
            style={{ paddingLeft: "25px" }} 
          />
          <h1 className="m-2 text-white " style={{ paddingLeft: "10px" }}>
            NASA
          </h1>
        </Link>
      )}

      {/* {user &&
        (user.role === "Customer Manager" || user.role === "Customer") && (
          // <SearchBox />
          
        )} */}
      {/* {user &&
        (user.role === "Customer Manager" || user.role === "Customer") && (
          <Link
            to="/cart"
            className="nav-link"
            style={{ marginRight: "20px", color: "white" }}
          >
            Cart
            {cart.cartItems.length > 0 && (
              <Badge pill bg="danger">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </Badge>
            )}
          </Link>
        )} */}
      {user && (
        <div className="d-flex align-items-center">
          <span className="text-white" style={{ paddingRight: "25px" }}>
            {user.name}
          </span>
          {user.role === "Student" && (
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnT08Vr-5u0H9C-2zi0vETETLTbAw45AS9oBjviTHppA&s"
              }
              className="rounded-circle mr-2"
              width="40"
              height="40"
            />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
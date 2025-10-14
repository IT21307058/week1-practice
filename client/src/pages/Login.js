import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
// import ToastContext from "../context/ToastContext";

const Login = () => {
  // const { toast } = useContext(ToastContext);
  const { loginUser } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    //spreading the previous state with the new state
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); //prevents the page from reloading/refreshing

    if (!credentials.email || !credentials.password) {
      // toast.error("Please enter all the required fields!");
      return;
    }

    loginUser(credentials);
  };

  var button = document.getElementById("mainButton");

  // var openForm = function () {
  //   button.className = "active";
  // };

  return (
    <>
      <div className="background">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img
            src="https://cdn.worldvectorlogo.com/logos/nasa-6.svg"
            className="rounded-circle mr-2"
            width="90"
            height="90"
          />
          <h3 className="text-center">Login</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="emailInput" className="form-label mt-4">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  aria-describedby="emailHelp"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  fdprocessedid="8n2of"
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordInput" className="form-label mt-4">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  required
                  fdprocessedid="8n2of"
                />
              </div>
              <center>
                <input
                  type="submit"
                  value="Login"
                  className="btn btn-danger"
                  style={{ marginTop: "20px" }}
                />
              </center>
              <p>
                Don't have an account? <Link to="/register" style={{color:"blue"}}>Create One</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

//We need to export the component so that we can import it in other files
export default Login;

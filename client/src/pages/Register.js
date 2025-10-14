import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const Register = () => {
  const { toast } = useContext(ToastContext);
  const { registerUser } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    //spreading the previous state with the new state
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); //prevents the page from reloading/refreshing

    // console.log(credentials);

    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword ||
      !credentials.role
    ) {
      toast.error("Please enter all the required fields!");
      return;
    }

    //check if the password and confirm password match
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("password do not match");
    }
    const userData = { ...credentials, confirmPassword: undefined };
    registerUser(userData);
  };
  return (
    <>
      <div className="background">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src="https://cdn.worldvectorlogo.com/logos/nasa-6.svg"
            className="rounded-circle mr-2"
            width="90"
            height="90"
          />
          <h3 className="text-center">Create your account</h3>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nameInput" className="form-label mt-4">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                  placeholder="Bhanuka Lakshitha Dayananda"
                  required
                  fdprocessedid="8n2of"
                />
              </div>
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
                  placeholder="bhanukalakshitha@gmail.com"
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
                  placeholder="Enter Password"
                  onChange={handleInputChange}
                  required
                  fdprocessedid="8n2of"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label mt-4">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleInputChange}
                  required
                  fdprocessedid="8n2of"
                />
              </div>
              <div className="form-group">
                <label htmlFor="roleInput" className="form-label mt-4">
                  Role
                </label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    id="roleInput"
                    name="role"
                    value={credentials.role}
                    onChange={handleInputChange}
                    placeholder="Student"
                    required
                    fdprocessedid="8n2of"
                  >
                    <option value="">Select Role</option>
                    <option value="Student">Student</option>
                  </select>
                  {/* <div className="select-arrow">&#9660;</div> */}
                </div>
              </div>
              <center>
                <input
                  type="submit"
                  value="Register"
                  className="btn btn-danger"
                  style={{ marginTop: "20px" }}
                ></input>
              </center>
              <p>
                Already have an account? <Link to="/login" style={{color:"blue"}}>Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
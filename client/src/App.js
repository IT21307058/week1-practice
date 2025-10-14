import { Routes as Switch, Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";

// import { AuthContextProvider } from "./context/AuthContext";

import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import { ToastContextProvider } from "./context/ToastContext";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import FetchApodDataPage from "./pages/apod/FetchApodDataPage.js";
// import FetchApodSpecificDateRange from "./pages/apod/FetchApodSpecificDateRange.js";
// import FetchApodRandom from "./pages/apod/FetchApodRandom.js";
// import FetchMarsRoverPhotos from "./pages/marsrovers/FetchMarsRoverPhotos.js"
// import FetchMarsRoverPhotosDate from "./pages/marsrovers/FetchMarsRoverPhotosDate.js";
// import FetchMissionManifestData from "./pages/marsrovers/FetchMissionManifestData.js";
// import { Helmet } from "react-helmet"

function App() {
  return (
    <Router>
      {/* <Helmet>
        <title>NASA</title>
      </Helmet> */}
      <div style={{ minHeight: "90vh", margin: "0px", padding: "0px" }}>
        <ToastContextProvider>
          {/* <AuthContextProvider> */}
            {/* <Header /> */}
            <Layout>
              <Switch>
                <Route path="/" element={<Home />} />
                {/* <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/apod" element={<FetchApodDataPage />} />
                <Route path="/apodrange" element={<FetchApodSpecificDateRange />} />
                <Route path="/apodrandom" element={<FetchApodRandom />} />
                <Route path="/marssol" element={<FetchMarsRoverPhotos />} />
                <Route path="/marsearthdate" element={<FetchMarsRoverPhotosDate />} />
                <Route path="/marsmanifestdata" element={<FetchMissionManifestData />} /> */}

              </Switch>
            </Layout>
          {/* </AuthContextProvider> */}
        </ToastContextProvider>
      </div>
    </Router>
  );
}

export default App;

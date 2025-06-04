import React from "react";
import "@fontsource/ubuntu";
import "./App.css";
import NavBar from "./components/guest/NavBar";
import Footer from "./components/guest/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/index";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar className="shrink-0" />
        <main className="flex-1 pt-16">
          {/* Contenu */}

          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
        <Footer className="shrink-0" />
      </div>
    </Router>
  );
}

export default App;

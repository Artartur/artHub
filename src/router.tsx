import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./screens/Home";
import User from "./screens/User";
import Repo from "./screens/Repo";
import NotFound from "./screens/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/user/:username",
    element: <User />,
  },
  {
    path: "/repo",
    element: <Repo />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

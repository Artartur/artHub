import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";
import User from "./screens/User";
import Repo from "./screens/Repo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/repo",
    element: <Repo />,
  },
]);

export default router;

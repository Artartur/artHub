import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";
import User from "./screens/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

export default router;

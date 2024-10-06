import { Exoplanets } from "./exoplanets"
import { Skybox } from "./skybox"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Exoplanets />,
    },
    {
      path: "/:x/:y/:z/:name",
      element: <Skybox />,
    },
    {
      path: "*",
      element: <Navigate to={"/"} replace/>,
    }
  ]);

  return <RouterProvider router={router}/>;
}


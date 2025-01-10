import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import ComingSoonPage from './ComingSoon';
import Preloader from './Preloader';
import NotFoundPage from './NotFoundPage';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  // Define the router using `createBrowserRouter`
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ComingSoonPage />,
      errorElement: <NotFoundPage />, // Handles undefined routes
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

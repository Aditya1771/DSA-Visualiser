import { Navigate, Route, Routes, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./Stores/authSlice";

// Components
import Navbar from "./Components/Header";
import LandingPage from "./Components/Body";
import DSADashboard from "./Components/DSADashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import BlogPage from "./pages/BlogPage";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";

// Visualizers
import BubbleSortVisualizer from "./Components/Algorithm/BubbleSort";
import InsertionSortVisualizer from "./Components/Algorithm/InsertionSort";
import SelectionSortVisualizer from "./Components/Algorithm/SelectionSort";
import BFSVisualizer from "./Components/Algorithm/BFSinGraph";
import DFSVisualizer from "./Components/Algorithm/DFSinGraph";
import LinearSearchVisualizer from "./Components/Algorithm/LinearSearch";
import BinarySearchVisualizer from "./Components/Algorithm/BinarySearch";

function App() {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Define your algorithm routes array
  const algorithmRoutes = [
    { path: "Bubble-Sort", element: <BubbleSortVisualizer /> },
    { path: "Insertion-Sort", element: <InsertionSortVisualizer /> },
    { path: "Selection-Sort", element: <SelectionSortVisualizer /> },
    { path: "BFS-in-Graph", element: <BFSVisualizer /> },
    { path: "DFS-in-Graph", element: <DFSVisualizer /> },
    { path: "Linear-Search", element: <LinearSearchVisualizer /> },
    { path: "Binary-Search", element: <BinarySearchVisualizer /> },
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const hideNavbar = ["/login", "/signup", "/verify-otp", "/forgot-password"].includes(location.pathname);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050505] text-slate-200">
      {!hideNavbar && <Navbar user={user} isAuthenticated={isAuthenticated} />}

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <Routes>
          {/* Public / Landing */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
          
          <Route path="/verify-otp" element={!isAuthenticated ? <OtpVerification /> : <Navigate to="/dashboard" />}/>
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />

          {/* Core Protected Routes */}
          <Route path="/dashboard" element={isAuthenticated ? <DSADashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profile/update" element={isAuthenticated ? <UpdateProfilePage /> : <Navigate to="/login" />} />

          <Route path="/blogs" element={<BlogPage />} />
          {/* Mapped Algorithm Routes with Auth Protection */}
          {algorithmRoutes.map(({ path, element }) => (
            <Route 
              key={path} 
              path={`/algorithms/${path}`} 
              element={isAuthenticated ? element : <Navigate to="/login" />} 
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
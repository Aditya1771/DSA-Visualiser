import Header from "./Components/Header";
import Home from "./Components/Home";

import { BrowserRouter, Routes, Route } from "react-router";
import DSADashboard from "./Components/DSADashboard";

import BubbleSortVisualizer from "./Components/Algorithm.js/BubbleSort";
import InsertionSortVisualizer from "./Components/Algorithm.js/InsertionSort";
import SelectionSortVisualizer from "./Components/Algorithm.js/SelectionSort"
import BFSVisualizer from "./Components/Algorithm.js/BFSinGraph";
import LinearSearchVisualizer from "./Components/Algorithm.js/LinearSearch";
import BinarySearchVisualizer from "./Components/Algorithm.js/BinarySearch";
import ThemeWrapper from "./ThemeWrapper";

export default function App() {
  const algorithmRoutes = [
    { path: "Bubble-Sort", element: <BubbleSortVisualizer /> },
    { path: "Insertion-Sort", element: <InsertionSortVisualizer /> },
    { path: "Selection-Sort", element: <SelectionSortVisualizer /> },
    { path: "BFS-in-Graph", element: <BFSVisualizer /> },
    { path: "Linear-Search", element: <LinearSearchVisualizer /> },
    { path: "Binary-Search", element: <BinarySearchVisualizer /> },
  ];

  return (
    <ThemeWrapper>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<DSADashboard />} />

          {algorithmRoutes.map(({ path, element }) => (
            <Route key={path} path={`/algorithms/${path}`} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

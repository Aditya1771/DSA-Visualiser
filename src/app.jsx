import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import DSADashboard from "./Components/DSADashboard.js";
import BubbleSortVisualizer from "./Components/Algorithm.js/BubbleSort";
import InsertionSortVisualizer from "./Components/Algorithm.js/InsertionSort.js";
import SelectionSortVisualizer from "./Components/Algorithm.js/SelectionSort.js";
import BFSVisualizer from "./Components/Algorithm.js/BFSinGraph.js";
import LinearSearchVisualizer from "./Components/Algorithm.js/LinearSearch.js";
import BinarySearchVisualizer from "./Components/Algorithm.js/BinarySearch.js";
import { Provider } from "react-redux";
import { store } from "./Stores/store.js";
import Header from "./Components/Header";

function App() {
  const algorithmRoutes = [
    { path: "Bubble-Sort", element: <BubbleSortVisualizer /> },
    { path: "Insertion-Sort", element: <InsertionSortVisualizer /> },
    { path: "Selection-Sort", element: <SelectionSortVisualizer /> },
    { path: "BFS-in-Graph", element: <BFSVisualizer /> },
    { path: "Linear-Search", element: <LinearSearchVisualizer /> },
    { path: "Binary-Search", element: <BinarySearchVisualizer /> },
  ];

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />   {/* Always visible */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<DSADashboard />} />

          {algorithmRoutes.map(({ path, element }) => (
            <Route key={path} path={`/algorithms/${path}`} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

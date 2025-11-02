import { Link } from "react-router";


export default function Body() {
  const features = [
    {
      icon: "⚡",
      title: "Algorithm Racing",
      description:
        "Compare sorting algorithms side-by-side with real-time speed visualization and step-by-step breakdown.",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: "🌳",
      title: "Tree Visualizer",
      description:
        "Watch binary trees grow, traverse, and balance in beautiful, animated diagrams.",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: "🧭",
      title: "Pathfinding Playground",
      description:
        "Explore BFS, DFS, Dijkstra, and A* with interactive maze path animations.",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: "📊",
      title: "Complexity Insights",
      description:
        "Understand time and space complexity with dynamic graphs and comparisons.",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="relative bg-gray-900 min-h-[500px] flex flex-col items-center justify-center overflow-hidden -z-0">
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-pulse-slow"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full mt-50">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-in-up ">
          Visualize Data Structures & Algorithms
        </h1>

        <div className="w-full md:w-3/4 lg:w-2/3 px-4 animate-fade-in-up-delay">
          <p className="text-gray-200 text-lg md:text-xl text-center leading-relaxed">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 font-medium">
              "Visualize. Race. Master!"
            </span>{" "}
            Interactive algorithm playground where sorts battle, trees bloom, and
            pathfinding comes alive – understand DSA through immersive visualization.
          </p>
        </div>

        <Link to="/algorithms">
          <button className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 animate-fade-in-up-delay-more">
            ⚡ Start Exploring Now
          </button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="relative z-10 mt-20 max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border border-gray-800 bg-gray-800 bg-opacity-50 hover:shadow-xl hover:scale-105 transition-transform duration-300`}
          >
            <div
              className={`text-4xl mb-4 inline-block bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
            >
              {feature.icon}
            </div>
            <h3
              className={`text-lg font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
            >
              {feature.title}
            </h3>
            <p className="text-gray-400 mt-2 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Floating animated elements */}
      <div className="absolute bottom-6 left-8 text-purple-400 text-4xl opacity-60 animate-float">
        ⚡
      </div>
      <div className="absolute top-1/4 right-10 text-indigo-400 text-4xl opacity-60 animate-float-delay">
        🧠
      </div>
    </div>
  );
}

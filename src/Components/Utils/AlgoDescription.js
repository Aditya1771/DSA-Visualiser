// src/data/algoDescriptions.js
export const algoDescriptions = {
  // Sorting
  "Bubble-Sort": "Repeatedly compares adjacent elements, swapping them if out of order. Simple to implement, but inefficient for large unsorted datasets.",
  "Selection-Sort": "Finds the smallest element, places it at the beginning. Repeats for remaining elements. Simple but inefficient on larger datasets.",
  "Insertion-Sort": "Builds sorted list by inserting each new element into its proper place. Works efficiently for nearly sorted or small arrays.",
  "Merge-Sort": "Recursively divides the array, sorts halves, and merges them efficiently. Provides guaranteed O(n log n) performance across all cases.",
  "Quick-Sort": "Partitions array using a pivot, recursively sorts subarrays. Very efficient on average but worst case O(n²) without optimizations.",
  "Heap-Sort": "Builds a binary heap, repeatedly extracts maximum or minimum, then rebuilds heap. Efficient with O(n log n) guaranteed complexity.",
  "Counting-Sort": "Counts element occurrences, calculates positions, and places elements accordingly. Works best for integers within small known ranges efficiently.",
  "Radix-Sort": "Processes digits of numbers from least significant to most significant. Non-comparative sorting algorithm, stable, and efficient for integers.",

  // Searching
  "Linear-Search": "Checks each element sequentially until target is found or end reached. Very simple but inefficient for large unsorted datasets.",
  "Binary-Search": "Repeatedly halves sorted search space to locate target. Efficient O(log n) complexity but requires sorted data for effectiveness.",

  // Array
  "Kadane's-Algorithm": "Uses dynamic programming to find maximum subarray sum efficiently in linear time, tracking current and global maximum values throughout.",
  "Moore's-Voting-Algorithm": "Efficiently finds majority element by counting votes and canceling others. Works in O(n) time with O(1) extra space.",
  "Two Pointer-Technique": "Uses two indices moving at different speeds or directions to solve array problems efficiently, such as pairs or subarrays.",
  "Sliding-Window": "Optimizes subarray problems by moving a fixed-size or variable window across data, calculating results without recomputing each time.",
  "Prefix-Sum": "Precomputes cumulative sums to answer range queries efficiently. Useful in array problems requiring repeated range sum calculations quickly.",

  // Linked List
  "Reverse-Linked-List": "Reverses node connections so that head becomes tail and order is flipped. Common interview problem demonstrating pointer manipulation.",
  "Detect-Cycle-in-Linked-List": "Uses fast and slow pointers (Floyd’s algorithm) to detect loops in a linked list with O(1) extra space.",
  "Merge-Two-Sorted-Lists": "Combines two sorted linked lists into a single sorted list efficiently by iterating and adjusting pointers without extra structures.",
  "Intersection-Point-of-Linked-Lists": "Finds the node where two linked lists intersect by aligning lengths and traversing together until meeting point occurs.",
  "Remove-Nth-Node-From-End": "Deletes the nth node from end by using two-pointer technique, advancing one pointer ahead before simultaneous traversal.",

  // Stack
  "Next-Greater-Element": "Uses stack to efficiently find next greater element for each array value, replacing brute force with O(n) complexity.",
  "Balanced-Parentheses": "Checks if parentheses, brackets, and braces are correctly balanced using stack. Fundamental problem in parsing expressions and compilers.",
  "Infix-to-Postfix": "Converts infix arithmetic expressions into postfix (Reverse Polish Notation) using stack, simplifying evaluation and order of operations.",
  "Evaluate-Postfix-Expression": "Evaluates postfix mathematical expressions efficiently using stack by processing operands and operators without precedence rules.",
  "Min-Stack": "Stack supporting push, pop, and retrieving minimum element in constant time using auxiliary structure or clever tracking technique.",

  // Queue
  "LRU-Cache": "Implements least recently used cache using queue or hashmap. Evicts oldest unused item when cache exceeds defined capacity limit.",
  "Circular-Queue": "Queue where rear connects to front, saving unused spaces. Efficiently manages memory with modular arithmetic for enqueue dequeue.",
  "Sliding-Window-Maximum": "Finds maximum element within every moving window across an array using deque for O(n) efficient complexity solution.",
  "Implement-Queue-using-Stacks": "Simulates queue behavior using two stacks. One stack handles enqueue, other manages dequeue operations with amortized efficiency.",

  // Tree
  "Inorder-Traversal": "Visits left subtree, then root, then right subtree recursively. Produces sorted order in binary search trees specifically.",
  "Preorder-Traversal": "Visits root before left and right subtrees recursively. Useful for copying trees or generating prefix expression representations.",
  "Postorder-Traversal": "Visits left, then right, then root recursively. Used for deleting trees, evaluating expressions, or computing dependent operations.",
  "Level-Order-Traversal": "Visits nodes level by level using queue. Also known as breadth-first traversal, often applied in shortest path problems.",
  "Lowest-Common-Ancestor": "Finds the lowest node in tree that has both given nodes as descendants, useful in genealogical or hierarchy problems.",
  "Diameter-of-Tree": "Calculates longest path between any two nodes in tree, measured in edges or nodes. Uses DFS or dynamic programming.",
  "Balanced-Binary-Tree": "Checks if left and right subtrees differ in height by at most one, ensuring logarithmic height for optimal efficiency.",
  "Serialize-and-Deserialize-Binary-Tree": "Converts tree into string representation and reconstructs it back. Useful for storage, transfer, or testing tree structures.",

  // Graph
  "BFS-in-Graph": "Traverses graph level by level using queue. Explores all neighbors before moving deeper, commonly used in shortest path problems.",
  "DFS-in-Graph": "Traverses graph depth-first using recursion or stack, exploring as deep as possible before backtracking. Useful for connectivity checks.",
  "Dijkstra's-Algorithm": "Finds shortest paths from source to all vertices in weighted graph using priority queue. Efficient but ignores negative weights.",
  "Bellman-Ford-Algorithm": "Finds shortest paths allowing negative weights. Runs slower than Dijkstra, but detects negative cycles within graph reliably.",
  "Floyd-Warshall": "Dynamic programming algorithm computing shortest paths between all pairs of vertices in weighted graph, handling negative weights gracefully.",
  "Topological-Sort": "Orders vertices of directed acyclic graph so every directed edge points forward. Useful for scheduling and dependency resolution tasks.",
  "Cycle-Detection-in-Graph": "Checks if graph contains cycles using DFS, union-find, or coloring technique. Essential for validating DAG structures effectively.",
  "Prim's-Algorithm": "Greedy algorithm that builds minimum spanning tree by adding smallest weight edge connecting tree to remaining vertices efficiently.",
  "Kruskal's-Algorithm": "Greedy algorithm that builds minimum spanning tree by repeatedly adding lowest weight edge without forming cycles using union-find.",
};

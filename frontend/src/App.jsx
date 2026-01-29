import React from 'react';

// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       {/* Navigation Bar */}
//       <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
//         <div className="flex items-center">
//           <span className="text-2xl font-bold text-blue-600">Circle</span>
//         </div>
        
//         <div className="hidden md:flex space-x-8">
//           <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
//           <a href="#circles" className="text-gray-600 hover:text-blue-600 font-medium">Circles</a>
//           <a href="#moments" className="text-gray-600 hover:text-blue-600 font-medium">Moments</a>
//           <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium">About</a>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <button className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
//             Login
//           </button>
//           <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5">
//             Join Circle →
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="px-6 py-20 md:py-32">
//         <div className="max-w-6xl mx-auto text-center">
//           <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
//             Find Your Circle,
//             <br />
//             <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
//               Build Your Network
//             </span>
//           </h1>
          
//           <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
//             Connect with like-minded people through Circles, share Moments, 
//             and build meaningful relationships in dedicated communities.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-xl transition-all transform hover:scale-105">
//               Join for Free →
//             </button>
//             <button className="px-8 py-3 border border-blue-500 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
//               Explore Circles
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Features Preview */}
//       <section id="features" className="px-6 py-20 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             What Makes Circle Unique
//           </h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="p-6 bg-blue-50 rounded-2xl">
//               <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
//                 <span className="text-white font-bold text-xl">👥</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Circles & Rings</h3>
//               <p className="text-gray-600">
//                 Join communities and sub-communities that match your interests. 
//                 Create meaningful connections in structured spaces.
//               </p>
//             </div>
            
//             <div className="p-6 bg-purple-50 rounded-2xl">
//               <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
//                 <span className="text-white font-bold text-xl">⚡</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Moments</h3>
//               <p className="text-gray-600">
//                 Share 24-hour disappearing content with your connections. 
//                 Keep your network updated with what matters most.
//               </p>
//             </div>
            
//             <div className="p-6 bg-pink-50 rounded-2xl">
//               <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
//                 <span className="text-white font-bold text-xl">🎥</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">RoundTables</h3>
//               <p className="text-gray-600">
//                 Host scheduled video meetings with time limits. 
//                 Perfect for discussions, presentations, or casual hangouts.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="px-6 py-8 bg-gray-800 text-white">
//         <div className="max-w-6xl mx-auto text-center">
//           <p className="text-gray-400">
//             © 2024 Circle. Connect better, together.
//           </p>
//           <p className="text-gray-500 text-sm mt-2">
//             Final Year Project • MERN Stack • Built with ❤️
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
 
 return ( <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
  );

}

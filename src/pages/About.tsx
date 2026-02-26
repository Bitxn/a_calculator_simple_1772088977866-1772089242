import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xl bg-gradient-to-br from-gray-800 to-gray-950 border border-gray-700 rounded-3xl shadow-2xl p-8 md:p-12 text-center transform transition-all duration-500 ease-in-out hover:scale-[1.01] hover:shadow-teal-500/20">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-extrabold text-4xl md:text-5xl mb-6 leading-tight">
          About This Simple Calculator
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed">
          Welcome to your everyday companion for quick and efficient calculations!
          This application provides a clean, intuitive, and highly responsive interface
          for all your basic arithmetic needs.
        </p>

        <p className="text-gray-400 text-md md:text-lg mb-8 leading-relaxed">
          Built with the power of React, enhanced with TypeScript for robust type safety,
          and styled beautifully with Tailwind CSS, this calculator is designed to offer
          a seamless user experience right in your browser. No backend, no fuss — just pure,
          frontend functionality at your fingertips.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Return to Calculator
        </Link>
      </div>

      <p className="mt-12 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Simple Calculator App. All rights reserved.
      </p>
    </div>
  );
}
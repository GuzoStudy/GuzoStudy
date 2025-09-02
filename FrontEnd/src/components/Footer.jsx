import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GuzoStudy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

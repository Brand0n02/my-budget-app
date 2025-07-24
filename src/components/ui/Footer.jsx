import { HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/40 backdrop-blur-sm  border-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 w-full">
      <div className="w-full mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
             
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">To be budgeted</h3>
                <p className="text-gray-300 text-sm">Smart Financial Dashboard</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
            <h4 className="text-indigo-300 font-bold mb-4 flex items-center text-base">
              <SparklesIcon className="w-4 h-4 mr-2 text-indigo-400" />
              Features
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Smart Categorization
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  AI Insights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Savings Jars
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Real-time Sync
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-purple-300 font-bold mb-4 flex items-center text-base">
              <ShieldCheckIcon className="w-4 h-4 mr-2 text-purple-400" />
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div className="bg-gradient-to-br from-pink-500/10 to-indigo-500/10 rounded-xl p-4 border border-pink-500/20">
            <h4 className="text-pink-300 font-bold mb-4 flex items-center text-base">
              <SparklesIcon className="w-4 h-4 mr-2 text-pink-400" />
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Financial Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Budget Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  Investment Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
            <h4 className="text-indigo-300 font-bold mb-4 flex items-center text-base">
              <SparklesIcon className="w-4 h-4 mr-2 text-indigo-400" />
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Reddit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-gray-300 text-sm font-medium">
                © {currentYear} To be budgeted. All rights reserved.
              </span>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-sm">Made with</span>
                <HeartIcon className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="text-sm">for better finances</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm font-medium">
                Status
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors text-sm font-medium">
                Blog
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors text-sm font-medium">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-300 transition-colors text-sm font-medium">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
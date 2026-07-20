import { Link } from 'react-router-dom';
import { Heart, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">GrowNest</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your AI-powered companion for raising healthy, happy children. Trusted by 50,000+ parents worldwide.
            </p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Product',
              links: ['Features', 'How It Works', 'Pricing', 'Changelog'],
            },
            {
              title: 'Resources',
              links: ['Parenting Blog', 'Vaccine Guide', 'Nutrition Tips', 'FAQ'],
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-primary-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 GrowNest. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500" fill="currentColor" />
            <span>for parents everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

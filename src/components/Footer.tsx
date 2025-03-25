
import { Link } from 'react-router-dom';
import { 

  Trophy, 

} from 'lucide-react';




// Footer Component
export const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook', url: 'x.com' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'x.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'x.com' }
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="mr-2 text-blue-500" />
            Sports Connect
          </h3>
          <p className="text-gray-400">
            Connecting athletes, teams, and sports enthusiasts through technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-gray-300 hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a 
                key={social.name} 
                href={social.url} 
                className="text-gray-300 hover:text-white transition"
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="col-span-full text-center text-gray-500 mt-8 pt-4 border-t border-gray-700">
          © 2024 Sports Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer
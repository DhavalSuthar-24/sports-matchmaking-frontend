import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Trophy, Target } from "lucide-react";
import Header from "../components/Headers";

// Footer Component
const Footer: React.FC = () => {
  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook", url: "x.com" },
    { name: "Twitter", icon: "fab fa-twitter", url: "x.com" },
    { name: "Instagram", icon: "fab fa-instagram", url: "x.com" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
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
            Connecting athletes, teams, and sports enthusiasts through
            technology.
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

// LandingPage Component
const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Users className="text-blue-600" size={48} />,
      title: "Create Teams",
      description:
        "Easily form and manage your sports teams with our intuitive platform.",
    },
    {
      icon: <Trophy className="text-green-600" size={48} />,
      title: "Challenge Opponents",
      description:
        "Send and accept challenges across multiple sports and skill levels.",
    },
    {
      icon: <Target className="text-red-600" size={48} />,
      title: "Track Performance",
      description:
        "Monitor your skills, stats, and progress across different games.",
    },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect, Challenge, Compete
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Discover local sports teams, challenge opponents, and showcase your
            skills across multiple sports.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Get Started
            </Link>
            <Link
              to="/sports"
              className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/20 transition"
            >
              Explore Sports
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Sports Connect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

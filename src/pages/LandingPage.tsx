

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Trophy, Target, Sword, Shield, BarChart2, Globe, Award, Zap } from "lucide-react";
import Header from "../components/Headers";

// Footer Component
const Footer: React.FC = () => {
  const socialLinks = [
    { name: "Twitter", icon: "fab fa-twitter", url: "x.com" },
    { name: "Instagram", icon: "fab fa-instagram", url: "x.com" },
    { name: "Discord", icon: "fab fa-discord", url: "x.com" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <motion.h3 
            className="text-2xl font-bold mb-4 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="mr-2 text-yellow-400" />
            GameFace
          </motion.h3>
          <p className="text-gray-400">
            Where real skills meet real competition. No fake likes, just real games.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <motion.div whileHover={{ x: 5 }} key={link.path}>
                <Link
                  to={link.path}
                  className="text-gray-300 hover:text-white transition flex items-center"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-4 text-lg">Join the Squad</h4>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                className="text-gray-300 hover:text-yellow-400 transition text-xl"
                whileHover={{ y: -3 }}
              >
                <i className={social.icon}></i>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="col-span-full text-center text-gray-500 mt-8 pt-4 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} GameFace. All rights reserved. | Built for players, by players.
        </motion.div>
      </div>
    </footer>
  );
};

// LandingPage Component
const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Sword className="text-yellow-400" size={48} />,
      title: "Build Your Dream Team",
      description: "Recruit players based on real skills - need a left-handed middle order batsman? We got you! IYKYK.",
    },
    {
      icon: <Shield className="text-blue-400" size={48} />,
      title: "Challenge & Conquer",
      description: "Throw down the gauntlet! Challenge other teams in your area and prove who's the real MVP.",
    },
    {
      icon: <BarChart2 className="text-green-400" size={48} />,
      title: "Skill-Based Rankings",
      description: "No fluff, just facts. Our algorithm ranks players based on actual performance. Flex those stats!",
    },
    {
      icon: <Globe className="text-purple-400" size={48} />,
      title: "Local Legends",
      description: "Find and follow top players in your region. Who's the king of your neighborhood?",
    },
    {
      icon: <Award className="text-red-400" size={48} />,
      title: "Earn Your Stripes",
      description: "Unlock titles and badges based on your skills. Divine wine status awaits!",
    },
    {
      icon: <Users className="text-teal-400" size={48} />,
      title: "Real Connections",
      description: "Social media connects us online but distances us IRL. We're changing that - meet your teammates face to face!",
    },
  ];

  const stats = [
    { value: "10+", label: "Sports Supported" },
    { value: "100K+", label: "Active Players" },
    { value: "50K+", label: "Teams Formed" },
    { value: "1M+", label: "Challenges Completed" },
  ];

  return (
    <div className="overflow-hidden">


      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-32 overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-yellow-400">GameFace</span>: Where <br className="hidden md:block" />Real Players Connect
          </motion.h1>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          >
            Tired of fake social media connections? Done losing money on fantasy betting? 
            <br />
            <span className="font-semibold text-yellow-300">We're bringing sports back to the streets.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Join the Game →
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 border-2 border-yellow-400 text-white font-bold rounded-lg hover:bg-yellow-400/10 transition transform hover:-translate-y-1"
            >
              How It Works
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <p className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why GameFace is Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not another fantasy app where you lose money. This is about <span className="font-semibold text-yellow-500">real skills, real games, real connections.</span>
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-yellow-300 transition-all"
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            whileInView={{ scale: [0.95, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Take Your Game Offline?
          </motion.h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Stop scrolling, start playing. Find your squad, build your legacy.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition shadow-lg"
            >
              Get in the Game - It's Free!
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;
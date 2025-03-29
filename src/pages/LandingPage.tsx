import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Trophy, Target, Sword, Shield, BarChart2, Globe, Award, Zap } from "lucide-react";


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
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <motion.h3 
            className="text-2xl font-bold mb-4 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="mr-2 text-yellow-400 dark:text-yellow-300" />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-300 dark:to-yellow-500 bg-clip-text text-transparent">
              GameFace
            </span>
          </motion.h3>
          <p className="text-gray-400 dark:text-gray-300">
            Where real skills meet real competition. No fake likes, just real games.
          </p>
          
    
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-lg text-gray-100 dark:text-gray-50">Quick Links</h4>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <motion.div whileHover={{ x: 5 }} key={link.path}>
                <Link
                  to={link.path}
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-yellow-300 transition flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 dark:bg-yellow-300 rounded-full mr-2 group-hover:animate-pulse"></span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-4 text-lg text-gray-100 dark:text-gray-50">Join the Squad</h4>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                className="text-gray-300 dark:text-gray-400 hover:text-yellow-400 dark:hover:text-yellow-300 transition text-xl"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <i className={social.icon}></i>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-700 dark:border-gray-800"
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
      icon: <Sword className="text-yellow-400 dark:text-yellow-300" size={48} />,
      title: "Build Your Dream Team",
      description: "Recruit players based on real skills - need a left-handed middle order batsman? We got you! IYKYK.",
    },
    {
      icon: <Shield className="text-blue-400 dark:text-blue-300" size={48} />,
      title: "Challenge & Conquer",
      description: "Throw down the gauntlet! Challenge other teams in your area and prove who's the real MVP.",
    },
    {
      icon: <BarChart2 className="text-green-400 dark:text-green-300" size={48} />,
      title: "Skill-Based Rankings",
      description: "No fluff, just facts. Our algorithm ranks players based on actual performance. Flex those stats!",
    },
    {
      icon: <Globe className="text-purple-400 dark:text-purple-300" size={48} />,
      title: "Local Legends",
      description: "Find and follow top players in your region. Who's the king of your neighborhood?",
    },
    {
      icon: <Award className="text-red-400 dark:text-red-300" size={48} />,
      title: "Earn Your Stripes",
      description: "Unlock titles and badges based on your skills. Divine wine status awaits!",
    },
    {
      icon: <Users className="text-teal-400 dark:text-teal-300" size={48} />,
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
    <div className="overflow-hidden dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-32 overflow-hidden transition-colors duration-300"
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-5"
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
            <span className="text-yellow-400 dark:text-yellow-300">GameFace</span>: Where <br className="hidden md:block" />Real Players Connect
          </motion.h1>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300 dark:text-gray-200"
          >
            Tired of fake social media connections? Done losing money on fantasy betting? 
            <br />
            <span className="font-semibold text-yellow-300 dark:text-yellow-200">
              We're bringing sports back to the streets.
            </span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-yellow-400 dark:bg-yellow-300 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-200 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95"
            >
              Join the Game →
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 border-2 border-yellow-400 dark:border-yellow-300 text-white font-bold rounded-lg hover:bg-yellow-400/10 dark:hover:bg-yellow-300/10 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              How It Works
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
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
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <p className="text-3xl md:text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why GameFace is Different
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not another fantasy app where you lose money. This is about{' '}
              <span className="font-semibold text-yellow-500 dark:text-yellow-400">
                real skills, real games, real connections.
              </span>
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
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-400 transition-all hover:shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white transition-colors duration-300"
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
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300 dark:text-gray-200">
            Stop scrolling, start playing. Find your squad, build your legacy.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-yellow-400 dark:bg-yellow-300 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-200 transition-all shadow-lg active:scale-95"
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
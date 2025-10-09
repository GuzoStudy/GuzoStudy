// src/pages/Contact.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this with your backend API
      await axios.post("https://guzostudy.onrender.com/api/contact", {
        name,
        email,
        message,
      });

      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h1>

          {status && (
            <p className="mb-4 text-sm text-green-600">{status}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              rows={5}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Social Links */}
          <div className="mt-8 flex justify-center space-x-6">
            <a href="https://facebook.com/GuzoStudy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com/GuzoStudy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com/GuzoStudy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://linkedin.com/in/GuzoStudy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center bg-blue-50 p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={20} className="text-blue-600" />
            <span>support@guzostudy.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={20} className="text-blue-600" />
            <span>+251 912 345 678</span>
          </div>
          <p className="text-gray-600 mt-4">
            Follow us on social media to stay updated with the latest courses, tutorials, and tips!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

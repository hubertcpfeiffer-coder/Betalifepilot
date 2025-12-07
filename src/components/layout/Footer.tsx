import React from 'react';
import { Bot, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Mio-Lifepilot</span>
            </div>
            <p className="text-gray-400 mb-4">Dein persönlicher KI-Avatar für die Optimierung deines Lebens. Automatisiere alle Online-Aufgaben und erreiche deine Ziele.</p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-cyan-600 rounded-lg transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-cyan-600 rounded-lg transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-cyan-600 rounded-lg transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-cyan-600 rounded-lg transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Organisation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">E-Mail Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kalender & Termine</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Finanzen & Banking</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Social Media</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Einkaufen</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Life Coaches</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Erfolgscoach</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gesundheitscoach</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Private Professor</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Runder Tisch der KIs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400"><Mail className="w-4 h-4" />support@mio-lifepilot.de</li>
              <li className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4" />+49 123 456 789</li>
              <li className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4" />Berlin, Deutschland</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 Mio-Lifepilot. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">AGB</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Impressum</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, Users, Building, Award, PenTool, FileCheck, ChevronRight, ExternalLink } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
     
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className={`max-w-3xl mx-auto text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            About <span className="text-indigo-400">ForensicVision</span>
          </h1>
          
          <p className="text-xl text-gray-300">
            Revolutionizing criminal investigations through advanced technology and machine learning.
          </p>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 mb-6">
              The rising crime rates have forced law enforcement techniques to evolve so that the efficiency and accuracy of suspect identification improve. Traditional methods include hand-drawn forensic sketches made by artists, based on the descriptions given by eyewitnesses.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              These methods have inherent shortcomings, including the availability of skilled artists and the inaccuracies inherent in manual sketching. Forensic Face Sketch Construction and Recognition aims to bridge these gaps through the use of advanced technological solutions.
            </p>
            <div className="flex items-center gap-3 text-indigo-400">
              <Shield className="h-6 w-6" />
              <span className="font-medium">Making investigations more effective and reliable</span>
            </div>
          </div>
          
          <div className={`bg-gray-800 rounded-xl p-8 border border-gray-700 relative overflow-hidden transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-20 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">What We Do</h3>
              <p className="text-gray-300 mb-6">
                Our project focuses on the development of a digital platform that automates the creation and recognition of forensic sketches. Through the use of:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-indigo-600 rounded-full p-1 mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span>Machine learning algorithms for feature detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-indigo-600 rounded-full p-1 mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span>Deep learning for sketch-to-photo matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-indigo-600 rounded-full p-1 mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span>Cloud infrastructure for real-time processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-indigo-600 rounded-full p-1 mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span>Advanced facial recognition technology</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Purpose */}
      <section className="py-16 px-6 lg:px-12 bg-gray-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl font-bold mb-6">Our Purpose</h2>
            <p className="text-lg text-gray-300">
              The purpose of this project is to streamline the process of suspect identification, thereby saving time and resources in investigations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Sketch Creation</h3>
              <p className="text-gray-300">
                Our system allows law enforcement agencies to create accurate facial sketches without relying on skilled artists, making the process faster and more accessible.
              </p>
            </div>
            
            <div className={`bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enhanced Accuracy</h3>
              <p className="text-gray-300">
                The incorporation of cutting-edge technologies enhances the ability to produce accurate sketches that can be quickly matched against vast criminal databases.
              </p>
            </div>
            
            <div className={`bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Improved Investigations</h3>
              <p className="text-gray-300">
                The importance of this project lies in its potential to revolutionize criminal investigations, making them more effective and reliable in bringing perpetrators to justice.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      {/* <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="text-3xl font-bold mb-6">The Team Behind ForensicVision</h2>
          <p className="text-lg text-gray-300">
            Our multidisciplinary team combines expertise in computer vision, machine learning, and forensic science to create cutting-edge solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              name: "Samiksha Thakre",
              img: "/api/placeholder/200/200",
              delay: "1200"
            },
            {
              name: "Ritesh Suryawanshi",
              img: "/api/placeholder/200/200",
              delay: "1300"
            },
            {
              name: "Satyam Kodale",
              img: "/api/placeholder/200/200",
              delay: "1400"
            },
            {
              name: "Mrs Sheetal Borade",
              img: "/api/placeholder/200/200",
              delay: "1500"
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-lg p-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${member.delay}ms` }}
            >
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-600"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      
      {/* Partners & Recognition */}
      {/* <section className="py-16 px-6 lg:px-12 bg-gray-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-1600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl font-bold mb-6">Partners & Recognition</h2>
            <p className="text-lg text-gray-300">
              ForensicVision is trusted by law enforcement agencies worldwide and has received recognition for its innovative approach.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`bg-gray-900 rounded-lg p-6 flex items-center justify-center h-32 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionDelay: `${1600 + (i * 100)}ms` }}
              >
                <img 
                  src={`/api/placeholder/120/60`} 
                  alt={`Partner ${i}`} 
                  className="max-h-12 opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="h-6 w-6" />,
                title: "Innovation Excellence Award",
                desc: "Recognized for breakthrough technology in forensic science, 2023",
                delay: "2000"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Law Enforcement Tech Partner",
                desc: "Official technology partner for multiple federal agencies",
                delay: "2100"
              },
              {
                icon: <Building className="h-6 w-6" />,
                title: "Government Security Clearance",
                desc: "Highest level of security clearance for sensitive operations",
                delay: "2200"
              }
            ].map((award, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${award.delay}ms` }}
              >
                <div className="bg-indigo-600 rounded-full p-3 text-white">
                  {award.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                  <p className="text-gray-300">{award.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* CTA Section */}
      {/* <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className={`bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-8 lg:p-12 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-1000 delay-2300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to join our mission?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl">
              Learn more about how ForensicVision is transforming criminal investigations and how you can be a part of this revolution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2">
                Contact Us
                <ExternalLink className="h-4 w-4" />
              </button>
              <button className="bg-transparent border border-white hover:bg-indigo-800 px-6 py-3 rounded-md font-medium transition-colors">
                View Demo
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <Fingerprint className="h-24 w-24 text-indigo-300 opacity-75" />
          </div>
        </div>
      </section> */}
      
  
    </div>
  );
};

export default About;
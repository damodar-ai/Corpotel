import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- Re-integrated Components ---

// 1. WorkflowStep Component
interface WorkflowStepProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  index: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ title, desc, icon, index }) => (
  <div className="relative flex flex-col items-center text-center group z-10">
    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 z-10 transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:transform group-hover:scale-110 group-hover:shadow-blue-200">
      <div className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
        {index + 1}
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed px-4">{desc}</p>
  </div>
);

// 2. VerifiedVenueCard Component
interface VerifiedVenueCardProps {
  name: string;
  location: string;
  rating: number;
  metrics: {
    capacity: string;
    wifi: string;
    type: string;
  };
  image: string;
  price: string;
  delay: string;
}

const VerifiedVenueCard: React.FC<VerifiedVenueCardProps> = ({ name, location, rating, metrics, image, price, delay }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group animate-slide-up" style={{ animationDelay: delay }}>
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-emerald-700 shadow-sm">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        Verified
      </div>
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
        {metrics.type}
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{name}</h3>
        <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 text-xs font-bold">
          <span>★</span> {rating}
        </div>
      </div>
      <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {location}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-600">
        <div className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center justify-center">
          <span className="font-semibold text-slate-800">{metrics.capacity}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">Capacity</span>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center justify-center">
          <span className="font-semibold text-slate-800">{metrics.wifi}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">Wifi</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <span className="block text-xs text-slate-400">Starting from</span>
          <span className="font-bold text-slate-900">{price}</span>
        </div>
        <button className="text-blue-600 font-bold text-sm hover:underline">View Details</button>
      </div>
    </div>
  </div>
);

// 3. FAQSection Component
const faqData = [
  {
    question: "How does CorpHotel help when we don’t know a city?",
    answer: "Our curated listings highlight business-ready areas near key convention centers and transit hubs. Plus, our verified venue badges ensure you book high-quality spaces without needing local knowledge."
  },
  {
    question: "Are all hotels and venues verified for corporate use?",
    answer: "Yes. Every listing on CorpHotel undergoes a strict verification process to ensure reliable Wi-fi, dedicated workspaces, and corporate-standard amenities."
  },
  {
    question: "Can we customize meeting rooms and services?",
    answer: "Absolutely. Our platform allows you to specify room layouts, A/V equipment needs, and catering preferences directly during the booking request process."
  },
  {
    question: "Is CorpHotel suitable for large corporate events and conferences?",
    answer: "Yes, we specialize in large-scale bookings. You can easily manage group room blocks and multi-day conference schedules all in one place."
  },
  {
    question: "Do we get a single place to manage bookings and coordination?",
    answer: "Yes. Your corporate dashboard provides a centralized view of all active trips, expense reports, and upcoming event schedules for your entire team."
  },
  {
    question: "Is pricing transparent, or are there hidden charges?",
    answer: "We prioritize transparency. detailed cost breakdowns are provided upfront, including taxes and service fees, so your finance team functionality has no surprises."
  }
];

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block animate-slide-up">Support & Clarity</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-slide-up leading-tight">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-lg animate-slide-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Everything you need to know about streamlining your corporate travel with CorpHotel.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 animate-slide-up group ${activeIndex === index ? 'bg-white border-blue-200 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
              style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${activeIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50'}`}>
                    {index + 1}
                  </span>
                  <span className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                    {item.question}
                  </span>
                </div>
                <span className={`flex-shrink-0 ml-4 transform transition-transform duration-300 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 group-hover:border-blue-200 ${activeIndex === index ? 'rotate-180 bg-blue-600 text-white border-transparent' : 'text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 ml-12 text-slate-600 leading-relaxed border-t border-transparent">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-blue-700"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Can't find the answer you're looking for? Our dedicated corporate support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Contact Support
              </a>
              <a href="tel:+15550000" className="bg-blue-700 border border-blue-400 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                +1 (555) 000-0000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: '💼', title: 'Corporate Rates', desc: 'Access exclusive discounts and corporate rates from partner hotels worldwide' },
    { icon: '📊', title: 'Expense Management', desc: 'Track and manage travel expenses with detailed reporting and analytics' },
    { icon: '🌍', title: 'Global Coverage', desc: 'Book hotels across 100+ countries with 24/7 customer support' },
    { icon: '⚡', title: 'Quick Booking', desc: 'Book in seconds with our streamlined, user-friendly interface' },
    { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security for your travel and payment information' },
    { icon: '👥', title: 'Team Management', desc: 'Manage bookings for your entire team with corporate controls' },
  ];

  const stats = [
    { number: '500+', label: 'Partner Hotels', icon: '🏨' },
    { number: '50K+', label: 'Bookings Completed', icon: '✅' },
    { number: '100+', label: 'Countries Covered', icon: '🌏' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      {/* Background - Clean White/Gray, no blobs */}



      <div className="relative z-10">
        {/* Animated Background Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 animate-mesh -z-10 bg-[length:400%_400%]"></div>

        {/* Hero Section */}
        <div className="border-b border-gray-100 overflow-hidden relative">
          {/* Subtle Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row min-h-[600px] items-center">

              {/* Left Content (Text) - Increased width for dominance */}
              <div className="w-full lg:w-[60%] px-6 py-20 md:py-24 flex flex-col justify-center text-left relative z-10 lg:pr-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 w-fit animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Created for Professionals</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 tracking-tight animate-slide-up">
                  The Preferred Choice for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-700">Corporate Travel</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Trusted by businesses to streamline hotel bookings, manage expenses, and host world-class meetings. Experience the standard of corporate hospitality.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => navigate('/hotels')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                      >
                        Find a Hotel
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </button>
                      <button
                        onClick={() => navigate('/bookings')}
                        className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        My Bookings
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                      >
                        Start Booking
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
                      >
                        Partner With Us
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-8 text-slate-500 text-sm font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-full">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Trusted by 500+ Companies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-full">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <span>Premium Hotel Network</span>
                  </div>
                </div>
              </div>

              {/* Right Visual (Image) - Reduced footprint, balanced sizing */}
              <div className="w-full lg:w-[40%] flex justify-center items-center p-6 lg:p-0 lg:pr-6">
                <div className="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                    alt="Corporate Environment"
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle Gradient for readability if we had text, kept minimal here */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                  {/* Minimal Floating Badge - Moved to ensure it doesn't clutter */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Executive Spaces</p>
                      <p className="text-xs text-slate-500">Verified Quality</p>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* How It Works Section */}
        <div className="relative py-20 bg-white overflow-hidden">
          {/* Subtle animated texture background */}
          <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block animate-slide-up">Seamless Workflow</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 animate-slide-up" style={{ animationDelay: '0.1s' }}>How CorpHotel Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10"></div>

              {[
                {
                  title: 'Choose City & Event',
                  desc: 'Select your destination and specify your event type or booking needs.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Compare Venues',
                  desc: 'Browse verified corporate hotels and meeting spaces with transparent pricing.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )
                },
                {
                  title: 'Customize Services',
                  desc: 'Configure room layouts, catering, and equipment requirements in detail.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  )
                },
                {
                  title: 'Book & Manage',
                  desc: 'Secure your booking instantly and manage everything from a single dashboard.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                }
              ].map((step, index) => (
                <WorkflowStep
                  key={index}
                  title={step.title}
                  desc={step.desc}
                  icon={step.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Compare Verified Section */}
        <div className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block animate-slide-up">Trust & Transparency</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 animate-slide-up mb-4" style={{ animationDelay: '0.1s' }}>Compare Verified Corporate Hotels & Venues</h2>
              <p className="text-slate-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Browse and compare business-ready hotels and venues, verified for corporate standards. We ensure consistent quality across all locations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <VerifiedVenueCard
                name="Grand Executive Plaza"
                location="New York, NY"
                rating={4.9}
                metrics={{ capacity: '500+', wifi: '1 Gbps', type: 'Conference' }}
                image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
                price="$250/night"
                delay="0.3s"
              />
              <VerifiedVenueCard
                name="TechCity Suites"
                location="San Francisco, CA"
                rating={4.8}
                metrics={{ capacity: '150+', wifi: '2 Gbps', type: 'Offsite' }}
                image="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                price="$320/night"
                delay="0.4s"
              />
              <VerifiedVenueCard
                name="Harborview Conference"
                location="Boston, MA"
                rating={4.7}
                metrics={{ capacity: '1200+', wifi: '500 Mbps', type: 'Convention' }}
                image="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&q=80"
                price="$180/night"
                delay="0.5s"
              />
            </div>

            <div className="text-center mt-10 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                View All Verified Venues
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="relative py-20 md:py-32 bg-slate-50 border-t border-slate-200 overflow-hidden">
          {/* Subtle background texture for this section */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#1e3a8a 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 animate-slide-up tracking-tight">Why Choose CorpHotel?</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
                We provide the infrastructure for seamless corporate travel and events, designed specifically for the needs of modern enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Corporate-Focused Listings', desc: 'Curated hotels aimed at business travelers with reliable Wi-Fi, workspaces, and premium amenities.', icon: <path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" /> },
                { title: 'Seamless Meeting & Event Booking', desc: 'Book conference rooms and event spaces instantly with real-time availability and configuration options.', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm4 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> }, // Users/Team icon proxy
                { title: 'Enterprise-Grade Reliability', desc: 'Trust in a platform built for stability, security, and consistent high-quality service standards.', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
                { title: 'Simplified Team Coordination', desc: 'Manage group bookings, room blocks, and travel itineraries for large teams effortlessly.', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
                { title: 'Business-Ready Environments', desc: 'Ensure productivity with guaranteed quiet zones, business centers, and executive lounges.', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 hover:border-blue-500/30"
                >
                  <div className="text-emerald-600 mb-6 p-3 bg-emerald-50 rounded-lg inline-block group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}

              {/* Highlight Card */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-8 text-white flex flex-col justify-center items-start shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Join 500+ Companies</h3>
                <p className="text-blue-100 mb-6 relative z-10 text-sm">Experience the difference of a dedicated corporate platform.</p>
                <button onClick={() => navigate('/login')} className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm relative z-10 w-full md:w-auto">
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Partners Section */}
        <div className="py-16 bg-white border-t border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center mb-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted by Industry Leaders</p>
          </div>

          {/* Slider Container */}
          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="flex w-[200%] animate-scroll">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-around items-center w-1/2 gap-12 px-12">
                  {['TechCorp', 'GlobalSystems', 'Innovate', 'FutureScale', 'BlueWave', 'AlphaGroup', 'OmegaTech', 'Starlight'].map((partner, idx) => (
                    <div key={idx} className="text-3xl font-bold text-slate-300 hover:text-slate-500 transition-colors duration-300 select-none whitespace-nowrap">
                      {partner}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group animate-slide-up pt-8 md:pt-0"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-blue-600">
                    {stat.icon}
                  </div>
                  <p className="text-5xl font-bold text-slate-900 mb-2">{stat.number}</p>
                  <p className="text-lg text-slate-500 font-medium tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* CTA Section */}
        <div className="py-20 md:py-32 bg-slate-900 border-t border-slate-200 relative overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-slide-up">
              Ready to Transform Your Business Travel?
            </h3>
            <p className="text-xl text-slate-300 mb-10 animate-slide-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
              Join thousands of companies already using CorpHotel for their hotel bookings. Get access to exclusive rates and seamless management.
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-900 hover:bg-blue-50 px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slide-up shadow-xl"
                style={{ animationDelay: '0.2s' }}
              >
                Start Your Journey →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Enterprise Assurance Section (New) */}
      <div className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Corporate Confidence Guaranteed</h4>
              <p className="text-slate-600 text-sm max-w-xl">
                We adhere to strict enterprise security standards and partner only with verified, business-ready venues. Your team's comfort and safety are our priority.
              </p>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Verified Venues</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

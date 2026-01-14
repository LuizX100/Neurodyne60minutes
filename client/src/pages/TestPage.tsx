import { useState, useEffect } from "react";
import { ThumbsUp, Volume2, Eye, Share2, Clock, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

// Initial Mock data for comments
const initialComments = [
  {
    id: 1,
    name: "Mary Johnson",
    avatar: "/images/comments/ava_wilson.webp",
    text: "I thought it was just poor circulation, but the burning wouldn't stop. My doctor just gave me pills that made me dizzy. After this video, I understood I needed to treat the root cause. I can finally sleep through the night without kicking off the covers!",
    time: "1h",
    likes: 15,
    liked: false
  },
  {
    id: 2,
    name: "John Baker",
    avatar: "/images/comments/sophia_martinez.webp",
    text: "I was terrified of losing my foot, honestly. Diabetics live in constant fear. I started this protocol 2 weeks ago and the tingling has gone down a lot. I'm even driving again without fear.",
    time: "2h",
    likes: 8,
    liked: false
  },
  {
    id: 3,
    name: "Ann Lewis",
    avatar: "/images/comments/isabella_clark.webp",
    text: "No one believed my pain, they thought I was complaining for nothing. This video explained exactly what I feel: like there's sand in my shoes and fire on the soles of my feet. Thank you for giving me hope again! 🙏",
    time: "1h",
    likes: 21,
    liked: false
  },
  {
    id: 4,
    name: "Linda Sanders",
    avatar: "/images/comments/olivia_lewis.webp",
    text: "I had tried everything, herbal teas, creams... nothing worked. What the doctor explains about the 'nerve sheath' makes total sense. I'm following it strictly and I can feel my toes again.",
    time: "1h",
    likes: 500,
    liked: false
  },
  {
    id: 5,
    name: "Olivia Smith",
    avatar: "/images/comments/olivia_smith.webp",
    text: "Has anyone verified if this is actually true? It seems too good to be true, but the comments give me hope. I'm afraid of being scammed.",
    replies: [
      {
        id: 101,
        name: "Health Online Team",
        avatar: "/images/health_online_logo.webp",
        text: "Hi Olivia! We understand your caution. All content presented has been rigorously verified and is based on recent clinical studies. Similar approaches have even been praised by renowned specialists like Dr. Oz, focusing on natural nerve regeneration.",
        time: "5 min",
        likes: 156,
        liked: false
      }
    ],
    time: "1h",
    likes: 13,
    liked: false
  },
  {
    id: 6,
    name: "Charles Miller",
    avatar: "/images/comments/michael_brown.webp",
    text: "The burning in my feet wouldn't let me sleep, it was hell. 3 days doing this and I slept 6 hours straight. Unbelievable how something natural works better than the heavy meds I was taking.",
    time: "30 min",
    likes: 42,
    liked: false
  }
];

export default function TestPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [comments, setComments] = useState(initialComments);
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 28 });
  const [currentDate, setCurrentDate] = useState("");
  const [viewers, setViewers] = useState(668);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [hasSeenOffer, setHasSeenOffer] = useState(false);
  // const [showOffer, setShowOffer] = useState(false); // Disabled for Vturb integration review

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set current date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-GB')); // DD/MM/YYYY format

    // Countdown timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    // Randomize viewer count slightly to make it feel "live"
    const viewerInterval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    // Vturb "Click to Reveal" Logic
    // Listens for hash changes in the URL (e.g., when Vturb button with link #offer-section is clicked)
    const handleHashChange = () => {
      if (window.location.hash === '#offer-section') {
        const offerSection = document.getElementById('offer-section');
        if (offerSection) {
          // Remove the hidden class and add visible class
          offerSection.classList.remove('vturb-hidden-offer');
          offerSection.classList.add('visible');
          
          // Smooth scroll to the section - using native behavior which works best for anchors
          setTimeout(() => {
            offerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check on initial load (in case user refreshes with hash)
    handleHashChange();

    // Intersection Observer to hide sticky footer when offer becomes visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShowStickyFooter(false);
          setHasSeenOffer(true); // Lock it: user has seen the offer
        }
      });
    }, { threshold: 0.01 }); // Trigger as soon as 1% is visible

    const offerSection = document.getElementById('offer-section');
    if (offerSection) observer.observe(offerSection);

    // Expose global function for Vturb or external scripts to trigger reveal manually
    // @ts-ignore
    window.revealOffer = () => {
      window.location.hash = '#offer-section';
    };

    // TEST: Auto-scroll at 10 seconds using Direct Player Monitoring
    const checkVideoTime = () => {
      // @ts-ignore - Access global smartplayer object
      if (typeof window.smartplayer !== 'undefined' && window.smartplayer.instances && window.smartplayer.instances.length > 0) {
        // @ts-ignore
        const player = window.smartplayer.instances[0];
        
        // Check if player has video property and currentTime
        if (player.video && typeof player.video.currentTime === 'number') {
          const currentTime = player.video.currentTime;
          
          // TEST TRIGGER: At 10 seconds (range 10-11s)
          if (currentTime >= 10 && !document.getElementById('offer-section')?.classList.contains('visible')) {
            
            // 1. Reveal the offer section immediately
            const offerSection = document.getElementById('offer-section');
            if (offerSection) {
              // Force layout recalculation before removing class to ensure browser acknowledges the change
              // This is crucial for older mobile devices
              void offerSection.offsetWidth; 
              
              offerSection.classList.remove('vturb-hidden-offer');
              offerSection.classList.add('visible');
              
              // Force another layout check to ensure the element is rendered in the DOM
              requestAnimationFrame(() => {
                // 2. Find the target: The 6-Bottle "Best Value" Package Card
                // We target the entire card container to ensure it's perfectly centered
                const bestValueCard = document.getElementById('best-value-package');
                const targetElement = bestValueCard || offerSection;
                
                // 3. Scroll to the target with a slight delay to ensure rendering is complete
                setTimeout(() => {
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              });
            }
          }

          // TEST STICKY FOOTER TRIGGER: At 5 seconds
          // If offer is unlocked but user is NOT seeing it (e.g. scrolled up), show sticky footer
          if (currentTime >= 5 && !hasSeenOffer) {
             const offerSection = document.getElementById('offer-section');
             
             // Special case for test page: Show footer even if offer is hidden (between 5s and 10s)
             // This allows testing the footer appearance before the auto-scroll kicks in
             if (currentTime >= 5 && currentTime < 10 && !hasSeenOffer) {
                setShowStickyFooter(true);
                return;
             }

             if (offerSection && offerSection.classList.contains('visible')) {
                // Check if offer is currently in viewport (even partially)
                const rect = offerSection.getBoundingClientRect();
                const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                
                // Check if any part of the element is visible in the viewport
                const isVisible = (
                  rect.top < windowHeight &&
                  rect.bottom >= 0
                );
                
                // If NOT visible AND hasn't been seen yet, show sticky footer
                if (!isVisible && !hasSeenOffer) {
                   setShowStickyFooter(true);
                } else {
                   setShowStickyFooter(false);
                   if (isVisible) setHasSeenOffer(true);
                }
             }
          } else if (hasSeenOffer) {
             // Double check to ensure it's hidden if lock is set
             setShowStickyFooter(false);
          }
        }
      }
    };

    // Poll every 500ms to check video time
    const timeCheckInterval = setInterval(checkVideoTime, 500);

    // Load Vturb Script Dynamically - Direct Injection for better reliability
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/99d57fa9-e513-41bb-b706-86ba3a3c429f/players/695e6042d57dbf783267be58/v4/player.js";
    script.async = true;
    script.type = "text/javascript";
    document.head.appendChild(script);

    return () => {
      clearInterval(timer);
      clearInterval(viewerInterval);
      clearInterval(timeCheckInterval);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "@teste@0996") {
      setIsAuthenticated(true);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const scrollToOffer = () => {
    // Manually trigger the hash change logic for internal buttons
    window.location.hash = '#offer-section';
  };

  const handleLike = (id: number) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === id && !comment.liked) {
          return { ...comment, likes: comment.likes + 1, liked: true };
        }
        return comment;
      })
    );
  };

  const handleReply = () => {
    // Using a simple alert for now, but could be replaced with a toast component if available
    // Since we don't have a toast library installed in the base template, we'll create a custom toast or use alert
    // For better UX, let's create a temporary DOM element for the toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300';
    toast.textContent = 'Comments are currently closed for this broadcast.';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#008080] flex items-center justify-center font-mono">
        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black p-1 shadow-xl w-80">
          <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-4">
            <span className="font-bold text-sm">Windows 95 Login</span>
            <button className="bg-[#c0c0c0] text-black w-4 h-4 flex items-center justify-center text-xs border-t border-l border-white border-b border-r border-black">
              x
            </button>
          </div>
          
          <div className="px-4 pb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <path d="M0 0h32v32H0z" fill="none"/>
                  <path d="M3 3h26v26H3z" fill="#fff"/>
                  <path d="M4 4h24v24H4z" fill="#c0c0c0"/>
                  <path d="M8 8h16v4H8z" fill="#000080"/>
                  <path d="M9 14h14v2H9z" fill="#000"/>
                  <path d="M9 18h14v2H9z" fill="#000"/>
                  <path d="M9 22h10v2H9z" fill="#000"/>
                </svg>
              </div>
              <p className="text-sm">Type a password to log on to Windows.</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-1 py-0.5 border-t-2 border-l-2 border-gray-600 border-b-2 border-r-2 border-white bg-white outline-none"
                  autoFocus
                />
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-6 py-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-white active:bg-gray-300 text-sm"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setPassword("")}
                  className="px-6 py-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-white active:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Top Red Alert Bar */}
      <div className="bg-[#CC0000] text-white text-center py-2 text-sm font-bold uppercase tracking-widest animate-pulse">
        watch while it's on air
      </div>

      {/* Header Banner */}
      <header className="bg-[#C41E3A] text-white py-3 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl tracking-wider">HEALTH ONLINE</div>
          <div className="hidden md:block text-xs uppercase tracking-widest opacity-90">
            Daily updates on wellness and health
          </div>
          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Author Info */}
        <div className="mb-6 text-sm text-gray-600 border-b pb-4 flex justify-between items-end">
          <div>
            <div className="font-bold text-black text-lg">By Dr. Daniel Amen</div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3" />
              <span>Updated 30 minutes ago - {currentDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#CC0000] font-bold bg-red-50 px-3 py-1 rounded-full text-xs animate-pulse">
            <div className="w-2 h-2 bg-[#CC0000] rounded-full"></div>
            LIVE BROADCAST
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-black text-center mb-2 leading-tight">
          <span className="text-[#CC0000]">They Lied:</span> This is destroying your nerves right now.
        </h1>
        <p className="text-center text-xl text-gray-600 font-medium mb-8">
          What big pharma doesn't tell you about neuropathy!
        </p>

        {/* Video Section Container */}
        <div className="relative w-full max-w-[400px] mx-auto mb-8">
            {/* Vturb Smart Player */}
              {/* @ts-ignore - Custom Element */}
              <vturb-smartplayer id="vid-695e6042d57dbf783267be58" style={{ display: 'block', margin: '0 auto', width: '100%' }}></vturb-smartplayer>
        </div>

        {/* Social Proof / Trust Bar */}
        <div className="max-w-3xl mx-auto mb-10 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/health_online_logo.webp" alt="Health Online" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-bold text-gray-900">Health Online</div>
              <div className="text-xs text-gray-500">1.8M Subscribers</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <ThumbsUp className="w-4 h-4" /> 397
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <Share2 className="w-4 h-4" /> Share
            </div>
          </div>
        </div>

        {/* Media Logos - Full Color & Official */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png" alt="The New York Times" className="h-8 md:h-10 object-contain" />
          <img src="/images/cbs_logo.webp" alt="CBS" className="h-8 md:h-10 object-contain" />
          <img src="/images/abc_logo.webp" alt="ABC" className="h-8 md:h-10 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CNBC_logo.svg/2560px-CNBC_logo.svg.png" alt="CNBC" className="h-8 md:h-10 object-contain" />
        </div>

        {/* OFFER SECTION - Configured for Vturb Integration */}
        {/* Class 'vturb-hidden-offer' is added here. It will be removed when hash changes to #offer-section */}
        <div id="offer-section" className="mb-16 scroll-mt-4 smartplayer-scroll-event vturb-hidden-offer">
            {/* Stock Counter */}
            <div className="text-center mb-6">
              <p className="text-xl font-bold text-red-600 animate-pulse flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                ⚠️ Only 106 bottles left in stock.
              </p>
            </div>

            <div className="bg-[#349896] text-white text-center py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold uppercase tracking-wide">Bio Nerve - Select Your Package</h2>
              <div className="flex justify-center items-center gap-1 text-yellow-400 text-sm mt-1">
                <span>★★★★★</span>
                <span className="text-white ml-1">Average Customer Rating 4.9</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-8 rounded-b-xl border-x border-b border-gray-200 shadow-xl">
              {/* Leading Choice Block - Moved Above Packages */}
              <div className="max-w-4xl mx-auto mb-12 border-[6px] border-[#349896] rounded-[30px] p-8 bg-white text-center shadow-lg">
                <h2 className="text-3xl md:text-4xl font-black text-black mb-8 leading-tight">
                  The <span className="text-[#349896] border-b-4 border-[#349896]">Leading Choice</span> for<br/>
                  Advanced Nerve Health Support<br/>
                  <span className="text-2xl md:text-3xl font-bold text-gray-700 mt-2 block">Trusted by Experts</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  {/* Dr. Oz */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#349896] mb-4 shadow-md">
                      <img src="/images/experts/dr_oz.webp" alt="Dr. Mehmet Oz" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Mehmet Oz</h3>
                    <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Cardiothoracic Surgeon</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      Natural approaches to nerve health are crucial. Ingredients that support microcirculation and reduce oxidative stress are key to long-term relief.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>

                  {/* Dr. Eric Berg */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#349896] mb-4 shadow-md">
                      <img src="/images/experts/dr_berg.webp" alt="Dr. Eric Berg" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Eric Berg</h3>
                    <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Chiropractor & Health Educator</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      Addressing the root cause of neuropathy often involves fixing nutritional deficiencies. Alpha Lipoic Acid and B-Vitamins are essential for nerve repair.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>

                  {/* Dr. Josh Axe */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#349896] mb-4 shadow-md">
                      <img src="/images/experts/dr_axe.webp" alt="Dr. Josh Axe" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Josh Axe</h3>
                    <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Certified Doctor of Natural Medicine</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      Don't just mask the pain. Feed your nerves the nutrients they need to regenerate. Plant-based antioxidants are powerful tools for nerve recovery.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 text-gray-700 text-lg font-medium border-t border-gray-200 pt-6">
                  We understand that trying something new can be daunting. That's why we provide a <span className="font-bold text-black">60-Day full satisfaction guarantee</span>, allowing you to test it without any risk.
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1 Bottle */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col items-center hover:shadow-xl transition-shadow order-2 md:order-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">1 Bottle</h3>
                  <p className="text-gray-500 text-sm mb-4">30 Day Supply</p>
                  <img src="/images/product_1_bottle.webp" alt="1 Bottle" className="h-40 object-contain mb-4" />
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">$69</span>
                    <span className="text-gray-500 text-sm">/bottle</span>
                  </div>
                  <button onClick={scrollToOffer} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3">
                    ADD TO CART
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img src="/images/visa_mastercard.webp" alt="Cards" className="h-4" />
                    <span>+ Shipping</span>
                  </div>
                </div>

                {/* 6 Bottles - Best Value */}
                <div id="best-value-package" className="bg-white rounded-xl shadow-xl p-6 border-2 border-[#349896] flex flex-col items-center relative transform md:-translate-y-4 order-1 md:order-2">
                  <div className="absolute -top-4 bg-[#F4D03F] text-black font-bold px-4 py-1 rounded-full text-sm shadow-sm uppercase tracking-wide">
                    Best Value
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">6 Bottles</h3>
                  <p className="text-gray-500 text-sm mb-4">180 Day Supply</p>
                  <img src="/images/product_6_bottles.webp" alt="6 Bottles" className="h-40 object-contain mb-4" />
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-gray-500 text-sm">/bottle</span>
                    <p className="text-green-600 font-bold text-sm mt-1">Save $300!</p>
                  </div>
                  <button onClick={scrollToOffer} className="w-full bg-[#F4D03F] hover:bg-[#F1C40F] text-black font-bold py-4 px-4 rounded-lg transition-colors mb-3 shadow-md text-lg animate-pulse">
                    ADD TO CART
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                    <img src="/images/visa_mastercard.webp" alt="Cards" className="h-4" />
                    <span>FREE US SHIPPING</span>
                  </div>
                </div>

                {/* 3 Bottles */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col items-center hover:shadow-xl transition-shadow order-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">3 Bottles</h3>
                  <p className="text-gray-500 text-sm mb-4">90 Day Supply</p>
                  <img src="/images/product_3_bottles.webp" alt="3 Bottles" className="h-40 object-contain mb-4" />
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">$59</span>
                    <span className="text-gray-500 text-sm">/bottle</span>
                    <p className="text-green-600 font-bold text-sm mt-1">Save $120!</p>
                  </div>
                  <button onClick={scrollToOffer} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3">
                    ADD TO CART
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                    <img src="/images/visa_mastercard.webp" alt="Cards" className="h-4" />
                    <span>FREE US SHIPPING</span>
                  </div>
                </div>
              </div>
              
              {/* Guarantee Badge */}
              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left max-w-2xl mx-auto">
                <img src="/images/guarantee_badge.webp" alt="60 Day Guarantee" className="w-32 h-32 object-contain" />
                <div>
                  <h4 className="font-bold text-xl mb-2">100% Satisfaction Guarantee</h4>
                  <p className="text-gray-600 text-sm">
                    Try Bio Nerve today. If you're not completely satisfied with your results in the next 60 days, simply return the bottles for a full refund. No questions asked.
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Comments ({comments.length})</h3>
            <div className="text-sm text-gray-500">Sort by: <span className="font-bold text-gray-900">Top</span></div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="font-bold text-sm text-gray-900">{comment.name}</div>
                    <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500 font-medium">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className={`hover:underline ${comment.liked ? 'text-blue-600 font-bold' : ''}`}
                    >
                      Like
                    </button>
                    <button onClick={handleReply} className="hover:underline">Reply</button>
                    <span>{comment.time}</span>
                    {comment.likes > 0 && (
                      <div className="flex items-center gap-1 bg-white shadow-sm px-1.5 py-0.5 rounded-full border border-gray-100 ml-auto">
                        <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                        <span>{comment.likes}</span>
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.map(reply => (
                    <div key={reply.id} className="flex gap-3 mt-3 ml-2">
                      <img src={reply.avatar} alt={reply.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none border border-blue-100">
                          <div className="font-bold text-sm text-gray-900 flex items-center gap-1">
                            {reply.name}
                            <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500" />
                          </div>
                          <p className="text-gray-800 text-sm mt-1">{reply.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500 font-medium">
                          <button className="hover:underline">Like</button>
                          <button className="hover:underline">Reply</button>
                          <span>{reply.time}</span>
                          {reply.likes > 0 && (
                            <div className="flex items-center gap-1 bg-white shadow-sm px-1.5 py-0.5 rounded-full border border-gray-100 ml-auto">
                              <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                              <span>{reply.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="text-gray-500 text-sm font-medium hover:text-gray-900 hover:underline">
              Load more comments
            </button>
          </div>
        </div>
      </main>

     {/* Sticky Footer Notification - Subtle Version */}
      {showStickyFooter && !hasSeenOffer && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-t border-[#C41E3A] py-3 px-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500 md:hidden">
          <div className="container mx-auto flex items-center justify-between gap-3">
            <div className="text-white flex items-center gap-2">
              <span className="text-lg animate-pulse">🎉</span>
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-wide text-white leading-tight">Offer Unlocked!</span>
                <span className="text-[10px] text-gray-300 leading-tight">Scroll down to save</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const offerSection = document.getElementById('offer-section');
                if (offerSection) {
                  // If offer is hidden (between 5s and 10s test window), reveal it first
                  if (offerSection.classList.contains('vturb-hidden-offer')) {
                    offerSection.classList.remove('vturb-hidden-offer');
                    offerSection.classList.add('visible');
                  }
                  
                  offerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setShowStickyFooter(false);
                  setHasSeenOffer(true);
                }
              }}
              className="bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold py-1.5 px-4 rounded text-xs uppercase tracking-wider whitespace-nowrap transition-colors shadow-sm"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-8 opacity-50">
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            <span className="font-bold text-xl tracking-wider">HEALTH ONLINE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
            <a href="#" className="hover:text-white">Scientific References</a>
          </div>
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
            <br/><br/>
            The content of this site is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <div className="mt-8 text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Health Online. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

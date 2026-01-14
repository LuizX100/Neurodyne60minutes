import { useState, useEffect } from "react";
import { ThumbsUp, Volume2, Eye, Share2, Clock, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trackBrowserPixel } from "@/lib/facebookTracking";
import { trackFacebookEvent } from "@/lib/facebookCAPIClient";

// Initial Mock data for comments
const initialComments = [
  {
    id: 1,
    name: "Mary Johnson",
    avatar: "/images/comments/ava_wilson.webp",
    text: "I thought it was just 'normal aging', but the brain fog wouldn't stop. My doctor just gave me Aricept that made me nauseous. After this video, I understood the radiation cause. I can finally remember my grandkids' names without hesitating!",
    time: "1h",
    likes: 15,
    liked: false
  },
  {
    id: 2,
    name: "John Baker",
    avatar: "/images/comments/sophia_martinez.webp",
    text: "I was terrified of the nursing home, honestly. Seniors live in constant fear of losing their independence. I started this protocol 2 weeks ago and the confusion has gone down a lot. I'm even driving again without getting lost.",
    time: "2h",
    likes: 8,
    liked: false
  },
  {
    id: 3,
    name: "Ann Lewis",
    avatar: "/images/comments/isabella_clark.webp",
    text: "No one believed my memory lapses, they thought I was just not paying attention. This video explained exactly what I feel: like there's cotton inside my head blocking my thoughts. Thank you for giving me my mind back! 🙏",
    time: "1h",
    likes: 21,
    liked: false
  },
  {
    id: 4,
    name: "Linda Sanders",
    avatar: "/images/comments/olivia_lewis.webp",
    text: "I had tried everything, crosswords, ginkgo biloba... nothing worked. What the doctor explains about the 'myelin sheath melting' makes total sense. I'm following it strictly and I can feel my sharp focus returning.",
    time: "1h",
    likes: 500,
    liked: false
  },
  {
    id: 5,
    name: "Olivia Smith",
    avatar: "/images/comments/olivia_smith.webp",
    text: "Has anyone verified if this 'Blue Fruit' extract is actually true? It seems too easy compared to what my neurologist says, but the comments give me hope. I'm afraid of being scammed.",
    replies: [
      {
        id: 101,
        name: "ABC News",
        avatar: "/images/abc_news_profile.jpg",
        text: "Hi Olivia! We understand your caution. The findings regarding the Arctic anthocyanins have been rigorously verified and are based on the recent Palo Alto clinical trials. Similar approaches focusing on myelin repair are now being praised by top neuroscientists as a breakthrough safer than traditional meds.",
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
    text: "The embarrassment of forgetting simple words was hell. 3 days doing this and I had a full conversation without stuttering once. Unbelievable how something natural works better than the heavy meds I was taking.",
    time: "30 min",
    likes: 42,
    liked: false
  }
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  // No longer using tRPC mutation - using simple fetch instead

  const [comments, setComments] = useState(initialComments);
  // const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 28 }); // Removed unused timer
  const [currentDate, setCurrentDate] = useState("");
  const [viewers, setViewers] = useState(642);
  const [updatedMinutes, setUpdatedMinutes] = useState(30);
  const [likesCount, setLikesCount] = useState(397);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  // const [showOffer, setShowOffer] = useState(false); // Disabled for Vturb integration review

  // Purchase Tracking Function - Dual Tracking (Browser + Server)
  const handlePurchase = async (e: React.MouseEvent<HTMLAnchorElement>, packageName: string, price: number, url: string) => {
    e.preventDefault(); // Prevent immediate navigation
    
    const customData = {
      content_name: packageName,
      currency: 'USD',
      value: price,
      num_items: 1,
      content_type: 'product'
    };

    // Dual tracking (Browser Pixel + Server CAPI)
    await trackFacebookEvent('InitiateCheckout', customData);
    console.log(`[Dual Tracking] InitiateCheckout - ${packageName} ($${price})`);

    // Redirect to checkout after tracking completes
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  };

  useEffect(() => {
    // Set current date and time dynamically
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    setCurrentDate(date.toLocaleString('en-US', options)); // e.g., "January 14, 2026, 10:45 AM"

    // Randomize "Updated X minutes ago" (20-29)
    setUpdatedMinutes(Math.floor(Math.random() * 10) + 20);

    // Randomize Likes Count (6500-7500)
    setLikesCount(Math.floor(Math.random() * 1001) + 6500);

    // Countdown timer logic removed as it was unused

    // Oscillate viewer count between 250-500 with natural fluctuation
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        // Create a more natural fluctuation (random walk)
        // 70% chance of small change (-3 to +3)
        // 20% chance of medium change (-7 to +7)
        // 10% chance of larger jump (-12 to +15)
        const rand = Math.random();
        let change;
        
        if (rand < 0.7) {
          change = Math.floor(Math.random() * 7) - 3;
        } else if (rand < 0.9) {
          change = Math.floor(Math.random() * 15) - 7;
        } else {
          change = Math.floor(Math.random() * 28) - 12;
        }
        
        let newValue = prev + change;
        
        // Keep within realistic bounds (600-900)
        if (newValue < 600) newValue = 600 + Math.floor(Math.random() * 20);
        if (newValue > 900) newValue = 900 - Math.floor(Math.random() * 20);
        
        return newValue;
      });
    }, 2500); // Update every 2.5s for better pacing

    // Vturb "Click to Reveal" Logic
    // Listens for hash changes in the URL (e.g., when Vturb button with link #offer-section is clicked)
    const handleHashChange = () => {
      if (window.location.hash === '#offer-section') {
        const offerSection = document.getElementById('offer-section');
        if (offerSection) {
          // Remove the hidden class and add visible class
          offerSection.classList.remove('vturb-hidden-offer');
          offerSection.classList.add('visible');
          
          // Smooth scroll to the section
          setTimeout(() => {
            offerSection.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check on initial load (in case user refreshes with hash)
    handleHashChange();

    // Intersection Observer to hide sticky footer when offer becomes visible AND track ViewContent
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShowStickyFooter(false);
          
          // Track ViewContent event (only once per session) - Dual Tracking
          if (!sessionStorage.getItem('viewContentTracked')) {
            const customData = {
              content_name: 'Neuromax Offer Section',
              content_type: 'product_group'
            };

            // Dual tracking (Browser Pixel + Server CAPI)
            trackFacebookEvent('ViewContent', customData);
            
            sessionStorage.setItem('viewContentTracked', 'true');
            console.log('[Dual Tracking] ViewContent - Offer Section Visible');
          }
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of offer is visible

    const offerSection = document.getElementById('offer-section');
    if (offerSection) observer.observe(offerSection);

    // Load Vturb Script Dynamically
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `var s=document.createElement("script");s.src="https://scripts.converteai.net/99d57fa9-e513-41bb-b706-86ba3a3c429f/players/6967a07a35a1be1be44d58e2/v4/player.js",s.async=!0,document.head.appendChild(s);`;
    document.head.appendChild(script);

    // Auto-scroll to video after 41min29s
    setTimeout(() => {
      const videoElement = document.getElementById('vid-6967a07a35a1be1be44d58e2');
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 2489000);

    // Auto-scroll at 24:35 (1475 seconds) using Direct Player Monitoring
    const checkVideoTime = () => {
      // @ts-ignore - Access global smartplayer object
      if (typeof window.smartplayer !== 'undefined' && window.smartplayer.instances && window.smartplayer.instances.length > 0) {
        // @ts-ignore
        const player = window.smartplayer.instances[0];
        
        // Check if player has video property and currentTime
        if (player.video && typeof player.video.currentTime === 'number') {
          const currentTime = player.video.currentTime;
          
          // TRIGGER: At 25:50 (1550 seconds) - Auto-scroll to 6-bottle package
          if (currentTime >= 1550 && !document.getElementById('offer-section')?.classList.contains('visible')) {
            
            const offerSection = document.getElementById('offer-section');
            if (offerSection) {
              // Force layout recalculation before removing class
              void offerSection.offsetWidth; 
              
              // Reveal the section
              offerSection.classList.remove('vturb-hidden-offer');
              offerSection.classList.add('visible');
              
              // Auto-scroll to 6-bottle package (Best Value)
              setTimeout(() => {
                const sixBottlePackage = document.getElementById('package-6');
                if (sixBottlePackage) {
                  sixBottlePackage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  console.log('[Auto-Scroll] Scrolled to 6-bottle package at 25:50');
                } else {
                  // Fallback: scroll to offer section if package not found
                  offerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  console.log('[Auto-Scroll] Scrolled to offer section (fallback)');
                }
              }, 300);
            }
          }

          // STICKY FOOTER TRIGGER: At 24:19 (1459 seconds)
          // DISABLED per user request (06/01/2026) - Logic preserved for future reference
          /*
          if (currentTime >= 1459) {
             const offerSection = document.getElementById('offer-section');
             if (offerSection && offerSection.classList.contains('visible')) {
                // Check if offer is currently in viewport
                const rect = offerSection.getBoundingClientRect();
                const isVisible = (
                  rect.top >= 0 &&
                  rect.left >= 0 &&
                  rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                  rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                // If NOT fully visible, show sticky footer
                if (!isVisible) {
                   setShowStickyFooter(true);
                } else {
                   setShowStickyFooter(false);
                }
             }
          }
          */
        }
      }
    };

    // Poll every 500ms to check video time
    // Poll every 500ms to check video time
    const timeCheckInterval = setInterval(checkVideoTime, 500);

    // Global Error Suppression (as requested)
    // Prevents random JS errors from interrupting the user experience
    const handleError = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleRejection = (e: PromiseRejectionEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      // Cleanup
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      // clearInterval(timer);
      clearInterval(viewerInterval);
      clearInterval(timeCheckInterval);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">


      {/* Header Banner - ABC News Style */}
      <header className="bg-white text-black py-4 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Hamburger Menu */}
          <button className="p-2 -ml-2 md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* ABC News Logo - Mobile First */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-initial">
            <img src="/images/abc_news_logo_2021.png" alt="ABC News" className="h-10 md:h-12 object-contain" />
          </div>
          
          {/* Notification Bell - Mobile */}
          <button className="p-2 -mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ABC News Style Article Header */}
        <div className="mb-6">
          {/* Headline - ABC News Mobile Style */}
          <h1 className="text-[32px] md:text-5xl font-bold text-black leading-[1.15] tracking-tight mb-6">
            Silicon Valley Insider: "We Didn't Create A Cure. We Found It In The Arctic."
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            Leaked report reveals 193 patients in Palo Alto secretly reversed Alzheimer's symptoms using a concentrated "Arctic Blue Fruit" extract. Big Pharma is fighting to scrub this video from the internet before it goes viral.
          </p>

          {/* Author & Date */}
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="text-gray-500">
              By <span className="text-gray-700">The Associated Press</span>
            </div>
            <div className="text-gray-500">
              {currentDate}
            </div>
          </div>

          {/* Share Icons */}
          <div className="flex gap-4 mt-6 mb-6">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
            </button>
          </div>
        </div>

        {/* Video Section Container */}
        <div className="relative w-full max-w-[400px] mx-auto mb-8">
            {/* Vturb Smart Player */}
            {/* @ts-ignore - Custom Element */}
              <vturb-smartplayer id="vid-6967a07a35a1be1be44d58e2" style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}></vturb-smartplayer>
            
            {/* Viewers Overlay - Floating Top Left */}
            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm text-white py-1.5 px-3 rounded-lg flex items-center gap-2 shadow-lg border border-white/10 pointer-events-none">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-sm font-bold">{viewers} watching now</span>
            </div>
        </div>

        {/* Social Proof / Trust Bar */}
        <div className="max-w-3xl mx-auto mb-10 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/abc_news_profile.jpg" alt="ABC News" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm">ABC News</span>
                <CheckCircle className="w-4 h-4 text-gray-500 fill-gray-200" />
              </div>
              <div className="text-xs text-gray-500">19M Subscribers</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <ThumbsUp className="w-4 h-4" /> {likesCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <Share2 className="w-4 h-4" /> Share
            </div>
          </div>
        </div>

        {/* Media Logos - Full Color & Official */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-6 font-bold">Also featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png" alt="The New York Times" className="h-8 md:h-10 object-contain" />
            <img src="/images/cbs_logo.webp" alt="CBS" className="h-8 md:h-10 object-contain" />
            <img src="/images/cnn_logo.webp" alt="CNN" className="h-8 md:h-10 object-contain" />
            <img src="/images/fox_news_logo.webp" alt="FOX News" className="h-8 md:h-10 object-contain" />
          </div>
        </div>

        {/* OFFER SECTION - Configured for Vturb Integration */}
        {/* Class 'vturb-hidden-offer' is added here. It will be removed when hash changes to #offer-section */}
        <div id="offer-section" className="vturb-hidden-offer smartplayer-scroll-event mb-16 scroll-mt-20">
            {/* Stock Counter */}
            <div className="text-center mb-6">
              <p className="text-xl font-bold text-red-600 animate-pulse flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                ⚠️ Only 106 bottles left in stock.
              </p>
            </div>

            <div className="bg-[#424267] text-white text-center py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold uppercase tracking-wide">NeuroDyne - Select Your Package</h2>
              <div className="flex justify-center items-center gap-1 text-yellow-400 text-sm mt-1">
                <span>★★★★★</span>
                <span className="text-white ml-1">Average Customer Rating 4.9</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-8 rounded-b-xl border-x border-b border-gray-200 shadow-xl">
              <div className="text-center mb-8 animate-pulse">
                <h2 className="text-2xl md:text-3xl font-black text-red-600 uppercase tracking-tight">
                  ⚠️ Limited Time Only: UP TO 50% OFF All Treatment Packages
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Package 1: 6 Bottles (Best Value) - MOVED TO FIRST POSITION FOR MOBILE OPTIMIZATION */}
                <div id="package-6" className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#424267] relative transform md:scale-105 z-10 order-1 md:order-2">
                  <div className="bg-[#424267] text-white text-lg font-bold text-center py-3 uppercase">
                    Best Value!
                  </div>
                  <div className="bg-[#424267]/10 py-2 text-center">
                    <h3 className="font-bold text-[#424267] text-xl">180 Days, 6 Bottles</h3>
                  </div>
                  <div className="p-6 text-center">
                    <img src="/images/6-bottles.png" alt="6 Bottles NeuroDyne" className="h-48 mx-auto mb-4 object-contain" />
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-2xl font-bold text-black">$</span>
                      <span className="text-7xl font-black text-black">49</span>
                      <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                        <span>Per</span>
                        <span>Bottle</span>
                      </div>
                    </div>
                    
                    <div className="text-[#424267] font-bold text-lg mb-4">✓ YOU SAVE $780!</div>
                    
                    <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> BIGGEST DISCOUNT
                      </div>
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> 60 DAYS GUARANTEE
                      </div>
                    </div>

                    <a 
                      href="https://enduroxprime.mycartpanda.com/checkout/204834758:1?afid=MlWM0pqZnR" 
                      onClick={(e) => handlePurchase(e, 'NeuroDyne - 6 Bottles', 294.00, 'https://enduroxprime.mycartpanda.com/checkout/204834758:1?afid=MlWM0pqZnR')}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="smartplayer-scroll-event block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-lg transition-colors uppercase text-xl mb-2"
                    >
                      Buy Now
                    </a>
                    <div className="text-center text-white font-bold text-sm mb-4 bg-[#424267]/80 py-1 rounded">Best Offer!</div>

                    <div className="text-sm text-gray-600 mb-2">
                      Total: <span className="line-through text-red-600 font-bold">$1074</span> <span className="font-bold text-black text-xl">$294</span>
                    </div>
                    <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                    
                    <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                  </div>
                </div>

                {/* Package 2: 3 Bottles - Order 2 on mobile */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#424267] transition-all order-2 md:order-1">
                  <div className="bg-gray-100 py-3 text-center border-b">
                    <h3 className="font-bold text-gray-700 text-lg">Most Popular</h3>
                    <p className="text-gray-500">90 Days, 3 Bottles</p>
                  </div>
                  <div className="p-6 text-center">
                    <img src="/images/3-bottles.png" alt="3 Bottles NeuroDyne" className="h-40 mx-auto mb-4 object-contain" />
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-xl font-bold text-black">$</span>
                      <span className="text-6xl font-black text-black">72</span>
                      <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                        <span>Per</span>
                        <span>Bottle</span>
                      </div>
                    </div>
                    
                    <div className="text-[#424267] font-bold text-lg mb-4">✓ YOU SAVE $360!</div>
                    
                    <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> GREAT VALUE
                      </div>
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> 60 DAYS GUARANTEE
                      </div>
                    </div>

                    <a 
                      href="https://enduroxprime.mycartpanda.com/checkout/204834757:1?afid=MlWM0pqZnR" 
                      onClick={(e) => handlePurchase(e, 'NeuroDyne - 3 Bottles', 217.00, 'https://enduroxprime.mycartpanda.com/checkout/204834757:1?afid=MlWM0pqZnR')}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4"
                    >
                      Buy Now
                    </a>

                    <div className="text-sm text-gray-600 mb-2">
                      Total: <span className="line-through text-red-600 font-bold">$577</span> <span className="font-bold text-black text-xl">$217</span>
                    </div>
                    <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                    
                    <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                  </div>
                </div>

                {/* Package 3: 2 Bottles - Order 3 on mobile */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#424267] transition-all order-3 md:order-3">
                  <div className="bg-gray-100 py-3 text-center border-b">
                    <h3 className="font-bold text-gray-700 text-lg">Try It Out</h3>
                    <p className="text-gray-500">60 Days, 2 Bottles</p>
                  </div>
                  <div className="p-6 text-center">
                    <img src="/images/2-bottles.png" alt="2 Bottles NeuroDyne" className="h-40 mx-auto mb-4 object-contain" />
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-xl font-bold text-black">$</span>
                      <span className="text-6xl font-black text-black">89</span>
                      <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                        <span>Per</span>
                        <span>Bottle</span>
                      </div>
                    </div>
                    
                    <div className="text-[#424267] font-bold text-lg mb-4">✓ YOU SAVE $200!</div>
                    
                    <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> GOOD START
                      </div>
                      <div className="flex items-center gap-2 text-black font-bold">
                        <span className="text-black">✓</span> 60 DAYS GUARANTEE
                      </div>
                    </div>

                    <a 
                      href="https://enduroxprime.mycartpanda.com/checkout/204834756:1?afid=MlWM0pqZnR" 
                      onClick={(e) => handlePurchase(e, 'NeuroDyne - 2 Bottles', 177.00, 'https://enduroxprime.mycartpanda.com/checkout/204834756:1?afid=MlWM0pqZnR')}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4"
                    >
                      Buy Now
                    </a>

                    <div className="text-sm text-gray-600 mb-2">
                      Total: <span className="line-through text-red-600 font-bold">$377</span> <span className="font-bold text-black text-xl">$177</span>
                    </div>
                    <div className="font-bold text-black mb-4">+$9.99 SHIPPING</div>
                    
                    <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                  </div>
                </div>
              </div>

              {/* Leading Choice Block - Moved After Packages */}
              <div className="max-w-4xl mx-auto mt-12 mb-12 border-[6px] border-[#424267] rounded-[30px] p-8 bg-white text-center shadow-lg">
                <h2 className="text-3xl md:text-4xl font-black text-black mb-8 leading-tight">
                  The <span className="text-[#424267] border-b-4 border-[#424267]">Leading Choice</span> for<br/>
                  Cognitive Restoration & Brain Health<br/>
                  <span className="text-2xl md:text-3xl font-bold text-gray-700 mt-2 block">Trusted by Experts</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  {/* Dr. Oz */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#424267] mb-4 shadow-md mx-auto">
                      <img src="/dr-oz-neurodyne.webp" alt="Dr. Mehmet Oz" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Mehmet Oz</h3>
                    <p className="text-sm text-[#424267] font-bold mb-3 uppercase tracking-wide">Cardiothoracic Surgeon</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      We are seeing a paradigm shift in brain health with <span className="font-bold text-black">Neurodyne</span>. It's not about masking memory loss with sedatives anymore; it's about cooling the inflamed neurons. This 'Arctic Blue Fruit' breakthrough is finally giving patients a way to rebuild the Myelin Sheath and shield the brain from modern environmental stress.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>

                  {/* Dr. Eric Berg */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#424267] mb-4 shadow-md mx-auto">
                      <img src="/dr-berg-neurodyne.webp" alt="Dr. Eric Berg" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Eric Berg</h3>
                    <p className="text-sm text-[#424267] font-bold mb-3 uppercase tracking-wide">Chiropractor & Health Educator</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      Most cognitive decline is actually 'Thermal Stress' in disguise. <span className="font-bold text-black">Neurodyne</span> succeeds because it stops frying your brain cells with EMF radiation. Its focus on fat-soluble Arctic Anthocyanins allows it to actually cross the Blood-Brain Barrier and repair the synapses instantly.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>

                  {/* Dr. Josh Axe */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#424267] mb-4 shadow-md mx-auto">
                      <img src="/dr-axe-neurodyne.webp" alt="Dr. Josh Axe" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Dr. Josh Axe</h3>
                    <p className="text-sm text-[#424267] font-bold mb-3 uppercase tracking-wide">Certified Doctor of Natural Medicine</p>
                    <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                      <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                      Your memories aren't gone; the connection is just melted. Conventional meds just zombie the brain, but <span className="font-bold text-black">Neurodyne</span> restores the wiring. It uses high-potency Polyphenols to create a 'Faraday Cage' around your nerve endings and turn the lights back on in your mind.
                      <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                  <p className="text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto">
                    We understand that trying something new can be daunting. That's why we provide a <span className="font-bold">60-Day full satisfaction guarantee</span>, allowing you to test it without any risk.
                  </p>
                </div>
              </div>

              {/* Guarantee Section */}
              <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="shrink-0">
                    <img src="/images/guarantee.webp" alt="100% Money Back Guarantee" className="w-40 md:w-48 drop-shadow-md" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Satisfaction or Your Money Back</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We're so confident you'll love NeuroDyne that we back it with a 60-day money-back guarantee. If you're not completely satisfied with your results, simply return the bottles (even if empty) within 60 days for a full refund.
                    </p>
                    <p className="font-bold text-[#003366]">No questions asked. No hassles. No risk.</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-8 flex justify-center">
                  <img src="/images/certifications.webp" alt="Product Certifications: Natural, GMP, USA Made, GMO Free" className="h-16 md:h-20 object-contain" />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>Is NeuroDyne safe to use?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        Absolutely. NeuroDyne is made with 100% natural ingredients and is manufactured in the USA in an FDA-registered facility that follows Good Manufacturing Practices (GMP). However, as with any supplement, it's a good idea to consult your healthcare provider before starting.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>How quickly will I see results?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        Many NeuroDyne users start noticing improvements in focus and mental clarity within the first 2-3 weeks, but for optimal results, we recommend using it consistently for at least 3 months. Remember, cognitive enhancement is a journey, and consistency is key.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>Do I need to change my lifestyle?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        No drastic lifestyle changes are necessary. NeuroDyne is designed to work with your brain naturally, helping enhance memory and cognitive function. However, combining NeuroDyne with good sleep, hydration, and mental exercises can help you achieve even better results.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>Can I take NeuroDyne with other supplements?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        Yes, NeuroDyne can generally be used alongside other supplements. However, to avoid overlapping ingredients, it's best not to combine it with products that have similar cognitive-enhancing components.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>How much should I order?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        For the best experience and results, we recommend starting with a 3 or 6-month supply. This will ensure you have enough of the formula to experience the full cognitive benefits of NeuroDyne.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>What if it doesn't work for me?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        We believe in the effectiveness of NeuroDyne, but if you're not completely satisfied, we offer a 60-Day money-back guarantee. Simply reach out to our customer service team, and we'll process your refund.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>How long does shipping take?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        Orders are processed within 2-3 days. For customers in the US, delivery typically takes 5-7 days. International orders may take 10-12 days, depending on customs procedures.
                      </div>
                    </details>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span>How do I take NeuroDyne?</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="text-gray-600 p-4 border-t border-gray-200">
                        For optimal results, take 1 mL (approximately 2 droppers full) once daily, ideally holding it under your tongue for a few seconds before swallowing or mixing with water. Consistency is key to experiencing the best cognitive benefits!
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              {/* Scientific References Section - Moved After FAQ */}
              <div className="mt-16 max-w-4xl mx-auto px-4 pb-12">
                <h2 className="text-3xl font-bold text-center mb-4">Scientific References & Clinical Studies</h2>
                <p className="text-center text-gray-600 mb-8">Our formula is backed by extensive research and clinical studies focusing on Neuro-Regeneration and Radio-Protection</p>
                
                <div className="text-sm text-gray-700 space-y-3 font-serif">
                  <p><span className="font-bold">1.</span> National Institutes of Health (NIH): "Impact of Non-Ionizing Radiation (EMF) on Blood-Brain Barrier Permeability and Cognitive Decline." 2024.</p>
                  <p><span className="font-bold">2.</span> Toxicology Reports: "Axonal Thermal Stress: How modern frequencies degrade the Myelin Sheath in seniors." 2023.</p>
                  <p><span className="font-bold">3.</span> Journal of Neurochemistry: "Neuroprotective properties of Arctic Anthocyanins against oxidative stress and neuronal apoptosis."</p>
                  <p><span className="font-bold">4.</span> Nature Neuroscience: "Reversal of Synaptic Loss via Concentrated Polyphenol Intervention in Early-Stage Dementia."</p>
                  <p><span className="font-bold">5.</span> Journal of Alzheimer's Disease: "The Radio-Shielding Effect: How Berry Pigments block environmental toxicity in neural tissue." 2024.</p>
                  <p><span className="font-bold">6.</span> European Journal of Nutrition: "Grape Seed Extract (OPCs) and the Restoration of Microcirculation in the Prefrontal Cortex." 2023.</p>
                  <p><span className="font-bold">7.</span> Neurotherapeutics: "Myelin Regeneration: The role of lipid-soluble antioxidants in restoring memory recall." 2022.</p>
                </div>
              </div>

              {/* DUPLICATE PACKAGES SECTION - After Scientific References */}
              <div className="mt-16 max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-3">
                    Ready to Start Your <span className="text-[#424267]">Nerve Recovery Journey?</span>
                  </h2>
                  <p className="text-lg text-gray-600">Choose your package below and experience the difference</p>
                </div>

                <div className="bg-gray-50 p-4 md:p-8 rounded-xl border border-gray-200 shadow-xl">
                  <div className="text-center mb-8 animate-pulse">
                    <h3 className="text-2xl md:text-3xl font-black text-red-600 uppercase tracking-tight">
                      ⚠️ Limited Time Only: UP TO 50% OFF All Treatment Packages
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Package 1: 6 Bottles (Best Value) */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#424267] relative transform md:scale-105 z-10 order-1 md:order-2">
                      <div className="bg-[#424267] text-white text-lg font-bold text-center py-3 uppercase">
                        Best Value!
                      </div>
                      <div className="bg-[#424267]/10 py-2 text-center">
                        <h4 className="font-bold text-[#424267] text-xl">180 Days, 6 Bottles</h4>
                      </div>
                      <div className="p-6 text-center">
                        <img src="/images/6-bottles.png" alt="6 Bottles NeuroDyne" className="h-48 mx-auto mb-4 object-contain" />
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span className="text-2xl font-bold text-black">$</span>
                          <span className="text-7xl font-black text-black">49</span>
                          <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                            <span>Per</span>
                            <span>Bottle</span>
                          </div>
                        </div>
                        
                        <div className="text-[#424267] font-bold text-lg mb-4">✓ YOU SAVE $780!</div>
                        
                        <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> BIGGEST DISCOUNT
                          </div>
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> 60 DAYS GUARANTEE
                          </div>
                        </div>

                        <a 
                          href="https://enduroxprime.mycartpanda.com/checkout/204834758:1?afid=MlWM0pqZnR" 
                          onClick={(e) => handlePurchase(e, 'NeuroDyne - 6 Bottles', 294.00, 'https://enduroxprime.mycartpanda.com/checkout/204834758:1?afid=MlWM0pqZnR')}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-lg transition-colors uppercase text-xl mb-2"
                        >
                          Buy Now
                        </a>
                        <div className="text-center text-white font-bold text-sm mb-4 bg-[#424267]/80 py-1 rounded">Best Offer!</div>

                        <div className="text-sm text-gray-600 mb-2">
                          Total: <span className="line-through text-red-600 font-bold">$1074</span> <span className="font-bold text-black text-xl">$294</span>
                        </div>
                        <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                        
                        <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                      </div>
                    </div>

                    {/* Package 2: 3 Bottles */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#424267] transition-all order-2 md:order-1">
                      <div className="bg-gray-100 py-3 text-center border-b">
                        <h4 className="font-bold text-gray-700 text-lg">Most Popular</h4>
                        <p className="text-gray-500">90 Days, 3 Bottles</p>
                      </div>
                      <div className="p-6 text-center">
                        <img src="/images/3-bottles.png" alt="3 Bottles NeuroDyne" className="h-40 mx-auto mb-4 object-contain" />
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span className="text-xl font-bold text-black">$</span>
                          <span className="text-6xl font-black text-black">72</span>
                          <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                            <span>Per</span>
                            <span>Bottle</span>
                          </div>
                        </div>
                        
                        <div className="text-[#424267] font-bold text-lg mb-1">✓ YOU SAVE $360!</div>
                        <div className="text-red-600 font-bold text-sm mb-4 animate-pulse">🔥 Limited $10 Extra Discount Applied!</div>
                        
                        <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> GREAT VALUE
                          </div>
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> 60 DAYS GUARANTEE
                          </div>
                        </div>

                        <a 
                          href="https://enduroxprime.mycartpanda.com/checkout/204834757:1?afid=MlWM0pqZnR" 
                          onClick={(e) => handlePurchase(e, 'NeuroDyne - 3 Bottles', 217.00, 'https://enduroxprime.mycartpanda.com/checkout/204834757:1?afid=MlWM0pqZnR')}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4"
                        >
                          Buy Now
                        </a>

                        <div className="text-sm text-gray-600 mb-2">
                          Total: <span className="line-through text-red-600 font-bold">$577</span> <span className="font-bold text-black text-xl">$217</span>
                        </div>
                        <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                        
                        <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                      </div>
                    </div>

                    {/* Package 3: 2 Bottles */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#424267] transition-all order-3 md:order-3">
                      <div className="bg-gray-100 py-3 text-center border-b">
                        <h4 className="font-bold text-gray-700 text-lg">Try It Out</h4>
                        <p className="text-gray-500">60 Days, 2 Bottles</p>
                      </div>
                      <div className="p-6 text-center">
                        <img src="/images/2-bottles.png" alt="2 Bottles NeuroDyne" className="h-40 mx-auto mb-4 object-contain" />
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span className="text-xl font-bold text-black">$</span>
                          <span className="text-6xl font-black text-black">89</span>
                          <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                            <span>Per</span>
                            <span>Bottle</span>
                          </div>
                        </div>
                        
                        <div className="text-[#424267] font-bold text-lg mb-4">✓ YOU SAVE $200!</div>
                        
                        <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> GOOD START
                          </div>
                          <div className="flex items-center gap-2 text-black font-bold">
                            <span className="text-black">✓</span> 60 DAYS GUARANTEE
                          </div>
                        </div>

                        <a 
                          href="https://enduroxprime.mycartpanda.com/checkout/204834756:1?afid=MlWM0pqZnR" 
                          onClick={(e) => handlePurchase(e, 'NeuroDyne - 2 Bottles', 177.00, 'https://enduroxprime.mycartpanda.com/checkout/204834756:1?afid=MlWM0pqZnR')}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block w-full bg-[#424267] hover:bg-[#363659] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4"
                        >
                          Buy Now
                        </a>

                        <div className="text-sm text-gray-600 mb-2">
                          Total: <span className="line-through text-red-600 font-bold">$377</span> <span className="font-bold text-black text-xl">$177</span>
                        </div>
                        <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                        
                        <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
            <span>63 Comments</span>
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Top Comments</span>
          </h2>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${comment.id * 100}ms` }}>
                <img 
                  src={comment.avatar} 
                  alt={comment.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Updated to Real Name format (no @) */}
                    <span className="font-bold text-sm text-[#050505]">{comment.name}</span>
                    <span className="text-xs text-gray-500">{comment.time} ago</span>
                  </div>
                  <p className="text-sm text-[#050505] leading-snug mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <div 
                      className={`flex items-center gap-1 cursor-pointer transition-colors duration-300 ${comment.liked ? 'text-green-600' : 'hover:text-gray-800'}`}
                      onClick={() => handleLike(comment.id)}
                    >
                      <ThumbsUp className={`w-3 h-3 ${comment.liked ? 'fill-current animate-bounce' : ''}`} />
                      <span>{comment.likes}</span>
                    </div>
                    <button 
                      onClick={handleReply}
                      className="hover:text-gray-800 uppercase font-bold text-[10px]"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <img 
                            src={reply.avatar} 
                            alt={reply.name} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-[#050505] flex items-center gap-1">
                                {reply.name}
                                {reply.name === "Health Online Team" && (
                                  <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    OFFICIAL
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-gray-500">{reply.time} ago</span>
                            </div>
                            <p className="text-sm text-[#050505] leading-snug mb-2">{reply.text}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                              <div className="flex items-center gap-1 text-gray-500">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{reply.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm font-medium border-t pt-4 bg-gray-50 py-3 rounded-lg">
            Comments are currently closed for this broadcast.
          </div>
        </div>
      </main>

      {/* Sticky Footer Notification - DISABLED */}
      {/* 
      {showStickyFooter && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t-4 border-[#C41E3A] p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500 md:hidden">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="text-white">
              <div className="font-bold text-sm uppercase tracking-wide text-[#C41E3A]">Special Offer Unlocked</div>
              <div className="text-xs text-gray-300">Don't miss your exclusive discount</div>
            </div>
            <button 
              onClick={() => {
                const offerSection = document.getElementById('offer-section');
                if (offerSection) {
                  offerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setShowStickyFooter(false);
                }
              }}
              className="bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold py-2 px-6 rounded shadow-lg text-sm uppercase tracking-wider whitespace-nowrap transition-colors"
            >
              View Offer
            </button>
          </div>
        </div>
      )}
      */}

      {/* Footer - ABC News Minimalist Style */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/abc_news_logo_2021.png" alt="ABC News" className="h-12 object-contain" />
          </div>

          {/* Legal Links */}
          <div className="text-sm text-gray-600 space-y-3 mb-6">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <a href="#" className="hover:underline">ABC News Network</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Your US State Privacy Rights</a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <a href="#" className="hover:underline">Children's Online Privacy Policy</a>
              <a href="#" className="hover:underline">Interest-Based Ads</a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <a href="#" className="hover:underline">About Nielsen Measurement</a>
              <a href="#" className="hover:underline">Terms of Use</a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <a href="#" className="hover:underline">Do Not Sell or Share My Personal Information</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            <p>© 2026 ABC News</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

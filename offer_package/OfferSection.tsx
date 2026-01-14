import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function OfferSection() {
  return (
    <div id="offer-section" className="vturb-hidden-offer smartplayer-scroll-event mb-16 scroll-mt-20">
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
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#349896] mb-4 shadow-md mx-auto">
                  <img src="/images/experts/dr_oz_bottle.webp" alt="Dr. Mehmet Oz" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-gray-900">Dr. Mehmet Oz</h3>
                <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Cardiothoracic Surgeon</p>
                <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                  <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                  We are seeing a paradigm shift in nerve care with <span className="font-bold text-black">BioNerve</span>. It's not about numbing the pain anymore; it's about flushing out the toxic buildup. This 'Desert Cactus' breakthrough is finally giving patients a way to restore microcirculation and stop the burning at its source.
                  <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                </div>
              </div>

              {/* Dr. Eric Berg */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#349896] mb-4 shadow-md mx-auto">
                  <img src="/images/experts/dr_berg_bottle.webp" alt="Dr. Eric Berg" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-gray-900">Dr. Eric Berg</h3>
                <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Chiropractor & Health Educator</p>
                <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                  <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                  Most neuropathy is actually 'Vitamin Toxicity' in disguise. <span className="font-bold text-black">BioNerve</span> succeeds because it stops fueling the fire with synthetic B-Vitamins. Its focus on bio-active, food-based nutrients allows it to actually penetrate the nerve sheath and repair the mitochondria.
                  <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                </div>
              </div>

              {/* Dr. Josh Axe */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-[#349896] mb-4 shadow-md mx-auto">
                  <img src="/images/experts/dr_axe_bottle.webp" alt="Dr. Josh Axe" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-gray-900">Dr. Josh Axe</h3>
                <p className="text-sm text-[#349896] font-bold mb-3 uppercase tracking-wide">Certified Doctor of Natural Medicine</p>
                <div className="text-gray-600 text-sm italic leading-relaxed relative px-2">
                  <span className="text-4xl text-gray-300 absolute -top-4 -left-2">"</span>
                  Your nerves aren't dead; they are suffocating. Conventional meds just cut the wire, but <span className="font-bold text-black">BioNerve</span> restores the connection. It uses powerful plant-based betalains to detoxify the nerve endings and turn the signal back on instantly.
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

          <div className="text-center mb-8 animate-pulse">
            <h2 className="text-2xl md:text-3xl font-black text-red-600 uppercase tracking-tight">
              ⚠️ Limited Time Only: UP TO 50% OFF All Treatment Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Package 1: 6 Bottles (Best Value) - MOVED TO FIRST POSITION FOR MOBILE OPTIMIZATION */}
            <div id="best-value-package" className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#349896] relative transform md:scale-105 z-10 order-1 md:order-2">
              <div className="bg-[#349896] text-white text-lg font-bold text-center py-3 uppercase">
                Best Value!
              </div>
              <div className="bg-[#349896]/10 py-2 text-center">
                <h3 className="font-bold text-[#349896] text-xl">180 Days, 6 Bottles</h3>
              </div>
              <div className="p-6 text-center">
                <img src="/images/bionerve_bottles_6.webp" alt="6 Bottles" className="h-48 mx-auto mb-4 object-contain" />
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl font-bold text-black">$</span>
                  <span className="text-7xl font-black text-black">49</span>
                  <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                    <span>Per</span>
                    <span>Bottle</span>
                  </div>
                </div>
                
                <div className="text-[#349896] font-bold text-lg mb-4">✓ YOU SAVE $294!</div>
                
                <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> BIGGEST DISCOUNT
                  </div>
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> 60 DAYS GUARANTEE
                  </div>
                </div>

                <a href="https://a3-offers.mycartpanda.com/checkout/194623379:1?afid=Er3HfhKoXX" target="_blank" rel="noopener noreferrer" className="smartplayer-scroll-event block w-full bg-[#349896] hover:bg-[#2a7a78] text-white font-bold py-4 rounded-lg shadow-lg transition-colors uppercase text-xl mb-2">
                  Buy Now
                </a>
                <div className="text-center text-white font-bold text-sm mb-4 bg-[#349896]/80 py-1 rounded">Best Offer!</div>

                <div className="text-sm text-gray-600 mb-2">
                  Total: <span className="line-through text-red-600 font-bold">$588</span> <span className="font-bold text-black text-xl">$294</span>
                </div>
                <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                
                <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
              </div>
            </div>

            {/* Package 2: 3 Bottles - Order 2 on mobile */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#349896] transition-all order-2 md:order-1">
              <div className="bg-gray-100 py-3 text-center border-b">
                <h3 className="font-bold text-gray-700 text-lg">Most Popular</h3>
                <p className="text-gray-500">90 Days, 3 Bottles</p>
              </div>
              <div className="p-6 text-center">
                <img src="/images/bionerve_bottles_3_new.webp" alt="3 Bottles" className="h-40 mx-auto mb-4 object-contain" />
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-xl font-bold text-black">$</span>
                  <span className="text-6xl font-black text-black">69</span>
                  <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                    <span>Per</span>
                    <span>Bottle</span>
                  </div>
                </div>
                
                <div className="text-[#349896] font-bold text-lg mb-1">✓ YOU SAVE $87!</div>
                <div className="text-red-600 font-bold text-sm mb-4 animate-pulse">🔥 Limited $10 Extra Discount Applied!</div>
                
                <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> GREAT VALUE
                  </div>
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> 60 DAYS GUARANTEE
                  </div>
                </div>

                <a href="https://a3-offers.mycartpanda.com/checkout/194623378:1?afid=Er3HfhKoXX" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#349896] hover:bg-[#2a7a78] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4">
                  Buy Now
                </a>

                <div className="text-sm text-gray-600 mb-2">
                  Total: <span className="line-through text-red-600 font-bold">$294</span> <span className="font-bold text-black text-xl">$207</span>
                </div>
                <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                
                <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
              </div>
            </div>

            {/* Package 3: 2 Bottles - Order 3 on mobile */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#349896] transition-all order-3 md:order-3">
              <div className="bg-gray-100 py-3 text-center border-b">
                <h3 className="font-bold text-gray-700 text-lg">Try It Out</h3>
                <p className="text-gray-500">60 Days, 2 Bottles</p>
              </div>
              <div className="p-6 text-center">
                <img src="/images/bionerve_bottles_2.webp" alt="2 Bottles" className="h-40 mx-auto mb-4 object-contain" />
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-xl font-bold text-black">$</span>
                  <span className="text-6xl font-black text-black">79</span>
                  <div className="flex flex-col items-start text-xs font-bold text-gray-500 uppercase leading-tight">
                    <span>Per</span>
                    <span>Bottle</span>
                  </div>
                </div>
                
                <div className="text-[#349896] font-bold text-lg mb-4">✓ YOU SAVE $28!</div>
                
                <div className="space-y-3 text-sm mb-6 border-y border-gray-100 py-4">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> GOOD START
                  </div>
                  <div className="flex items-center gap-2 text-black font-bold">
                    <span className="text-black">✓</span> 60 DAYS GUARANTEE
                  </div>
                </div>

                <a href="https://a3-offers.mycartpanda.com/checkout/194623380:1?afid=Er3HfhKoXX" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#349896] hover:bg-[#2a7a78] text-white font-bold py-4 rounded-lg shadow-md transition-colors uppercase text-xl mb-4">
                  Buy Now
                </a>

                <div className="text-sm text-gray-600 mb-2">
                  Total: <span className="line-through text-red-600 font-bold">$186</span> <span className="font-bold text-black text-xl">$158</span>
                </div>
                <div className="font-bold text-black mb-4">+ FREE SHIPPING</div>
                
                <img src="/images/payment_methods_transparent.webp" alt="Visa Mastercard Amex Discover" className="h-8 mx-auto opacity-90" />
              </div>
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
                  We're so confident you'll love Bio Nerve that we back it with a 60-day money-back guarantee. If you're not completely satisfied with your results, simply return the bottles (even if empty) within 60 days for a full refund.
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
                    <span>How Long Will It Take to See Results?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 p-4 border-t border-gray-200">
                    Many Bio Nerve users start noticing changes within the first few weeks, but for optimal results, we recommend using it consistently for at least 3 months. Remember, supporting nerve health and neuromuscular function is a journey, and consistency is key.
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span>Will I Need to Follow a Strict Diet or Exercise?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 p-4 border-t border-gray-200">
                    No extreme diets or workouts are necessary. Bio Nerve is designed to work with your body, helping you maintain healthy nerve function and relief from pain and tingling. However, combining Bio Nerve with a balanced diet and regular activity can help you achieve even better results.
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span>Can I Use Bio Nerve with Other Supplements?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 p-4 border-t border-gray-200">
                    Yes, Bio Nerve can generally be used alongside other supplements. However, to avoid overlapping ingredients, it's best not to combine it with products that have similar components.
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span>How Many Bottles Should I Order?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 p-4 border-t border-gray-200">
                    For the best experience and results, we recommend starting with a 3 or 6-month supply. This will ensure you have enough product to experience the full benefits of Bio Nerve.
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span>What If Bio Nerve Doesn't Work for Me?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 p-4 border-t border-gray-200">
                    We believe in the effectiveness of Bio Nerve, but if you're not completely satisfied, we offer a 60-Day money-back guarantee. Simply reach out to our customer service team, and we'll process your refund – no questions asked.
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Scientific References Section - Moved After FAQ */}
          <div className="mt-16 max-w-4xl mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Scientific References & Clinical Studies</h2>
            <p className="text-center text-gray-600 mb-8">Our formula is backed by extensive research and clinical studies</p>
            
            <div className="text-sm text-gray-700 space-y-3 font-serif">
              <p><span className="font-bold">1.</span> Therapeutic Goods Administration (Australian Gov): "Risk of peripheral neuropathy with synthetic vitamin B6." Safety Advisory, 2020.</p>
              <p><span className="font-bold">2.</span> Toxicology Reports: "Pyridoxine (Vitamin B6) induced neurotoxicity: Mechanisms and clinical implications." 2021.</p>
              <p><span className="font-bold">3.</span> National Institutes of Health (NIH): "Betalains from Opuntia ficus-indica (Prickly Pear Cactus) and Neuroprotective Activities."</p>
              <p><span className="font-bold">4.</span> Journal of Ethnopharmacology: "Anti-inflammatory Effects of Nopal Cactus in Chronic Pain Management."</p>
              <p><span className="font-bold">5.</span> Journal of Pain Management: "Alpha-Lipoic Acid and Neuropathy Relief: Clinical Evidence." 2022.</p>
              <p><span className="font-bold">6.</span> Journal of Inflammation Research: "Turmeric and Nerve Health: Impact on Inflammation." 2023.</p>
              <p><span className="font-bold">7.</span> Neurotherapeutics: "Acetyl-L-Carnitine for Nerve Regeneration: Clinical Studies." 2022.</p>
            </div>
          </div>
        </div>
    </div>
  );
}

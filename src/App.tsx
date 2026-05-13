import { useEffect, useRef, useState, useLayoutEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Mail, MapPin, Clock, Thermometer } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Utility for merging tailwind classes safely
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RegistrationMarks = () => (
  <>
    <Plus className="absolute top-4 left-4 w-8 h-8 text-dark opacity-40 select-none pointer-events-none" />
    <Plus className="absolute top-4 right-4 w-8 h-8 text-dark opacity-40 select-none pointer-events-none" />
    <Plus className="absolute bottom-4 left-4 w-8 h-8 text-dark opacity-40 select-none pointer-events-none" />
    <Plus className="absolute bottom-4 right-4 w-8 h-8 text-dark opacity-40 select-none pointer-events-none" />
  </>
);

const Section = ({ 
  children, 
  className, 
  id,
  noMarks = false,
  entrance = "vertical"
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string;
  noMarks?: boolean;
  entrance?: "vertical" | "slide-left" | "slide-right";
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    let ctx = gsap.context(() => {
      // Use timeline with scrub for a perfect 1:1 scroll-to-animation relationship
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", 
          end: "bottom top",      
          scrub: 1,               
        }
      });

      let startX = 0;
      let startY = 0;
      let endX = 0;
      let endY = 0;
      
      if (entrance === "vertical") {
        startY = 100;
        endY = -100;
      } else if (entrance === "slide-left") {
        startX = -150;
        endX = 150;
      } else if (entrance === "slide-right") {
        startX = 150;
        endX = -150;
      }

      tl.fromTo(contentRef.current, 
        { opacity: 0, y: startY, x: startX }, 
        { opacity: 1, y: 0, x: 0, duration: 1.5, ease: "none" }
      )
      .to(contentRef.current, { opacity: 1, y: 0, x: 0, duration: 4, ease: "none" })
      .to(contentRef.current, { opacity: 0, y: endY, x: endX, duration: 1.5, ease: "none" });
    }, sectionRef);

    return () => ctx.revert();
  }, [entrance]);

  return (
    <section 
      ref={sectionRef}
      id={id}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden border-b border-dark/10 bg-transparent min-h-[100vh] w-full py-20", 
        className
      )}
    >
      {!noMarks && <RegistrationMarks />}
      <div ref={contentRef} className="w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </section>
  );
};

const MassivePlaceholder = ({ 
  title,
  label, 
  caption, 
  src = "",
  description,
  onHoverChange,
  entrance = "vertical",
  id,
  imageSrc,
  videoSrc
}: { 
  title?: string;
  label?: string; 
  caption: string;
  src?: string;
  description?: { mission: string; origin: string; surplusArchive?: string[] };
  onHoverChange: (hovered: boolean) => void;
  entrance?: "vertical" | "slide-left" | "slide-right";
  id?: string;
  imageSrc?: string;
  videoSrc?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !mediaRef.current || !mediaWrapperRef.current) return;

    let ctx = gsap.context(() => {
      // Reveal animation for the massive title
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=10%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // Reveal animation for the combined media wrapper
      gsap.fromTo(mediaWrapperRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mediaWrapperRef.current,
            start: "top bottom-=10%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Parallax effect on the inner media
      gsap.to(mediaRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -60,
        ease: "none"
      });

      if (textRef.current) {
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top bottom-=10%", // Adjust start to trigger slightly before the bottom
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section id={id} className="bg-transparent" entrance={entrance}> 
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center p-8 md:p-20 py-32 pb-4"
      >
        {title && (
          <div ref={titleRef} className="w-full self-start text-left mb-4">
            <h3 className="font-display font-bold uppercase" style={{ color: '#ef7b05', fontSize: 'clamp(4rem, 8vw, 8rem)', lineHeight: 1 }}>
              {title}
            </h3>
          </div>
        )}
        <div 
          ref={mediaWrapperRef}
          className="relative w-full flex flex-row items-stretch gap-6 group cursor-none"
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
        >
          {/* Left Media Placeholder - Dynamically cropped to match height */}
          <div className="relative flex-1 bg-[#e5e5e5] overflow-hidden">
             {/* Content Wrapper for parallax */}
             <div ref={mediaRef} className="absolute inset-x-0 -top-20 -bottom-20 flex items-center justify-center">
                 <div className="w-full h-full flex items-center justify-center border border-black/10">
                    {imageSrc ? (
                        <img src={imageSrc} alt={title || "Media"} className="absolute inset-0 w-full h-full object-cover object-center" />
                    ) : (
                       <span className="text-[#050505]/40 font-mono text-sm uppercase select-none">IMG</span>
                    )}
                 </div>
             </div>
             <div className="absolute inset-0 border border-dark/5 group-hover:border-brand/40 transition-colors pointer-events-none" />
          </div>

          {/* Right Media Placeholder - 1:1, explicit aspect ratio dictating height */}
          <div className="relative w-1/3 md:w-2/5 aspect-[1/1] bg-[#e5e5e5] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center border border-black/10">
                 {videoSrc ? (
                     <video src={videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-center" />
                 ) : (
                    <span className="text-[#050505]/40 font-mono text-sm uppercase select-none">LOOP 1:1</span>
                 )}
              </div>
              <div className="absolute inset-0 border border-dark/5 group-hover:border-brand/40 transition-colors pointer-events-none" />
          </div>
        </div>
        
        <div className="mt-8 self-start w-full flex flex-col z-10">
          <div className="w-full flex justify-between items-baseline mb-4">
            <span className="font-mono text-xs text-dark tracking-widest uppercase">{caption}</span>
            <span className="font-mono text-[8px] text-dark/40 uppercase">Archived_Data // Sector_4</span>
          </div>
          
          {description && (
            <div ref={textRef} className="w-full max-w-3xl text-left mt-8 mb-[15rem]">
              <div className="mb-8">
                <div className="font-mono text-[12px] md:text-[13px] font-bold uppercase mb-2" style={{ color: '#050505' }}>
                  // THE MISSION
                </div>
                <p className="font-display text-base md:text-lg leading-relaxed" style={{ color: '#050505' }}>
                  {description.mission}
                </p>
              </div>
              
              <div className="mb-8">
                <div className="font-mono text-[12px] md:text-[13px] font-bold uppercase mb-2" style={{ color: '#050505' }}>
                  // THE ORIGIN
                </div>
                <p className="font-display text-base md:text-lg leading-relaxed" style={{ color: '#050505' }}>
                  {description.origin}
                </p>
              </div>

              {description.surplusArchive && description.surplusArchive.length > 0 && (
                <div>
                  <div className="font-mono text-[12px] md:text-[13px] font-bold uppercase mb-2" style={{ color: '#050505' }}>
                    // SURPLUS ARCHIVE
                  </div>
                  <div className="flex flex-col gap-2">
                    {description.surplusArchive.map((item, i) => (
                      <p key={i} className="font-display text-base md:text-lg leading-relaxed" style={{ color: '#050505' }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

const ConditionBlock = ({ 
  caption, 
  description, 
  onHoverChange,
  imageSrc,
  videoSrc
}: { 
  caption: string;
  description: React.ReactNode;
  onHoverChange: (hovered: boolean) => void;
  imageSrc?: string;
  videoSrc?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topBlockRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !topBlockRef.current || !headlineRef.current) return;

    let ctx = gsap.context(() => {
      // Top block fade + slide up
      gsap.fromTo(topBlockRef.current,
        { opacity: 1, y: 100 },
        { 
          opacity: 1, 
          y: 0,
          ease: "none",
          scrollTrigger: {
             trigger: containerRef.current,
             start: "top bottom-=100",
             end: "top center",
             scrub: 1
          }
        }
      );

      // Tearing effect for condition blocks
      gsap.to(headlineRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        yPercent: -60, // Move up faster
        ease: "none"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-[100vh] flex flex-col justify-center px-8 md:px-20 py-32"
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-end z-10 mb-12">
          <h3 ref={headlineRef} className="font-display text-4xl md:text-6xl lg:text-[7vw] font-black text-dark uppercase tracking-tighter leading-none m-0 whitespace-nowrap">
            {caption}
          </h3>
      </div>

      <div ref={topBlockRef} className="w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center justify-between mb-16 max-w-7xl mx-auto">
        <div className="w-full md:w-[45%] relative group cursor-none"
           onMouseEnter={() => onHoverChange(true)}
           onMouseLeave={() => onHoverChange(false)}
        >
           {/* Aspect Ratio Container */}
           <div className="w-full aspect-[4/5] bg-[#e5e5e5] overflow-hidden border border-black/10 relative">
              {videoSrc ? (
                 <video src={videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-center" />
              ) : imageSrc ? (
                 <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-black/10 font-mono text-4xl uppercase select-none font-bold">RE:LAB</span>
                 </div>
              )}
           </div>
        </div>
        <div className="w-full md:w-[50%] flex items-center h-full pt-8 md:pt-0">
           <p className="font-mono text-sm md:text-base leading-[1.6] text-left" style={{ color: '#050505', textWrap: 'pretty' }}>
              {description}
           </p>
        </div>
      </div>
    </div>
  );
};

const EndlessTickerTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!textRef.current) return;
    
    let ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30, // Adjust speed as needed
        ease: "none",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const textString = "/// [ SYS_LOG: 2026 ] VISUAL EVIDENCE ACQUIRED /// DEPLOYING EINSATZPROTOKOLL /// UNAUTHORIZED ACCESS MONITORED ";
  
  return (
    <div ref={containerRef} className="w-full overflow-hidden py-4 bg-transparent flex border-y border-[#ef7b05]">
      <div ref={textRef} className="flex whitespace-nowrap">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="font-mono text-sm tracking-[0.05em] uppercase text-[#050505] mr-8">
            {textString}
          </span>
        ))}
      </div>
    </div>
  );
};

const EinsatzprotokollBlock = ({ onHoverChange, videoSrc }: { onHoverChange: (hovered: boolean) => void, videoSrc?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current || !mediaRef.current) return;
    let ctx = gsap.context(() => {
      // Move the oversized inner content down as user scrolls past it
      gsap.to(mediaRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        yPercent: 20,
        ease: "none"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handlePlayClick = () => {
    if (videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
      } else {
        videoElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[70vh] group overflow-hidden border border-black/10 ${!isPlaying ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => !isPlaying && onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={handlePlayClick}
    >
      <div 
        ref={mediaRef}
        className="absolute w-full h-[130%] -top-[15%] left-0 bg-[#e5e5e5] flex flex-col justify-center pointer-events-none"
      >
        {videoSrc && (
          <video
            ref={videoElementRef}
            src={videoSrc}
            playsInline
            controls={isPlaying}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 pointer-events-auto`}
          />
        )}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#050505]/20 transition-opacity duration-300">
             <div className="flex flex-col items-center">
                <div className="w-20 h-20 border border-[#ffffff] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-[#ef7b05] bg-[#050505]/50 backdrop-blur-sm">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-[#ef7b05] border-b-[10px] border-b-transparent ml-1" />
                </div>
                <span className="mt-8 font-display text-2xl font-bold uppercase tracking-widest text-[#ffffff] transition-colors group-hover:text-[#ef7b05]" style={{textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>
                  PLAY EINSATZPROTOKOLL
                </span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DiagnosticIntroBlock = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    let ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=10%",
            end: "center center",
            scrub: true
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-transparent pt-24">
      <div className="w-full max-w-7xl mx-auto px-8 md:px-20">
        <div ref={textRef} className="w-full md:max-w-[60%] flex flex-col items-start text-left mb-24">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tighter uppercase mb-6" style={{ color: '#ef7b05' }}>
            URBAN BASELINE // SYSTEM DIAGNOSTIC
          </h2>
          <p className="font-mono text-sm md:text-base" style={{ color: '#050505', lineHeight: 1.6, textWrap: 'pretty' }}>
            Die urbane Infrastruktur Wiens kollabiert unter ihrer eigenen Last. Bevor taktische Hardware zum Einsatz kommt, erfordert das RE:LAB-Protokoll eine lückenlose Analyse der Ausgangslage. Das System verzeichnet drei kritische Versagenszustände, die den öffentlichen Raum systematisch neutralisieren.
          </p>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#050505]" />
    </section>
  );
};

const ChapterDividerBlock = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const briefingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !textBlockRef.current || !briefingRef.current) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(textBlockRef.current,
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1
          }
        }
      );

      gsap.fromTo(briefingRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: briefingRef.current,
            start: "top bottom-=10%",
            end: "center center",
            scrub: true
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-8 bg-transparent"
    >
      <div ref={textBlockRef} className="flex flex-col items-center mt-12 md:mt-24">
        <div className="font-mono text-sm md:text-base tracking-[0.2em] font-bold mb-6 uppercase" style={{ color: '#ef7b05' }}>
          [ SYSTEM OVERRIDE: ACCEPTED ]
        </div>
        <h2 className="font-display font-bold text-[8vw] md:text-7xl lg:text-9xl tracking-tighter leading-none m-0" style={{ color: '#ef7b05' }}>
          TACTICAL ARSENAL
        </h2>
        <div className="font-mono text-xs md:text-sm tracking-widest mt-8 uppercase" style={{ color: '#050505' }}>
          INITIATING HARDWARE DEPLOYMENT...
        </div>
      </div>

      <div 
        ref={briefingRef}
        className="w-full max-w-2xl mx-auto mt-16 mb-24 text-left"
      >
        <p 
          className="font-mono text-sm md:text-base" 
          style={{ 
            color: '#050505', 
            lineHeight: 1.6, 
            textWrap: 'pretty' 
          }}
        >
          Als direkte Antwort auf den infrastrukturellen Kollaps aktiviert RE:LAB die verworfenen Ressourcen der Stadt. Der unregulierte Sperrmüll Wiens dient uns nicht als Abfall, sondern als rohe Baumaterie. Wir rekonfigurieren diese Materialien zu taktischer Hardware – funktionale Werkzeuge, konzipiert für die physische Rückeroberung des öffentlichen Raums. Das Problem wird zur Waffe.
        </p>
      </div>
    </section>
  );
};

const FieldEvidenceBlock = ({ img1Src, img2Src, img3Src, img4Src, img5Src }: { img1Src?: string, img2Src?: string, img3Src?: string, img4Src?: string, img5Src?: string }) => {
  const containerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !galleryRef.current) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(galleryRef.current, 
        { opacity: 1, y: 100 }, 
        { 
          opacity: 1, 
          y: 0, 
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom-=10%",
            end: "center center",
            scrub: 1
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section className="bg-transparent py-40 relative block">
      <div ref={containerRef} className="w-full max-w-7xl mx-auto px-8 relative h-full">
        <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-8 max-w-4xl leading-none" style={{ color: '#ef7b05' }}>
          FIELD EVIDENCE // URBAN DEPLOYMENT
        </h2>

        <div className="w-full max-w-xl text-left mb-24">
          <p className="font-mono text-sm md:text-base" style={{ color: '#050505', lineHeight: 1.6, textWrap: 'pretty' }}>
            Um sicherzustellen, dass die Stadtbevölkerung diese Intervention auch wirklich mitbekommt, haben wir das Labor auf die Straße verlagert. Durch gezieltes Guerilla-Marketing vom Aufhängen großflächiger Plakate über die Verteilung unseres Magazins bis hin zur direkten Platzierung der Geräte im öffentlichen Raum, machen wir das Projekt für jeden unübersehbar.
          </p>
        </div>

        <div ref={galleryRef} className="flex flex-col items-center gap-12 w-full max-w-7xl mx-auto">
          {/* Top Row: 2 items, 4:3 */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative aspect-[4/3] bg-[#e5e5e5] border border-[#ef7b05] overflow-hidden flex flex-col justify-end p-4">
               {img1Src && <img src={img1Src} alt="Evidence 1" className="absolute inset-0 w-full h-full object-cover object-center" />}
            </div>
            <div className="relative aspect-[4/3] bg-[#e5e5e5] border border-[#ef7b05] overflow-hidden flex flex-col justify-end p-4">
               {img2Src && <img src={img2Src} alt="Evidence 2" className="absolute inset-0 w-full h-full object-cover object-center" />}
            </div>
          </div>
          
          {/* Middle Row: 2 items, 3:4 */}
          <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="relative aspect-[3/4] bg-[#e5e5e5] border border-[#ef7b05] overflow-hidden flex flex-col justify-end p-4">
               {img3Src && <img src={img3Src} alt="Evidence 3" className="absolute inset-0 w-full h-full object-cover object-center" />}
            </div>
            <div className="relative aspect-[3/4] bg-[#e5e5e5] border border-[#ef7b05] overflow-hidden flex flex-col justify-end p-4">
               {img4Src && <img src={img4Src} alt="Evidence 4" className="absolute inset-0 w-full h-full object-cover object-center" />}
            </div>
          </div>

          {/* Bottom Row: 1 item, 4:3, max-w */}
          <div className="w-full relative aspect-[4/3] bg-[#e5e5e5] border border-[#ef7b05] overflow-hidden flex flex-col justify-end p-4 lg:max-w-4xl">
             {img5Src && <img src={img5Src} alt="Evidence 5" className="absolute inset-0 w-full h-full object-cover object-center" />}
          </div>
        </div>
      </div>
    </Section>
  );
};

const SmartHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] bg-[#ffffff] flex flex-col items-center justify-center pt-4 pb-2 px-8 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ borderBottom: '1px solid #050505' }}
    >
      {/* Top Row (Logo & Brand Title) */}
      <div className="flex flex-row items-center justify-center gap-6" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
        {/* Logo Placeholder */}
<div className="flex items-center justify-center shrink-0" style={{ width: '0.8em', height: '0.8em' }}>
  <img src="/Media/logo relab cogwheel2.png" alt="RE:LAB Logo" className="w-full h-full object-contain" />
</div>

        {/* Brand Text */}
        <div className="font-display font-bold uppercase shrink-0" style={{ color: '#050505', lineHeight: 0.8 }}>
          RE:LAB.
        </div>
      </div>

      {/* Bottom Row (Centered Navigation Links) */}
      <nav className="flex flex-row items-center justify-center gap-[3vw] mt-2">
        <a href="#vienna-worker" className="font-mono uppercase text-[#050505] text-sm no-underline hover:text-[#ef7b05] transition-colors duration-200">VIENNA WORKER</a>
        <a href="#ring-rider" className="font-mono uppercase text-[#050505] text-sm no-underline hover:text-[#ef7b05] transition-colors duration-200">RING RIDER</a>
        <a href="#focus-visor" className="font-mono uppercase text-[#050505] text-sm no-underline hover:text-[#ef7b05] transition-colors duration-200">FOCUS VISOR</a>
        <a href="#shade-node" className="font-mono uppercase text-[#050505] text-sm no-underline hover:text-[#ef7b05] transition-colors duration-200">SHADE NODE</a>
      </nav>
    </header>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const loadingCounterRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [isHoveringPlaceholder, setIsHoveringPlaceholder] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    // Stop body scrolling initially
    document.body.style.overflow = "hidden";

    // Cinematic scrolling experience
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.stop(); // Stop Lenis until loading is done
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Loading Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        lenis.start();
        ScrollTrigger.refresh();
      }
    });

    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (loadingCounterRef.current) {
          loadingCounterRef.current.innerText = Math.round(counter.val) + "%";
        }
      }
    })
    .to([loadingCounterRef.current, loadingTextRef.current], {
      color: "#ef7b05",
      duration: 0.1
    })
    .to(loadingRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut",
      delay: 0.4
    })
    .fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={cn("relative min-h-screen selection:bg-brand selection:text-white bg-transparent", isHoveringPlaceholder && "cursor-none")}>
      
      {/* Loading Screen */}
      <div 
        ref={loadingRef}
        className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-8 select-none"
      >
        <div 
          ref={loadingCounterRef} 
          className="font-display font-bold text-[15vw] leading-none tracking-tighter text-[#ffffff]"
        >
          0%
        </div>
        <div 
          ref={loadingTextRef}
          className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-[#ffffff]"
        >
          [ SYSTEM INITIALIZING ]
        </div>
      </div>

      {/* Custom Crosshair Cursor */}
      <AnimatePresence>
        {isHoveringPlaceholder && (
          <motion.div 
            key="cursor"
            className="fixed pointer-events-none z-[5000] text-brand flex items-center justify-center mix-blend-difference"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              x: mousePos.x - 40, 
              y: mousePos.y - 40,
              opacity: 1,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.5 }}
          >
            <Plus className="w-20 h-20" />
          </motion.div>
        )}
      </AnimatePresence>

      <SmartHeader />

      <main className="relative z-10 w-full" ref={containerRef}>
        
        {/* Hero Section */}
        <Section className="bg-transparent pt-[14rem]">
          <div className="max-w-7xl w-full px-8 flex flex-col items-start">
            <div className="hero-text-block opacity-0 w-full" ref={heroRef}>
              <h1 className="font-display font-bold text-dark uppercase mb-4 tracking-tighter block text-left" style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', lineHeight: 0.9 }}>
                THE STREET HAS <br /> FAILED.
              </h1>
              <h2 className="font-display font-bold text-brand uppercase tracking-tighter block text-right" style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', lineHeight: 0.9 }}>
                THE LAB <br /> TAKES OVER.
              </h2>
            </div>
            
            <div className="mt-[20vh] flex justify-between w-full font-mono">
              <span className="text-xs tracking-tighter uppercase opacity-60">
                ACCESSING RE:LAB // ARCHIVE_2026
              </span>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase text-dark">Lvl 07 restricted</span>
                 <span className="text-[10px] uppercase text-brand animate-pulse">Live link active</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Hero to Video Ticker */}
        <EndlessTickerTransition />

        {/* Video Deployment Scene */}
        <Section className="bg-transparent">
           <div className="w-full h-full py-20 px-8 flex flex-col items-center justify-center">
              <EinsatzprotokollBlock onHoverChange={setIsHoveringPlaceholder} videoSrc="" />
           </div>
        </Section>

        {/* Diagnostic Intro */}
        <DiagnosticIntroBlock />

        {/* System Failures Sequential Scroll */}
        <section className="w-full bg-transparent">
          <ConditionBlock 
            caption="[COND. 01: WASTE]" 
            description={<>Urbane Bio-Materie und synthetischer Abfall überschreiten in den dicht besiedelten Bezirken Wiens kritische Schwellenwerte. Standardisierte Entsorgungsprotokolle versagen bei der Eindämmung des Überlaufs. Sekundäre Eindämmungssektoren sind kompromittiert, was zu einer unregulierten Oberflächenverschmutzung führt. Die&nbsp;Straße erstickt an ihren eigenen Nebenprodukten.</>}
            onHoverChange={setIsHoveringPlaceholder}
            imageSrc="/Media/Wien Sperrmuell.jpeg" 
            videoSrc=""
          />
          <ConditionBlock 
            caption="[COND. 02: SEALING]" 
            description={<>Die&nbsp;Asphalt- und Betonsättigung hat in kritischen urbanen Zonen ein toxisches Level erreicht. Natürliche Drainage und thermische Regulation sind nicht mehr existent. Die&nbsp;Oberflächentemperatur Wiens eskaliert in den Sommermonaten und generiert isolierte Hitzeinseln. Die&nbsp;organische Schicht wurde durch brutale Bodenversiegelung vollständig erstickt.</>}
            onHoverChange={setIsHoveringPlaceholder}
            imageSrc="Media/Wien Hitze.jpeg" 
            videoSrc=""
          />
          <ConditionBlock 
            caption="[COND. 03: EXCLUSION]" 
            description={<>Feindliche architektonische Modifikationen verdrängen systematisch unerwünschte Demografien. Öffentliche Ruhezonen in der Stadt existieren fast ausschließlich als konsumgebundene Sektoren. Die&nbsp;Infrastruktur verteidigt sich aktiv gegen ihre eigenen Bewohner und drängt sie an die äußeren Ränder des Systems. Der&nbsp;öffentliche Raum ist nicht mehr öffentlich.</>}
            onHoverChange={setIsHoveringPlaceholder}
            imageSrc="Media/Exclusion.jpg" 
            videoSrc=""
          />
        </section>

        {/* Chapter Divider */}
        <ChapterDividerBlock />

        {/* Hardware Deployment Sequential Scroll */}
        <MassivePlaceholder 
          id="vienna-worker"
          title="VIENNA WORKER"
          label="VIENNA"
          caption="[RE:L_ID_01: VIENNA WORKER]" 
          description={{
            mission: "Mobile Intervention against the ongoing privatization and forced consumption of public seating.",
            origin: "Reclaimed 04.08.2026 / Bulky waste scenario, 1st District Vienna.",
            surplusArchive: [
              "01 Heritage Chassis: Original Thonet bentwood chair, mass-bent beech wood. Material shows strong vintage patina and worn paint. Mod: Integration of mounting points.",
              "02 Tactical Load Harness: Repurposed salvaged mil-spec nylon. Mod: Isolated carrying system.",
              "03 Adaption Hardware: Salvaged clamps and buckles. Mod: Bolt-connection to wooden frame."
            ]
          }}
          onHoverChange={setIsHoveringPlaceholder}
          entrance="slide-left"
          imageSrc="/Media/Vienna Worker.jpg"
          videoSrc=""
        />
        <MassivePlaceholder 
          id="ring-rider"
          title="RING RIDER"
          label="RIDER"
          caption="[RE:L_ID_02: RING RIDER]" 
          description={{
            mission: "Mechanical resistance against the rigid, motorized dominance of urban asphalt.",
            origin: "Reclaimed 22.09.2025 / MA48-Altstoffdepot & industrial sites, 11th District Vienna.",
            surplusArchive: [
              "01 Kinetic Units: Discarded circular sweeping brushes. Material robust nylon bristles. Mod: Retooled for direct ground contact.",
              "02 Main Chassis: Salvaged steel construction parts, heavy industrial steel with yellow paint residue. Mod: Cut and welded into a rigid chassis.",
              "03 Transmission: Patinated gears and chains. Material hard carbon steel. Mod: Direct integration for mechanical power transfer."
            ]
          }}
          onHoverChange={setIsHoveringPlaceholder}
          entrance="slide-right"
          imageSrc="/Media/ring rider.jpg"
          videoSrc="/Media/Ringrider.mp4"
        />
        <MassivePlaceholder 
          id="focus-visor"
          title="FOCUS VISOR"
          label="VISOR"
          caption="[RE:L_ID_03: FOCUS VISOR]" 
          description={{
            mission: "Complete sensory isolation against acoustic and visual overload during urban rush-hour.",
            origin: "Reclaimed 12.08.2026 / Bulky waste scenario, 7th District Vienna.",
            surplusArchive: [
              "01 Base Chassis: Vintage bicycle helmet, scratched ABS. Mod: Drilled mounting points.",
              "02 visual rejection Grid: Repurposed weathered leather briefcase. Mod: Cut as tunnel-vision blinders.",
              "03 acoustic Mute Modules: Salvaged aviation headphones. Mod: Integrated for physical dB attenuation."
            ]
          }}
          onHoverChange={setIsHoveringPlaceholder}
          entrance="slide-left"
          imageSrc="/Media/Focus visor.jpg"
          videoSrc=""
        />
        <MassivePlaceholder 
          id="shade-node"
          title="SHADE NODE"
          label="SHADE"
          caption="[RE:L_ID_04: SHADE NODE]" 
          description={{
            mission: "Autonomous climate intervention against extreme heat radiation on completely sealed urban squares.",
            origin: "Reclaimed / Construction surplus & abandoned areas, 15th District Vienna.",
            surplusArchive: [
              "01 Chassis & Ballast: Discarded shopping cart, concrete pavers. Mod: Basket re-engineered for 150kg counterweight.",
              "02 Vertical Support: Salved infrastructure pipe, heavily patinated steel. Mod: Reinforced side-fixation.",
              "03 Climate Membrane: Salvaged bleached balcony awning. Mod: Recalibrated mechanics for free-standing deployment."
            ]
          }}
          onHoverChange={setIsHoveringPlaceholder}
          entrance="slide-right"
          imageSrc="/Media/shade node scene.jpg"
          videoSrc="/Media/Shade node.mp4"
        />

        {/* Field Evidence Sequential Layout */}
        <FieldEvidenceBlock img1Src="/Media/showbox1.png" img2Src="/Media/showbox2.jpg" img3Src="/Media/showbox3.jpg" img4Src="/Media/Magazin1.jpg" img5Src="/Media/magazine2.jpg" />

        {/* Footer Scene */}
        <footer className="snap-section flex flex-col justify-end bg-transparent" id="footer">
          {/* Manifesto Block */}
          <div className="flex-1 bg-white flex items-center justify-center overflow-hidden border-t border-dark">
            <h3 className="font-display font-bold text-[12vw] leading-[0.85] text-dark uppercase tracking-tighter w-full text-center px-4 py-20">
              WHAT THE CITY DISCARDS, THE LAB WEAPONIZES. RE:LAB ARCHIVE 2026.
            </h3>
          </div>

          {/* Terminal Block */}
          <div className="bg-dark text-white p-8 md:p-12 border-t border-white/10">
            <div className="flex justify-between items-baseline mb-8">
              <h4 className="font-display font-bold text-4xl md:text-8xl tracking-tighter" style={{ color: '#ef7b05' }}>RE:LAB</h4>
              <h4 className="font-display font-bold text-4xl md:text-8xl tracking-tighter text-white" style={{ color: '#ffffff' }}>ARCHIVE</h4>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-6" />

            {/* Technical Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-mono tracking-wider text-white/50">
              <div className="flex flex-col gap-2">
                <span className="text-white/20 uppercase font-bold">JOIN THE ARCHIVE (EMAIL)</span>
                <div className="flex items-center gap-2 group cursor-pointer text-white hover:text-brand transition-colors">
                  <Mail className="w-3 h-3" />
                  <span className="uppercase font-medium">CONTACT@RELAB.NET</span>
                  <span className="animate-[blink_1s_infinite] h-3 w-[2px] bg-brand inline-block" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white/20 uppercase font-bold">SITE COORDINATES</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="uppercase">VIENNA, AT // 48.2082° N, 16.3738° E</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white/20 uppercase font-bold">SYSTEM TIME</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span className="uppercase">12:20 PM CEST</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white/20 uppercase font-bold">ENV_TEMP</span>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-3 h-3" />
                  <span className="uppercase">18°C / CLOUD_COVER 4%</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </main>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}


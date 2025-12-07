// DemoSection.tsx
import { motion } from "framer-motion";
import { useState, useRef } from "react";

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleGetStarted = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="demos"
      className="bg-background py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-3 sm:mb-4"
          >
            <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-medium">
              Experience
            </p>
            <div className="mx-auto mt-2 w-8 h-px bg-border" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-foreground leading-tight font-extralight px-4"
          >
            Simple Steps To Avoid
            <br />
            <span className="relative inline-block mt-2 sm:mt-4">
              <span className="italic font-normal">Complexity</span>
              <span className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-px bg-foreground origin-left transform scale-x-0 hover:scale-x-100 transition-transform duration-700"></span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-light px-4"
          >
            Travel with no worries, pay up your stuffs. Experience hassle-free
            international payments with instant conversion.
          </motion.p>
        </motion.div>

        {/* Video Demonstration */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full aspect-video bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden group hover:border-border/70 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

            {/* Video Element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-0"
              onEnded={() => setIsPlaying(false)}
              playsInline
              preload="metadata"
            >
              <source src="/1207.mov" type="video/quicktime" />
              <source src="/1207.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Button Overlay - Only show when video is not playing */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center p-4 bg-black/20 z-20 cursor-pointer"
                onClick={handlePlayVideo}
              >
                <div className="text-center space-y-6 sm:space-y-10">
                  {/* Play Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-primary/5 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary/10 transition-all duration-500 group-hover:scale-105 border border-border/40 mx-auto"
                  >
                    <span className="absolute inset-0 rounded-full border border-border/40 animate-ping" />
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-foreground ml-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="px-4"
                  >
                    <p className="text-foreground text-lg sm:text-xl lg:text-2xl font-light tracking-wide">
                      Watch Demo Video
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-2 sm:mt-3 tracking-wide">
                      See how it works in action
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Video Controls Overlay - Show when playing */}
            {isPlaying && (
              <div className="absolute inset-0 z-30" onClick={handlePlayVideo}>
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src="/1207.mov"
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                />
              </div>
            )}

            {/* Decorative geometric elements - hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              whileInView={{ opacity: 0.3, rotate: -12, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden sm:block absolute top-6 sm:top-10 left-6 sm:left-10 w-20 sm:w-28 h-20 sm:h-28 border border-border rounded-xl -rotate-12 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden sm:block absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-24 sm:w-36 h-24 sm:h-36 border border-border rounded-full opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none z-10"
            />
            <motion.div
              initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.3, rotate: 45, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden sm:block absolute top-1/3 right-8 sm:right-14 w-16 sm:w-20 h-16 sm:h-20 border border-border rotate-45 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none z-10"
            />
          </motion.div>

          {/* Video Info Stats */}
          <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              { value: "2:30", label: "Duration" },
              { value: "4 Steps", label: "Easy Process" },
              { value: "< 1ms", label: "Transaction Speed" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative text-center group py-4 sm:py-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-foreground mb-3 sm:mb-4 tracking-wider"
                >
                  {stat.value}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-muted-foreground text-xs uppercase tracking-widest font-medium"
                >
                  {stat.label}
                </motion.p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-2/3 h-px bg-border transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center px-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed font-light"
          >
            Ready to revolutionize your payment experience?
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="group relative px-10 sm:px-12 lg:px-14 py-4 sm:py-5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-500 overflow-hidden active:scale-95 w-full sm:w-auto"
          >
            <span className="relative z-10 text-base sm:text-lg tracking-wide font-medium">
              Get Started Now
            </span>
            <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 bg-primary/20" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;

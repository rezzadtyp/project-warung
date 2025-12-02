const DemoSection = () => {
  return (
    <section id="demos" className="min-h-screen bg-background py-28 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-32 space-y-6">
          <div className="inline-block mb-4">
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
              Experience
            </p>
            <div className="mx-auto mt-2 w-8 h-px bg-border" />
          </div>

          <h2 className="text-6xl md:text-8xl font-serif text-foreground leading-tight font-extralight">
            Simple Steps To Avoid
            <br />
            <span className="relative inline-block mt-4">
              <span className="italic font-normal">Complexity</span>
              <span className="absolute -bottom-3 left-0 w-full h-px bg-foreground origin-left transform scale-x-0 hover:scale-x-100 transition-transform duration-700"></span>
            </span>
          </h2>

          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
            Travel with no worries, pay up your stuffs. Experience hassle-free
            international payments with instant conversion.
          </p>
        </div>

        {/* Video Demonstration */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="relative w-full aspect-video bg-card rounded-3xl border border-border overflow-hidden group hover:border-border/70 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-10">
                {/* Play Button */}
                <button className="relative w-28 h-28 bg-primary/5 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary/10 transition-all duration-500 group-hover:scale-105 border border-border/40">
                  <span className="absolute inset-0 rounded-full border border-border/40 animate-ping" />
                  <svg
                    className="w-12 h-12 text-foreground ml-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                <div>
                  <p className="text-foreground text-2xl font-light tracking-wide">
                    Watch Demo Video
                  </p>
                  <p className="text-muted-foreground text-sm mt-3 tracking-wide">
                    See how it works in action
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative geometric elements */}
            <div className="absolute top-10 left-10 w-28 h-28 border border-border rounded-xl -rotate-12 opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute bottom-10 right-10 w-36 h-36 border border-border rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute top-1/3 right-14 w-20 h-20 border border-border rotate-45 opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>

          {/* Video Info Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative text-center group py-6">
              <div className="text-5xl md:text-6xl font-extralight text-foreground mb-4 tracking-wider">
                2:30
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Duration
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-2/3 h-px bg-border transition-all duration-500" />
            </div>

            <div className="relative text-center group py-6">
              <div className="text-5xl md:text-6xl font-extralight text-foreground mb-4 tracking-wider">
                4 Steps
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Easy Process
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-2/3 h-px bg-border transition-all duration-500" />
            </div>

            <div className="relative text-center group py-6">
              <div className="text-5xl md:text-6xl font-extralight text-foreground mb-4 tracking-wider">
                &lt; 1ms
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Transaction Speed
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-2/3 h-px bg-border transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
            Ready to revolutionize your payment experience?
          </p>

          <button className="group relative px-14 py-5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-500 overflow-hidden active:scale-95">
            <span className="relative z-10 text-lg tracking-wide font-medium">
              Get Started Now
            </span>
            <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 bg-primary/20" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;

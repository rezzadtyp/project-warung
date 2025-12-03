import ConnectButton from "../shared/ConnectButton";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="bg-background flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl">
        {/* TEXT BLOCK */}
        <div className="order-1 lg:order-1 space-y-4 sm:space-y-5 max-w-xl mx-auto text-center lg:text-left">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-tight">
            Get Closer
            <br />
            With Payment.
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-base sm:text-lg">
            Foreign Currency to Rupiah In Millisecond!
          </p>

          {/* Sign In Box - Desktop only */}
          <div className="hidden lg:block bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 max-w-md mx-auto lg:mx-0">
            <div className="text-center">
              <p className="text-card-foreground/80 text-sm sm:text-base font-medium">
                Connect to your preferred Wallet!
              </p>
            </div>

            <div className="w-full flex justify-center items-center">
              <div className="w-full sm:w-auto sm:scale-110 transition-transform">
                <ConnectButton />
              </div>
            </div>

            <p className="text-muted-foreground text-xs text-center px-2">
              By continuing, you acknowledge our Privacy Policy.
            </p>
          </div>
        </div>

        {/* IMAGE BLOCK */}
        <div className="order-2 lg:order-2 relative block">
          <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden">
            <img
              src="src/assets/hero.jpg"
              alt="Hero"
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute top-32 left-8 text-primary font-mono text-sm opacity-40 rotate-[-15deg]">
              )<span className="text-secondary">{` { ( ) > `}</span>-&lt;
            </div>

            <div className="absolute bottom-40 right-12 text-primary font-mono text-sm opacity-40 rotate-[15deg]">
              {`- + : ) /`}
            </div>
          </div>
        </div>

        {/* Sign In Box - Mobile only */}
        <div className="order-3 lg:hidden bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 max-w-md mx-auto">
          <div className="text-center">
            <p className="text-card-foreground/80 text-sm sm:text-base font-medium">
              Connect to your preferred Wallet!
            </p>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full sm:w-auto sm:scale-110 transition-transform">
              <ConnectButton />
            </div>
          </div>

          <p className="text-muted-foreground text-xs text-center px-2">
            By continuing, you acknowledge our Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

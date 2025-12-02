import ConnectButton from "../shared/ConnectButton";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen bg-background flex items-center justify-center px-6 pt-20"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl">
        {/* Left Content */}
        <div className="space-y-5 max-w-xl">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-serif text-foreground leading-tight">
            Get Closer
            <br />
            With Payment.
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-lg">
            Foreign Currency to Rupiah In Millisecond!
          </p>

          {/* Sign In Box */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 max-w-md">
            {/* Wallet Connection Text */}
            <div className="text-center">
              <p className="text-card-foreground/80 text-base font-medium">
                Connect to your preferred Wallet!
              </p>
            </div>

            {/* Connect Button */}
            <div className="w-full flex justify-center items-center">
              <div className="scale-110 transition-transform">
                <ConnectButton />
              </div>
            </div>

            {/* Privacy Notice */}
            <p className="text-muted-foreground text-xs text-center">
              By continuing, you acknowledge our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative lg:block hidden">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
            {/* Hero Image */}
            <img
              src="src/assets/hero.jpg"
              alt="Hero"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Decorative code-like elements */}
            <div className="absolute top-32 left-8 text-primary font-mono text-sm opacity-40 rotate-[-15deg]">
              )<span className="text-secondary">{` { ( ) > `}</span>-&lt;
            </div>

            <div className="absolute bottom-40 right-12 text-primary font-mono text-sm opacity-40 rotate-[15deg]">
              {`- + : ) /`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

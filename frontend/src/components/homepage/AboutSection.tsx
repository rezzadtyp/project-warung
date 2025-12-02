const AboutSection = () => {
  const steps = [
    {
      number: "01",
      title: "Merchant Generate QR",
      description:
        "Merchants create a unique QR code for seamless payment collection with instant currency conversion rates.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "User Scan",
      description:
        "Customers simply scan the QR code with their mobile wallet to view payment details and current exchange rates.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Convert & Pay with USDT",
      description:
        "Foreign currency is automatically converted to USDT in milliseconds. Users confirm and complete the payment securely.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Transaction History",
      description:
        "Merchants receive USDT instantly and can view complete transaction history with detailed records and analytics.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="docs" className="min-h-screen bg-background py-28 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-32 space-y-6">
          <div className="inline-block mb-4">
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
              Process
            </p>
            <div className="mx-auto mt-2 w-8 h-px bg-border" />
          </div>

          <h2 className="text-6xl md:text-8xl font-serif text-card-foreground leading-tight font-extralight tracking-tight">
            How It
            <span className="relative inline-block ml-4">
              <span className="italic font-normal">Works</span>
              <span
                className="absolute -bottom-3 left-0 w-full h-px bg-border origin-left
                transform scale-x-0 hover:scale-x-100 transition-transform duration-700"
              />
            </span>
          </h2>

          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Seamless cross-border payments in four simple steps. Fast, secure,
            and transparent.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group bg-card border border-border rounded-3xl p-12 
              transition-all duration-700 hover:border-primary hover:shadow-xl"
            >
              {/* Number & Icon */}
              <div className="flex items-start justify-between mb-10">
                <span className="text-4xl font-extralight text-muted-foreground">
                  {step.number}
                </span>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-3xl font-light text-card-foreground tracking-tight mb-6">
                {step.title}
              </h3>

              <p className="text-muted-foreground text-lg leading-relaxed font-light mb-10">
                {step.description}
              </p>

              {/* Preview Box */}
              <div
                className="relative w-full h-56 bg-card border border-border rounded-xl 
                flex items-center justify-center transition-colors duration-500"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-card rounded-xl flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                    Preview
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

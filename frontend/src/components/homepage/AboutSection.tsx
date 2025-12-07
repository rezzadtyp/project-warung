// AboutSection.tsx
import { motion } from "framer-motion";

const AboutSection = () => {
  const steps = [
    {
      number: "01",
      title: "Merchant Generate QR",
      description:
        "Merchants create a unique QR code for seamless payment collection with instant currency conversion rates.",
      image: "/generate-qr.png",
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
      image: "/user-scan.png",
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
      image: "/user-pay.png",
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
      title: "AI-Assistant for Merchant",
      description:
        "Guidance to your business needs. Supports speech-to-text feature.",
      image: "/AI-Chat-Assistant.png",
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
    <section
      id="docs"
      className="bg-background py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
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
              Process
            </p>
            <div className="mx-auto mt-2 w-8 h-px bg-border" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-card-foreground leading-tight font-extralight tracking-tight px-4"
          >
            How It
            <span className="relative inline-block ml-2 sm:ml-4">
              <span className="italic font-normal">Works</span>
              <span
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-px bg-border origin-left
                transform scale-x-0 hover:scale-x-100 transition-transform duration-700"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light px-4"
          >
            Seamless cross-border payments in four simple steps. Fast, secure,
            and transparent.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 
              transition-all duration-700 hover:border-primary hover:shadow-xl"
            >
              {/* Number & Icon */}
              <div className="flex items-start justify-between mb-6 sm:mb-8 lg:mb-10">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-3xl sm:text-4xl font-extralight text-muted-foreground"
                >
                  {step.number}
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                >
                  {step.icon}
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-2xl sm:text-3xl font-light text-card-foreground tracking-tight mb-4 sm:mb-6"
              >
                {step.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light mb-6 sm:mb-8 lg:mb-10"
              >
                {step.description}
              </motion.p>

              {/* Preview Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="relative w-full h-40 sm:h-48 lg:h-56 bg-card border border-border rounded-xl 
                flex items-center justify-center overflow-hidden transition-colors duration-500"
              >
                {step.image ? (
                  <motion.img
                    src={step.image}
                    alt={step.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-card rounded-xl flex items-center justify-center"
                    >
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground"
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
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                      className="text-muted-foreground text-xs uppercase tracking-widest font-medium"
                    >
                      Preview
                    </motion.p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default AboutSection;

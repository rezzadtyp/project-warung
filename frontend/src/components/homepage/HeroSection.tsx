// HeroSection.tsx
import { formatUSDT, useUSDTBalance } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import type { Address } from "viem";
import ConnectButton from "../shared/ConnectButton";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { address } = useAppKitAccount();

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
    error: balanceError,
  } = useUSDTBalance(address as Address);

  useEffect(() => {
    if (address) {
      const timer = setTimeout(() => {
        refetchBalance();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [address, refetchBalance]);

  return (
    <section
      id="hero"
      className="bg-background flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl">
        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-1 space-y-4 sm:space-y-5 max-w-xl mx-auto text-center lg:text-left"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-tight"
          >
            Get Closer
            <br />
            With Payment.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg"
          >
            Foreign Currency to Rupiah In Millisecond!
          </motion.p>

          {/* Sign In Box - Desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 max-w-md mx-auto lg:mx-0"
          >
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
          </motion.div>
        </motion.div>

        {/* IMAGE BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-2 lg:order-2 relative block"
        >
          <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              src="src/assets/hero.jpg"
              alt="Hero"
              className="w-full h-full object-cover rounded-lg"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute top-32 left-8 text-primary font-mono text-sm opacity-40 rotate-15"
            >
              )<span className="text-secondary">{` { ( ) > `}</span>-&lt;
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute bottom-40 right-12 text-primary font-mono text-sm opacity-40 rotate-15"
            >
              {`- + : ) /`}
            </motion.div>
          </div>
        </motion.div>

        {/* Sign In Box - Mobile only */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="order-3 lg:hidden bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 max-w-md mx-auto"
        >
          <div className="text-center">
            <p className="text-card-foreground/80 text-sm sm:text-base font-medium">
              Connect to your preferred Wallet!
            </p>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full sm:w-auto sm:scale-110 transition-transform items-center flex flex-col">
              <ConnectButton />
              {address && !isLoadingBalance && balance !== undefined && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-foreground mt-2"
                >
                  Balance: {formatUSDT(balance as bigint)} USDT
                </motion.p>
              )}
              {address && isLoadingBalance && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-muted-foreground mt-2"
                >
                  Loading balance...
                </motion.p>
              )}
              {address && balanceError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-red-500 mt-2"
                >
                  Error loading balance
                </motion.p>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-xs text-center px-2">
            By continuing, you acknowledge our Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
import { useAuth } from "@/providers/AuthProvider";
import {
  AppKitButton,
  useAppKit,
  useAppKitAccount
} from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { login, user, logout } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Auto-login when wallet connects
  useEffect(() => {
    const handleAutoLogin = async () => {
      if (isConnected && address && !user && !isAuthenticating) {
        setIsAuthenticating(true);
        try {
          await login(address);
        } catch (error) {
          console.error("Auto-login failed", error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    handleAutoLogin();
  }, [isConnected, address, user, login, isAuthenticating]);

  // Auto-logout when wallet disconnects
  useEffect(() => {
    if (!isConnected && user) {
      logout();
    }
  }, [isConnected, user, logout]);

  // Re-authenticate if wallet address changes
  useEffect(() => {
    const handleAddressChange = async () => {
      if (
        isConnected &&
        address &&
        user &&
        user.publicKey !== address &&
        !isAuthenticating
      ) {
        setIsAuthenticating(true);
        try {
          // Logout first, then login with new address
          logout();
          await login(address);
        } catch (error) {
          console.error("Re-authentication failed", error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    handleAddressChange();
  }, [address, user, isConnected, login, logout, isAuthenticating]);

  if (address && isConnected) {
    return (
      <div className="w-fit sm:w-auto">
        <AppKitButton />
      </div>
    );
  }

  return (
    <Button
      onClick={() => open()}
      variant={"outline"}
      className="w-full sm:w-auto rounded-full bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
      disabled={isAuthenticating}
    >
      {isAuthenticating ? "Connecting..." : "Connect"}
    </Button>
  );
};

export default ConnectButton;

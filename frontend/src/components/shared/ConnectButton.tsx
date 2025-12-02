import {
  AppKitAccountButton,
  useAppKit,
  useAppKitAccount,
} from "@reown/appkit/react";
import { Button } from "../ui/button";

const ConnectButton = () => {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();

  if (address) {
    return <AppKitAccountButton />;
  }

  return (
    <Button
      onClick={() => open()}
      variant={"outline"}
      className="rounded-full bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
    >
      Connect
    </Button>
  );
};

export default ConnectButton;

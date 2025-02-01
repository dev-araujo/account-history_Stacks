import {
  AppConfig,
  showConnect,
  type UserData,
  UserSession,
} from "@stacks/connect";
import { useEffect, useState } from "react";

export function useStacks() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  function connectWallet() {
    showConnect({
      appDetails: {
        name: "Stacks Account History",
        icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
      },
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }

  function disconnectWallet() {
    userSession.signUserOut();
    setUserData(null);
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    }
  }, []);

  return { userData, connectWallet, disconnectWallet };
}

"use client";

import { redirect } from "next/navigation";
import { useStacks } from "@/hooks/use-stacks";

export default function Home() {
  const { userData } = useStacks();

  if (!userData) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-8 p-24">
        <span>Connect your wallet or search for an address</span>
      </main>
    );
  }
  redirect(`/${userData.profile.stxAddress.mainnet}`);
}

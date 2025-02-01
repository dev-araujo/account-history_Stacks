"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { abbreviateAddress } from "@/lib/stx-utils";
import { createAddress } from "@stacks/transactions";
import { useStacks } from "@/hooks/use-stacks";

export function Navbar() {
  const ADDRESS_WALLET_MOCK = "SP3WCFX1JC1PMMFD1XZZCCVSS88TBJV3A8JFPD4XZ";
  const router = useRouter();
  const pathname = usePathname();
  const [searchAddress, setSearchAddress] = useState(ADDRESS_WALLET_MOCK);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { userData, connectWallet, disconnectWallet } = useStacks();

  const currentAddress = pathname.split("/")[1];

  useEffect(() => {
    if (currentAddress) {
      setSearchAddress(currentAddress);
    }
  }, [currentAddress]);

  function handleSearch() {
    if (!searchAddress.startsWith("SP")) {
      return alert("Please enter a mainnet Stacks address");
    }
    try {
      createAddress(searchAddress);
    } catch (error) {
      return alert(`Invalid Stacks address entered ${error}`);
    }
    router.push(`/${searchAddress}`);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex w-full items-center justify-between gap-4 p-4 h-16 border-b border-gray-500">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="text-2xl font-bold mr-4">
          Stacks Account History
        </Link>
        <button className="md:hidden" onClick={toggleMenu}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <div
        className={`${
          isMenuOpen
            ? "flex flex-col absolute top-16 left-0 w-full bg-gray-900 p-4 z-10 gap-4"
            : "hidden md:flex"
        } items-center gap-4 md:static md:bg-transparent md:p-0 md:z-0 md:flex-row md:w-auto justify-center`}
      >
        <div className="flex-grow md:max-w-md">
          <input
            type="text"
            placeholder="your address wallet here SP..."
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          {userData ? (
            <div className="flex flex-col md:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(`/${userData.profile.stxAddress.mainnet}`)
                }
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
              >
                View {abbreviateAddress(userData.profile.stxAddress.mainnet)}
              </button>
              <button
                type="button"
                onClick={disconnectWallet}
                className="rounded-lg bg-red-500 px-12 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

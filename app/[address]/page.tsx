import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { TransactionsList } from "@/components/txns-list";
import { fetchAddressBalance } from "@/lib/fetch-address-balance";
import { fetchAddressTransactions } from "@/lib/fetch-address-transactions";

export default async function Activity({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  const initialTransactions = await fetchAddressTransactions({ address });
  const balance = await fetchAddressBalance(address);

  return (
    <main className="flex flex-col p-8 gap-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <h1 className="text-3xl font-bold break-all text-center md:text-left">
          {address}
        </h1>
        <Link
          href={`https://explorer.hiro.so/address/${address}`}
          target="_blank"
          className="rounded-lg flex gap-1 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View on Hiro
        </Link>
      </div>

      <TransactionsList address={address} transactions={initialTransactions} />
    </main>
  );
}

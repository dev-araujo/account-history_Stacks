import type {
  FetchAddressTransactionsResponse,
  Transaction,
} from "@/lib/fetch-address-transactions";
import { abbreviateTxnId, abbreviateAddress } from "@/lib/stx-utils";
import {
  ActivityIcon,
  ArrowLeftRightIcon,
  BlocksIcon,
  CodeSquareIcon,
  FunctionSquareIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface TransactionDetailProps {
  result: FetchAddressTransactionsResponse["results"][number];
}

type TransactionInformationByType = {
  primaryTitle: string;
  secondaryTitle: string;
  tags: string[];
};

const TxTypeIcon: Record<Transaction["tx_type"], LucideIcon> = {
  coinbase: BlocksIcon,
  token_transfer: ArrowLeftRightIcon,
  smart_contract: CodeSquareIcon,
  contract_call: FunctionSquareIcon,
  poison_microblock: ActivityIcon,
};

function getTransactionInformationByType(
  result: TransactionDetailProps["result"]
): TransactionInformationByType {
  if (result.tx.tx_type === "coinbase") {
    return {
      primaryTitle: `Block #${result.tx.block_height}`,
      secondaryTitle: "",
      tags: ["Coinbase"],
    };
  }

  if (result.tx.tx_type === "token_transfer") {
    return {
      primaryTitle: `Transfer ${(
        Number.parseFloat(result.tx.token_transfer.amount) / 1_000_000
      ).toFixed(2)} STX`,
      secondaryTitle: "",
      tags: ["Token Transfer"],
    };
  }

  if (result.tx.tx_type === "smart_contract") {
    return {
      primaryTitle: result.tx.smart_contract.contract_id,
      secondaryTitle: "",
      tags: ["Contract Deployment"],
    };
  }

  if (result.tx.tx_type === "contract_call") {
    return {
      primaryTitle: result.tx.contract_call.function_name,
      secondaryTitle: result.tx.contract_call.contract_id.split(".")[1],
      tags: ["Contract Call"],
    };
  }

  if (result.tx.tx_type === "poison_microblock") {
    return {
      primaryTitle: "Microblock",
      secondaryTitle: "",
      tags: ["Microblock"],
    };
  }

  return {
    primaryTitle: "",
    secondaryTitle: "",
    tags: [],
  };
}

export function TransactionDetail({ result }: TransactionDetailProps) {
  const Icon = TxTypeIcon[result.tx.tx_type];
  const { primaryTitle, secondaryTitle, tags } =
    getTransactionInformationByType(result);

  return (
    <div className="flex flex-col p-4 border-l-2 border-transparent hover:border-blue-500 transition-all gap-4 md:flex-row md:items-start">
      <div className="flex items-center gap-4 w-full md:w-1/2">
        <Icon className="h-10 w-10 rounded-full p-2 border border-gray-700 flex-shrink-0" />

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 flex-wrap justify-start">
            <span className="font-medium text-sm whitespace-nowrap">
              {primaryTitle}
            </span>
            {secondaryTitle && (
              <span className="text-gray-500 text-sm whitespace-nowrap">
                ({secondaryTitle})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 font-bold text-xs text-gray-500 flex-wrap justify-start">
            {tags.map((tag) => (
              <span key={tag} className="whitespace-nowrap">
                {tag}
              </span>
            ))}
            <span>•</span>
            <span className="font-normal whitespace-nowrap">
              By{" "}
              <Link
                href={`${result.tx.sender_address}`}
                className="hover:underline transition-all"
              >{`${abbreviateAddress(result.tx.sender_address)}`}</Link>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-1/2 md:justify-end">
        <div className="flex items-center gap-2 flex-wrap justify-start text-xs">
          <span className="whitespace-nowrap">
            {abbreviateTxnId(result.tx.tx_id)}
          </span>
          <span>•</span>
          <span suppressHydrationWarning className="whitespace-nowrap">
            {new Date(result.tx.block_time).toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-1 font-bold text-xs text-gray-500 flex-wrap justify-start">
          <span className="whitespace-nowrap">
            Block #{result.tx.block_height}
          </span>
          <span>•</span>
          <span className="whitespace-nowrap">Nonce {result.tx.nonce}</span>
        </div>
      </div>
    </div>
  );
}

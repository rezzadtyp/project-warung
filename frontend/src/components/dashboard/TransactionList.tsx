import type { Transaction } from "@/lib/types";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";

interface TransactionListProps {
  transactions?: Transaction[];
}

export function TransactionList({ transactions = [] }: TransactionListProps) {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mx-auto max-w-4xl space-y-3">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-12">
              <div className="h-16 w-16 rounded-2xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                No transactions yet
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      tx.status === "completed"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}
                  >
                    {tx.status === "completed" ? (
                      <ArrowUpRight
                        className={`h-4 w-4 ${
                          tx.status === "completed"
                            ? "text-emerald-500"
                            : "text-neutral-400"
                        }`}
                      />
                    ) : (
                      <ArrowDownLeft
                        className={`h-4 w-4 ${
                          tx.status === "pending"
                            ? "text-amber-500"
                            : "text-neutral-400"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {tx.amount.toLocaleString("id-ID")} IDR
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {tx.timestamp.toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.status === "completed"
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                      : tx.status === "pending"
                      ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30"
                      : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30"
                  }`}
                >
                  {tx.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import type { Transaction } from "@/lib/types";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";

interface TransactionListProps {
  transactions?: Transaction[];
}

export function TransactionList({ transactions = [] }: TransactionListProps) {
  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mx-auto max-w-4xl space-y-3">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-12">
              <div className="h-16 w-16 rounded-2xl bg-card flex items-center justify-center mb-4 shadow-inner">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No transactions yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-2xl 
                bg-card border border-border
                hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* ICON BOX */}
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center
                      ${
                        tx.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : tx.status === "pending"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-rose-100 text-rose-600"
                      }
                    `}
                  >
                    {tx.status === "completed" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : tx.status === "pending" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>

                  {/* TEXT */}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {tx.amount.toLocaleString("id-ID")} IDR
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      tx.status === "completed"
                        ? "text-emerald-600 bg-emerald-100"
                        : tx.status === "pending"
                        ? "text-amber-600 bg-amber-100"
                        : "text-rose-600 bg-rose-100"
                    }
                  `}
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

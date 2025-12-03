import type { Transaction } from "@/lib/types";
import { ArrowDownLeft, ArrowUpRight, Menu, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../utils/useSidebar";

interface TransactionListProps {
  transactions?: Transaction[];
}

export function TransactionList({ transactions = [] }: TransactionListProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium">Transactions</span>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 p-3 sm:p-6 overflow-auto">
        <div className="mx-auto max-w-4xl space-y-2 sm:space-y-3">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-8 sm:mt-12">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-card flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
                <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                No transactions yet
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                bg-card border border-border
                hover:border-primary transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  {/* ICON BOX */}
                  <div
                    className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0
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
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : tx.status === "pending" ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {tx.amount.toLocaleString("id-ID")} IDR
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
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
                    px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ml-2
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

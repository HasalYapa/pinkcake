import { ORDER_STATUSES } from "@/lib/constants";
import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, CircleDot, Loader } from "lucide-react";

interface OrderStatusVisualizerProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusVisualizer({ currentStatus }: OrderStatusVisualizerProps) {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={status} className="flex-1 flex items-center">
            <div className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" : "",
                  isCurrent ? "bg-primary/20 border-primary text-primary" : "",
                  isFuture ? "bg-muted border-muted-foreground/50 text-muted-foreground" : ""
                )}
              >
                {isCompleted && <Check className="w-5 h-5" />}
                {isCurrent && <CircleDot className="w-5 h-5 animate-pulse" />}
                {isFuture && <div className="w-3 h-3 bg-muted-foreground/30 rounded-full" />}
              </div>
              <p className={cn(
                "text-xs mt-2 text-center",
                 isCurrent ? "font-bold text-foreground" : "text-muted-foreground"
              )}>{status}</p>
            </div>
            
            {index < ORDER_STATUSES.length - 1 && (
                 <div className={cn(
                    "flex-1 h-1 -mx-1",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                 )}></div>
            )}

          </div>
        );
      })}
    </div>
  );
}

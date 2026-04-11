import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SummaryCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  color?: "emerald" | "blue" | "orange" | "purple" | "destructive" | "amber"
}

const colorConfig = {
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    trend: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    blob: "from-emerald-400/20 to-teal-400/20",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    trend: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    blob: "from-blue-400/20 to-indigo-400/20",
  },
  orange: {
    icon: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    trend: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    blob: "from-orange-400/20 to-amber-400/20",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    trend: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    blob: "from-purple-400/20 to-violet-400/20",
  },
  destructive: {
    icon: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    trend: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    blob: "from-red-400/20 to-rose-400/20",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    trend: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    blob: "from-amber-400/20 to-yellow-400/20",
  },
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  color = "emerald",
}: SummaryCardProps) {
  const theme = colorConfig[color]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-white/70 to-slate-50/50 p-4 sm:p-5 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl hover:-translate-y-0.5 dark:border-slate-700/50 dark:from-slate-800/60 dark:to-slate-900/40",
        className
      )}
    >
      <div className={cn("absolute -top-8 -right-8 h-24 w-24 rounded-full bg-linear-to-br blur-2xl group-hover:scale-110 transition-transform duration-300", theme.blob)} />
      
      <div className="relative z-10 flex flex-col gap-4 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <span className="text-lg font-semibold text-foreground">{title}</span>
            <div className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {value}
            </div>
          </div>
          <div className={cn("flex items-center justify-center rounded-xl p-2.5 shadow-sm backdrop-blur-md transition-colors", theme.icon)}>
            <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
        </div>

        {(description || trend) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
            {description && (
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            )}
            {trend && (
              <div className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                theme.trend
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
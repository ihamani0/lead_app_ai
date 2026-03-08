// components/media/CopyButton.tsx
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  onCopy: (e: React.MouseEvent) => void;
  copied: boolean;
  className?: string;
  label?: string;
}

export function CopyButton({ onCopy, copied, className, label = "Copy" }: CopyButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCopy(e);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 transition-opacity", className)}
            onClick={handleClick}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  );
}
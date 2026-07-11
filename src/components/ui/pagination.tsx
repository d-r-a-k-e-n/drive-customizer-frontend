import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Button
        variant="default"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeft size={24} />
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? "primary" : "default"}
            className={cn(pageNumber === page && " px-3 py-1 rounded-md")}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      <Button
        variant="default"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ArrowRight size={24} />
      </Button>
    </nav>
  );
}

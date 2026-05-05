import { Button } from "../ui/button";

interface Pagination {
  type?: string;
  page?: number;
  isActive?: boolean;
}

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  return (
    <div className="text-text-muted flex items-center justify-between px-8 text-sm font-normal">
      <div>
        {currentPage} of {totalPages} results
      </div>

      <div className="flex gap-1">
        <Button
          className="bg-bg-state-soft text-text-subtle h-8 px-3.5"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>

        <Button
          className="bg-bg-state-soft text-text-subtle h-8 px-3.5"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

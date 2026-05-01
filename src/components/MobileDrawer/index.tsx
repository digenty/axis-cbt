import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export const MobileDrawer = ({
  open,
  setIsOpen,
  children,
  title,
  showCloseButton = true,
  className,
}: {
  open: boolean;
  setIsOpen: (bool: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode | string;
  showCloseButton?: boolean;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      {open && isMobile && <DrawerOverlay />}
      <DrawerContent
        {...(!showCloseButton && {
          onInteractOutside: (event) => event.preventDefault(),
        })}
        className={cn(
          "bg-bg-card border-border-darker m-4 block rounded-xl md:hidden",
          className,
        )}
      >
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{title}</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>
        {title && (
          <div className="bg-bg-card-subtle border-border-default flex h-14 items-center justify-between rounded-t-xl border-b px-4">
            <h2 className="text-text-default text-base font-semibold">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                onClick={(evt) => {
                  evt.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <XIcon className="text-icon-default-muted h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {children}
      </DrawerContent>
    </Drawer>
  );
};

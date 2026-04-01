import { cn } from "@/lib/utils";
import { Avatar as AvatarComponent, AvatarImage } from "./ui/avatar";

export const Avatar = ({
	url,
	className,
}: {
	url?: string;
	className?: string;
}) => {
	return (
		<AvatarComponent className={cn(className)}>
			<AvatarImage src={url || "/images/avatar.svg"} />
		</AvatarComponent>
	);
};

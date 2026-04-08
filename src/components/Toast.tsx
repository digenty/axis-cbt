"use client";

import { Button } from "@/components/ui/button";
import { CircleAlert, CircleCheck, TriangleAlert, XIcon } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface ToastProps {
	id: string | number;
	title: string;
	description?: string;
	type: "success" | "error" | "warning" | "info";
	button?: {
		label: string | undefined;
		onClick: () => void;
	};
}

export const toast = (toast: Omit<ToastProps, "id">) => {
	return sonnerToast.custom((id) => (
		<Toast
			id={id}
			title={toast.title}
			type={toast.type}
			description={toast.description}
			{...(toast.button && {
				button: {
					label: toast.button?.label,
					onClick: () => toast.button?.onClick(),
				},
			})}
		/>
	));
};

const Toast = (props: ToastProps) => {
	const { title, description, button, id, type } = props;

	return (
		<div className="bg-bg-inverted flex w-full items-start gap-2 rounded-2xl p-3 shadow-lg md:max-w-[318px]">
			{type === "success" ? (
				<CircleCheck className="text-border-success mt-0.5 size-4 font-bold" />
			) : type === "error" ? (
				<CircleAlert className="text-border-destructive mt-0.5 size-4" />
			) : (
				<TriangleAlert className="text-border-warning mt-0.5 size-4" />
			)}
			<div className="flex flex-1 items-center">
				<div className="w-full space-y-3">
					<div>
						<p className="text-text-inverted-default pt-0 text-sm font-medium">
							{title}
						</p>
						{description && (
							<p className="text-text-inverted-subtle mt-1 text-xs">
								{description}
							</p>
						)}
					</div>

					{button && (
						<Button className="bg-bg-default text-text-muted h-7 text-xs">
							{button?.label}
						</Button>
					)}
				</div>
			</div>

			<div>
				<Button
					className="bg-transparent hover:bg-transparent!"
					onClick={() => {
						button?.onClick();
						sonnerToast.dismiss(id);
					}}
				>
					<XIcon className="text-text-inverted-subtle size-4" />
				</Button>
			</div>
		</div>
	);
};

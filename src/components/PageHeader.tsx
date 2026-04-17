"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface PageHeaderProps {
	breadcrumbs?: BreadcrumbItem[];
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

export const PageHeader = ({
	breadcrumbs,
	title,
	subtitle,
	actions,
}: PageHeaderProps) => {
	return (
		<div className="mb-6 flex items-start justify-between">
			<div>
				{breadcrumbs && breadcrumbs.length > 0 && (
					<nav className="mb-1 flex items-center gap-1">
						{breadcrumbs.map((item, i) => (
							<span key={i} className="flex items-center gap-1">
								{i > 0 && (
									<ChevronRight className="h-3 w-3 text-gray-300" />
								)}
								{item.href ? (
									<Link
										href={item.href}
										className="text-xs text-gray-500 transition-colors hover:text-gray-700"
									>
										{item.label}
									</Link>
								) : (
									<span className="text-xs text-gray-400">
										{item.label}
									</span>
								)}
							</span>
						))}
					</nav>
				)}
				<h1 className="text-lg font-semibold text-gray-900">{title}</h1>
				{subtitle && (
					<p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
				)}
			</div>
			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
};

// ─── Back Button ──────────────────────────────────────────────────────────────

export const BackButton = ({ href }: { href?: string }) => {
	const router = useRouter();
	return (
		<button
			onClick={() => (href ? router.push(href) : router.back())}
			className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
		>
			<ArrowLeft className="h-3.5 w-3.5" />
			Back
		</button>
	);
};

type WithId = { id: number };

export const reorderByGroup = <T extends WithId>(
	items: T[],
	groupKey: keyof T,
	groupValue: number,
	orderedIds: number[],
): T[] => {
	const groupItems = items.filter((item) => item[groupKey] === groupValue);

	const map = new Map<number, T>(groupItems.map((item) => [item.id, item]));

	const rest = items.filter((item) => item[groupKey] !== groupValue);

	const reordered = orderedIds
		.map((id) => map.get(id))
		.filter((item): item is T => Boolean(item));

	return [...rest, ...reordered];
};

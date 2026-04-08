import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";

export const getSchools = async () => {
	try {
		const { data } = await api.get("/schools");
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

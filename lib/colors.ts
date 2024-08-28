import { Calendar, Contact, HandCoins, MapPin, School2, User } from "lucide-vue-next";
import colors from "tailwindcss/colors";

export const icons = {
	event: Calendar,
	function: Contact,
	institution: School2,
	person: User,
	place: MapPin,
	salary: HandCoins,
};

export const bgColors = {
	event: "bg-event-400 dark:bg-event-700",
	function: "bg-function-400 dark:bg-function-700",
	person: "bg-person-400 dark:bg-person-700",
	place: "bg-place-400 dark:bg-place-800",
	institution: "bg-institution-400 dark:bg-institution-700",
	salary: "bg-salary-400 dark:bg-salary-700",
	mix: "bg-neutral-300 dark:bg-neutral-400",
};
export const bgColorsSemiTransparent = {
	event: "bg-event-400/50 dark:bg-event-700/50",
	function: "bg-function-400/50 dark:bg-function-700/50",
	person: "bg-person-400/50 dark:bg-person-700/50",
	place: "bg-place-400/50 dark:bg-place-800/50",
	institution: "bg-institution-400/50 dark:bg-institution-700/50",
	salary: "bg-salary-400/50 dark:bg-salary-700/50",
	mix: "bg-neutral-300/50 dark:bg-neutral-400/50",
};
export const borderColors = {
	event: "border-event-400 dark:border-event-700",
	function: "border-function-400 dark:border-function-700",
	person: "border-person-400 dark:border-person-700",
	place: "border-place-400 dark:border-place-800",
	institution: "border-institution-400 dark:border-institution-700",
	salary: "border-salary-400 dark:border-salary-700",
};
export const textColors = {
	event: "text-event-400 dark:text-event-700",
	function: "text-function-400 dark:text-function-700",
	person: "text-person-400 dark:text-person-700",
	place: "text-place-400 dark:text-place-800",
	institution: "text-institution-400 dark:text-institution-700",
	salary: "text-salary-400 dark:text-salary-700",
};
export const scrollbarColors = {
	event: "scrollbar-thumb-event-400/50 dark:scrollbar-thumb-event-700/50",
	function: "scrollbar-thumb-function-400/50 dark:scrollbar-thumb-function-700/50",
	person: "scrollbar-thumb-person-400/50 dark:scrollbar-thumb-person-700/50",
	place: "scrollbar-thumb-place-400/50 dark:scrollbar-thumb-place-800/50",
	institution: "scrollbar-thumb-institution-400/50 dark:scrollbar-thumb-institution-700/50",
	salary: "scrollbar-thumb-salary-400/50 dark:scrollbar-thumb-salary-700/50",
};

export const colorCodes: Record<string, string> = {
	event: colors.rose[500],
	function: colors.sky[500],
	person: colors.emerald[500],
	place: colors.purple[500],
	institution: colors.indigo[500],
	salary: colors.amber[500],
};

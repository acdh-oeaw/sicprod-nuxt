import { Calendar, Contact, HandCoins, MapPin, School2, User } from "lucide-vue-next";

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
	function: "bg-function-400 dark:bg-function-600",
	person: "bg-person-400 dark:bg-person-700",
	place: "bg-place-400 dark:bg-place-700",
	institution: "bg-institution-400 dark:bg-institution-700",
	salary: "bg-salary-400 dark:bg-salary-700",
	mix: "bg-neutral-300 dark:bg-neutral-600",
};
export const borderColors = {
	event: "border-event-400 dark:border-event-700",
	function: "border-function-400 dark:border-function-600",
	person: "border-person-400 dark:border-person-700",
	place: "border-place-400 dark:border-place-700",
	institution: "border-institution-400 dark:border-institution-700",
	salary: "border-salary-400 dark:border-salary-700",
};

// utils/formatTime.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export function formatShortTime(timestamp) {
	const now = dayjs();
	const postTime = dayjs(timestamp);
	const diffSec = now.diff(postTime, "second");

	if (diffSec < 60) return `${diffSec}s`;
	const diffMin = now.diff(postTime, "minute");
	if (diffMin < 60) return `${diffMin}m`;
	const diffHr = now.diff(postTime, "hour");
	if (diffHr < 24) return `${diffHr}h`;
	const diffDay = now.diff(postTime, "day");
	if (diffDay < 7) return `${diffDay}d`;
	const diffWk = now.diff(postTime, "week");
	if (diffWk < 4) return `${diffWk}w`;
	const diffMo = now.diff(postTime, "month");
	if (diffMo < 12) return `${diffMo}mo`;
	return `${now.diff(postTime, "year")}y`;
}

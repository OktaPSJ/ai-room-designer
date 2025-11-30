/**
 * Track usage limits for free tier users
 */

const USAGE_KEY = 'ai_room_designer_usage';
const FREE_TIER_DAILY_LIMIT = 3;

function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export function getUsageData() {
    const usageStr = localStorage.getItem(USAGE_KEY);
    if (!usageStr) {
        return { date: getTodayKey(), count: 0 };
    }

    try {
        const usage = JSON.parse(usageStr);

        // Reset if it's a new day
        if (usage.date !== getTodayKey()) {
            return { date: getTodayKey(), count: 0 };
        }

        return usage;
    } catch {
        return { date: getTodayKey(), count: 0 };
    }
}

export function incrementUsage() {
    const usage = getUsageData();
    usage.count += 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    return usage;
}

export function getRemainingUploads() {
    const usage = getUsageData();
    return Math.max(0, FREE_TIER_DAILY_LIMIT - usage.count);
}

export function canUpload() {
    return getRemainingUploads() > 0;
}

export function getDailyLimit() {
    return FREE_TIER_DAILY_LIMIT;
}

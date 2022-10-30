export const ADDED_ANY_TIME = 'any-time'
export const ADDED_LAST_6_MONTHS = 'last-6-months'
export const ADDED_LAST_YEAR = 'last-year'
export const ADDED_LAST_MONTH = 'last-month'
export const ADDED_THIS_WEEK = 'this-week'

export const DATE_ADDED_DEFAULT_VALUE = ADDED_ANY_TIME

export const DATE_ADDED_OPTIONS = {
    [ADDED_ANY_TIME]: {
        label: 'Any Time',
    },
    [ADDED_LAST_YEAR]: {
        label: 'Last Year',
    },
    [ADDED_LAST_6_MONTHS]: {
        label: 'Last 6 months',
    },
    [ADDED_LAST_MONTH]: {
        label: 'Last month',
    },
    [ADDED_THIS_WEEK]: {
        label: 'This week',
    },
}

export const DATE_ADDED_HEADER_LABELS = {
    [ADDED_ANY_TIME]: '',
    [ADDED_LAST_YEAR]: 'In The Last Year',
    [ADDED_LAST_6_MONTHS]: 'In The Last 6 months',
    [ADDED_LAST_MONTH]: 'In The Last month',
    [ADDED_THIS_WEEK]: 'This week',
}

export function isValidDateAdded(slug) {
    return !!DATE_ADDED_OPTIONS[slug]
}

export function validateDateAdded(slug) {
    if (!DATE_ADDED_OPTIONS[slug]) {
        throw new Error('invalid date added slug ' + slug)
    }
}

export const SORT_BY_NEWEST = 'newest'
export const SORT_BY_MOST_POPULAR = 'most-popular'
export const SORT_BY_KICK_ASS = 'kick-ass'
export const SORT_BY_REQUESTED = 'requested'
export const SORT_BY_RECENTLY_VIEWED = 'recently-viewed'
export const SORT_BY_PEOPLE_I_FOLLOW = 'people-i-follow'

export const SORT_BY_DEFAULT_VALUE = SORT_BY_NEWEST

export const SORT_BY_OPTIONS = {
    [SORT_BY_NEWEST]: {
        label: 'Newest Items',
    },
    [SORT_BY_MOST_POPULAR]: {
        label: 'Most Popular Items',
    },
    [SORT_BY_KICK_ASS]: {
        label: 'Kick-Ass Items',
    },
    [SORT_BY_REQUESTED]: {
        label: 'Requested Items',
    },
    [SORT_BY_RECENTLY_VIEWED]: {
        label: 'Recently Viewed',
    },
    [SORT_BY_PEOPLE_I_FOLLOW]: {
        label: 'People I Follow',
    },
}

export const SORT_BY_HEADER_LABELS = {
    [SORT_BY_NEWEST]: 'Newest',
    [SORT_BY_MOST_POPULAR]: 'Most Popular',
    [SORT_BY_KICK_ASS]: 'Kick-Ass',
    [SORT_BY_REQUESTED]: 'Requested',
    [SORT_BY_RECENTLY_VIEWED]: 'Recently Viewed',
    [SORT_BY_PEOPLE_I_FOLLOW]: 'By People I Follow',
}

export function isValidSortBy(slug) {
    return !!SORT_BY_OPTIONS[slug]
}

export function validateSortBy(slug) {
    if (!SORT_BY_OPTIONS[slug]) {
        throw new Error('invalid sort by slug ' + slug)
    }
}

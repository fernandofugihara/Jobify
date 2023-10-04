// We're created this file to store util data, and created this file to define our constants. In this project we have some enum
// values and we need to make then constants to reuse then in our model, validation and in the front-end.

export const JOB_STATUS = {
    PENDING: "pending",
    INTERVIEW: "interview",
    DECLINED: "declined"
};

export const JOB_TYPE = {
    FULL_TIME: "full-time",
    PART_TIME: "part-time",
    INTERNSHIP: "internship"
};


export const JOB_SORT_BY = {
    NEWEST_FIRST: "newest",
    OLDEST_FIRST: "oldest",
    ASCENDING: "a-z",
    DESCENDING: "z-a"
};
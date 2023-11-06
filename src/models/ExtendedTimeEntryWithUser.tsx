interface ExtendedTimeEntryWithUser {
    id: number;
    date: string;
    distance: number;
    hours: number;
    minutes: number;
    seconds: number;
    user_id: number;
}

export default ExtendedTimeEntryWithUser;
interface ExtendedTimeEntryWithUser {
    id: number;
    date: string;
    distance: number;
    hours: number;
    minutes: number;
    seconds: number;
    user_id: number;
    username: string;
}

export default ExtendedTimeEntryWithUser;
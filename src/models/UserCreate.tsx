interface UserCreate {
    username: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
}

export default UserCreate;
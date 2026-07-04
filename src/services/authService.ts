const BASE_URL = import.meta.env.BASE_URL;

const register = async () => {
    const res = await fetch(`${BASE_URL}/register`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data);
    }

    return data;
};

const authService = { register };
export default authService;
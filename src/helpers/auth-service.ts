import axios from "axios";
import type { AuthenticatedUser } from "@/models/authenticated-user";
import { ref } from "vue";

export interface AuthResponse {
    success: boolean;
    errorMessage: string;
}

export abstract class AuthService {
    public static userAuthenticated = ref(false);
    private static authenticatedUser: AuthenticatedUser | null = null;

    static async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const authResponse = await axios.post('https://api.escuelajs.co/api/v1/auth/login',
                { email, password });

            const userData = await axios.get("https://api.escuelajs.co/api/v1/auth/profile", {
                headers: {
                    'Authorization': `Bearer ${authResponse.data.access_token}`
                }
            });

            this.userAuthenticated.value = true;
            this.authenticatedUser = { ...userData.data };
            console.log("Authenticated user: ", this.authenticatedUser);

            return {
                success: true,
                errorMessage: ''
            };
        } catch (err: unknown) {
            if (err instanceof Error) {
                return {
                    success: false,
                    errorMessage: err.message
                };
            } else {
                return {
                    success: false,
                    errorMessage: 'An unknown error occurred'
                };
            }
        }
    }

    static logout() {
        console.log(this.userAuthenticated.value);
        console.log(this.authenticatedUser);
        this.userAuthenticated.value = false;
        this.authenticatedUser = null;
        console.log("Logged out");
    }

}


import { UserModel } from 'auth/models/user.model';
import { ResponseApi } from 'shared/interfaces/response.interface';

export interface AuthResponse extends ResponseApi {
	user?: UserModel,
	token?: string;
	refreshToken?: string;
	expiresIn?: Date;
	role?: string;
}
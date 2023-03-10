import { UserModel } from 'auth/models/user.model';
import { ResponseApi } from 'shared/interfaces/response.interface';

export interface AuthResponse extends ResponseApi {
	data?: {
		user?: UserModel,
		accessToken?: string;
		refreshToken?: string;
	}
}
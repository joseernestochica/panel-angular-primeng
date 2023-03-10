import { UserModel } from 'auth/models/user.model';
import { ResponseApi } from 'shared/interfaces/response.interface';

export interface UserResponse extends ResponseApi {

	data?: UserModel | UserModel[]

}
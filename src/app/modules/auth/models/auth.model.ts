import { UserModel } from "./user.model";

export class AuthModel {

	constructor (

		public accessToken?: string,
		public refreshToken?: string,
		public user?: UserModel

	) { }
}

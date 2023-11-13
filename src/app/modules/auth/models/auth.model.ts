import { UserModel } from "./user.model";

export class AuthModel {

	constructor (

		public token?: string,
		public refreshToken?: string,
		public user?: UserModel

	) { }
}

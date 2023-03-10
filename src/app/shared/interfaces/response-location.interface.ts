import { ICountryModel, LocationModel } from "shared/models/location.model";
import { ResponseApi } from "./response.interface";

export interface ResponseLocation extends ResponseApi {
	data?: {
		countries?: ICountryModel[];
		states?: LocationModel[];
		cities?: LocationModel[];
		country?: string;
		state?: string;
		city?: string;
	}
}
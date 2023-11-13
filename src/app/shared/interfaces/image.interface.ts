import { ResponseApi } from "./response.interface";

export interface ImagesResponse extends ResponseApi {

	images?: string[];

}

export interface ImageGet {

	name?: string;
	type?: string;
	id?: string;
	idItem1?: string;
	idItem2?: string;

}

export interface ImageInsert {
	urlImg: string;
	imagesPic: File[];
	urlDelete?: string;
	urlPost?: string;
}
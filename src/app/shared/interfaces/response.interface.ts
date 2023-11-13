export interface ResponseApi {

	message?: string;
	statusCode?: number;
	total?: number;
	errors?: any;
	id?: number | string;
	alert?: string;
	ok?: boolean;

}
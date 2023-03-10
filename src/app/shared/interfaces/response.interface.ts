export interface ResponseApi {

	message?: string;
	statusCode?: number;
	total?: number;
	page?: number;
	last_page?: number;
	error?: ReponseErrorApi;

}

export interface ReponseErrorApi {
	error?: string;
	message?: string;
	statusCode?: number;
}
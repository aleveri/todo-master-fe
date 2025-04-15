export interface ApiResponse<T> {
     status: boolean;
     content?: T[];
     errors?: string[];
}
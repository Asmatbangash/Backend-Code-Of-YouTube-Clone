class ApiResponse {
    constructor(statusCode, data, message, stack){
        this.statusCode = statusCode,
        this.data = data, 
        this.message = message, 
        this.stack = stack
    }
}

export {ApiResponse}
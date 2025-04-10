class ApiResponse {
    constructor(statusCode, data, message, stack){
        super(message)
        this.statusCode = statusCode,
        this.data = data, 
        this.message = message, 
        this.stack = stack
    }
}

export {ApiResponse}
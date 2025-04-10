class ApiError extends Error{
    constructor(statusCode, data, message = 'somethin went wrong', errors = [], stack){
        super(message)
        this.statusCode = statusCode,
        this.data = data, 
        this.message = message,
        this.errors = errors


        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

    
}

export {ApiError}
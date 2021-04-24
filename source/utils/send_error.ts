export const sendErrorMiddleware = (_req, res) => {
    res.sendError = (error) => {
        res.send(error.statusCode).json({message: error.message})
    }
}
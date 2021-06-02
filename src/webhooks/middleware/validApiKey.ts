declare global {
    namespace Express {
        interface Request {
            apiKey?: string
        }
    }
}

export default function(req, res, next) {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send({message: 'Invalid api key'});
    }
    const apiKey = req.headers.authorization.substring('Bearer '.length);
    if(!apiKey) {
        return res.status(401).send({message: 'Invalid api key'});
    }

    req.apiKey = apiKey;

    return next();
}
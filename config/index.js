const config = {
    production: {
        DATABASE: process.env.MONGODB_URI,
        DATABASE_NAME: process.env.MONGODB_NAME,
        PORT: process.env.PORT
    },
    default: {        
        DATABASE: process.env.MONGODB_URI_DEV,
        DATABASE_NAME: process.env.MONGODB_NAME,
        PORT: process.env.PORT,
    }
}


exports.get = function get(env) {
    return config[env] || config.production
}

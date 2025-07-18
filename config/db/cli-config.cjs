require('dotenv').config()

const parseIntOr = (val, def) => {
    const parsed = parseInt(val, 10)
    return isNaN(parsed) ? def : parsed
}

const common = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseIntOr(process.env.DB_PORT, 5432),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production',
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    define: {
        underscored: false,
        freezeTableName: true,
        timestamps: true,
    },
}

module.exports = {
    development: { ...common },
    test: { ...common },
    production: {
        ...common,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    },
}

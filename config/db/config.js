import 'dotenv/config'

const parseIntOr = (val, def) => {
    const parsed = parseInt(val, 10)
    return isNaN(parsed) ? def : parsed
}

const common = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseIntOr(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production',
    pool: {
        max: 10, // max number of connections
        min: 2, // minimum number of idle connections
        acquire: 30000, // maximum time (ms) to try to get a connection before throwing
        idle: 10000, // maximum time (ms) a connection can be idle before being released
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // ⚠️ Needed for self-signed / Neon
        },
    },
    define: {
        underscored: false, // snake_case columns
        freezeTableName: true, // don't pluralize table names
        timestamps: true, // automatically add createdAt/updatedAt
    },
}

const config = {
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

export default config

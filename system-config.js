var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'currency_exchange',
    insecureAuth: true
};

var siteConfig = {
    port: 80
}
module.exports = {
    db: dbConfig,
    site: siteConfig
};
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "https://reppeprotcod.github.io");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}

module.exports = cors;
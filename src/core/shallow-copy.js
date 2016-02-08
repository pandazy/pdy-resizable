module.exports = objOrigin=> {
    var ret = {};
    Object.keys(objOrigin).forEach(key=> {
        ret[key] = objOrigin[key];
    });
    return ret;
};
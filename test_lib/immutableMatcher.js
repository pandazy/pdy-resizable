module.exports = {
    toBeImmutable(){
        return {
            compare(actual){
                var result = {};
                try {
                    var propName = 'prop' + (new Date).getTime() + Math.random();
                    actual[propName] = new Date();
                    result.pass = actual[propName] == null;
                }
                catch (ex) {
                    result.pass = /(not\s+extensible)|(read\s+only)/i.test(ex.message);
                }
                return result;
            }
        };
    }
};
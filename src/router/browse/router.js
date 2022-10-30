import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/router/browse/routes.js'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,

    stringifyQuery(obj){

        let result = stringifyQuery(obj)

        // app uses these characters unencoded
        return result
            .replace(/%3A/g, ':')
            .replace(/%7C/g, '|')
    }
})


// copied from vue-router
function stringifyQuery (obj) {
    var res = obj ? Object.keys(obj).map(function (key) {
        var val = obj[key];

        if (val === undefined) {
            return ''
        }

        if (val === null) {
            return encode(key)
        }

        if (Array.isArray(val)) {
            var result = [];
            val.forEach(function (val2) {
                if (val2 === undefined) {
                    return
                }
                if (val2 === null) {
                    result.push(encode(key));
                } else {
                    result.push(encode(key) + '=' + encode(val2));
                }
            });
            return result.join('&')
        }

        return encode(key) + '=' + encode(val)
    }).filter(function (x) { return x.length > 0; }).join('&') : null;
    return res ? ("?" + res) : ''
}

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ','); };

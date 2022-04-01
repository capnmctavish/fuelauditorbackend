const AccessControl = require('accesscontrol');
// const schedule = require('node-schedule');
const ac = new AccessControl();

exports.roles = (function (){
    ac.grant("employee").readOwn("profile").updateOwn("profile")

    ac.grant("manager").extend("employee")

    ac.grant("owner").extend("employee").readAny("profile")

    ac.grant("admin").extend("owner").deleteAny("profile").updateAny("profile")

    return ac;
})();
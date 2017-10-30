var fs = require('fs');
var rolespath = "content/storage/roles/";
var rolesfileextension = ".roles";

function roleFileExists(serverid){
    serverid = serverid.toString();
    var path = rolespath + serverid + rolesfileextension;
    return fs.existsSync(path);
}

var rolesFileTemplate = {
    admins: []
};

function getRoles(serverid){
    serverid = serverid.toString();
    var path = rolespath + serverid + rolesfileextension;
    if (!fs.existsSync(path)) {
        return [];
    }
    var roles = null;
    try{
        roles = JSON.parse(fs.readFileSync(path, 'utf8'));
    }catch(err){}
    if(roles === undefined || roles === null) return null;
    return roles; //{admins:[userid: String]}
}

function setRoles(serverid, content){
    var path = rolespath + serverid + rolesfileextension;
    fs.writeFileSync(path, content, function(){});
    return;
}

module.exports = {
    getAdmins: function(serverid){
        var roles = getRoles(serverid);
        if(roles === null || roles.admins === undefined || roles.admins === null) return [];
        return roles.admins;
    },
    isAdmin: function(serverid, userid){
        serverid = serverid.toString();
        userid = userid.toString();
        var roles = getRoles(serverid);
        if(roles === null || roles.admins === undefined || roles.admins === null || roles.admins.length === 0) return false;
        return roles.admins.indexOf(userid) !== -1; //isadmin: Boolean
    },
    setAdmin: function(serverid, userid){
        serverid = serverid.toString();
        userid = userid.toString();
        if(!roleFileExists(serverid)){
            var newContent = JSON.parse(JSON.stringify(rolesFileTemplate));
            newContent.admins.push(userid);
            setRoles(serverid, JSON.stringify(newContent));
            return;
        }else{
            if(module.exports.isAdmin(serverid, userid)) return;
            var roles = getRoles(serverid);
            if(roles === null){
                roles = {admins:[]};
            }
            if(roles.admins === undefined || roles.admins === null){
                roles.admins = [];
            }
            roles.admins.push(userid);
            setRoles(serverid, JSON.stringify(roles));
            return;
        }
    },
    unsetAdmin: function(serverid, userid){
        serverid = serverid.toString();
        userid = userid.toString();

        if(!roleFileExists(serverid)) return;
        if(!module.exports.isAdmin(serverid, userid)) return;

        var roles = getRoles(serverid);
        roles.admins.splice(roles.admins.indexOf(userid),1);
        setRoles(serverid, JSON.stringify(roles));
        return;
    }

};
//NETWORK
var http = require("http");
var https = require("https");
var emitter = require('events').EventEmitter;

function getJSON(options, onResult)
{

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
};

var optionsServers = {
    host: 'sphinx.vm.iswleuven.be',
    port: 443,
    path: '/api/servers',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var optionsSites = {
    host: 'sphinx.vm.iswleuven.be',
    port: 443,
    path: '/api/sites',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

//SERVICE_MANAGER
var settings = require('../../settings.js');

var isw_server_members = [];
var service_reminds = [];
/*
 * [
 *  {
 *      reminds: [timestamp: Date.now()=longint],
 *      host_address: String, //UNIQUE
 *  }
 * ]
 */

function defineServerMembers(isw_guild){
    var members = isw_guild.members.array();
    for(var i=0;i<members.length;i++){
        if(isServerMember(members[i].id)){
            isw_server_members.push(members[i]);
        }
    }
    if(isw_server_members.length === 0){
        console.log("Warning: No members specified to notify for offline services (isw_service_warner).");
    }
}

function isServerMember(member_id){
    for(var i=0;i<settings.isw_service_managers.length;i++){
        if(member_id.toString() === settings.isw_service_managers[i])
            return true;
    }
    return false;
}

function getOfflineServices(){
    var em = new emitter();
    setTimeout(function(){
        getJSON(optionsServers, (statusCode, result)=>{
            result = result.servers;
            var offline_servers = [];
            for(var i=0;i<result.length;i++){
                if(result[i].alert === 1 && result[i].status === "down"){
                    var server = {};
                    server.type = "server";
                    server.host_name = result[i].host_name;
                    server.description = result[i].description;
                    server.host_address = result[i].host_address;
                    server.status = result[i].status;
                    server.down_since = result[i].down_since;
                    offline_servers.push(server);
                }
            }

            getJSON(optionsSites, (statusCode, result)=>{
                result = result.sites;
                var offline_sites = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].alert === 1 && result[i].status === "down"){
                        var server = {};
                        server.type = "site";
                        server.host_name = result[i].host_name;
                        server.description = result[i].description;
                        server.host_address = result[i].host_address;
                        server.status = result[i].status;
                        server.down_since = result[i].down_since;
                        offline_sites.push(server);
                    }
                }

                var offline_services = offline_servers.concat(offline_sites);
                em.emit('ready', offline_services);
            });

        });
    }, 1);
    return em;
} /*.on('ready', offline_services=>{}) => offline_services:
   *[
   *  {
   *    type: String, //"server" or "site"
   *    host_name: String,
   *    description: String,
   *    host_address: String,
   *    status: String,
   *    down_since: String,
   *    }
   * ]
  */

function addRemindToService(host_address){
    for(var i=0;i<service_reminds.length;i++){
        if(service_reminds[i].host_address === host_address){
            service_reminds[i].reminds.push(Date.now());
            return;
        }
    }
    service_reminds.push({reminds: [Date.now()], host_address: host_address});
    return;
}

function updateServices(offline_services){
    var newList = [];
    for(var i=0;i<service_reminds.length;i++){
        var found = false;
        for(var j=0;j<offline_services.length;j++){
            if(service_reminds[i].host_address === offline_services[j].host_address){
                found = true;
                break;
            }
        }
        if(found)
            newList.push(service_reminds[i]);
    }
    service_reminds = newList;
}

function getReminds(host_address){
    var reminds = null;
    for(var i=0;i<service_reminds.length;i++){
        if(host_address === service_reminds[i].host_address){
            reminds = service_reminds[i];
        }
    }
    return reminds;
}

function getServicesToRemind(offline_services){
    var services_to_remind = [];
    for(var i=0;i<offline_services.length;i++){
        var reminds = getReminds(offline_services[i].host_address);

        if(reminds === null || reminds.reminds === null || reminds.reminds.length === 0){
            services_to_remind.push(offline_services[i]);
        }else{
            if(reminds.reminds.length-1 < settings.isw_service_warn_time_intervals.length){
                var interval = settings.isw_service_warn_time_intervals[reminds.reminds.length-1]; //IN MINUTES
                interval = interval * 60000; //IN MS
                if(reminds.reminds[reminds.reminds.length-1] + interval < Date.now()){
                    services_to_remind.push(offline_services[i]);
                }
            }
            if(reminds.reminds.length-1 >= settings.isw_service_warn_time_intervals.length && settings.isw_service_keep_reminding ){
                var interval = settings.isw_service_warn_time_intervals[settings.isw_service_warn_time_intervals.length-1];
                interval = interval * 60000; //IN MS
                if(reminds.reminds[reminds.reminds.length-1] + interval < Date.now()){
                    services_to_remind.push(offline_services[i]);
                }
            }
        }
    }
    return services_to_remind;
}

function createMessagePart(service_to_remind){

 /*.on('ready', offline_services=>{}) => offline_services:
   *[
   *  {
   *    type: String, //"server" or "site"
   *    host_name: String,
   *    description: String,
   *    host_address: String,
   *    status: String,
   *    down_since: String,
   *    }
   * ]
  */

    var content = "\n```";
    content += "\ntype: " + service_to_remind.type;
    content += "\nhost_name: " + service_to_remind.host_name;
    content += "\ndescription: " + service_to_remind.description;
    content += "\nhost_address: " + service_to_remind.host_address;
    content += "\nstatus: " + service_to_remind.status;
    content += "\ndown_since: " + service_to_remind.down_since;
    content += "\n```";
    return content;
}

function checkServices(){
    getOfflineServices().on('ready', offline_services=>{
        //REMOVE SERVICES FROM service_reminds THAT ARE ACTIVE
        updateServices(offline_services);

        //CHECK OFFLINE SERVICES
        var services_to_remind = getServicesToRemind(offline_services);

        var content = "Warning, following ISW services are down:";
        var message_parts = [];

        for(var i=0;i<services_to_remind.length;i++){
            addRemindToService(services_to_remind[i].host_address);
            message_parts.push(createMessagePart(services_to_remind[i]));
        }

        if(message_parts.length === 0) return;

        for(var i=0;i<isw_server_members.length;i++){
            isw_server_members[i].send(content);
            for(var j=0;j<message_parts.length;j++){
                isw_server_members[i].send(message_parts[j]);
            }
        }

    });
}


module.exports = {
    run: function(isw_guild){
        defineServerMembers(isw_guild);
        setInterval(function(){
            checkServices();
        }, 300000);
    }
};
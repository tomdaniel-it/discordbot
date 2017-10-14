module.exports = class Command{

        //CREATES this.prefix, this.message
        constructor(message, prefix){
            this.prefix = prefix;
            this.message = message;
        }

        //CREATES this.command, this.params USING this.prefix, this.message
        createParameters(){
            var text = this.message;
            
            var regex = new RegExp("^\\" + this.prefix + "([a-zA-Z]+)(.*)$");
            if(!regex.test(text)){
                return "That's not how it works! (-_-) Ex: .command -p parameter --name Bob";
            }
            this.command = regex.exec(text)[1];
            text = regex.exec(text)[2].trim();
            this.params = [];
            while(true){
                regex = /^(-|--)([a-zA-Z]+)\s"([^"]+)"/;
              if(regex.test(text)){
                  var match = regex.exec(text);
                  this.params.push({key:match[2].trim().toLocaleLowerCase(),value:match[3].trim()});
                text = text.substring(match[0].length);
                continue;
              }
              
              regex = /^(-|--)([a-zA-Z]+)\s([^-]+)/;
              if(regex.test(text)){
                  var match = regex.exec(text);
                  this.params.push({key:match[2].trim().toLocaleLowerCase(),value:match[3].trim()});
                text = text.substring(match[0].length);
                continue;
              }
              break;
            }
            if(text.trim()!=="") return "That's not how it works! (-_-) Ex: .command -p parameter --name Bob";
            return true;
        }
        
        getMessage(){
            return this.message;
        }

        getParameters(){
            return this.params;
            /* 
             * [{key:key, value:value}]
             * Ex: [
             *  {key:"name", value:"Bob"},
             *  {key:"t", value:50},
             *  {key:"m", value:"Hi buddy!"}
             * ]
            */
        }
        
        getCommand(){
            return this.command;
        }
    };
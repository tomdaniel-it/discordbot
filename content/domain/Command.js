module.exports = class Command{

        //CREATES this.prefix, this.message
        constructor(message, prefix){
            this.prefix = prefix;
            this.message = message;
        }

        //CREATES this.command, this.params USING this.prefix, this.message
        createParameters(){
            var text = this.message.content;
            var regex = new RegExp("^\\" + this.prefix + "([a-zA-Z_\.]+)(.*)$");
            if(!regex.test(text)){
                return "That's not how it works! (-_-) Ex: .command <value1> [value2]";
            }
            this.command = regex.exec(text)[1].toLowerCase();
            var tmp_params = regex.exec(text)[2].trim();
            tmp_params = tmp_params.replace(/@watergieter/ig, '<@233991650790080512>')
            this.params = tmp_params;
            return true;
        }
        
        getMessage(){
            return this.message;
        }

        getParameters(){
            return this.params;
        }
        
        getCommand(){
            return this.command;
        }

        getPrefix(){
            return this.prefix;
        }
    };
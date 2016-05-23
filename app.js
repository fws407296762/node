const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");
const mime = require("./mime");
const server = http.createServer();

server.on('request',(req,res)=>{
    let url = req.url === "/" ?  '/views/index.ejs' : req.url,
        file = getUrlFile(url),
        ext = path.extname(file),
        contentType = mime.getMIME(ext);
    let method = req.method.toLowerCase();  
        fs.readFile("."+file,function(err,str){
            if(err){
                res.send(404,"找不到该页面");
            }
            str = str.toString("utf8");
            if(ext === ".ejs"){
                switch(file){
                    case "/views/index.ejs":
                        str = ejs.render(str,{
                            title:"这个是首页"
                        });
                    break;
                    case "/views/initdatabase.ejs":
                        str = ejs.render(str,{
                            title:"这个是数据库创建页面"
                        });
                    break;
                }
            } 
            res.send(200,str,{
                "Content-Type":contentType
            });
        });
    if(method === "get"){
        console.log("GET");
    }
    if(method === 'post'){
        switch(file){
            case "/views/initdatabase.ejs":
                let params = '';
                req.on("data",function(chunk){
                    params += chunk.toString();
                });
                req.on("end",function(){
                    let paramsObj = querystring.parse(params);
                    
                })
            break;
        }
    }
   
});

server.listen(3000);

let isType = (type)=>{
    return (obj)=>{
        return Object.prototype.toString.call(obj) === '[object '+type+']';
    }
}

let types = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error','Object'];
types.forEach(function(item){
    this['is'+item] = isType(item);
});

http.ServerResponse.prototype.send = function(state,str,options){
    let s = parseInt(state),
        _str = str,
        buf_str = Buffer.from(_str,'utf8'),
        o = {
            "Content-Type":'text/plain',
            "Content-Length":Buffer.byteLength(buf_str),
            "Server":"Node.js "+(process.version)
        };
    if(options && isObject(options)){
        o = objExtend(o,options);
    }
    this.writeHead(s,o);
    this.write(buf_str);
    this.end();
}

let objExtend = (dest,src,redefine)=>{
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    if(!dest){
        throw "目标对象未定义";
    }
    if(!src){
        throw "源对象未定义";
    }
    if(redefine === undefined){
        redefine = true;
    }
    
    Object.getOwnPropertyNames(src).map(function(item){
        if(!redefine && hasOwnProperty.call(dest,item)){
            return ;
        }
        var descriptor = Object.getOwnPropertyDescriptor(src,item);
        Object.defineProperty(dest,item,descriptor);
    });
    return dest;
};

let getUrlFile = (url)=>{
    if(!url || !isString(url)) throw "URL参数错误";
    let startIndex = url.indexOf("/"),
        endIndex = url.indexOf("?") > -1 ? url.indexOf("?") : url.length;
    return url.substring(startIndex,endIndex);
};
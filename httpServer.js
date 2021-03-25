var http = require('http');
var fs = require('fs');
var url = require('url');

var net_client = require('net');  // 클라이언트

function getConnection()
{
    var client = "";
    var recvData = [];  
    client = net_client.connect({port: 8888, host:'192.168.100.20'}, function() {
     
        console.log("connect log======================================================================"); 
        console.log('connect success'); 
        console.log('local = ' + this.localAddress + ':' + this.localPort); 
        console.log('remote = ' + this.remoteAddress + ':' +this.remotePort); 
     
        local_port = this.localPort; 
     
        this.setEncoding('utf8'); 
        this.setTimeout(600000); // timeout : 10분 
        console.log("client setting Encoding:binary, timeout:600000" ); 
        console.log("client connect localport : " + local_port);
    }); 
 
    // 접속 종료 시 처리 
    client.on('close', function() { 
        console.log("client Socket Closed : " + " localport : " + local_port); 
    }); 
 
// 데이터 수신 후 처리 
    client.on('data', function(data) { 
        if(data == 'nodejs')
        {
            console.log('sucess!!!@@@@@@@@@@@@@')
        }
        console.log("data recv log=================================================================="); 
        recvData.push(data); 
        console.log("data.length : " + data.length);
        console.log("data recv : " + data);
        client.end();
    }); 
 
    client.on('end', function() { 
        console.log('client Socket End'); 
    }); 
     
    client.on('error', function(err) { 
        console.log('client Socket Error: '+ JSON.stringify(err)); 
    }); 
     
    client.on('timeout', function() { 
        console.log('client Socket timeout: '); 
    }); 
     
    client.on('drain', function() { 
        console.log('client Socket drain: '); 
    }); 
     
    client.on('lookup', function() { 
        console.log('client Socket lookup: '); 
    });  
    return client;
}

var app = http.createServer(function (request, response) {
    

    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;

    var list;
  
    
    if (request.url == '/') {
        _url = '/index.html';
    }
    
    if(request.url == '/favicon.ico'){
        
        return response.writeHead(404);
    }
    
    if (request.url == '/sucess.html') {
        
        getConnection();

        var template;
        console.log(request.url);
        fs.readdir('./video/', function (error, filelist) {
    
            var i = 0;
            while (i < filelist.length) {
    
                list = list + '<tr>';
                
                list = list + '<th onClick = " test(this);">' + filelist[i]+ '</th>';
                
                var day = filelist[i].split("_")[0];
                
                list = list + '<th>' + day + '</th>';

                var slide = filelist[i].split("_")[1].split(".")[0];
                var time = slide.split("-");
                var hour = time[0]+"시";
                var min = time[1]+"분";
                var sec = time[2]+"초";
                list = list + '<th>' + hour+min+sec + '</th>';
    
                i = i + 1
                list = list + '</tr>';
    
            }
    
            list = list.split("undefined")[1];
            template = `
          <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="http://210.102.142.15:3000/bootstrap">
        <link rel="stylesheet" href="http://210.102.142.15:3000/sucess_css">
    </head>
    
     
    
    <body>
    
    
         <header>
             <Image id="camera_img" src="http://210.102.142.15:3000/image_test"></Image> 
             <p class = "neon">BLACK BOX</p>
        </header>
    
    
        <section>
    
            <div id = 'vi'>
                <p class = 'title'> 2021년 03월 17일 11시 42분 26초 </p>
                <video id ='test'  src = "http://210.102.142.15:3000/video/2021-03-17_11-42-26.mp4" controls> </video>
            </div>
            <div id = 'tb'>
                <table class="table table-bordered table-dark">
    
                    <thead>
                        <td class ='Playlist' colspan="3"> 재생목록</td>
                    </thead>
                    <tbody>
                    <th class = 'name' scope="col">파일 이름</th>
                    <th class = 'name' scope="col">날짜</th>
                    <th class = 'name' scope="col">시간</th>
    
                        ${list}
    
                    </tbody>
                </table>
            </div>
        </section>
    
           <script type="text/javascript">
    
                function test(obj){
    
                 
                    var j=document.getElementsByClassName("selected");
                    for(var i=0;i<j.length;i++){
                        j[i].className="";
                        }  
                    
    
                    obj.className="selected";
                    
                    var filename=obj.innerHTML;
    
                    console.log(filename);
                    document.getElementById("test").src = "http://210.102.142.15:3000/video/"+filename;
                    console.log(document.getElementById("test").src);
                    
                    
                    slice(filename);
                }
                
                function slice(str)
                {
                    var slice = [];
                    slice = str.split("_");
                    var y = slice[0].split("-")[0];
                    var month = slice[0].split("-")[1];
                    var d = slice[0].split("-")[2];
                    var h = slice[1].split("-")[0];
                    var min = slice[1].split("-")[1];
                    var s = slice[1].split("-")[2].split(".")[0];
                    var x = document.getElementsByClassName("title")[0];
                    x.innerText=(y+"년 "+month+"월 " +d+"일       " + h+"시 "+ min+"분 "+s +"초" );
                    
                }
    
            </script>
    
        <script src="js/jquery.min.js.js"></script>
        <script src="js/bootstrap.min.js"></script>
    
    </body></html>
          `
          
          response.end(template);
        });

        return;
    }
   
    if (request.url == '/bootstrap') {
        var image_name = "css/bootstrap.css";

        fs.readFile(image_name, function (err, data) {
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });

        return;
    }
    if (request.url == '/sucess_css') {
        var image_name = "sucess_css.css";

        fs.readFile(image_name, function (err, data) {
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });
        return;
    }
    
    if (request.url == '/image_test') {
        var image_name = "img/test.png";
        fs.readFile(image_name, function (err, data) {
            
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });
        return;
    }

    var split_url=request.url.split("/");
    if (split_url[1] == 'video') {
        //        url_split=url.split("/");
        console.log("video");
        var video_name = "video/"+split_url[2];
        console.log(video_name+"ddddddddddd");

        fs.readFile(video_name, function (err, data) {
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });



        return;
    }


      
    if (request.url == '/nfc') {
        var image_name = "img/nfc.png";
        fs.readFile(image_name, function (err, data) {
            
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });

        return;
    }
    
    if (request.url == 'vendor/bootstrap/css/bootstrap.min.css') {
        var image_name = "img/nfc.png";
        fs.readFile(image_name, function (err, data) {
            
            if (err) throw err;
            response.writeHead(200);
            response.write(data);
            response.end();
        });

        return;
    }

    response.writeHead(200);
    console.log(_url);
    response.end(fs.readFileSync(__dirname + _url));
});
app.listen(3000);

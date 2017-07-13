var http = require("http");
var url = "http://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000260?sort=MonitorDate&offset=0&limit=1000";
var firebase = require('firebase');
var app = firebase.initializeApp({
    ServiceAccount: {
       projectId: "opendataaqi",
       clientEmail: "f74372017@mailst.cjcu.edu.tw",
       privateKey: "-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----\n"
    },
   databaseURL: "https://opendataaqi.firebaseio.com"
});

var today,y,mo,d,t,h,m,s,ref,rref;

function gettime(){
//date
  today = new Date();
  y = today.getFullYear();
  mo = today.getMonth()+1;
  d = today.getDate();
  ref = firebase.database().ref('/'+y+"年"+mo+"月"+d+'日/');
  t = new Date();
  h = "0" + t.getHours();
  m = "0" + t.getMinutes();
  s = "0" + t.getSeconds();
  h = h.substring(h.length - 2, h.length + 1);
  m = m.substring(m.length - 2, m.length + 1);
  s = s.substring(s.length - 2, s.length + 1);
  rref = ref.child('/'+h+':00:00/');
  console.log(rref.key);
  
}

function checkremove(){
  var rref = firebase.database().ref('/');
  rref.once('value').then(function(snapshot){
    var number = snapshot.numChildren();
    if(number>10){
      rref.remove()
      .then(function(){
        console.log("Remove succeeded.");
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
    }
  });
}

function updata(){
  http.get(url, function(response){
    var data = [];
    response.on('data', function(chunk){
        data += chunk;
    });
    response.on('end', function(){
        data = JSON.parse(data);
        rref.update(data);
    });
  }).on('error', function(e){
    //console.log("error: ", e);
    //console.log(y+'/'+mo+'/'+d+' '+h+':'+m+':'+s);
});
}
gettime();updata();checkremove();
setInterval(function(){gettime();updata();checkremove();},1000*60*60);

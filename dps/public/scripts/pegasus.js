// Micro lib to send ajax requests
function pegasus(a,b){return b=new XMLHttpRequest,b.open("GET",a),a=[],b.onreadystatechange=b.then=function(c,d,e,f){if(c&&c.call&&(a=[,c,d]),4==b.readyState&&(e=a[0|b.status/200])){try{f=JSON.parse(b.responseText)}catch(g){f=null}e(f,b)}},b.send(),b}

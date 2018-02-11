function getdata(){
  var xhttp = new XMLHttpRequest();
  var url="http:/localhost:3000/db";

  xhttp.open("GET",url, true);
  xhttp.send();
	
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myArr=JSON.parse(this.responseText);
      var dataObj=JSON.stringify(myArr,null,20);
      document.getElementById('msg').innerHTML=dataObj;
    }
  };
}
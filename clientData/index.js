function getdata(){
  var xhttp = new XMLHttpRequest();
  var url="http:/localhost:3000/db";

  xhttp.open("GET",url, true);
  xhttp.send();
	
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myArr=JSON.parse(this.responseText);
      //var dataObj=JSON.stringify(myArr,null,20);
      var show=document.getElementById('msg1');
      show.innerHTML="<h2>Report of the base document </h2>"+"Extension : "+"<b>"+myArr.adminData.extA+"</b>"+
      "</br>Total words count : "+"<b>"+myArr.adminData.wordcount+"</b>"+"</br>Literature strength in %age : "+"<b>"+
      myArr.compData.adminLitT+"</b>"+"</br>Topics covered in %age : "+"<b>"+(myArr.compData.adminhPerc+myArr.compData.adminbPerc)+"</b>"+
      
      "</br><h2>Report of the target document </h2>"+"Extension : "+"<b>"+myArr.targetData.extT+"</b>"+
      "</br>Total words count : "+"<b>"+myArr.targetData.wordcount+"</b>"+"</br>Literature strength in %age : "+"<b>"+
      myArr.compData.targetLitT+"</b>"+"</br>Topics covered in %age : "+"<b>"+(myArr.compData.targethPerc+myArr.compData.targetbPerc)+"</b>"+
      
      "</br><h2>Consolidated Report</h2>"+"Document type test : "+"<b>"+myArr.finalData.docType.msg+"</b>"+"</br></br>Word count test : "+"<b>"+
      myArr.finalData.docWord.msg+"</b>"+"</br></br>Document similarity test : Document is "+"<b>"+myArr.finalData.docSim.val+"%</b>"+" similar"+
      "</br>&emsp;&emsp;&emsp;"+"*Remarks : "+"<b>"+myArr.finalData.docSim.msg+"</b>"+"</br></br>Document technical content test : Document is lagging "+"<b>"
      +myArr.finalData.docTech.val+"% behind</b>"+"</br>&emsp;&emsp;&emsp;"+"*Remarks : "+"<b>"+myArr.finalData.docTech.msg+"</b>"+
      "</br></br>Document literature test : Document is lagging "+"<b>"+myArr.finalData.docLit.val+"% behind</b>"+"</br>&emsp;&emsp;&emsp;"+"*Remarks : "+
      "<b>"+myArr.finalData.docLit.msg+"</b>"+"</br></br>Document final score out of 200 : "+"<b>"+myArr.compData.finalScore+"</b>";
    }
  };
}





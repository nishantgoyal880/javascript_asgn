var textract = require('textract');
var natural = require('natural');
var stringSimilarity = require('string-similarity');
var wordcount = require('wordcount');
var WordPOS = require('wordpos');
var fs=require('fs');
var path = require('path');
var wordpos = new WordPOS();
var admin='html.docx';
var target='bootstrap.docx';
var dataA;
var dataT;


var adminData={
  extA:path.extname(admin),
  wordcount:0,
  nounsCount:0,
  adjCount:0,
  verbCount:0,
  nounPercA:0,
  adjPercA:0,
  verbPercA:0,
}
var targetData={
  extT:path.extname(target),
  wordcount:0,
  nounsCount:0,
  adjCount:0,
  verbCount:0,
  nounPercT:0,
  adjPercT:0,
  verbPercT:0,
}
var compData={
  stringMatch:0,
}

var docBreak = function(file,obj,data){
  return new Promise((resolve,reject)=>{
      //reading file
      textract.fromFileWithPath(file,{preserveLineBreaks:true},function(error,text){
        if (error){
          console.log(error);
        }else{
          //obtaining whole text
          if(data=="A")
            dataA=text;
          if(data=='T')
            dataT=text;
          //counting word
          obj.wordcount=wordcount(text);
          //counting nouns
          wordpos.getNouns(text, function(result){
            obj.nounsCount=result.length;
          });
          //counting adjectives
          wordpos.getAdjectives(text, function(result){
            obj.adjCount=result.length;
          });
          //counting verbs
          wordpos.getVerbs(text, function(result){
            obj.verbCount=result.length;
            resolve("success");
          });
        }
      });
    });
  }

let promises=[];
let p1=docBreak(admin,adminData,"A");
promises.push(p1);
let p2=docBreak(target,targetData,"T");
promises.push(p2);

Promise.all(promises).then(function(results){
  var score=200;

  //calculating %age of nouns
   adminData.nounPercA=parseInt(adminData.nounsCount/(adminData.wordcount)*100);
   targetData.nounPercT=parseInt(targetData.nounsCount/(targetData.wordcount)*100);

  //calculating %age of adjectives
   adminData.adjPercA=parseInt(adminData.adjCount/(adminData.wordcount)*100);
   targetData.adjPercT=parseInt(targetData.adjCount/(targetData.wordcount)*100);

  //calculating %age of verbs
   adminData.verbPercA=parseInt(adminData.verbCount/(adminData.wordcount)*100);
   targetData.verbPercT=parseInt(targetData.verbCount/(targetData.wordcount)*100);

  //calculating string matching
   compData.stringMatch=(stringSimilarity.compareTwoStrings(dataA,dataT))*100;


   console.log(adminData);
   console.log(targetData);
   console.log(compData);
})
.catch((message)=> console.log(message));

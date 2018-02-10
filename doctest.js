var textract = require('textract');
var natural = require('natural');
var stringSimilarity = require('string-similarity');
var wordcount = require('wordcount');
var WordPOS = require('wordpos');
var fs=require('fs');
var path = require('path');
var wordpos = new WordPOS();
var tokenizer = new natural.WordTokenizer();
var admin='html.docx';
var target='bootstrap.docx';
var dataA;
var dataT;
var tokenArrayA=[];
var tokenArrayT=[];
var wordH=0;
var wordB=0;

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
  adminhPerc:0,
  adminbPerc:0,
  targethPerc:0,
  targetbPerc:0,
}

//tokenizing keywords file and counting total words
var hRead=fs.readFileSync('htmlkeys.txt','utf8');
wordH=wordcount(hRead);
var tokenhKeys=tokenizer.tokenize(hRead);
var bRead=fs.readFileSync('bootstrapKeys.txt','utf8');
wordB=wordcount(bRead);
var tokenbKeys=tokenizer.tokenize(bRead);

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
          //Tokenizing whole text
          if(data=="A")
            tokenArrayA=tokenizer.tokenize(text);
          if(data=="T")
            tokenArrayT=tokenizer.tokenize(text);
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
  adminData.nounPercA=parseInt((adminData.nounsCount/adminData.wordcount)*1000);
  targetData.nounPercT=parseInt((targetData.nounsCount/targetData.wordcount)*1000);

  //calculating %age of adjectives
  adminData.adjPercA=parseInt((adminData.adjCount/adminData.wordcount)*1000);
  targetData.adjPercT=parseInt((targetData.adjCount/targetData.wordcount)*1000);

  //calculating %age of verbs
  adminData.verbPercA=parseInt((adminData.verbCount/adminData.wordcount)*1000);
  targetData.verbPercT=parseInt((targetData.verbCount/targetData.wordcount)*1000);

  //calculating string matching
  compData.stringMatch=parseInt((stringSimilarity.compareTwoStrings(dataA,dataT))*100);

   //calculating %age of keywords used
   compData.adminhPerc=percKeys(tokenhKeys,tokenArrayA,wordH);
   compData.adminbPerc=percKeys(tokenbKeys,tokenArrayA,wordB);
   compData.targethPerc=percKeys(tokenhKeys,tokenArrayT,wordH);
   compData.targetbPerc=percKeys(tokenbKeys,tokenArrayT,wordB);



   console.log(adminData);
   console.log(targetData);
   console.log(compData);
})
.catch((message)=> console.log(message));


var percKeys=function(tokenhKey,tokenArray,word){
   var count=0;
    for(let i in tokenhKey){
      for(let j in tokenArray){
        if(tokenhKey[i]==tokenArray[j]){
          count++;
          break;
        }
      }
    }
    let perc=(count/word)*100;
    return parseInt(perc);
  }


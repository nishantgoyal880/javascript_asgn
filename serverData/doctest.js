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

//JSON object
var finalResults={};
var param=['adminData','targetData','compData','finalData'];

param.map(state=>{
  finalResults[state]={
  }
});

finalResults.finalData={
  docType:{},
  docWord:{},
  docSim:{},
  docTech:{},
  docLit:{}
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

   //Checking the file type
   if(targetData.extT!=adminData.extA){
    finalResults.finalData.docType.msg="File rejected:wrong file extension,(.docx) required";
   }else{
    finalResults.finalData.docType.msg="File Accepted:Good to go";
   }

   //Checking word count
   if((targetData.wordcount>parseInt((adminData.wordcount*80)/100)) && (targetData.wordcount<parseInt((adminData.wordcount*120)/100))){
    finalResults.finalData.docWord.msg="The target file is within the allowed range";
   }else{
    finalResults.finalData.docWord.msg="The target file is not within the allowed range";
   }

   //Checking string similarity
   var x=compData.stringMatch;
   finalResults.finalData.docSim.val=x;

   if(x>80){
    finalResults.finalData.docSim.msg="You have done a great job";
   }else if(x>50){
    finalResults.finalData.docSim.msg="You have done an average job";
   }else{
    finalResults.finalData.docSim.msg="You have done a poor job";
   }

   //Checking keywords used
   var y=(compData.adminbPerc+compData.adminhPerc)-(compData.targetbPerc+compData.targethPerc);
   y=(y< 0) ? y * -1 : y;
   finalResults.finalData.docTech.val=y;
   if(y<10){
    finalResults.finalData.docTech.msg="Your document can be referred to someone";
   }else if (y<20){
    finalResults.finalData.docTech.msg="Your document is worthy for you only";
  }else{
    finalResults.finalData.docTech.msg="Your document is not worth reading";
  }

  //Checking literature of document
  var z=(adminData.nounPercA+adminData.verbPercA+adminData.adjPercA)-(targetData.nounPercT+targetData.verbPercT+targetData.adjPercT);
  finalResults.finalData.docLit.val=z;
  if(z<=(-5)){
    finalResults.finalData.docLit.msg="This document is well explaining or may be off the topic";
  }else if(z>(-5) && z<5){
    finalResults.finalData.docLit.msg="This document is around the topic";
  }else{
    finalResults.finalData.docLit.msg="This document is less interactive or may be just touching the topic";
  }     

  //Again Json object :-)
  finalResults.adminData={
    extA:adminData.extA,
    wordcount:adminData.wordcount,
    nounsCount:adminData.nounsCount,
    adjCount:adminData.adjCount,
    verbCount:adminData.verbCount,
    nounPercA:adminData.nounPercA,
    adjPercA:adminData.adjPercA,
    verbPercA:adminData.verbPercA,  
  }
  finalResults.targetData={
    extT:targetData.extT,
    wordcount:targetData.wordcount,
    nounsCount:targetData.nounsCount,
    adjCount:targetData.adjCount,
    verbCount:targetData.verbCount,
    nounPercT:targetData.nounPercT,
    adjPercT:targetData.adjPercT,
    verbPercT:targetData.verbPercT,  
  }
  finalResults.compData={
    stringMatch:compData.stringMatch,
    adminhPerc:compData.adminhPerc,
    adminbPerc:compData.adminbPerc,
    targethPerc:compData.targethPerc,
    targetbPerc:compData.targetbPerc,
  }

   //stringifying json object
   let json=JSON.stringify(finalResults,null,20);
   //writing final data into json
   fs.writeFile('../final_data.json',json,'utf8',(err)=>{
    if(err){
      console.log("Error");
      return;
    }
   });

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



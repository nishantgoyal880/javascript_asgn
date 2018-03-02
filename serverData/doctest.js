
var natural = require('natural');
var fs=require('fs');
var path = require('path');
var tokenizer = new natural.WordTokenizer();
var admin='html.txt';
var target='bootstrap.txt';
var dataA;
var dataT;
var tokenArrayA=[];
var tokenArrayT=[];
var wordH=0;
var wordB=0;
var score=200;

//variables for pos tagger
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
 
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);




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
var hRead=fs.readFileSync('htmlKeys.txt','utf8');
wordH=(tokenizer.tokenize(hRead)).length;
var tokenhKeys=tokenizer.tokenize(hRead);
var bRead=fs.readFileSync('bootstrapKeys.txt','utf8');
wordB=(tokenizer.tokenize(bRead)).length;
var tokenbKeys=tokenizer.tokenize(bRead);

//function for getting various parameter of document
var docBreak = function(file,obj,data){
  //reading file
  var text= fs.readFileSync(file,'utf8');

  var json=tagger.tag(tokenizer.tokenize(text));

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
  obj.wordcount=(tokenizer.tokenize(text)).length;
  //counting nouns
  var count=0;
  for(i=0;i<obj.wordcount;i++){
    if(json[i][1]=='NN'||json[i][1]=='NNP'||json[i][1]=='NNPS'||json[i][1]=='NNS')
      count++;    
  }
  obj.nounsCount=count;

  //counting verbs
  var count=0;
  for(i=0;i<obj.wordcount;i++){
    if(json[i][1]=='VB'||json[i][1]=='VBD'||json[i][1]=='VBG'||json[i][1]=='VBP'||json[i][1]=='VBN'||json[i][1]=='VBZ')
      count++;    
  }
  obj.verbCount=count;

  //counting adjectives
  var count=0;
  for(i=0;i<obj.wordcount;i++){
    if(json[i][1]=='JJ'||json[i][1]=='JJR'||json[i][1]=='JJS')
      count++;    
  }
  obj.adjCount=count;

}

//calling target and base file functions 
docBreak(admin,adminData,"A");
docBreak(target,targetData,"T");

//function for calculating the total keys used in document
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

  //calculating %age of nouns
  adminData.nounPercA=parseInt((adminData.nounsCount/adminData.wordcount)*100);
  targetData.nounPercT=parseInt((targetData.nounsCount/targetData.wordcount)*100);

  //calculating %age of adjectives
  adminData.adjPercA=parseInt((adminData.adjCount/adminData.wordcount)*100);
  targetData.adjPercT=parseInt((targetData.adjCount/targetData.wordcount)*100);

  //calculating %age of verbs
  adminData.verbPercA=parseInt((adminData.verbCount/adminData.wordcount)*100);
  targetData.verbPercT=parseInt((targetData.verbCount/targetData.wordcount)*100);

  //calculating string matching
  compData.stringMatch=parseInt((natural.JaroWinklerDistance(dataA,dataT))*100);

   //calculating %age of keywords used
   compData.adminhPerc=percKeys(tokenhKeys,tokenArrayA,wordH);
   compData.adminbPerc=percKeys(tokenbKeys,tokenArrayA,wordB);
   compData.targethPerc=percKeys(tokenhKeys,tokenArrayT,wordH);
   compData.targetbPerc=percKeys(tokenbKeys,tokenArrayT,wordB);

   //Checking the file type
   if(targetData.extT!=adminData.extA){
    finalResults.finalData.docType.msg="File rejected:wrong file extension";
   }else{
    finalResults.finalData.docType.msg="File Accepted:Good to go";
   }

   //Checking word count
   var dif=parseInt((adminData.wordcount-targetData.wordcount)/100);
   dif=(dif<0) ? dif * -1 : dif;
   score=score-dif;

   if((targetData.wordcount>parseInt((adminData.wordcount*80)/100)) && (targetData.wordcount<parseInt((adminData.wordcount*120)/100))){
    finalResults.finalData.docWord.msg="The target file is within the allowed range";
   }else{
    finalResults.finalData.docWord.msg="The target file is not within the allowed range";
   }

   //Checking string similarity
   var x=compData.stringMatch;
   finalResults.finalData.docSim.val=x;
   score=score-(100-x);

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
   score=score-y;

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
  var lit=(z< 0) ? z * -1 : z;
  score=score-lit;

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
    finalScore:score,
    adminLitT:(adminData.nounPercA+adminData.verbPercA+adminData.adjPercA),
    targetLitT:(targetData.nounPercT+targetData.verbPercT+targetData.adjPercT),
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





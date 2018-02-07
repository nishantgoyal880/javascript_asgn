var textract = require('textract');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var wordcount = require('wordcount');
var WordPOS = require('wordpos');
wordpos = new WordPOS();
var countT=new Array(5);
var countA=new Array(5);
var i;
var totalWordsT=0;
var totalWordsA=0;

function init(count){
for(i=0;i<5;i++){
  count[i]=0;
  }
}
//initializing arrays
init(countA);
init(countT);

var myFirstPromise = new Promise((resolve, reject) => {
                  //reading file
                  textract.fromFileWithPath('html.docx',{preserveLineBreaks:true},function(error,text){
                    if (error) {
                      console.log(error);
                    } else {
                      //counting word
                      totalWordsA=wordcount(text);
                      //counting nouns
                      wordpos.getNouns(text, function(result){
                      countA[0]=result.length;
                      });
                      //counting adjectives
                      wordpos.getAdjectives(text, function(result){
                      countA[1]=result.length;
                      });
                      //counting verbs
                      wordpos.getVerbs(text, function(result){
                      countA[2]=result.length;
                      });
                      //counting adverbs
                      wordpos.getAdverbs(text, function(result){
                      countA[3]=result.length;
                      });
                    }
                  });
                resolve("success");
          });

myFirstPromise.then((successMessage) => {
  console.log("creating report from Admin Document");
});

var mySecondPromise = new Promise((resolve, reject) => {
                  //reading file
                  textract.fromFileWithPath('html.docx',{preserveLineBreaks:true},function(error,text){
                    if (error) {
                      console.log(error);
                    } else {
                      //counting word
                      totalWordsT=wordcount(text);
                      //counting nouns
                      wordpos.getNouns(text, function(result){
                      countT[0]=result.length;
                      });
                      //counting adjectives
                      wordpos.getAdjectives(text, function(result){
                      countT[1]=result.length;
                      });
                      //counting verbs
                      wordpos.getVerbs(text, function(result){
                      countT[2]=result.length;
                      });
                      //counting adverbs
                      wordpos.getAdverbs(text, function(result){
                      countT[3]=result.length;
                      });
                    }
                  });
                resolve("success");
          });

mySecondPromise.then((successMessage) => {
  console.log("creating report from Target Document");
});

var myThirdPromise = new Promise((resolve, reject) => {
        resolve("success");
});
myThirdPromise.then((successMessage) => {
var score=200;
if(totalWordsT>1500){
  

}else{
  console.log("Document word count is less therefore rejected");
}
console.log("--------------Analysis completed-----------");
});

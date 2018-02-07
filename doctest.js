var textract = require('textract');
//var natural = require('natural');
var wordcount = require('wordcount');
var WordPOS = require('wordpos');
wordpos = new WordPOS();
var countT=new Array(6);
var countA=new Array(6);
var i;

function init(count){
  for(i=0;i<6;i++){
    count[i]=0;
  }
}
//initializing arrays
init(countA);
init(countT);

           var docBreak = function(file,count){
             return new Promise(function(resolve,reject){
              //reading file
              textract.fromFileWithPath(file,{preserveLineBreaks:true},function(error,text){
                if (error){
                  console.log(error);
                }else{
                      //counting word
                      count[0]=wordcount(text);
                      //counting nouns
                      wordpos.getNouns(text, function(result){
                      count[1]=result.length;
                      });
                      //counting adjectives
                      wordpos.getAdjectives(text, function(result){
                      count[2]=result.length;
                      });
                      //counting verbs
                      wordpos.getVerbs(text, function(result){
                      count[3]=result.length;
                      });
                      //counting adverbs
                      wordpos.getAdverbs(text, function(result){
                      count[4]=result.length;
                      });
                    }
                    setTimeout(function(){
    		      		resolve("Success!"); 
                 		}, 250);
                  });                
              });
            }
   
        Promise.all([docBreak('html.docx',countA),docBreak('bootstrap.docx',countT)]).then(function(){
        	var score=200;
        	var wordPerc= parseInt((countA[0]-countT[0])/countA[0]*100);
        	var wordPerc = (wordPerc < 0) ? wordPerc * -1 : wordPerc;
        	
        	var nounPerc=parseInt((countA[1]-countT[1])/countA[1]*100);
        	var nounPerc = (nounPerc < 0) ? nounPerc * -1 : nounPerc;
        	
        	var adjPerc=parseInt((countA[2]-countT[2])/countA[2]*100);
        	var adjPerc = (adjPerc < 0) ? adjPerc * -1 : adjPerc;
        	
        	var verbPerc=parseInt((countA[3]-countT[3])/countA[3]*100);
        	var verbPerc = (verbPerc < 0) ? verbPerc * -1 : verbPerc;
        	
        	var adPerc=parseInt((countA[4]-countT[4])/countA[4]*100);
        	var adPerc = (adPerc < 0) ? adPerc * -1 : adPerc;
        	
        	var average=(wordPerc+nounPerc+adPerc+adjPerc+verbPerc)/5;

    		if(countT[0]>1500 && countT[0]<5000){
    			score=score-wordPerc;
    			score=score-nounPerc;


    		console.log('The overall score of target document with respect to admin document is '+score+" out of 200");
    		console.log("");
    		}else{
    		console.log("Document word count is less therefore rejected");
  			}
  			console.log("The overall percentage of document in terms of literature is "+average+" %");
  			console.log("");
  			console.log("-------------Analysis completed-----------");
        });

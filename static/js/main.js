const currentDisplay = document.querySelector('#display #current');
const operationDisplay = document.querySelector('#display #operation')
const DEFAULT_CHARACTER = '0';
const EQUALS_CHARACTER = '=';
var doingOperation = false;
var resetNumber = false;
var operationComplete = false;

function init(){
    currentDisplay.textContent = DEFAULT_CHARACTER;
    document.querySelectorAll('.number').forEach((button)=>{
        button.addEventListener('click',()=>{
            if(resetNumber || operationComplete){
                currentDisplay.textContent = button.textContent;
                if(resetNumber){
                    resetNumber = false;
                }
                if(operationComplete){
                    operationDisplay.textContent = '';
                    operationComplete = false;
                }
            }
            else{
                writeNumberToDisplay(button.textContent)
            }
        })
    })    
    document.querySelectorAll('.operator').forEach((button)=>{
        button.addEventListener('click',()=>{
            if(!doingOperation){
                operationDisplay.textContent=currentDisplay.textContent+button.textContent;
                doingOperation = true;
                resetNumber = true;
            }
            else{
                operationDisplay.textContent = replaceCharacter(operationDisplay.textContent,
                                                    operationDisplay.textContent.length-1,
                                                    button.textContent)
            }
        })
    })
    document.querySelector('#btn-delete').addEventListener('click',()=>{
        if(currentDisplay.textContent.length > 1)
            currentDisplay.textContent = currentDisplay.textContent.slice(0,currentDisplay.textContent.length-1);
        else
            currentDisplay.textContent = DEFAULT_CHARACTER;
    })
    document.querySelector('#btn-result').addEventListener('click',()=>{
        if(operationDisplay.textContent.includes(EQUALS_CHARACTER)){
            replaceFirstOperationNumber(currentDisplay.textContent);
        }
        result = computeResult();
        operationDisplay.textContent += currentDisplay.textContent + EQUALS_CHARACTER;
        currentDisplay.textContent = result;
        doingOperation = false;
        operationComplete = true;
    })

}

function findOperationIndex(){
    for(var i = 0; i < operationDisplay.textContent.length; i++){
        if(isNaN(operationDisplay.textContent.charAt(i)))
            return i;
    }
    return -1;
}

function replaceFirstOperationNumber(numberToReplaceWith){
    operationIndex = findOperationIndex();
    operationDisplay.textContent = numberToReplaceWith + operationDisplay.textContent.slice(operationIndex)
}

function computeResult(){
    if(operationDisplay.textContent.slice(-1) == EQUALS_CHARACTER)
        return eval(operationDisplay.textContent.slice(0,-1));
    number1 = operationDisplay.textContent.slice(0,operationDisplay.textContent.length-1);
    number2 = currentDisplay.textContent;
    operation = operationDisplay.textContent.charAt(operationDisplay.textContent.length-1);
    return eval(`${number1}${operation}${number2}`);
}

function writeNumberToDisplay(numberToAppend){
    if(currentDisplay.textContent == DEFAULT_CHARACTER)
        currentDisplay.textContent = numberToAppend;
    else
        currentDisplay.textContent += numberToAppend;
}

function replaceCharacter(string, index, replacement) {
    return (
      string.slice(0, index) +
      replacement +
      string.slice(index + replacement.length)
    );
  }
  



window.addEventListener('load',init);


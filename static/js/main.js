const currentDisplay = document.querySelector('#display #current');
const operationDisplay = document.querySelector('#display #operation')
const displayParent = document.querySelector('#display');
const DEFAULT_CHARACTER = '0';
const EQUALS_CHARACTER = '=';
const DECIMAL_CHARACTER = '.';
const DECREASE_FONT_AMOUNT = '10';
var doingOperation = false;
var resetCurrentDisplay = false;
var operationCompleted = false;
var operations = ['/','*','-','+'];
var currentDisplayFontSize = parseFloat(window.getComputedStyle(currentDisplay).getPropertyValue('font-size'));
var operationDisplayFontSize =  parseFloat(window.getComputedStyle(operationDisplay).getPropertyValue('font-size'));


function init(){
    currentDisplay.textContent = DEFAULT_CHARACTER;
    
    document.querySelectorAll('.number').forEach((button)=>{
        button.addEventListener('click',()=>{
            if(resetCurrentDisplay || operationCompleted){
                currentDisplay.textContent = button.textContent;
                if(resetCurrentDisplay){
                    resetCurrentDisplay = false;
                }
                if(operationCompleted){
                    operationDisplay.textContent = '';
                    operationCompleted = false;
                }
            }
            else{
                writeNumberToDisplay(button.textContent)
            }
        })
    })    
    document.querySelectorAll('.operator').forEach((button)=>{
        button.addEventListener('click',()=>{
            if(operationCompleted){
                operationDisplay.textContent = currentDisplay.textContent;
                operationCompleted = false;
            }
            if(!doingOperation){
                operationDisplay.textContent=currentDisplay.textContent+button.textContent;
                doingOperation = true;
                resetCurrentDisplay = true;
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
        if(currentDisplay.textContent.charAt(currentDisplay.textContent.length-1) == DECIMAL_CHARACTER)
            currentDisplay.textContent = currentDisplay.textContent.slice(0,-1);
        result = computeResult();
        if(result == "Infinity"){
            alert('Invalid operation or number out of range');
            return;
        }
        if(!operationCompleted)
        {
            operationDisplay.textContent += currentDisplay.textContent + EQUALS_CHARACTER;
            operationCompleted = true;
        }
        currentDisplay.textContent = result;
        doingOperation = false;
        resetCurrentDisplay = true;
    })
    document.querySelector('#btn-clear-partial').addEventListener('click',()=>{
        if(operationCompleted){
            resetAll();
        }
        else{
            currentDisplay.textContent = DEFAULT_CHARACTER;
        }
    })
    document.querySelector('#btn-clear-all').addEventListener('click',resetAll)
    document.querySelector('#btn-change-sign').addEventListener('click',()=>{
        currentDisplay.textContent = -1 * parseInt(currentDisplay.textContent); 
    })
    document.querySelector('#btn-decimal').addEventListener('click',()=>{
        if(!currentDisplay.textContent.includes(DECIMAL_CHARACTER))
            currentDisplay.textContent += DECIMAL_CHARACTER;
    })
    document.querySelectorAll('.btn').forEach((button)=>{
        button.addEventListener('click',()=>{
            [[currentDisplay, currentDisplayFontSize], [operationDisplay, operationDisplayFontSize]].forEach((element) => {
                let display = element[0];
                let defaultFontSize = element[1];
                let displayWidth = parseFloat(window.getComputedStyle(displayParent).getPropertyValue('width'));
                let elementWidth = parseFloat(window.getComputedStyle(display).getPropertyValue('width'));
                let elementFontSize = parseFloat(window.getComputedStyle(display).getPropertyValue('font-size'));
                let newFont = (displayWidth / elementWidth) * elementFontSize;
                if (newFont <= defaultFontSize)
                    display.style.fontSize = `${newFont}px`;
                
            })
            
        })
    })
}

function resetAll(){
    currentDisplay.textContent = DEFAULT_CHARACTER;
    operationDisplay.textContent = '';
    operationCompleted = false;
    resetCurrentDisplay = false;
    doingOperation = false;
}

function findOperationIndex(){
    operationsIndexes = []
    for(let i = 0; i < operationDisplay.textContent.length; i++){
        if(operations.indexOf(operationDisplay.textContent.charAt(i)) != -1)
            operationsIndexes.push(i);
    }
    if(operationsIndexes.length > 1)
        return operationsIndexes[1];
    else 
        return operationsIndexes[0];
}

function replaceFirstOperationNumber(numberToReplaceWith){
    operationIndex = findOperationIndex();
    operationDisplay.textContent = numberToReplaceWith + operationDisplay.textContent.slice(operationIndex)
}

function computeResult(){
    if(operationCompleted){
        replaceFirstOperationNumber(currentDisplay.textContent);
        return eval(operationDisplay.textContent.slice(0,-1));
    }
    return eval(operationDisplay.textContent+currentDisplay.textContent);
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


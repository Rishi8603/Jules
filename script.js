const display = document.getElementById('display');
let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }

    // Prevent multiple leading zeros
    if (display.value === '0' && value === '0') return;
    // If display is '0' and a non-zero number is pressed, replace '0'
    if (display.value === '0' && value !== '0' && !isOperator(value) && value !== '.') {
        display.value = value;
        currentOperand = display.value;
        return;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && display.value.includes('.')) return;

    // Handle operator input
    if (isOperator(value)) {
        if (currentOperand === '' && previousOperand === '') return; // No first operand
        if (currentOperand === '' && isOperator(previousOperand.slice(-1))) { // Allows changing operator
             previousOperand = previousOperand.slice(0, -1) + value;
             display.value = previousOperand;
             operation = value;
             return;
        }
        if (operation && currentOperand !== '') {
            calculateResult(); // Calculate intermediate result if there's a pending operation
        }
        operation = value;
        previousOperand = display.value;
        shouldResetDisplay = true;
        currentOperand = ''; // Reset current operand for next input
    } else { // Handle number input
        if (shouldResetDisplay) { // If an operator was just pressed
            display.value = value;
            shouldResetDisplay = false;
        } else {
            display.value += value;
        }
        currentOperand = display.value;
    }
}

function isOperator(value) {
    return value === '+' || value === '-' || value === '*' || value === '/';
}

function clearDisplay() {
    display.value = '0'; // Show '0' when cleared
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    shouldResetDisplay = false;
}

function calculateResult() {
    if (operation == null || previousOperand === '' || display.value === '') {
        // If display.value is empty and an op was chosen, it means the user hit = after an op.
        // Or, if the user just typed a number and hit =, do nothing.
        if (operation && display.value === '' && currentOperand === '') {
             // if user types "5 * =" then treat it as "5 * 5"
             currentOperand = previousOperand;
             display.value = currentOperand;
        } else if (!operation) {
            return; // Nothing to calculate if no operation is set
        } else {
            // If there's an operation but no second operand yet, do nothing or handle as per calculator logic
            // For now, we just return if currentOperand (second number) is not ready.
            if(currentOperand === '') return;
        }
    }

    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand); // currentOperand is the second number here

    if (isNaN(prev) || isNaN(current)) {
        // This can happen if previousOperand was just an operator or something went wrong
        display.value = "Error";
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
        shouldResetDisplay = true;
        return;
    }

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = "Error";
                currentOperand = '';
                previousOperand = '';
                operation = undefined;
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    display.value = result.toString();
    previousOperand = result.toString(); // The result becomes the new previousOperand for chaining
    operation = undefined; // Clear the operation
    currentOperand = ''; // Reset current operand, next number will be new
    shouldResetDisplay = true; // Next number input should clear the display
}

// Initialize display
clearDisplay();

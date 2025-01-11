const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function roundResult(result) {
    return Math.round(result * 10000000000) / 10000000000;
}

function backspace() {
    const { displayValue } = calculator;
    calculator.displayValue = displayValue.slice(0, -1) || '0';
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => roundResult(firstOperand / secondOperand),
    '*': (firstOperand, secondOperand) => roundResult(firstOperand * secondOperand),
    '+': (firstOperand, secondOperand) => roundResult(firstOperand + secondOperand),
    '-': (firstOperand, secondOperand) => roundResult(firstOperand - secondOperand),
    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('backspace')) {
        backspace();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Map keyboard keys to calculator buttons
    if (key >= '0' && key <= '9') {
        inputDigit(key);
        updateDisplay();
    } else if (key === '.') {
        inputDecimal(key);
        updateDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        handleOperator('=');
        updateDisplay();
    } else if (key === 'Backspace') {
        backspace();
        updateDisplay();
    }
});
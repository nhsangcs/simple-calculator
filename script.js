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

function calculateSquare() {
    calculator.displayValue = String(Math.pow(parseFloat(calculator.displayValue), 2));
}

function calculateSin() {
    calculator.displayValue = String(Math.sin(parseFloat(calculator.displayValue)));
}

function calculateCos() {
    calculator.displayValue = String(Math.cos(parseFloat(calculator.displayValue)));
}

function calculateTan() {
    calculator.displayValue = String(Math.tan(parseFloat(calculator.displayValue)));
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

    if (target.classList.contains('function')) {
        switch (target.value) {
            case 'square':
                calculateSquare();
                break;
            case 'sin':
                calculateSin();
                break;
            case 'cos':
                calculateCos();
                break;
            case 'tan':
                calculateTan();
                break;
        }
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
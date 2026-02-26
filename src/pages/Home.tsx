import React, { useState, useCallback } from 'react';

// Calculator state interface
interface CalculatorState {
  displayValue: string;
  firstOperand: number | null;
  operator: string | null;
  waitingForSecondOperand: boolean;
}

const performCalculation = (
  firstOperand: number,
  secondOperand: number,
  operator: string
): number | string => {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '*':
      return firstOperand * secondOperand;
    case '/':
      if (secondOperand === 0) return 'Error'; // Division by zero
      return firstOperand / secondOperand;
    default:
      return secondOperand; // Should not typically be reached with valid operators
  }
};

export default function Home() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
  });

  const inputDigit = useCallback((digit: string) => {
    setCalculatorState((prevState) => {
      const { displayValue, waitingForSecondOperand } = prevState;
      if (displayValue === 'Error') return prevState; // Cannot input digit after an error

      if (waitingForSecondOperand) {
        return {
          ...prevState,
          displayValue: digit,
          waitingForSecondOperand: false,
        };
      } else {
        // Prevent leading zeros unless it's just '0'
        return {
          ...prevState,
          displayValue: displayValue === '0' && digit !== '.' ? digit : displayValue + digit,
        };
      }
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setCalculatorState((prevState) => {
      const { displayValue, waitingForSecondOperand } = prevState;
      if (displayValue === 'Error') return prevState;

      if (waitingForSecondOperand) {
        return {
          ...prevState,
          displayValue: '0.',
          waitingForSecondOperand: false,
        };
      } else if (!displayValue.includes('.')) {
        return {
          ...prevState,
          displayValue: displayValue + '.',
        };
      }
      return prevState; // No change if decimal already exists
    });
  }, []);

  const handleOperator = useCallback((nextOperator: string) => {
    setCalculatorState((prevState) => {
      let { displayValue, firstOperand, operator, waitingForSecondOperand } = prevState;
      if (displayValue === 'Error' && nextOperator !== 'AC') return prevState; // Only AC can clear an error

      const inputValue = parseFloat(displayValue);

      if (firstOperand === null && !isNaN(inputValue)) { // First operand not set yet
        return {
          ...prevState,
          firstOperand: inputValue,
          operator: nextOperator === '=' ? null : nextOperator, // Don't set '=' as an ongoing operator
          waitingForSecondOperand: true,
        };
      } else if (operator && !waitingForSecondOperand) { // Chaining operations or pressing '='
        let result: number | string = performCalculation(firstOperand!, inputValue, operator);
        let newDisplayValue = typeof result === 'number'
          ? String(parseFloat(result.toFixed(10))) // Limit floating point errors, then remove trailing zeros
          : String(result);

        if (newDisplayValue === 'Error') {
            return {
                displayValue: 'Error',
                firstOperand: null,
                operator: null,
                waitingForSecondOperand: true,
            };
        }

        if (nextOperator === '=') {
          return {
            displayValue: newDisplayValue,
            firstOperand: null,
            operator: null,
            waitingForSecondOperand: true,
          };
        } else {
          return {
            displayValue: newDisplayValue,
            firstOperand: parseFloat(newDisplayValue),
            operator: nextOperator,
            waitingForSecondOperand: true,
          };
        }
      }

      // If an operator is pressed immediately after another operator (e.g., 5 + * -> 5 * )
      // or if waitingForSecondOperand is true and a new operator is pressed (e.g., 5 + 3 + -> 8 +)
      // This ensures the operator is updated correctly.
      if (waitingForSecondOperand && nextOperator !== '=') {
        return {
          ...prevState,
          operator: nextOperator,
        };
      }

      return prevState; // No effective change
    });
  }, []);

  const clearAll = useCallback(() => {
    setCalculatorState({
      displayValue: '0',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false,
    });
  }, []);

  const toggleSign = useCallback(() => {
    setCalculatorState((prevState) => {
      const { displayValue } = prevState;
      if (displayValue === '0' || displayValue === 'Error') return prevState;
      const newValue = parseFloat(displayValue) * -1;
      return {
        ...prevState,
        displayValue: String(newValue),
      };
    });
  }, []);

  const inputPercent = useCallback(() => {
    setCalculatorState((prevState) => {
      const { displayValue } = prevState;
      if (displayValue === '0' || displayValue === 'Error') return prevState;
      const currentValue = parseFloat(displayValue);
      const percentValue = currentValue / 100;
      return {
        ...prevState,
        displayValue: String(percentValue),
      };
    });
  }, []);

  // Determine display font size dynamically based on displayValue length
  let displayFontSize = 'text-5xl';
  if (calculatorState.displayValue.length > 9) {
    displayFontSize = 'text-4xl';
  }
  if (calculatorState.displayValue.length > 13) {
    displayFontSize = 'text-3xl';
  }
  if (calculatorState.displayValue.length > 18) {
    displayFontSize = 'text-2xl';
  }

  // Helper for rendering buttons with common styles
  const createButton = (label: string, className: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-2xl p-4 text-2xl font-semibold
        bg-zinc-700 text-white shadow-lg shadow-zinc-950/50
        hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]
        transition-all duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-800
        ${className}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4 font-sans text-gray-100">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-gray-800 to-gray-700 p-6 shadow-2xl shadow-black/70 ring-2 ring-gray-600">
        {/* Calculator Display */}
        <div
          className={`
            mb-6 h-24 flex items-end justify-end overflow-hidden rounded-2xl
            bg-zinc-900 p-4 text-right font-light text-lime-400
            shadow-inner shadow-zinc-950 ring-1 ring-zinc-700
          `}
        >
          <p className={`${displayFontSize} leading-none truncate max-w-full tracking-tight`}>
            {calculatorState.displayValue}
          </p>
        </div>

        {/* Calculator Buttons Grid */}
        <div className="grid grid-cols-4 gap-4">
          {createButton('AC', 'col-span-1 bg-zinc-600 hover:brightness-125 text-zinc-200', clearAll)}
          {createButton('+/-', 'bg-zinc-600 hover:brightness-125 text-zinc-200', toggleSign)}
          {createButton('%', 'bg-zinc-600 hover:brightness-125 text-zinc-200', inputPercent)}
          {createButton('÷', 'bg-amber-500 hover:brightness-110 active:scale-[0.97] focus:ring-amber-400', () => handleOperator('/'))}

          {createButton('7', '', () => inputDigit('7'))}
          {createButton('8', '', () => inputDigit('8'))}
          {createButton('9', '', () => inputDigit('9'))}
          {createButton('×', 'bg-amber-500 hover:brightness-110 active:scale-[0.97] focus:ring-amber-400', () => handleOperator('*'))}

          {createButton('4', '', () => inputDigit('4'))}
          {createButton('5', '', () => inputDigit('5'))}
          {createButton('6', '', () => inputDigit('6'))}
          {createButton('−', 'bg-amber-500 hover:brightness-110 active:scale-[0.97] focus:ring-amber-400', () => handleOperator('-'))}

          {createButton('1', '', () => inputDigit('1'))}
          {createButton('2', '', () => inputDigit('2'))}
          {createButton('3', '', () => inputDigit('3'))}
          {createButton('+', 'bg-amber-500 hover:brightness-110 active:scale-[0.97] focus:ring-amber-400', () => handleOperator('+'))}

          {createButton('0', 'col-span-2', () => inputDigit('0'))}
          {createButton('.', '', inputDecimal)}
          {createButton('=', 'bg-blue-600 hover:brightness-110 active:scale-[0.97] focus:ring-blue-500', () => handleOperator('='))}
        </div>
      </div>
    </div>
  );
}
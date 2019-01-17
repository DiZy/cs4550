(function() {	
	var OPERATIONS = {
		ADD: 'add',
		MUL: 'mul',
		DIV: 'div',
		SUB: 'sub'
	};

	var total = '0';
	var curOp = null;
	var second = '';
	var opCompleted = true;

	function updateDisplay(value) {
		document.getElementById('value').innerHTML  = value;
	}

	function equals() {
		if(second === '') {
			curOp = OPERATIONS.ADD;
			opCompleted = false;
			return;
		}
		
		total = parseFloat(total);
		second = parseFloat(second);

		if(curOp === OPERATIONS.ADD) {
			total = total + second;
		} else if (curOp === OPERATIONS.SUB) {
			total = total - second;
		} else if (curOp === OPERATIONS.MUL) {
			total = total * second;
		} else if (curOp === OPERATIONS.DIV) {
			total = total / second;
		}

		updateDisplay(total);
		second = '';
		curOp = null;
		opCompleted = true;
	}

	function numberInput(x) {
		if (opCompleted === true) {
			total = x;
			updateDisplay(total);
		} else if(curOp === null) { 
			total = '' + total + x;
			updateDisplay(total);
		} else {
			second = second + x;
			updateDisplay(second);
		}
		opCompleted = false;
	}

	function opInput(op) {
		if(op == OPERATIONS.ADD) {
			equals();
		} else {
			curOp = op;
			opCompleted = false;
		}
	}

	function clear() {
		second = '';
		curOp = null;
		total = '0';
		opCompleted = true;
		updateDisplay(total);
	}

	document.addEventListener('DOMContentLoaded', function() {
		Array.prototype.forEach.call(document.getElementsByClassName('number-button'), function(button) {
			button.addEventListener('click', function() {
				numberInput(this.innerHTML);
			});
		});

		Array.prototype.forEach.call(document.getElementsByClassName('op-button'), function(button) {
			button.addEventListener('click', function() {
				opInput(this.id);
			});
		});

		document.getElementById('clear').addEventListener('click', clear);
	});
})();

import { useRef, useImperativeHandle } from 'react';
import './promptBar.css';


function PromptBar({ onRequest, onClear, ref }) {
	const inputRef = useRef(null);
	const btnAskRef = useRef(null);
	const btnClearRef = useRef(null);

	useImperativeHandle(ref, () => ({
		toggleButtons(disable=true) {
			btnAskRef.current.disable = disable;
			btnClearRef.current.disable = disable;
		}
	}));

	function handleAskButtonClick(ev) {
		const request = inputRef.current.value;

		ref.current.toggleButtons();
		onRequest(request.trim());
		inputRef.current.value = "";
	}

	function handleClearButtonClick(ev) {
		ev.preventDefault();

		ref.current.toggleButtons();
		inputRef.current.value = "";
		onClear();
	}

  return (
    <div className="input-bar">
			<input id="request" ref={inputRef} type="text" placeholder="Where do you want to go?" autoComplete="off" autoFocus />
			<button ref={btnAskRef} id="btn-ask" name="action" className="btn-ask" onClick={handleAskButtonClick}>
				<span className='btn-icon'></span>
				Ask
			</button>
			<button ref={btnClearRef} id="btn-clear" name="action" className="btn-clear" onClick={handleClearButtonClick}>
				<span className='btn-icon'></span>
				Clear
			</button>
    </div>
  )
}

export default PromptBar

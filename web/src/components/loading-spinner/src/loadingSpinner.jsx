import './loadingSpinner.css';
import { useState, useRef, useImperativeHandle } from 'react';

function LoadingSpinner({ ref }) {
	const overlayRef = useRef(null);
	const [spinnerText, setSpinnerText] = useState("");

	useImperativeHandle(ref, () => ({
    display(show=true, loadingText="") {
			setSpinnerText(_ => loadingText);
			if (show) {
				overlayRef.current.classList.add('active');
			} else {
				overlayRef.current.classList.remove('active');
			}
		}
  }));

  return (
		<div ref={overlayRef} className="loading-overlay" id="loading-overlay">
			<div className="loading-content">
				<span className="loading-compass"></span>
				<span className="loading-text" id="loading-text">{spinnerText}</span>
			</div>
		</div>
  )
}

export default LoadingSpinner

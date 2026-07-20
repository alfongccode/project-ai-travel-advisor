import { useRef, useEffect } from 'react';
import './journal.css';

function Journal({ context=[] }) {
	const chatContainerRef = useRef(null);

	useEffect(() => {
		chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}, [context]);

  return (
    <div className="journal">
			<div className="journal-page">
				<div className="journal-header">
					<h1>Travel Journal</h1>
					<span className="entry-number">Entry Nº { context.length }</span>
				</div>

				<div ref={chatContainerRef} className="chat-container" id="chat-container">
						{!context.length && <div className="empty-state">✦ Your next adventure starts with a question ✦</div>}
						{context.map((entry, index) => 
							<div key={index} className="log-entry ${entry.role}">
									<label className="entry-label">
											— {entry.role === "user" ? "Explorer" : "Guide"}
									</label>
									<div className="entry-text">{entry.content}</div>
							</div>)}
				</div>
			</div>
    </div>
  )
}

export default Journal

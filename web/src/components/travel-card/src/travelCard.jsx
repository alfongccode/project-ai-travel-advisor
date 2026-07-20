import './travelCard.css';

function TravelCard({ data = {} }) {
  return (
		<div className="response-card">
				<span className="response-stamp">✦ Itinerary Filed ✦</span>
				<h1 className="response-title">{data.trip_title}</h1>
				<p className="response-summary">{data.trip_summary}</p>

				<div className="response-section">
						<span className="response-label">Itinerary</span>
						<p className="response-text">{data.itinerary}</p>
				</div>

				<div className="response-section">
						<span className="response-label">Travel Tips</span>
						<p className="response-text">{data.travel_tips}</p>
				</div>

				<div className="response-footer">
						<span className="response-label">Estimated Cost</span>
						<span className="response-cost">{data.estimated_budget?.amount} {data.estimated_budget?.currency}</span>
				</div>
				<img class="response-img" src={`data:image/jpeg;base64,${data.itineraryMap}`} alt="Travel itinerary"/>
		</div>
  )
}

export default TravelCard

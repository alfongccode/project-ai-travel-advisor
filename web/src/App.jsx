import { useState, useRef } from 'react'
import './App.css'
import Header from './components/header';
import Journal from './components/journal';
import PromptBar from './components/prompt-bar';
import TravelCard from './components/travel-card';
import providers from './providers';
import LoadingSpinner from './components/loading-spinner';
import PolaroidGallery from './components/polaroid-gallery/src/polaroidGallery';

const RESPONSE_STATUS = {
    MISSING_INFO: "missing_info",
    COMPLETE: "complete"
};

function App() {
  const [context, setContext] = useState([]);
  const [travelData, setTravelData] = useState({});
  const [photographs, setPhotographs] = useState([]);
  const loadingSpinnerRef = useRef(null);
  const promptBarRef = useRef(null);

  function handlePromptRequest(request) {
    let answer = {}
    const updatedContext = [];

    loadingSpinnerRef.current.display(true, "Asking the Guide…");
    return providers.promptUserRequest(request)
      .then(async response => {
        if (response.status === RESPONSE_STATUS.COMPLETE) {
          await providers.generateItineraryMap(response.itinerary)
            .then(itineraryMap => {
              setTravelData({
                ...response,
                itineraryMap: itineraryMap
              })})
            .catch(() => setTravelData({ ...response }));
          providers.getLocationImages(response.trip_location?.country, response.trip_location?.city)
            .then(images => setPhotographs(images));
        }
        return providers.getContextRecords()
            .then(records => setContext(records));
        })
      .finally(() => {
        loadingSpinnerRef.current.display(false);
        promptBarRef.current.toggleButtons(false);
      });
  }

  function handleContextClear() {
    loadingSpinnerRef.current.display(true, "Cleaning the journal…");
    return providers.clearContext()
      .then(_ => setContext([]))
      .finally(_ => {
        loadingSpinnerRef.current.display(false);
        promptBarRef.current.toggleButtons(false);
      });
  }

  return (
    <>
      <Header></Header>
      <Journal context={context}></Journal>
      {Object.keys(travelData).length !== 0 && <TravelCard data={travelData}></TravelCard>}
      <PolaroidGallery images={photographs}></PolaroidGallery>
      <PromptBar ref={promptBarRef} onRequest={handlePromptRequest} onClear={handleContextClear}></PromptBar>
      <p className="hint">✦ Press Enter to send your message to the guide ✦</p>
      <LoadingSpinner ref={loadingSpinnerRef}></LoadingSpinner>
    </>
  )
}

export default App

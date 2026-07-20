import conversationContext from './src/conversationContextRequest';
import promptUserRequest from './src/userRequest';
import getLocationImages from './src/searchImagesRequest';
import generateItineraryMap from './src/generateItineraryMapRequest';

export default {
    ...conversationContext,
    generateItineraryMap,
    getLocationImages,
    promptUserRequest
}
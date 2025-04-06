# Live Train Location of Finland website

This is a website that retrieves real-time train location (almost, as it is set to fetch every 10 seconds haha) from [DigiTraffic API](https://www.digitraffic.fi/en/) and it shows the location in the map. The website allows the user to search for trains with the train Number, display real-time in the marker popup while also showing the samne information in a side-bar which also displays extra information fetched from the train metadata.

## Features
1. **Real-time Train Location Updates**:
   - Fetches train location data from the DigiTraffic API and updates the map every 10 seconds.
2. **Interactive Map UI**:
   - Displays train locations on a map using `react-leaflet`.
3. **Search Functionality**:
   - Users can search for specific trains.
4. **Train Details Sidebar**:
   - Shows metadata, including speed, category, departure and destination information for selected trains.
5. **Automatic Data Refresh**:
   - Automatically fetches and updates train locations in the background

## Technologies Used
- **Frontend Framework**: React.js
- **Map Library**: React-Leaflet
- **API**: DigiTraffic Railway Traffic API
- **Styling**: Custom CSS
- **Other Libraries**:
  - `Leaflet` for marker icons
  - `useState` and `useEffect` hooks for state management
  - `useCallback` to optimize performance

## Setup Instructions
1. Clone this repository to your local machine:
   git clone https://github.com/FinnsquirolCentria/train-LiveLocation.git
2. Navigate to the project directory:
    cd trainLocation-map
3. Install necessary dependencies 
    npm install
4. Start the server:
    npm start
5. It will probably open the website automatically. If not, visit:
    http://localhost:3000 to use it

## API 
- Train Locations:
    - Endpoint: https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/
    - Data includes: train number, coordinates, speed, departure date, accuracy, timestamp. Data used: train number, coordinates and speed
- Train Metadata:
    - Endpoint: https://rata.digitraffic.fi/api/v1/trains/latest/{trainNumber}
    - Datata used: train Number, type, category, first and last row of the timetable to show the departure and destination details
- Hide API key:
    - The API is public for the current APIs, so it is not necessary to hide it as there are no keys.

## Future improvements
- Add information and markers for the stations

## Author
Diego Finnilä

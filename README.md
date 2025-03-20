# WeatherSphere 🌍

WeatherSphere is a React application that provides real-time weather information based on user input or geolocation. The app fetches weather data from the OpenWeatherMap API and displays it in a user-friendly interface.

## Features

- Search for weather by city name.
- Automatically fetch weather based on the user's geolocation.
- Display current weather conditions, temperature, humidity, wind speed, and visibility.
- Search history to quickly access previously searched cities.
- Toggle between Celsius and Fahrenheit temperature units.
- Animated weather icons for a visually appealing experience.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Umair001101/Weather_App-using-API.git
   cd weathersphere
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install react-animated-weather

   ```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   REACT_APP_API_KEY=your_api_key_here
   ```
   ### Note: Replace `your_api_key_here` with your actual OpenWeatherMap API key.

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

- Enter a city name in the input field and click "Search" to fetch the weather data.
- Click the 📍 button to get the weather for your current location.
- Use the unit toggle to switch between Celsius and Fahrenheit.
- View your search history and click on any city to quickly fetch its weather again.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


## Acknowledgments

- [OpenWeatherMap API](https://openweathermap.org/api) for providing weather data.
- [React](https://reactjs.org/) for building the user interface.

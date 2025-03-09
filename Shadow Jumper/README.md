# Shadow Jumper

A puzzle-platformer game where you control two characters simultaneously - one in the light world and one in the shadow world. The twist is that they move oppositely, and when one jumps, the other ducks!

## How to Play

1. Use the **LEFT/RIGHT** arrow keys to move both characters (they move in opposite directions)
2. Press **UP** to make the Light character jump (Shadow character will duck)
3. Press **DOWN** to make the Light character duck (Shadow character will jump)
4. Guide both characters to their respective goals without either of them falling or hitting obstacles

## Game Features

- Multiple levels with increasing difficulty
- Unique puzzle-platformer mechanics
- Simple and intuitive controls
- Responsive design that works on different screen sizes

## Running the Game

Simply open the `index.html` file in a web browser to play the game. No additional installation is required.

## Converting to Android App

To convert this web-based game to an Android app, you can use one of the following methods:

### Method 1: Using WebView (Recommended for beginners)

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Create a new Android project
3. Add a WebView component to your main activity layout
4. Load the HTML, CSS, and JavaScript files into the assets folder of your Android project
5. Configure the WebView to load the local HTML file and enable JavaScript
6. Build and export your app

### Method 2: Using Apache Cordova/PhoneGap

1. Install [Node.js](https://nodejs.org/)
2. Install Cordova: `npm install -g cordova`
3. Create a new Cordova project: `cordova create ShadowJumper`
4. Navigate to your project: `cd ShadowJumper`
5. Add Android platform: `cordova platform add android`
6. Copy your HTML, CSS, and JS files to the `www` folder
7. Build the Android app: `cordova build android`
8. The APK file will be generated in the `platforms/android/app/build/outputs/apk` directory

### Method 3: Using Capacitor

1. Install [Node.js](https://nodejs.org/)
2. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
3. Initialize Capacitor in your project: `npx cap init ShadowJumper`
4. Add Android platform: `npx cap add android`
5. Copy your web files to the `www` folder
6. Build and sync: `npx cap sync android`
7. Open in Android Studio: `npx cap open android`
8. Build and export your app from Android Studio

## Requirements

- Web browser with JavaScript enabled
- For Android conversion: Android Studio, Node.js (depending on method chosen)

## License

This game is provided as-is for educational and personal use.

## Credits

Created as a simple puzzle-platformer game concept using HTML, CSS, and JavaScript. 
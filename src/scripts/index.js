import '../styles/index.scss';
import Typr from 'typr.js'; // Library to load and parse the font files [TODO: link]
import MerriweatherStrong from '../../public/fonts/Merriweather-Black.ttf'; // Bold font
import MerriweatherMild from '../../public/fonts/Merriweather-Light.ttf';   // Light font
import { loadFont } from './utils';

////////////////
// Load fonts //
// 1.1. Load fonts as promises (see 'utils.js')
const fontStrongBuffer = loadFont(MerriweatherStrong);
const fontMildBuffer = loadFont(MerriweatherMild);
let fontStrong;
let fontMild;
////////////////

Promise.all([fontStrongBuffer, fontMildBuffer]).then(function(fonts) {
  // 1.1. We get the fonts as a ArrayBuffers ('fonts')
  // 2. Parse ArrayBuffers to get font objects
  fontStrong = Typr.parse(fonts[0]);
  fontMild = Typr.parse(fonts[1]);

  // 3. After we have the font objects
  //    we trigger the drawing function,
  //    which will print things on screen
  requestAnimationFrame(draw);
});

function draw() {
  console.log('fontStrong', fontStrong);
  console.log('fontMild', fontMild);
}
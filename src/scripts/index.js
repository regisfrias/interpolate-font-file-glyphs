import '../styles/index.scss';
import Typr from 'typr.js'; // Library to load and parse the font files [TODO: link]
import autosize from 'autosize';
import MerriweatherStrong from '../../public/fonts/Merriweather-Black.ttf'; // Bold font
import MerriweatherMild from '../../public/fonts/Merriweather-Light.ttf';   // Light font
import { loadFont, getDPR, layoutText } from './utils';

////////////////
// Load fonts //
// 1.1. Load fonts as promises (see 'utils.js')
const fontStrongBuffer = loadFont(MerriweatherStrong);
const fontMildBuffer = loadFont(MerriweatherMild);
let fontStrong;
let fontMild;
////////////////

//////////////
// Text box //
const canvas = document.querySelector(".text-box");
const sourceTextBox = document.querySelector(".text-source");
const textColor = window.getComputedStyle(sourceTextBox, null).color || '#000000';
let fontSize = window.getComputedStyle(sourceTextBox, null).fontSize.split('px')[0];
let sourceText = sourceTextBox.value; // The text to be rendered on the canvas
sourceTextBox.addEventListener('keyup', onKeyUp);
//////////////

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
  // Resize text source box to match content
  autosize(sourceTextBox);

  // 4. Set canvas width to match sourceTextBox
  canvas.width = Math.floor(sourceTextBox.offsetWidth*getDPR());
  canvas.height = Math.floor(sourceTextBox.offsetHeight*getDPR());

  // Get font size as rendered in sourceTextBox
  fontSize = window.getComputedStyle(sourceTextBox, null).fontSize.split('px')[0];

  // Set up canvas
  const scale = fontSize*getDPR() / fontStrong.head.unitsPerEm; // Typr.js uses sizes in 'em' unit
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // redraw on blank canvas every frame
  scaleCnv(canvas); // Set canvas size to the same as sourceTextBox based on device pixel ratio
  ctx.scale(scale,-scale); // Also scale the 2D context

  // 5. Lay out text based on the text box.
  //    The sourceText comes as a continuous string,
  //    so we need to break lines according to font size
  //    and amount of text.
  const laidoutText = layoutText(sourceText, fontStrong, scale, canvas.width);
  console.log('laidoutText', laidoutText);
}

function onKeyUp(evt) {
  sourceText = sourceTextBox.innerText; // Update sourceText with new text if there is any.
  requestAnimationFrame(draw);  // Update canvas.
}

function scaleCnv(canvas) {
  canvas.setAttribute("style", "width:"+(canvas.width/getDPR())+"px; height:"+(canvas.height/getDPR())+"px");
}
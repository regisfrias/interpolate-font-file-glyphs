import '../styles/index.scss';
import Typr from 'typr.js'; // Library to load and parse the font files [TODO: link]
import autosize from 'autosize';
import RobotoSlabBlack from '../../public/fonts/RobotoSlab-Black.ttf'; // Bold font
import RobotoSlabThin from '../../public/fonts/RobotoSlab-Thin.ttf';   // Thin font
import { loadFont, getDPR, layoutText, pathDiffs } from './utils';

////////////////
// Load fonts //
// 1.1. Load fonts as promises (see 'utils.js')
const fontStrongBuffer = loadFont(RobotoSlabBlack);
const fontMildBuffer = loadFont(RobotoSlabThin);
let fontStrong;
let fontMild;

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

//////////////
// Controls //
const thicknessControl = document.querySelector('.thickness-amount');
thicknessControl.addEventListener('input', onChangeThickness);
let thicknessAmount = parseFloat(thicknessControl.value); // How bold the type should be (0–1)
//////////////



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
  let tpath = {cmds:[], crds:[]};

  // 6. Loop through each line of laid out text.
  laidoutText.map( (txt, lineNumber ) => {
    // Get glyph IDs    
    const gls = Typr.U.stringToGlyphs(fontStrong, txt);

    // Initialise x
    let x = 0;

    for(var i=0; i<gls.length; i++) {
      var gid = gls[i];
      if(gid==-1) continue;

      var gid2 = (i<gls.length-1 && gls[i+1]!=-1)  ? gls[i+1] : 0;
      var path = Typr.U.glyphToPath(fontMild, gid);
      var pathStrong = Typr.U.glyphToPath(fontStrong, gid);
      const diffs = pathDiffs(path, pathStrong);

      for(var j=0; j<path.crds.length; j+=2) {
        const pointX = path.crds[j] + x;
        const pointXDiff = diffs.crds[j];
        const pointY = path.crds[j+1];
        const pointYDiff = diffs.crds[j+1];

        const coordX = pointX + (pointXDiff * thicknessAmount);
        const coordY = pointY + (pointYDiff * thicknessAmount) - ((lineNumber+0.75) * fontStrong.head.unitsPerEm);

        tpath.crds.push(coordX);
        tpath.crds.push(coordY);
      }

      for(var j=0; j<path.cmds.length; j++) tpath.cmds.push(path.cmds[j]);

      const diff = fontStrong.hmtx.aWidth[gid] - fontMild.hmtx.aWidth[gid];

      // Push letter to the right by the width of the glyph
      // Also compensate for font weight (if thin, this should be smaller)
      x += fontMild.hmtx.aWidth[gid] + (diff * thicknessAmount);

      if(i<gls.length-1) x += Typr.U.getPairAdjustment(fontStrong, gid, gid2);
    }
  });

  ctx.fillStyle = textColor;
  Typr.U.pathToContext(tpath, ctx);
  ctx.fill('evenodd');
}

function onKeyUp(evt) {
  sourceText = sourceTextBox.value; // Update sourceText with new text if there is any.
  requestAnimationFrame(draw);  // Update canvas.
}

function onChangeThickness(evt) {
  thicknessAmount = parseFloat(evt.target.value);
  requestAnimationFrame(draw);
}

function scaleCnv(canvas) {
  canvas.setAttribute("style", "width:"+(canvas.width/getDPR())+"px; height:"+(canvas.height/getDPR())+"px");
}
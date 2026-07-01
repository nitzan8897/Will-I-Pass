/* =====================================================================
   viz-helpers.js — עזרי SVG משותפים לכל הוויזואליזציות
   קואורדינטות דרך viewBox קבוע (360x220) — מיקום דטרמיניסטי שמתאים לכל רוחב.
   ===================================================================== */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const VIZ_WIDTH = 360, VIZ_HEIGHT = 220;

function createSvg(){
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`);
  svg.classList.add('viz-svg');
  return svg;
}

function svgElement(tag, attributes){
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const name in attributes) element.setAttribute(name, attributes[name]);
  return element;
}

function svgCircle(cx, cy, radius, className){
  return svgElement('circle', { cx, cy, r: radius, class: className });
}

function svgLine(x1, y1, x2, y2, className){
  return svgElement('line', { x1, y1, x2, y2, class: className });
}

function svgText(x, y, content, className = 'v-label', extra = {}){
  const text = svgElement('text', { x, y, class: className, ...extra });
  text.textContent = content;
  return text;
}

// מחליף את תוכן המיכל בציור חדש ומחזיר את ה-svg
function renderInto(containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const svg = createSvg();
  container.appendChild(svg);
  return svg;
}

// המרת קואורדינטות עכבר/מגע לקואורדינטות פנימיות של ה-SVG (לגרירה)
function pointerToSvg(svg, event){
  const point = svg.createSVGPoint();
  point.x = event.clientX; point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

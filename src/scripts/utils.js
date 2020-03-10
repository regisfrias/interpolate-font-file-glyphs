export const loadFont = (path) => {
  // Let's return a promise which resolves to an ArrayBuffer 
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = (e) => resolve(e.target.response);
    request.onerror = () => reject(request.statusText);
    request.send();
  });
};

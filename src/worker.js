function getAccuracyScores(imageData) {
  const score = tf.tidy(() => {
    const channels = 1;
    let input = tf.browser.fromPixels(imageData, channels);
    input = tf.cast(input, "float32").div(tf.scalar(255));
    // input = input.flatten();  // mlp
    input = input.expandDims();
    return model.predict(input).dataSync();
  });
  return score;
}

function predict(imageData) {
  const scores = getAccuracyScores(imageData);
  const klass = scores.indexOf(Math.max.apply(null, scores));
  return klass;
}

async function loadModel() {
  model = await tf.loadGraphModel("model/model.json");
}

importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js");

let model;
loadModel();

self.addEventListener("message", (event) => {
  event.data.klass = predict(event.data.imageData);
  delete event.data.imageData;
  postMessage(event.data);
});

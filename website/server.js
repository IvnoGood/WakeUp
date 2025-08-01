const express = require("express");
const data = require("./sample.json");
const app = express();
const port = 3000;

let ledState = {
  on: true,
  bri: 200,
  transition: 4,
  seg: [{ col: [[255, 120, 0]] }],
};

app.use(express.json());
app.use(express.static("public"));

app.post("/json/state", (req, res) => {
  // Toggle on/off if "on":"t" is sent
  console.log(req.body);
  if (req.body.on === "t") {
    ledState.on = !ledState.on;
  } else if (req.body.on === true) {
    ledState.on = true;
  } else if (req.body.on === false) {
    ledState.on = false;
  }
  if (typeof req.body.bri === "number") ledState.bri = req.body.bri;
  if (typeof req.body.transition === "number")
    ledState.transition = req.body.transition;
  if (req.body.seg && Array.isArray(req.body.seg)) {
    ledState.seg = req.body.seg;
  }
  res.status(200).json({ success: true });
});

app.get("/json/info", (req, res) => {
  res.json(data.info);
});

app.get("/state", (req, res) => {
  res.json(ledState);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur WLED simulé sur http://0.0.0.0:${port}`);
});

const doGet = () =>
  HtmlService.createTemplateFromFile("frontend/index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag(
      "viewport",
      'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1"'
    )
    .setTitle("Gestor Pacientes")
    .setFaviconUrl("https://res.cloudinary.com/dt1aacjqj/image/upload/v1714168483/pngwing.com_4_k9wtdt.png");

const include = (ruta) =>
  HtmlService.createHtmlOutputFromFile(ruta).getContent();


const doPost = (e) => {
  return handleCorsRequest(e);
};

const handleCorsRequest = (e) => {
  let output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ success: true, message: "CORS configurado correctamente" }));
  output.setHeader("Access-Control-Allow-Origin", "https://script.google.com/macros/s/AKfycbwb44M5MZaDjIWkC5nnCjeV1Vy9JSL0wJmbrrD4VXGeA4PJYyGQvMBw5xo-lMynSIq4/exec"); 
  output.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  output.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return output;
};

function doOptions(e) {
  return handleCorsRequest(e);
}


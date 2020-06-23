const fs = require("fs"),
  BUILDFOLDER = './build/',
  regex = /(href|src)=[\'\"]\.\/static\/(js|css)\/(.*?)\.chunk\.(css|js)[\'\"]/gm,
  NAMESCSS = ['css', 'mainCss'],
  NAMESJS = ['js', 'mainJs'],
  filePath = BUILDFOLDER + "index.html",
  regexRemove = /(.*?)\.chunk\.js\.LICENSE\.txt/gm;

function getFileList(_path) {
  if (fs.existsSync(_path)) {
    return fs.readdirSync(_path)
  }
}

let fileContent = fs.readFileSync(filePath, "utf8");
let m, names = [];

while ((m = regex.exec(fileContent)) !== null) {
  // This is necessary to avoid infinite loops with zero-width matches
  if (m.index === regex.lastIndex) regex.lastIndex++;
  names.push({ name: m[3], format: m[4] });
}

names.forEach(({ name, format }, key) => {
  let newName = (format === 'css' ? NAMESCSS : NAMESJS).shift();
  fileContent = fileContent.replace(name, newName)
  fs.rename(`${BUILDFOLDER}static/${format}/${name}.chunk.${format}`,
    `${BUILDFOLDER}static/${format}/${newName}.chunk.${format}`, (err) => {
      if (err) console.log('ERROR: ' + err);
    });
})
fs.writeFileSync(filePath, fileContent);

let staticPath = BUILDFOLDER + "static/js/",
  files = getFileList(staticPath);

files.forEach((fileName) => {
  if (regexRemove.test(fileName)) fs.unlinkSync(staticPath + fileName)
})
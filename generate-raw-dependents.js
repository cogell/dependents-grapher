var path = require('path');
var fs = require('fs');
var dependents = require('dependents');
var glob = require('glob');
var util = require('util');

// TODO: promisify all libs before use...

const getFilenameFromPath = filepath => filepath.replace(/^.*[\\\/]/, '');

const transformsDentsToRaw = (filename, dependentsArray) => {
  const children = dependentsArray.map(dependentRelativePath => {
    return {
      name: getFilenameFromPath(dependentRelativePath),
    };
  });

  return {
    name: getFilenameFromPath(filename),
    children,
  };
};

const writeDependentsIntoSrc = async (filename, rawDependents) => {
  try {
    const filepath = path.resolve('./src/data/', `${filename}.json`)
    util.promisify(fs.writeFile)(
      filepath,
      JSON.stringify(rawDependents),
    );
    console.log(`${filepath} success`)
  } catch (err) {
    // deal with it
  }
}

const getJavasScriptFiles = async directory =>
  await util.promisify(glob)(`${directory}/**/*.js`);

const getDependents = async (filename, directory) => {
  const dents = await util.promisify(dependents)({
    filename,
    directory,
  });
  return transformsDentsToRaw(filename, dents);
};

async function main() {
  const directory = process.argv[2];
  console.log('directory', directory);

  const javascriptFilePaths = await getJavasScriptFiles(directory);
  const allRawDependents = await Promise.all(
    javascriptFilePaths.map(javascriptFilePath =>
      getDependents(javascriptFilePath, directory),
    ),
  );

  await Promise.all(
    allRawDependents.map((rawDependents, index) => {
      const ogJsFile = javascriptFilePaths[index];
      const filename = path.basename(ogJsFile, '.js');
      return writeDependentsIntoSrc(filename, rawDependents);
    }),
  );
}

(async () => {
  try {
    var text = await main();
    console.log(text);
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();

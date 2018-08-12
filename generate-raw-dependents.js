var dependents = require('dependents');
var fs = require('fs')

const getFilenameFromPath = filepath => filepath.replace(/^.*[\\\/]/, '')

const transformsDepsToRaw = (filename, dependentsArray) => {
  const children = dependentsArray.map(dependentRelativePath => {
    return {
      name: getFilenameFromPath(dependentRelativePath),
    }
  });

  return {
    name: getFilenameFromPath(filename),
    children,
  }
}

const writeDependentsIntoSrc = rawDependents => fs.writeFileSync('./src/data/raw-dependents.json', JSON.stringify(rawDependents))

function main() {
  const filename = process.argv[2]
  const directory = './example/src'
  // const input = {
  //   filename: './example/src/App.js',
  //   directory: './example/src/',
  // }

  // const { filename, directory } = input;

  console.log('filename', filename);

  dependents({
    filename,
    directory,
  }, (err, dependents) => {
    if (err) {
      console.log(err);
    }

    const rawDependents = transformsDepsToRaw(filename, dependents);
    writeDependentsIntoSrc(rawDependents);
  });
}

main();

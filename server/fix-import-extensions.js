import { replaceInFile } from 'replace-in-file';
const options = {
  files: 'dist/**/*.js',
  from: /from\s+['"](\..*?)['"]/g,
  to: (match, p1) => {
    // If the path doesn't already end with .js, add it
    if (!p1.endsWith('.js')) {
      return `from '${p1}.js'`;
    }
    return match;
  },
};
replaceInFile(options)
  .then((results) => {
    console.log(
      'Import paths updated:',
      results.filter((r) => r.hasChanged).map((r) => r.file)
    );
  })
  .catch((error) => {
    console.error('Error occurred while updating import paths:', error);
  });

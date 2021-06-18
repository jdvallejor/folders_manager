
/**
 * Expose `Foldermanager`.
 */

module.exports = new Foldermanager();

/**
* Initialize a Foldermanager.
*
* @api public
*/
 
function Foldermanager() {
  if (!(this instanceof Foldermanager)) return new Foldermanager();
  this.foldersTree = {};
}
 
/**
* Creates new folders
*
* @param {Array} args
* @return {void}
*/

Foldermanager.prototype.create = function create(args) {
  if (args[0]) {
    const folders = args[0].split('/');
    addFolder(this.foldersTree, folders);
  }
}

function addFolder(currentFolder, listFolders) {
  if (!currentFolder.hasOwnProperty(listFolders[0])) {
    currentFolder[listFolders[0]] = {};
  }
  if (listFolders.length > 1) {
    addFolder(currentFolder[listFolders[0]], listFolders.slice(1));
  }
}

/**
* Moves one folder to another one
*
* @param {Array} args
* @return {void}
*/

Foldermanager.prototype.move = function move(args) {
  if (args[0] && args[1]) {
    const foldersToMove = args[0].split('/');
    if (!checkExistence(this.foldersTree, foldersToMove)) {
      console.log(`\x1b[31mCannot move ${args[0]} - the folder does not exist\x1b[0m`);
    } else {
      let newFoldersPath = args[1].split('/');
      newFoldersPath.push(foldersToMove[foldersToMove.length - 1]);
      const fullFolderToMove = getFullFolder(this.foldersTree, foldersToMove);
      addMovedFolder(this.foldersTree, newFoldersPath, fullFolderToMove);
      deleteHandler(this.foldersTree, foldersToMove, args[0]);
    }
  }
}

function addMovedFolder(currentFolder, listFolders, fullFolderToMove) {
  if (!currentFolder.hasOwnProperty(listFolders[0])) {
    currentFolder[listFolders[0]] = {};
  }
  if (listFolders.length > 1) {
    addMovedFolder(currentFolder[listFolders[0]], listFolders.slice(1), fullFolderToMove);
  } else {
    currentFolder[listFolders[0]] = fullFolderToMove;
  }
}

function getFullFolder(currentFolder, listFolders) {
  if (!currentFolder.hasOwnProperty(listFolders[0])) {
    return {};
  } else {
    if (listFolders.length > 1) {
      return getFullFolder(currentFolder[listFolders[0]], listFolders.slice(1));
    } else {
      return currentFolder[listFolders[0]];
    }
  }
}

function checkExistence(currentFolder, listFolders) {
  if (!currentFolder.hasOwnProperty(listFolders[0])) {
    return false;
  } else {
    if (listFolders.length > 1) {
      return checkExistence(currentFolder[listFolders[0]], listFolders.slice(1));
    } else {
      return true;
    }
  }
}

/**
* Deletes one folder
*
* @param {Array} args
* @return {void}
*/

Foldermanager.prototype._delete = function _delete(args) {
  if (args[0]) {
    const folders = args[0].split('/');
    deleteHandler(this.foldersTree, folders, args[0]);
  }
}

function deleteHandler(currentFolder, listFolders, targetFolder) {
  if (currentFolder.hasOwnProperty(listFolders[0])) {
    if (listFolders.length > 1) {
      deleteHandler(currentFolder[listFolders[0]], listFolders.slice(1), targetFolder);
    } else {
      delete currentFolder[listFolders[0]];
    }
  } else {
    console.log(`\x1b[31mCannot delete ${targetFolder} - ${listFolders[0]} does not exist\x1b[0m`);
  }
}

/**
* List all folders
*
* @return {void}
*/

Foldermanager.prototype.list = function list() {
  printSubLevels(this.foldersTree, 0);
}

function printSubLevels(currentFolder, level) {
  let spaces = ''
  for (let i = 0; i < level; i++) {
    spaces += '  ';
  }
  const folderNames = Object.keys(currentFolder).sort();
  for (const folderName of folderNames) {
    console.log(spaces + folderName + '');
    if (Object.keys(currentFolder[folderName]).length > 0) {
      printSubLevels(currentFolder[folderName], level + 1);
    }
  }
}

/**
 * Initialize a Foldermanager.
 *
 */

function Foldermanager() {
  if (!(this instanceof Foldermanager)) return new Foldermanager();
  this.foldersTree = {};
}

function addFolder(currentFolder, listFolders) {
  if (!Object.prototype.hasOwnProperty.call(currentFolder, listFolders[0])) {
    currentFolder[listFolders[0]] = {};
  }
  if (listFolders.length > 1) {
    addFolder(currentFolder[listFolders[0]], listFolders.slice(1));
  }
}

/**
 * Creates new folders
 *
 * @param {Array} args
 * @return {void}
 */

Foldermanager.prototype.create = function create(args) {
  if (args[0]) {
    const folders = args[0].split("/");
    addFolder(this.foldersTree, folders);
  }
};

function removeHandler(currentFolder, listFolders, targetFolder) {
  if (Object.prototype.hasOwnProperty.call(currentFolder, listFolders[0])) {
    if (listFolders.length > 1) {
      removeHandler(
        currentFolder[listFolders[0]],
        listFolders.slice(1),
        targetFolder
      );
    } else {
      delete currentFolder[listFolders[0]];
    }
  } else {
    console.log(
      `\x1b[31mCannot delete ${targetFolder} - ${listFolders[0]} does not exist\x1b[0m`
    );
  }
}

/**
 * Deletes one folder
 *
 * @param {Array} args
 * @return {void}
 */

Foldermanager.prototype.remove = function remove(args) {
  if (args[0]) {
    const folders = args[0].split("/");
    removeHandler(this.foldersTree, folders, args[0]);
  }
};

function getFullFolder(currentFolder, listFolders) {
  if (!Object.prototype.hasOwnProperty.call(currentFolder, listFolders[0])) {
    return {};
  }
  if (listFolders.length > 1) {
    return getFullFolder(currentFolder[listFolders[0]], listFolders.slice(1));
  }
  return currentFolder[listFolders[0]];
}

function checkExistence(currentFolder, listFolders) {
  if (!Object.prototype.hasOwnProperty.call(currentFolder, listFolders[0])) {
    return false;
  }
  if (listFolders.length > 1) {
    return checkExistence(currentFolder[listFolders[0]], listFolders.slice(1));
  }
  return true;
}

function addMovedFolder(currentFolder, listFolders, fullFolderToMove) {
  if (!Object.prototype.hasOwnProperty.call(currentFolder, listFolders[0])) {
    currentFolder[listFolders[0]] = {};
  }
  if (listFolders.length > 1) {
    addMovedFolder(
      currentFolder[listFolders[0]],
      listFolders.slice(1),
      fullFolderToMove
    );
  } else {
    currentFolder[listFolders[0]] = fullFolderToMove;
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
    const foldersToMove = args[0].split("/");
    if (!checkExistence(this.foldersTree, foldersToMove)) {
      console.log(
        `\x1b[31mCannot move ${args[0]} - the folder does not exist\x1b[0m`
      );
    } else {
      const newFoldersPath = args[1].split("/");
      newFoldersPath.push(foldersToMove[foldersToMove.length - 1]);
      const fullFolderToMove = getFullFolder(this.foldersTree, foldersToMove);
      addMovedFolder(this.foldersTree, newFoldersPath, fullFolderToMove);
      removeHandler(this.foldersTree, foldersToMove, args[0]);
    }
  }
};

function printSubLevels(currentFolder, level) {
  let spaces = "";
  for (let i = 0; i < level; i += 1) {
    spaces += "  ";
  }
  const folderNames = Object.keys(currentFolder).sort();
  for (let i = 0; i < folderNames.length; i += 1) {
    const folderName = folderNames[i];
    console.log(`${spaces}${folderName}`);
    if (Object.keys(currentFolder[folderName]).length > 0) {
      printSubLevels(currentFolder[folderName], level + 1);
    }
  }
}

/**
 * List all folders
 *
 * @return {void}
 */

Foldermanager.prototype.list = function list() {
  printSubLevels(this.foldersTree, 0);
};

/**
 * Expose `Foldermanager`.
 */

module.exports = Foldermanager;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let foldersTree = {};
const avaliableOptions = ['CREATE', 'MOVE', 'DELETE', 'LIST'];

rl.output.write(
`\x1b[36m
Welcome to the folders management system
The available commands are:

    - CREATE <folder_path>
    - MOVE <folder_path> <folder_path>
    - DELETE <folder_path>
    - LIST

Please enter your comands:
\x1b[0m
`
);

function create(args) {
  if (args[1]) {
    const folders = args[1].split('/');
    addFolder(foldersTree, folders);
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

function move(args) {
  if (args[1] && args[2]) {
    const foldersToMove = args[1].split('/');
    if (!checkExistence(foldersTree, foldersToMove)) {
      rl.output.write(`\x1b[31mCannot move ${args[1]} - the folder does not exist\x1b[0m\n`);
    } else {
      let newFoldersPath = args[2].split('/');
      newFoldersPath.push(foldersToMove[foldersToMove.length - 1]);
      const fullFolderToMove = getFullFolder(foldersTree, foldersToMove);
      addMovedFolder(foldersTree, newFoldersPath, fullFolderToMove);
      deleteHandler(foldersTree, foldersToMove, args[1]);
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

function _delete(args) {
  if (args[1]) {
    const folders = args[1].split('/');
    deleteHandler(foldersTree, folders, args[1]);
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
    rl.output.write(`\x1b[31mCannot delete ${targetFolder} - ${listFolders[0]} does not exist\x1b[0m\n`);
  }
}

function list() {
  printSubLevels(foldersTree, 0);
}

function printSubLevels(currentFolder, level) {
  let spaces = ''
  for (let i = 0; i < level; i++) {
    spaces += ' ';
  }
  for (const folderPath in currentFolder) {
    rl.output.write(spaces + folderPath + '\n');
    if (Object.keys(currentFolder[folderPath]).length > 0) {
      printSubLevels(currentFolder[folderPath], level + 1);
    }
  }
}

rl.on('line', (input) => {
    const args = input.split(' ')
    if (!avaliableOptions.includes(args[0].toUpperCase())) {
      rl.output.write('\x1b[31mInvalid command, please try again\x1b[0m\n')
    } else {
      switch (args[0].toUpperCase()) {
        case 'CREATE':
          create(args)
          break;
        case 'MOVE':
          move(args)
          break;
        case 'DELETE':
          _delete(args)
          break;
        case 'LIST':
          list()
          break;
        default:
          break;
      }
    }
});

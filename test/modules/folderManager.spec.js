const Foldermanager = require("../../modules/folderManager");

describe("FolderManager", () => {
  const folderManager1 = new Foldermanager();

  it("should have a foldersTree attribut", () => {
    expect(
      Object.prototype.hasOwnProperty.call(folderManager1, "foldersTree")
    ).toBe(true);
  });

  describe("#create()", () => {
    it("should create a folder", () => {
      const folderManager = new Foldermanager();
      folderManager.create(["fruits"]);
      expect(
        Object.prototype.hasOwnProperty.call(
          folderManager.foldersTree,
          "fruits"
        )
      ).toBe(true);
    });
    it("should create all folders defined in the path if they do not exist", () => {
      const folderManager = new Foldermanager();
      folderManager.create(["fruits/apples"]);
      const folderManager2 = new Foldermanager();
      folderManager2.foldersTree = { fruits: { apples: {} } };
      expect(folderManager).toEqual(folderManager2);
    });
  });

  describe("#move()", () => {
    it("should move one folder with all its content to another", () => {
      const folderManager = new Foldermanager();
      folderManager.create(["fruits/apples"]);
      folderManager.create(["food"]);
      folderManager.move(["fruits", "food"]);
      const folderManager2 = new Foldermanager();
      folderManager2.foldersTree = { food: { fruits: { apples: {} } } };
      expect(folderManager).toEqual(folderManager2);
    });
  });

  describe("#remove()", () => {
    it("should remove one folder with all its content", () => {
      const folderManager = new Foldermanager();
      folderManager.create(["fruits/apples"]);
      folderManager.create(["food"]);
      folderManager.remove(["fruits"]);
      const folderManager2 = new Foldermanager();
      folderManager2.foldersTree = { food: {} };
      expect(folderManager).toEqual(folderManager2);
    });
    global.console.log = jest.fn();
    it("should write a warning message when the folder does not exist", () => {
      const folderManager = new Foldermanager();
      folderManager.create(["fruits/apples"]);
      folderManager.create(["food"]);
      folderManager.remove(["fruits/food"]);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toHaveBeenNthCalledWith(
        1,
        "\x1b[31mCannot delete fruits/food - food does not exist\x1b[0m"
      );
    });
  });

  describe("#list()", () => {
    it("should list all the folders", () => {
      global.console.log = jest.fn();
      const folderManager = new Foldermanager();
      folderManager.create(["fruits/apples"]);
      folderManager.create(["food"]);
      folderManager.list();
      expect(console.log).toBeCalledTimes(3);
      expect(console.log).toHaveBeenNthCalledWith(1, "food");
      expect(console.log).toHaveBeenNthCalledWith(2, "fruits");
      expect(console.log).toHaveBeenNthCalledWith(3, "  apples");
    });
  });
});

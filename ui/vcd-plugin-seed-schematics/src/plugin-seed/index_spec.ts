import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('plugin-seed', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('plugin-seed', {
      name: "test1",
      vcdVersion: "9.1"
    }, Tree.empty());

    expect(tree.files.length).toEqual(17);
  });
});

import * as fs from './fs';
import { join, dirname, resolve } from 'path';
import fixtures from 'fixturez';

const f = fixtures(__dirname);
const REAL_PLATFORM = process.platform;

describe('fs', () => {
  describe('readFile()', () => {
    it('should read a file', async () => {
      let filePath = join(f.find('simple-package'), 'package.json');
      let fileContents = await fs.readFile(filePath);

      expect(fileContents.toString()).toContain('fixture-basic');
    });
  });

  describe('writeFile()', () => {
    it('should write a file', async () => {
      let dirName = f.temp();
      let filePath = join(dirName, 'file.txt');

      await fs.writeFile(filePath, 'test');

      let fileContents = await fs.readFile(filePath);

      expect(fileContents.toString()).toBe('test');
    });
  });

  describe('rimraf()', () => {
    it('should delete a directory', async () => {
      let dirName = f.temp();
      let filePath = join(dirName, 'file.txt');

      await fs.writeFile(filePath, 'test');
      await fs.rimraf(dirName);
      await expect(fs.readFile(dirName)).rejects.toHaveProperty(
        'code',
        'ENOENT'
      );
      await expect(fs.readFile(filePath)).rejects.toHaveProperty(
        'code',
        'ENOENT'
      );
    });
  });

  describe('stat()', () => {
    it('should get the stats of a file', async () => {
      let fixturePath = join(f.find('simple-package'), 'package.json');
      let stat = await fs.stat(fixturePath);

      expect(stat.isFile()).toBe(true);
      expect(stat.isDirectory()).toBe(false);
    });

    it('should get the stats of a directory', async () => {
      let fixturePath = f.find('simple-package');
      let stat = await fs.stat(fixturePath);

      expect(stat.isFile()).toBe(false);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  describe('lstat()', () => {
    it('should get the stats of a file', async () => {
      let fixturePath = join(f.find('simple-package'), 'package.json');
      let stat = await fs.lstat(fixturePath);

      expect(stat.isFile()).toBe(true);
      expect(stat.isDirectory()).toBe(false);
    });

    it('should get the stats of a directory', async () => {
      let fixturePath = f.find('simple-package');
      let stat = await fs.lstat(fixturePath);

      expect(stat.isFile()).toBe(false);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  describe('symlink()', () => {
    if (REAL_PLATFORM === 'linux') {
      describe('posix', () => {
        it('should create a relative symlink to a directory', async () => {
          let tempDir = f.temp();
          let src = join(f.find('symlinks'), 'file.txt');
          let dest = resolve(tempDir, 'file.txt');

          await fs.symlink(src, dest, 'junction');

          let realPath = (await fs.readlink(dest)) || '';
          let resolved = join(dirname(dest), realPath);

          expect(resolved).toEqual(src);
        });

        it('should create a relative symlink to an executable file', async () => {
          let tempDir = f.temp();
          let src = join(f.find('symlinks'), 'executable.sh');
          let dest = resolve(tempDir, 'executable.sh');

          await fs.symlink(src, dest, 'exec');

          let realPath = (await fs.readlink(dest)) || '';
          let resolved = join(dirname(dest), realPath);

          expect(resolved).toEqual(src);
        });

        it('should overwrite an existing symlink', async () => {
          let tempDir = f.temp();
          let src1 = join(f.find('symlinks'), 'file.txt');
          let src2 = join(f.find('symlinks'), 'file2.txt');
          let dest = resolve(tempDir, 'file.txt');

          await fs.symlink(src1, dest, 'junction');
          await fs.symlink(src2, dest, 'junction');

          let realPath = (await fs.readlink(dest)) || '';
          let resolved = join(dirname(dest), realPath);

          expect(resolved).toEqual(src2);
        });
      });
    }

    if (REAL_PLATFORM === 'win32') {
      describe('windows', () => {
        it('should create a command shim to an executable file', async () => {
          let tempDir = f.temp();
          let src = join(f.find('symlinks'), 'shim.cmd');
          let dest = resolve(tempDir, 'unshimmed.cmd');

          await fs.symlink(src, dest, 'exec');

          let files = await fs.readdir(tempDir);

          expect(files).toEqual(['unshimmed', 'unshimmed.cmd']);
        });

        it('should always use absolute paths when creating symlinks', async () => {
          let tempDir = f.temp();
          let src = join(f.find('symlinks'), 'file.txt');
          let dest = resolve(tempDir, 'file.txt');

          await fs.symlink(src, dest, 'junction');

          let realPath = await fs.readlink(dest);

          expect(realPath).toBe(src);
        });
      });
    }
  });

  describe('readdir()', () => {
    it('should list a directory of files', async () => {
      let fixturePath = f.find('simple-project');
      let files = await fs.readdir(fixturePath);

      expect(files).toEqual(['package.json', 'packages']);
    });
  });

  describe('readdirSafe()', () => {
    it('should list a directory of files', async () => {
      let fixturePath = f.find('simple-project');
      let files = await fs.readdirSafe(fixturePath);

      expect(files).toEqual(['package.json', 'packages']);
    });

    it('should return an array if no directory exists', async () => {
      let fixturePath = join(__dirname, 'foo', 'bar', 'baz');
      let files = await fs.readdirSafe(fixturePath);

      expect(files).toEqual([]);
    });
  });

  describe('readlink()', () => {
    // ...
  });
});
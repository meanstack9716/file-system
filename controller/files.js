import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const createFile = (req, res) => {
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).send('No data provided');
  }
  try {
    const directoryPath = path.join(__dirname, '..', 'files');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdir(directoryPath, (err) => {
        if (err) {
          return res.status(500).send({
            message: 'Error while creating directory',
            err: err.message,
          });
        }
      });
    }
    const filePath = path.join(
      directoryPath,
      `data${new Date().getTime()}.json`
    );
    const jsonData = JSON.stringify(data);
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: 'Error while writing file', error: err.message });
      }
      return res.status(200).send({ message: 'file created successfully' });
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const getAllFiles = (req, res) => {
  try {
    const directoryPath = path.join(__dirname, '..', 'files');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send({
          message: 'Error while reading directory',
          error: err.message,
        });
      }
      res.status(200).send({ fileNames: files });
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const getFileData = (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '..', 'files', fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send({
          message: 'Internal server error',
          error: err.message,
        });
      }
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        return res.status(500).send({
          message: 'Error while parsing json data',
          error: error.message,
        });
      }
      res.status(200).json({ data: jsonData });
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const updateFileData = (req, res) => {
  try {
    const { fileName } = req.params;
    const data = req.body;
    if (Object.keys(data).length === 0) {
      return res.status(400).send('No data provided');
    }
    const filePath = path.join(__dirname, '..', 'files', fileName);
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (readErr, fileData) => {
        if (readErr) {
          return res.status(500).send({
            message: 'Error while reading the file',
            error: readErr.message,
          });
        }
        let jsonData;
        try {
          jsonData = JSON.parse(fileData);
        } catch (parseError) {
          return res.status(500).send({ message: 'Error while parsing data' });
        }
        const updatedData = { ...jsonData, ...data };
        const updatedJsonData = JSON.stringify(updatedData);
        fs.writeFile(filePath, updatedJsonData, (writeErr) => {
          if (writeErr) {
            return res.status(500).send({
              message: 'Error updating file',
              error: writeErr.message,
            });
          }
        });
      });
      res.status(200).send('File updated successfully');
    } else {
      return res.status(404).send({ message: 'File not found' });
    }
    res.status(200).json({ data: 'success' });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const deleteFile = (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'files', fileName);
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).send({ message: 'File not found' });
        } else {
          return res.status(500).send({
            message: 'Error while deleting file',
            error: err.message,
          });
        }
      }
      res.status(200).send('File deleted successfully');
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export { createFile, getAllFiles, getFileData, updateFileData, deleteFile };

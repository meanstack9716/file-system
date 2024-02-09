import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const createFile = async (req, res) => {
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).send('No data provided');
  }
  try {
    const directoryPath = path.join(__dirname, '..', 'files');
    if (!fs.existsSync(directoryPath)) {
      await fs.promises.mkdir(directoryPath);
    }
    const filePath = path.join(
      directoryPath,
      `data${new Date().getTime()}.json`
    );
    const jsonData = JSON.stringify(data);
    await fs.promises.writeFile(filePath, jsonData);
    res.status(200).send({ message: 'file created successfully' });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const getAllFiles = async (req, res) => {
  try {
    const directoryPath = path.join(__dirname, '..', 'files');
    const files = await fs.promises.readdir(directoryPath);
    res.status(200).send({ fileNames: files });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const getFileData = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '..', 'files', fileName);
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    let jsonData;
    try {
      jsonData = JSON.parse(fileData);
    } catch (error) {
      return res.status(500).send({
        message: 'Error while parsing json data',
        error: error.message,
      });
    }
    res.status(200).json({ data: jsonData });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const updateFileData = async (req, res) => {
  try {
    const { fileName } = req.params;
    const data = req.body;
    if (Object.keys(data).length === 0) {
      return res.status(400).send('No data provided');
    }
    const filePath = path.join(__dirname, '..', 'files', fileName);
    if (fs.existsSync(filePath)) {
      const fileData = await fs.promises.readFile(filePath, 'utf8');
      let jsonDataFromFile;
      try {
        jsonDataFromFile = JSON.parse(fileData);
      } catch (parseError) {
        return res.status(500).send({ message: 'Error while parsing data' });
      }
      const updatedData = { ...jsonDataFromFile, ...data };
      const updatedJsonData = JSON.stringify(updatedData);
      await fs.promises.writeFile(filePath, updatedJsonData);
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
const deleteFile = async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'files', fileName);
  try {
    await fs.promises.unlink(filePath);
    res.status(200).send('File deleted successfully');
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export { createFile, getAllFiles, getFileData, updateFileData, deleteFile };

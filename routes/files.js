import express from 'express';
import {
  createFile,
  deleteFile,
  getAllFiles,
  getFileData,
  updateFileData,
} from '../controller/files.js';
const router = express.Router();
router.post('/create', createFile);
router.get('/get_all_files', getAllFiles);
router.get('/get_file_data/:fileName', getFileData);
router.put('/update/:fileName', updateFileData);
router.delete('/delete/:fileName', deleteFile);

export default router;

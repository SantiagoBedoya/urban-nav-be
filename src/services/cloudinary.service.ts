/* eslint-disable @typescript-eslint/naming-convention */
import {BindingScope, injectable} from '@loopback/core';
import {Request, Response} from '@loopback/rest';
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

@injectable({scope: BindingScope.TRANSIENT})
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadFile(
    request: Request,
    res: Response,
  ): Promise<{done: boolean; err?: unknown; url?: string}> {
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    return new Promise((resolve, reject) => {
      upload.single('file')(request, res, err => {
        if (err) {
          reject({done: false, err});
          return;
        }
        const file = request.file as Express.Multer.File;
        const cldUploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'images',
          },
          (cldErr, result) => {
            if (cldErr) {
              reject({done: false, err: cldErr});
            }
            resolve({done: true, url: result?.secure_url});
          },
        );
        streamifier.createReadStream(file.buffer).pipe(cldUploadStream);
      });
    });
  }
}

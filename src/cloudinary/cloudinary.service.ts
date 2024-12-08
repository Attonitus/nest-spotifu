import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import {} from 'node:buffer'
import { Readable } from 'node:stream';

@Injectable()
export class CloudinaryService {

  constructor(
    private readonly configService: ConfigService
  ){
    cloudinary.config({
      cloud_name: configService.get("CLOUD_NAME"),
      api_key: configService.get("API_KEY"),
      api_secret: configService.get("API_SECRET")
    })
  }

  async uploadFile(file: Express.Multer.File, resource_type: 'image' | 'video' = 'image'): 
  Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream({
        folder: this.configService.get("FOLDER"),
        resource_type
      },
      (error, result) => {
        if(error) return reject(error);
        resolve(result);
      })

      Readable.from(file.buffer).pipe(upload);
    })
  }

  async deleteFile(id: string, resource_type: 'image' | 'video' = 'image'): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(`${this.configService.get("FOLDER")}/${id}`, {resource_type})
      .then((res) => resolve(res))
      .catch(error => reject(error))
    })
  }
}

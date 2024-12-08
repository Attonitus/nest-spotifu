import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class FilesService {

  constructor(
    private readonly cloudinaryService: CloudinaryService
  ){}

  async upload(file: Express.Multer.File, resource_type: "image" | "video" = "image") {
    const res = await this.cloudinaryService.uploadFile(file, resource_type);
    if(!res.secure_url){
      throw new ConflictException(`Error uploading file`);
    }
    return {
      public_id: res.public_id,
      url: res.secure_url
    };
  }

  async remove(id: string, resource_type: 'image' | 'video' = 'image') {
    const res = await this.cloudinaryService.deleteFile(id, resource_type);
    if(res.result === "not found"){
      throw new BadRequestException(`File with ID ${id} not exist`);
    }
    return;
  }
}

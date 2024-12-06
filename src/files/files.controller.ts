import { Controller, Post, Param, Delete, UploadedFile, Body, UseInterceptors, ParseFilePipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileExtensionFilter } from './helpers/fileExtensionFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileExtensionFilter
  }))
  uploadFile(@UploadedFile('file', ParseFilePipe) file: Express.Multer.File) {
    return this.filesService.upload(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}

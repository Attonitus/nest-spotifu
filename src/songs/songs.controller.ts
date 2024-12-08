import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UploadedFile, UploadedFiles, UseInterceptors, ParseFilePipe, BadRequestException } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileExtensionFilter } from 'src/files/helpers/fileExtensionFilter.helper';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
    {name: 'imageFile', maxCount: 1},
    {name: 'songFile', maxCount: 1},
  ], { fileFilter: fileExtensionFilter }))
  create(@Body() createSongDto: CreateSongDto, 
  @UploadedFiles() files: {imageFile?: Express.Multer.File, songFile?: Express.Multer.File}) {
    const {imageFile, songFile} = files;
    if(!imageFile || !songFile) throw new BadRequestException(`image and song are required`);
    return this.songsService.create(createSongDto, imageFile[0], songFile[0]);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.songsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Get('search/:term')
  searchGenres(@Param('term') term: string) {
    return this.songsService.search(term);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'imageFile', maxCount: 1},
    {name: 'songFile', maxCount: 1},
  ], { fileFilter: fileExtensionFilter }))
  update(@Param('id', ParseUUIDPipe) id: string, 
  @Body() updateSongDto: UpdateSongDto,
  @UploadedFiles() files: {imageFile?: Express.Multer.File, songFile?: Express.Multer.File}) {
    const {imageFile = [], songFile = []} = files;
    return this.songsService.update(id, updateSongDto, imageFile[0], songFile[0]);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.songsService.remove(id);
  }
}

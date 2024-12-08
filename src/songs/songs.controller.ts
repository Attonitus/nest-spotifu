import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UploadedFile, UploadedFiles, UseInterceptors, ParseFilePipe, BadRequestException } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileExtensionFilter } from 'src/files/helpers/fileExtensionFilter.helper';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { GetArtist } from 'src/auth/decorators/get-artist.decorator';
import { Artist } from 'src/auth/entities/artist.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @Auth(ValidRoles.user)
  @UseInterceptors(
    FileFieldsInterceptor([
    {name: 'imageFile', maxCount: 1},
    {name: 'songFile', maxCount: 1},
  ], { fileFilter: fileExtensionFilter }))
  create(@Body() createSongDto: CreateSongDto,
  @GetArtist() artist: Artist,
  @UploadedFiles() files: {imageFile?: Express.Multer.File, songFile?: Express.Multer.File}) {
    const {imageFile, songFile} = files;
    if(!imageFile || !songFile) throw new BadRequestException(`image and song are required`);
    return this.songsService.create(createSongDto, imageFile[0], songFile[0], artist);
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
  @Auth(ValidRoles.user)
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'imageFile', maxCount: 1},
    {name: 'songFile', maxCount: 1},
  ], { fileFilter: fileExtensionFilter }))
  update(@Param('id', ParseUUIDPipe) id: string, 
  @Body() updateSongDto: UpdateSongDto,
  @GetArtist() artist: Artist,
  @UploadedFiles() files: {imageFile?: Express.Multer.File, songFile?: Express.Multer.File}) {
    const {imageFile = [], songFile = []} = files;
    return this.songsService.update(id, updateSongDto, imageFile[0], songFile[0], artist);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetArtist() artist: Artist) {
    return this.songsService.remove(id, artist);
  }
}

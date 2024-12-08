import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSongDto, VALID_GENRES } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { validateUUID } from 'src/adapters/uuid.adapter';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class SongsService {

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,

    private readonly fileService: FilesService,
  ){}

  async create(createSongDto: CreateSongDto, imageFile: Express.Multer.File, songFile: Express.Multer.File) {

    const imageUpload  = await this.fileService.upload(imageFile);
    const songUpload  = await this.fileService.upload(songFile, "video");

    try {
      const song = this.songRepository.create({...createSongDto, 
        songImage: {
          public_id: imageUpload.public_id.split('/')[1],
          url: imageUpload.url
        },
        songAudio: {
          public_id: songUpload.public_id.split('/')[1],
          url: songUpload.url
        }
      });

      if(!song) throw new BadRequestException(`Error creating song`);

      await this.songRepository.save(song);

      return song;
    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;

    const songs = await this.songRepository.find({
      skip: offset,
      take: limit
    })

    return songs;
  }

  async findOne(uuid: string) {

    let song : Song;

    if(validateUUID(uuid)){
      song = await this.songRepository.findOneBy({id: uuid});
    }

    if(!song) throw new BadRequestException(`Song with ${uuid} not exist`);
  
    return song;

  }

  async search(genre: string){
    let songs : Song[];

    if(VALID_GENRES.includes(genre)){
      songs = await this.songRepository.findBy({genre});
    }

    if(!songs) throw new BadRequestException(`Song with genre ${genre} not exist`);
    return songs;
  }

  async update(id: string, updateSongDto: UpdateSongDto, 
    imageFile: Express.Multer.File, songFile: Express.Multer.File) {

      const song = await this.findOne(id);
      if(!song) throw new BadRequestException(`Song with ${id} not exist`);

      // Copy all values of updateDTO to song
      Object.assign(song, updateSongDto);

      if(imageFile){

        if(song.songImage){
          await this.fileService.remove(song.songImage.public_id);
        }

        const imageUploaded = await this.fileService.upload(imageFile);

        song.songImage.public_id = imageUploaded.public_id.split("/")[1];
        song.songImage.url = imageUploaded.url;
      }

      if(songFile){

        if(song.songAudio){
          await this.fileService.remove(song.songAudio.public_id, 'video');
        }

        const songUploaded = await this.fileService.upload(songFile, "video");
        song.songAudio.public_id = songUploaded.public_id.split("/")[1];
        song.songAudio.url = songUploaded.url;
      }

      await this.songRepository.save(song);

      return song;
  }

  async remove(id: string) {
    const {songAudio, songImage} = await this.findOne(id);

    if(!songAudio || !songImage){
      throw new BadRequestException(`Song with ${id} dont have audio or image`);
    }

    await this.fileService.remove(songAudio.public_id, 'video');
    await this.fileService.remove(songImage.public_id);

    const deleted = await this.songRepository.delete({id});
    if(deleted.affected === 0){
      throw new BadRequestException(`User with id ${id} not exist`);
    }
    return;
  }

  private handleDBErrors(error: any){

    throw new InternalServerErrorException(`Error: ${error}`)
  }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSongDto, VALID_GENRES } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { validateUUID } from 'src/adapters/uuid.adapter';

@Injectable()
export class SongsService {

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>
  ){}

  async create(createSongDto: CreateSongDto) {
    try {
      const song = this.songRepository.create(createSongDto);

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

  async update(id: string, updateSongDto: UpdateSongDto) {
    const songUpdated = await this.songRepository.preload({id, ...updateSongDto});

    if(!songUpdated) throw new BadRequestException(`Song with ${id} not exist`);

    await this.songRepository.save(songUpdated);

    return songUpdated;
  }

  async remove(id: string) {
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

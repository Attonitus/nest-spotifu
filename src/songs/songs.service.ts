import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return `This action returns all songs`;
  }

  async findOne(id: string) {

    const song = await this.songRepository.findOneBy({id});

    if(!song) throw new BadRequestException(`Song with ${id} not exist`);

    return song;

  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const songUpdated = await this.songRepository.preload({id, ...updateSongDto});

    if(!songUpdated) throw new BadRequestException(`Song with ${id} not exist`);

    await this.songRepository.save(songUpdated);

    return songUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }

  private handleDBErrors(error: any){

    throw new InternalServerErrorException(`Error: ${error}`)
  }
}

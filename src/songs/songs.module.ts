import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { SongImage } from './entities/song-image.entity';
import { FilesModule } from 'src/files/files.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SongAudio } from './entities/song-audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, SongImage, SongAudio]), FilesModule, CloudinaryModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}

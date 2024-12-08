import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs/entities/song.entity';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SongImage } from './songs/entities/song-image.entity';
import { SongAudio } from './songs/entities/song-audio.entity';
import { AuthModule } from './auth/auth.module';
import { Artist } from './auth/entities/artist.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Song, SongImage, SongAudio, Artist],
      synchronize: true,
    }),
    SongsModule,
    CommonModule,
    FilesModule,
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

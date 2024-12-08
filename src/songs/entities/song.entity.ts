import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SongImage } from "./song-image.entity";
import { SongAudio } from "./song-audio.entity";

@Entity()
export class Song {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(
        () => SongAudio,
        (songAudio) => songAudio.song,
        {cascade: true, eager: true} 
    )
    @JoinColumn()
    songAudio: SongAudio;

    @Column('text')
    title: string;
    
    @Column('numeric')
    year: number;

    @OneToOne(
        () => SongImage,
        (songImage) => songImage.song,
        {cascade: true, eager: true} 
    )
    @JoinColumn()
    songImage: SongImage;

    @Column('text')
    genre: string;

}

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";

@Entity()
export class SongAudio{
    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    public_id: string;

    @Column('text')
    url: string;

    @OneToOne(
        () => Song,
        (song) => song.songAudio,
        {onDelete: 'CASCADE'}
    )
    song: Song;
}
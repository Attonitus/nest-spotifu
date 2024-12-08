import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";

@Entity()
export class SongImage{

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;

    @Column('text')
    public_id: string;

    @OneToOne(
        () => Song,
        (song) => song.songImage,
        {onDelete: 'CASCADE'}
    )
    song: Song;
}
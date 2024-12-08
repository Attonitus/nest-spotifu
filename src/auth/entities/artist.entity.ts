import { Song } from "src/songs/entities/song.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Artist {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('text', {
        unique: true
    })
    name:string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Song,
        (song) => song.artist
    )
    song: Song[];

    @BeforeInsert()
    lowcaseEmail() {
        this.email = this.email.toLowerCase().trim();
    }

}

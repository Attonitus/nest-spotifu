import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Song {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('text')
    songUrl: string;

    @Column('text')
    title: string;
    
    @Column('numeric')
    year: number;

    @Column('text')
    imageUrl: string;

    @Column('text')
    genre: string;

}

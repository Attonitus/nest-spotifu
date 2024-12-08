import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @BeforeInsert()
    lowcaseEmail() {
        this.email = this.email.toLowerCase().trim();
    }

}

import { Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'members' })
export class Member {
    @ObjectIdColumn()
    @Transform(({ value }) => value.toString(), { toPlainOnly: true })
    id: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}

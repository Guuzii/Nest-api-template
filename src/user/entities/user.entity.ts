import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
  orderBy: {
    email: 'ASC',
    id: 'DESC',
  },
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 64 })
  email: string;

  @Column()
  password: string;

  /** prénom */
  @Column({ type: 'varchar', length: 64, nullable: true })
  firstname?: string;

  /** nom */
  @Column({ type: 'varchar', length: 64, nullable: true })
  lastname?: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('simple-array')
  images!: string[];

  @Column()
  workLink!: string;

  @Column({ default: 'visible' })
  status!: string;
}

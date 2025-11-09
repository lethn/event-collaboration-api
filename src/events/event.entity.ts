import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type EventStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'],
    default: 'TODO',
  })
  status: EventStatus;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @ManyToOne(() => User, (user) => user.events, { eager: true })
  owner: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  invitees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  mergedFrom: string[];
}

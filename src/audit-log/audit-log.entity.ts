import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  newEventId: string;

  @Column({ type: 'jsonb' })
  oldEventIds: string[];

  @CreateDateColumn()
  createdAt: Date;
}

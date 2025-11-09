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
  oldEvents: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    startTime: string;
    endTime: string;
    invitees: { id: string; name: string }[];
  }[];

  @CreateDateColumn()
  createdAt: Date;
}

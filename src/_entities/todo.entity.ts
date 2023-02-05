import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CategoryEntity } from 'src/_entities/category.entity';

@Entity('todos')
export class TodoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  userId: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  status: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 1000,
  })
  memo: string;

  @Column({
    nullable: true,
    type: 'date',
  })
  today: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.todo, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;
}

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/_entities/user.entity';
import { TemplateCategoryEntity } from 'src/_entities/template-category.entity';
import { TodoEntity } from 'src/_entities/todo.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.category, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => TemplateCategoryEntity, (templateCategory) => templateCategory.category)
  templateCategory: TemplateCategoryEntity[];

  @OneToMany(() => TodoEntity, (todo) => todo.category)
  todo: TodoEntity[];
}

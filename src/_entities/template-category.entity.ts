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
import { TemplateEntity } from 'src/_entities/template.entity';

@Entity('template_categories')
export class TemplateCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  templateId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TemplateEntity, (template) => template.templateCategory, {
    onDelete: 'CASCADE',
  })
  template: TemplateEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.templateCategory, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;
}

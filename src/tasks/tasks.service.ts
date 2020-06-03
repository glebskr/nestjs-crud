import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { chain } from 'lodash';

import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getTasks(): Array<Task> {
    return this.tasks;
  }

  getTaskById(id: ReturnType<typeof uuid>): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Array<Task> {
    const { status, search } = filterDto;

    return chain(this.tasks)
      .filter(task => (status ? task.status === status : true))
      .filter(task => (search ? task.description.includes(search) : true));
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: ReturnType<typeof uuid>, newStatus: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = newStatus;
    return task;
  }

  deleteTaskById(id: ReturnType<typeof uuid>): void {
    const taskToDelete = this.getTaskById(id);

    this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
  }
}

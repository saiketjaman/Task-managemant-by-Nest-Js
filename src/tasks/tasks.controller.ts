import { Body, Controller, Get, Post, Param, Delete, Put, Patch, Query, UsePipes, ValidationPipe,ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}
    
    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User,
        ): Promise<Task[]>{
        return this.taskService.getTasks(filterDto, user);
       
    }
    
    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user)
    }
    
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,  
        @Body('status', TaskStatusValidationPipe,) status: TaskStatus,
        @GetUser() user: User,
        ): Promise<Task>{
        return this.taskService.updateTaskStatus(id, status, user);
    }
    
    
    @Put('/:id')
    @UsePipes(ValidationPipe)
    updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.taskService.updateTask(id, createTaskDto, user);
    }
    
    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<void> {
       return this.taskService.deleteTask(id, user);
    }
}

import { Body, Controller, Get, Post, Param, Delete, Put, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import SuccessResponse from 'src/interface/http/SuccessResponse';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) {}

    
    @Get()
    async getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User,
        ): Promise<SuccessResponse>{
        this.logger.verbose(`User "${user.username}" retriving all task. Filter: ${JSON.stringify(filterDto)}`);
            
        return {
            success: true, 
            message: 'Task Retrive Successfully',
            data: await this.taskService.getTasks(filterDto, user)
        }
    }
    
    @Get('/:id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<SuccessResponse> {
        return {
            success: true, 
            message: 'Single Task Retrive Successfully',
            data: await this.taskService.getTaskById(id, user)
        }
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<SuccessResponse> {
        return { 
            success: true, 
            message: 'Task Created Successfully',
            data: await this.taskService.createTask(createTaskDto, user)
        }
    }
    
    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,  
        @Body('status', TaskStatusValidationPipe,) status: TaskStatus,
        @GetUser() user: User,
        ): Promise<SuccessResponse>{
            return { 
                success: true, 
                message: 'Task Updated successfully',
                data: await this.taskService.updateTaskStatus(id, status, user)
            }
    }
    
    
    @Put('/:id')
    @UsePipes(ValidationPipe)
    async updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ): Promise<SuccessResponse> {
            return { 
                success: true, 
                message: 'Task Updated Successfully',
                data: await this.taskService.updateTask(id, createTaskDto, user)
            }
    }
    
    @Delete('/:id')
    async deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<SuccessResponse> {
            return { 
                success: true, 
                message: 'Task Deleted Successfully',
                data: await this.taskService.deleteTask(id, user)
            }
    }
}

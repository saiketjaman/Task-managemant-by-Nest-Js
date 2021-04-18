import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const Joi = require('joi')

@Injectable()
export class CreateTaskRequest implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
      
    const schmea = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(2).required()
    })
    
    try {
    await schmea.validateAsync(req.body)
    next();
    
    }catch(errors) {
        return res.status(422).json({ 
            success: false,
            message: 'Please check the fields',
            errors: errors.details.map(err => {
                return {
                    key: err.context.key || err.path.join('.'),
                    message: err.message
                }
            })
        })
    }

  }
}

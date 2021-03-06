import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const { username , password } = authCredentialsDto;
         
        const salt = await bcrypt.genSalt();
        
        const user = new User();
        user.username = username;
        user.salt = salt
        user.password = await this.hasPassword(password, salt);
        try {
            await user.save();
        } catch (error) {
            // dublicated username error code 23505 console.log(error,code)
            if(error.code === '23505') {
               throw new ConflictException('Username already exit');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
    
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user =  await this.findOne({ username});
        
        if(user && await user.validaPassword(password)){
            return user.username;
        } else {
            return null;
        }
        
    }
    
    
    private async hasPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
    
}
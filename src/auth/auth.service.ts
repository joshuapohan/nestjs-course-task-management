import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username } = await this.userRepository.validateUserCredentials(authCredentialsDto);
    const accessToken = await this.jwtService.sign({ username });

    return {
      username,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    return await this.userRepository.getUserByUsername(username);
  }
}

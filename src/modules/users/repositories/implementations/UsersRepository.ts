import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
      .createQueryBuilder("users")
      .innerJoinAndSelect("users.games", "ug")
      .where("users.id = :id", {id: user_id})
      .getOne();
    
    return user!
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query('select first_name from users order by 1');
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {    
    return await this.repository.query('SELECT first_name, last_name, email FROM users WHERE UPPER(first_name) = UPPER($1) AND UPPER(last_name) = UPPER($2)', [first_name, last_name]);
  }
}

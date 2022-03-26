import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where('UPPER(games.title) like :title', {title: `%${param.toUpperCase()}%`})
      .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("games")
      .innerJoinAndSelect("games.users", "gu")
      .where("games.id = :id", {id: id})
      .getOne();

    return game!.users
  }
}

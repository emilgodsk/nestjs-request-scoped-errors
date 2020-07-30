import { Controller, Get, Inject } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor(
    @Inject('CONNECTION')
    private readonly connection
  ) {}

  @Get()
  get(): boolean {
    console.log(this.connection);

    return true;
  }
}

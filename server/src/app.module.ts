import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksModule } from './works/works.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'digital_portfolio',
      autoLoadEntities: true,
      synchronize: true,
    }),
    WorksModule,
  ],
})
export class AppModule {}

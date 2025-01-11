import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as fs from 'fs';

// Modules
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

// Entities
import { Message } from './events/message.entity';
import { User } from './auth/auth.entity';

// Configurations
import { typeOrmConfigAsync } from './config/typeorm.config';
import { jwtConfigAsync } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
      cache: false,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    TypeOrmModule.forFeature([Message, User]),
    AuthModule,
    EventsModule,
    JwtModule.registerAsync(jwtConfigAsync),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    const envPath = join(process.cwd(), '.env');
    console.log('\n=== Environment Configuration ===');
    console.log('Environment file path:', envPath);
    console.log('File exists:', fs.existsSync(envPath));
    
    if (fs.existsSync(envPath)) {
      console.log('Environment file contents:');
      console.log(fs.readFileSync(envPath, 'utf8'));
    }

    console.log('\nEnvironment variables loaded:');
    console.log({
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_DATABASE: process.env.DB_DATABASE,
      APP_PORT: process.env.APP_PORT,
      APP_ORIGIN: process.env.APP_ORIGIN,
    });
    console.log('===============================\n');
  }
}
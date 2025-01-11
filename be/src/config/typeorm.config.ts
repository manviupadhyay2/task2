import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message } from 'src/events/message.entity';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    // Get configuration values
    const host = configService.get<string>('DB_HOST');
    const port = configService.get<number>('DB_PORT');
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_DATABASE');

    // Log the configuration values (consider removing in production)
    console.log('Database Configuration:', {
      host,
      port,
      username,
      database,
      passwordProvided: !!password,
    });

    // Collect missing values for a more detailed error message
    const missingValues = [];
    if (!host) missingValues.push('DB_HOST');
    if (!username) missingValues.push('DB_USERNAME');
    if (!password) missingValues.push('DB_PASSWORD');
    if (!database) missingValues.push('DB_DATABASE');

    if (missingValues.length > 0) {
      throw new Error(
        `Missing required database configuration. Please check your .env file.\nMissing values:\n${missingValues.join('\n- ')}`
      );
    }

    return {
      type: 'mysql',
      host,
      port: port || 3306,
      username,
      password,
      database,
      entities: [User, Message],
      synchronize: true, // Disable in production
      logging: true,
      logger: 'advanced-console',
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    try {
      return TypeOrmConfig.getOrmConfig(configService);
    } catch (error) {
      console.error('Failed to create TypeORM configuration:', error.message);
      throw error;
    }
  },
};
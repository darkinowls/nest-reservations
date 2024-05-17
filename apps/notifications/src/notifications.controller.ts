import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NOTIFY_USER } from '@app/common/consts';
import { NotifyUserDto } from '@app/common/dto/notifyUser.dto';

@Controller()
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {
	}

	@Get()
	async getHello() {
		return this.notificationsService.notifyUser({
			message: 'Hello World!',
			subject: 'rest api test',
			email: 'user@example.com'
		});
	}

	@EventPattern(NOTIFY_USER)
	async notifyUser(@Payload() data: NotifyUserDto) {
		return this.notificationsService.notifyUser(data);
	}

}

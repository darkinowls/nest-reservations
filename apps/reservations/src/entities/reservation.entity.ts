import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ReservationEntity extends AbstractEntity<ReservationEntity> {

	@Column()
		startDate: Date;
	@Column()
		endDate: Date;
	@Column()
		userId: string;
	@Column()
		placeId: string;
	@Column()
		invoiceId: string;


}


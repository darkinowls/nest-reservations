import { Timestamp } from '../../../../google/protobuf/timestamp';

export class DateConverter {

	static toTimeStamp(date: Date): Timestamp {
		return {
			nanos: (date.getTime() % 1000) * 1e6,
			seconds: date.getTime() / 1000
		};
	}

}